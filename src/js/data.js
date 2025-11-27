const planetasDB = [
  {
    id: 0,
    nombre: "Sol",
    pattern: "assets/marcadores/pattern_sol.patt",
    textura: "assets/planetas/sol.jpg", // ¡Falta esta imagen!
    audio: "assets/audio/sol_sonido.mp3",
    tamano: 1.2,
    velocidad: 35000, // Rotación muy lenta
  },
  // --- PLANETAS INTERIORES ---
  {
    id: 1,
    nombre: "Mercurio",
    pattern: "assets/marcadores/pattern_mercurio.patt",
    textura: "assets/planetas/2k_mercury.jpg", // Usando tu textura subida
    audio: "assets/audio/mercurio_sonido.mp3",
    tamano: 0.3,
    velocidad: 15000,
  },
  {
    id: 2,
    nombre: "Venus",
    pattern: "assets/marcadores/pattern_venus.patt",
    textura: "assets/planetas/2k_venus_surface.jpg", // ¡Falta esta imagen!
    audio: "assets/audio/venus_sonido.mp3",
    tamano: 0.45,
    velocidad: 25000, // Rota muy lento (y al revés en la realidad)
  },
  {
    id: 3,
    nombre: "Tierra",
    pattern: "assets/marcadores/pattern_tierra.patt",
    textura: "assets/planetas/2k_earth_daymap.jpg", // Usando tu textura subida
    audio: "assets/audio/tierra_sonido.mp3",
    tamano: 0.5,
    velocidad: 10000,
  },
  {
    id: 4,
    nombre: "Marte",
    pattern: "assets/marcadores/pattern_marte.patt",
    textura: "assets/planetas/2k_mars.jpg", // Usando tu textura subida
    audio: "assets/audio/marte_sonido.mp3",
    tamano: 0.4,
    velocidad: 10000,
  },
  // --- GIGANTES GASEOSOS ---
  {
    id: 5,
    nombre: "Júpiter",
    pattern: "assets/marcadores/pattern_jupiter.patt",
    textura: "assets/planetas/2k_jupiter.jpg", // Usando tu textura subida
    audio: "assets/audio/jupiter_sonido.mp3",
    tamano: 1.0,
    velocidad: 4000, // Muy rápido
  },
  {
    id: 5,
    nombre: "Saturno",
    pattern: "assets/marcadores/pattern_saturno.patt",
    textura: "assets/planetas/2k_saturn.jpg", // Usando tu textura subida
    audio: "assets/audio/saturno_sonido.mp3",
    tamano: 0.9,
    velocidad: 4500,
  },
  {
    id: 7,
    nombre: "Urano",
    pattern: "assets/marcadores/pattern_urano.patt",
    textura: "assets/planetas/urano.jpg", // ¡Falta esta imagen!
    audio: "assets/audio/urano_sonido.mp3",
    tamano: 0.7,
    velocidad: 6000,
  },
  {
    id: 8,
    nombre: "Neptuno",
    pattern: "assets/marcadores/pattern_neptuno.patt",
    textura: "assets/planetas/2k_neptune.jpg", // Usando tu textura subida
    audio: "assets/audio/neptuno_sonido.mp3",
    tamano: 0.7,
    velocidad: 6000,
  },
  // --- PLANETAS ENANOS (Tus texturas ficticias) ---
  {
    id: 9,
    nombre: "Ceres",
    pattern: "assets/marcadores/pattern_ceres.patt",
    textura: "assets/planetas/2k_ceres_fictional.jpg",
    audio: "assets/audio/ceres_sonido.mp3",
    tamano: 0.2,
    velocidad: 12000,
  },
  {
    id: 10,
    nombre: "Eris",
    pattern: "assets/marcadores/pattern_eris.patt",
    textura: "assets/planetas/2k_eris_fictional.jpg",
    audio: "assets/audio/eris_sonido.mp3",
    tamano: 0.2,
    velocidad: 12000,
  },
  {
    id: 11,
    nombre: "Haumea",
    pattern: "assets/marcadores/pattern_haumea.patt",
    textura: "assets/planetas/2k_haumea_fictional.jpg",
    audio: "assets/audio/haumea_sonido.mp3",
    tamano: 0.25, // Ligeramente más grande por ser ovalado
    velocidad: 3800, // Rota rapidísimo en la vida real (4 horas)
  },
  {
    id: 12,
    nombre: "Makemake",
    pattern: "assets/marcadores/pattern_makemake.patt",
    textura: "assets/planetas/2k_makemake_fictional.jpg",
    audio: "assets/audio/makemake_sonido.mp3",
    tamano: 0.2,
    velocidad: 12000,
  },
  {
    id: 11,
    nombre: "luna",
    pattern: "assets/marcadores/pattern_luna.patt",
    textura: "assets/planetas/luna.jpg",
    audio: "assets/audio/luna_sonido.mp3",
    tamano: 0.25, // Ligeramente más grande por ser ovalado
    velocidad: 3800, // Rota rapidísimo en la vida real (4 horas)
  },
  {
    id: 12, // Corregí el ID (tenías dos 5)
    nombre: "blackhole_3d",
    pattern: "assets/marcadores/blackhole_3d.patt",
    type: "3dmodel", // Etiqueta para saber que es un GLB
    modelo: "assets/modelos_3d/blackhole_3d.glb", // <--- TU ARCHIVO GLB AQUÍ
    audio: "assets/audio/saturno_sonido.mp3",
    escala: "0.5 0.5 0.5", // IMPORTANTE: Los modelos suelen venir muy grandes o chicos
    velocidad: 4500
  },
];
