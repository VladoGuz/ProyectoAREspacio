import { planetasDB } from "./data.js";

// Variable global para controlar que solo suene un audio a la vez
let audioActual = null;

// --- 1. COMPONENTE DE MANEJO DE AUDIO (Sound Handler) ---
AFRAME.registerComponent("sound-handler", {
  init: function () {
    // Cuando la cámara encuentra el marcador
    this.el.addEventListener("markerFound", () => {
      const soundEntity = this.el.querySelector("[sound]");

      if (soundEntity) {
        console.log("🟢 Marcador detectado. Intentando reproducir audio...");

        // Si ya hay un audio sonando y no es este, lo callamos
        if (audioActual && audioActual !== soundEntity) {
          audioActual.components.sound.stopSound();
        }

        // Guardamos este como el actual
        audioActual = soundEntity;

        // Reproducimos (el .catch evita errores si el navegador bloquea)
        try {
          soundEntity.components.sound.stopSound(); // Reinicia el audio
          soundEntity.components.sound.playSound();
        } catch (error) {
          console.error("⚠️ Error reproduciendo audio:", error);
        }
      }
    });

    // Cuando se pierde el marcador (Opcional: detiene el audio)
    this.el.addEventListener("markerLost", () => {
      const soundEntity = this.el.querySelector("[sound]");
      if (soundEntity) {
        console.log("🔴 Marcador perdido. Pausando audio.");
        soundEntity.components.sound.stopSound();
      }
    });
  },
});

// --- 2. LOGICA DE INICIO (DOM) ---
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // A. Ocultar pantalla de bienvenida
      document.getElementById("overlay").style.display = "none";

      // B. DESBLOQUEAR AUDIO (Vital para Chrome/Android)
      const scene = document.querySelector("a-scene");
      
      // Intentamos despertar el AudioContext del navegador
      if (scene.audioListener && scene.audioListener.context) {
        const context = scene.audioListener.context;
        if (context.state === "suspended") {
          context.resume().then(() => {
            console.log("🔊 AudioContext DESBLOQUEADO por el clic del usuario.");
          });
        }
      }

      // C. Cargar los planetas
      iniciarExperiencia();
    });
  } else {
    // Si no hay botón, intentamos cargar directo (puede fallar audio)
    console.warn("⚠️ No se encontró botón de inicio. El audio podría fallar.");
    iniciarExperiencia();
  }
});

// --- 3. GENERADOR DE ESCENA ---
function iniciarExperiencia() {
  const scene = document.querySelector("a-scene");

  planetasDB.forEach((data) => {
    const marker = document.createElement("a-marker");

    // Configuración del marcador (Hiro o Pattern personalizado)
    if (data.pattern.includes("hiro")) {
      marker.setAttribute("preset", "hiro");
    } else {
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", data.pattern);
    }

    // Añadimos el componente de control de audio y eventos
    marker.setAttribute("sound-handler", "");
    marker.setAttribute("emitevents", "true");

    // --- LOGICA VISUAL: ¿Es Modelo 3D o Esfera? ---
    let entity;

    if (data.type === "3dmodel") {
      // CASO A: Modelo GLB (Saturno 3D, Nave, etc.)
      entity = document.createElement("a-entity");
      entity.setAttribute("gltf-model", data.modelo);
      
      // Aplicamos la escala que definiste en data.js (ej: "0.005 0.005 0.005")
      entity.setAttribute("scale", data.escala);
      
      // Corrección de rotación base
      entity.setAttribute("rotation", "0 0 0");

    } else {
      // CASO B: Esfera básica (Sol, Tierra, Marte)
      entity = document.createElement("a-sphere");
      entity.setAttribute("radius", data.tamano);
      
      // Posición para que flote sobre el marcador
      entity.setAttribute("position", `0 ${data.tamano} 0`);

      // Textura
      if (data.nombre === "Sol") {
        entity.setAttribute("material", `shader: flat; src: ${data.textura}`);
      } else {
        entity.setAttribute("src", data.textura);
      }
    }

    // --- ANIMACIÓN DE ROTACIÓN ---
    // Solo rotamos si la velocidad es mayor a 0
    if (data.velocidad > 0) {
      entity.setAttribute("animation", {
        property: "rotation",
        to: "0 360 0",
        loop: true,
        dur: data.velocidad,
        easing: "linear"
      });
    }

    marker.appendChild(entity);

    // --- CONFIGURACIÓN DE AUDIO OPTIMIZADA ---
    if (data.audio) {
      const sound = document.createElement("a-entity");
      
      // poolSize: 5 -> Permite mejor manejo de memoria en móviles
      // volume: 5 -> Sube el volumen por defecto
      sound.setAttribute("sound", `
        src: url(${data.audio}); 
        autoplay: false; 
        volume: 10; 
        loop: false;
        poolSize: 5;
      `);
      
      marker.appendChild(sound);
    }

    // Añadir todo a la escena
    scene.appendChild(marker);
  });
}