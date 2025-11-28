// Al agregar ?v=2, el navegador se ve obligado a descargar el archivo nuevo
import { planetasDB } from "./data.js?v=2";

// --- CONFIGURACIÓN DE COMPONENTES DE AFRAME ---
  console.log("DATOS CARGADOS:", planetasDB);
// Componente para manejar el audio al detectar/perder marcadores
AFRAME.registerComponent("sound-handler", {
  init: function () {
    // Cuando el marcador es DETECTADO
    this.el.addEventListener("markerFound", () => {
      const soundEntity = this.el.querySelector("[sound]");
      if (soundEntity) {
        console.log("Marcador encontrado, reproduciendo audio...");
        soundEntity.components.sound.stopSound(); // Reinicia si ya estaba sonando
        soundEntity.components.sound.playSound();
      }
    });

    // Cuando el marcador se PIERDE (Opcional pero recomendado)
    this.el.addEventListener("markerLost", () => {
      const soundEntity = this.el.querySelector("[sound]");
      if (soundEntity) {
        console.log("Marcador perdido, pausando audio.");
        soundEntity.components.sound.stopSound();
      }
    });
  },
});

// --- LÓGICA PRINCIPAL ---

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start");
  
  // Si existe el botón, esperamos el click para iniciar (necesario para el audio)
  if (startBtn) {
    startBtn.addEventListener("click", iniciarExperiencia);
  } else {
    // Si no tienes botón de inicio, intenta cargar directo (puede fallar el audio en Chrome)
    console.warn("No se encontró botón de inicio. El audio podría bloquearse.");
    iniciarExperiencia();
  }
});

function iniciarExperiencia() {
  // 1. Ocultar el overlay de bienvenida si existe
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display = "none";

  // 2. Desbloquear el AudioContext (Vital para navegadores modernos)
  const scene = document.querySelector("a-scene");
  if (scene.audioListener && scene.audioListener.context.state === "suspended") {
    scene.audioListener.context.resume().then(() => {
      console.log("AudioContext activado correctamente.");
    });
  }

  // 3. Generar los planetas desde la base de datos
  planetasDB.forEach((data) => {
    const marker = document.createElement("a-marker");

    // Configuración del tipo de marcador (Hiro o Pattern)
    if (data.pattern.includes("hiro")) {
      marker.setAttribute("preset", "hiro");
    } else {
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", data.pattern);
    }

    // Añadimos el componente que controla el sonido
    marker.setAttribute("sound-handler", "");
    marker.setAttribute("emitevents", "true"); // Necesario para detectar eventos en AR.js

    // --- CREACIÓN DEL OBJETO VISUAL (Esfera o Modelo 3D) ---
    let entity;

    if (data.type === "3dmodel") {
      // CASO A: Es un Modelo GLB (Saturno 3D, Blackhole, etc.)
      entity = document.createElement("a-entity");
      entity.setAttribute("gltf-model", data.modelo);
      
      // Aplicamos la ESCALA desde data.js
      entity.setAttribute("scale", data.escala); 
      
      // Corrección de rotación inicial (a veces los modelos vienen acostados)
      entity.setAttribute("rotation", "0 0 0"); 
      
    } else {
      // CASO B: Es una Esfera (Sol, Tierra, Júpiter normal)
      entity = document.createElement("a-sphere");
      
      // Aplicamos el TAMAÑO (radio) desde data.js
      entity.setAttribute("radius", data.tamano);
      
      // Material / Textura
      if (data.nombre === "Sol") {
        // El sol brilla (shader: flat evita sombras)
        entity.setAttribute("material", `shader: flat; src: ${data.textura}`);
      } else {
        entity.setAttribute("src", data.textura);
      }
      
      // Posición para que no atraviese el marcador (radio hacia arriba)
      entity.setAttribute("position", `0 ${data.tamano} 0`);
    }

    // --- ANIMACIÓN DE ROTACIÓN ---
    // Solo añadimos animación si la velocidad es mayor a 0
    if (data.velocidad > 0) {
      entity.setAttribute("animation", {
        property: "rotation",
        to: "0 360 0",
        loop: true,
        dur: data.velocidad, // Tiempo en ms (menos es más rápido)
        easing: "linear"
      });
    }

    marker.appendChild(entity);

    // --- CONFIGURACIÓN DE AUDIO ---
    if (data.audio) {
      const sound = document.createElement("a-entity");
      // 'poolSize: 1' ayuda a la gestión de memoria en móviles
      sound.setAttribute("sound", `src: url(${data.audio}); autoplay: false; volume: 4; loop: false;`);
      marker.appendChild(sound);
    }

    // Añadimos el marcador completo a la escena
    scene.appendChild(marker);
  });
}