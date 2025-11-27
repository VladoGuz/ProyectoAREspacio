import { planetasDB } from "./data.js";

// BLOQUE DE CONEXIÓN HTML <-> JS
document.addEventListener('DOMContentLoaded', () => {
    console.log("Página cargada. Vinculando botones...");

    // 1. Buscamos el botón por su ID
    const botonInicio = document.getElementById('btn-start');

    // 2. Verificamos que el botón exista (para evitar errores)
    if (botonInicio) {
        // 3. Le asignamos la función SIN PARÉNTESIS
        // Correcto: iniciarExperiencia
        // Incorrecto: iniciarExperiencia()
        botonInicio.addEventListener('click', iniciarExperiencia);
        console.log("Botón de inicio vinculado correctamente.");
    } else {
        console.error("Error: No encontré el botón con id 'btn-start' en el HTML");
    }

    // Vinculamos también el botón rojo de emergencia (si existe)
    const botonUnmute = document.getElementById('btn-unmute');
    if (botonUnmute) {
        botonUnmute.addEventListener('click', forzarAudio);
    }
});
// --- CONFIGURACIÓN ---

// Variable global para controlar reproducción exclusiva
let audioActual = null;

// --- 1. COMPONENTE DE AUDIO ---
AFRAME.registerComponent("sound-handler", {
  init: function () {
    this.el.addEventListener("markerFound", () => {
      const soundEntity = this.el.querySelector("[sound]");

      if (soundEntity) {
        console.log("Planeta detectado. Intentando reproducir...");

        // Si ya está sonando este mismo, no hacer nada
        if (soundEntity.components.sound.isPlaying) return;

        // Si hay otro sonando, cállalo
        if (audioActual && audioActual !== soundEntity) {
          audioActual.components.sound.stopSound();
          console.log("Silenciando anterior...");
        }

        // REPRODUCIR
        // Importante: .catch() captura si el navegador lo bloquea
        try {
          soundEntity.components.sound.playSound();
          audioActual = soundEntity;
          console.log("Reproduciendo AUDIO con éxito.");
        } catch (error) {
          console.error("Error al reproducir audio:", error);
        }
      }
    });

    // Opcional: Pausar si se pierde el marcador (comenta esto si prefieres que siga hablando)
    this.el.addEventListener("markerLost", () => {
      // console.log("Marcador perdido - Audio sigue sonando (Narrador mode)");
    });
  },
});

function iniciarExperiencia() {
  document.getElementById("overlay").style.display = "none";

  const scene = document.querySelector("a-scene");
  if (scene.audioListener) {
    const context = scene.audioListener.context;
    if (context.state === "suspended") {
      context.resume().then(() => {
        console.log("AudioContext DESPERTADO forzosamente.");
      });
    }
  }

  planetasDB.forEach(data => {
    const marker = document.createElement('a-marker');
    
    // Configuración del marcador
    if (data.pattern === 'hiro') {
      marker.setAttribute('preset', 'hiro');
    } else {
      marker.setAttribute('type', 'pattern');
      marker.setAttribute('url', data.pattern);
    }
    
    marker.setAttribute('sound-handler', ''); 
    marker.setAttribute('emitevents', 'true');

    // --- AQUÍ ESTÁ EL CAMBIO PARA SOPORTAR EL MODELO GLB ---
    let entity;

    if (data.type === '3dmodel') {
        // CASO 1: Es un Modelo 3D (Saturno)
        entity = document.createElement('a-entity');
        entity.setAttribute('gltf-model', data.modelo);
        // La escala es vital en modelos externos
        entity.setAttribute('scale', data.escala || '1 1 1'); 
        // Ajustamos posición para que flote sobre el marcador
        entity.setAttribute('position', '0 0.5 0');
    } else {
        // CASO 2: Es una esfera normal (Tierra, Marte, etc.)
        entity = document.createElement('a-sphere');
        entity.setAttribute('radius', data.tamano);
        entity.setAttribute('position', '0 0.5 0');
        
        if (data.nombre === "Sol") {
            entity.setAttribute('material', 'shader: flat; src: ' + data.textura);
        } else {
            entity.setAttribute('src', data.textura);
        }
    }

    // Animación común para ambos (Rotación)
    entity.setAttribute('animation', `property: rotation; to: 0 360 0; loop: true; dur: ${data.velocidad || 10000}; easing: linear`);

    // Agregamos la entidad (sea esfera o modelo) al marcador
    marker.appendChild(entity);

    // Configuración del Audio (Igual que antes)
    if (data.audio) {
      const sound = document.createElement('a-entity');
      sound.setAttribute('sound', `src: url(${data.audio}); autoplay: false; volume: 6`);
      marker.appendChild(sound);
    }

    scene.appendChild(marker);
  });
}
// js/app.js

// ... todas tus funciones (generarEscena, iniciarExperiencia, etc) ...
