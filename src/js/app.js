import { planetasDB } from "./data.js";

 // --- CONFIGURACIÓN ---
      

// Variable global para controlar reproducción exclusiva
      let audioActual = null;

      // --- 1. COMPONENTE DE AUDIO ---
      AFRAME.registerComponent('sound-handler', {
        init: function () {
          this.el.addEventListener('markerFound', () => {
            const soundEntity = this.el.querySelector('[sound]');
            
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
          this.el.addEventListener('markerLost', () => {
             // console.log("Marcador perdido - Audio sigue sonando (Narrador mode)");
          });
        }
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

   planetasDB.forEach((data) => {
     const marker = document.createElement("a-marker");

     // Configuración del marcador
     if (data.pattern === "hiro") {
       marker.setAttribute("preset", "hiro");
     } else {
       marker.setAttribute("type", "pattern");
       marker.setAttribute("url", data.pattern);
     }

     marker.setAttribute("sound-handler", ""); // Activamos la lógica inteligente
     marker.setAttribute("emitevents", "true");

     // Configuración del Planeta (Con la velocidad personalizada que pediste)
     const sphere = document.createElement("a-sphere");
     sphere.setAttribute("position", "0 0.5 0");
     sphere.setAttribute("radius", data.tamano);

     // Shader especial para el Sol
     if (data.nombre === "Sol") {
       sphere.setAttribute("material", "shader: flat; src: " + data.textura);
     } else {
       sphere.setAttribute("src", data.textura);
     }

     // Animación con velocidad personalizada
     sphere.setAttribute(
       "animation",
       `property: rotation; to: 0 360 0; loop: true; dur: ${
         data.velocidad || 10000
       }; easing: linear`
     );

     // Configuración del Audio
     if (data.audio) {
       const sound = document.createElement("a-entity");

       sound.setAttribute(
         "sound",
         `src: url(${data.audio}); autoplay: false; volume: 6`
       );
       marker.appendChild(sound);
     }

     marker.appendChild(sphere);
     scene.appendChild(marker);
   });
 }