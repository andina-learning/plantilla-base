/* =========================================================
   CURSO · Cómo se escribe un artículo académico
   ---------------------------------------------------------
   Cliente:   Universidad Andina Virtual · Escuela de Posgrado
   Insumo:    ../insumos/DI_Unidad.docx · Preguntas_Unidad.docx · Glosario_Unidad.docx
   Audiencia: [PENDIENTE · del DI]
   Duración:  [PENDIENTE · del DI]
   Preset visual: andina  (ver instituciones/andina/INSTITUCION.md)
   Versión template: hibrida

   Las pantallas de fuente/contenido/ son EJEMPLOS: vienen de la demo
   (cursos/demo-unidad-2, la Unidad 2 de Scala con la piel Andina) y se
   reemplazan por el contenido literal del DI. Las fotos de ejemplo no
   viajan en la semilla: solo la de portada, que es la oficial de Andina.
   ========================================================= */

module.exports = {

  brand: {
    // Logo negativo (blanco + «Virtual» celeste): el que va sobre el sidebar abismo.
    // En el tema «clara» la skin lo cambia por la versión azul.
    name: '',
    sub:  '',
    logo:       'assets/img/logos/andina-logo-blanco.png',
    logoMobile: 'assets/img/logos/andina-aguila-blanco.png',
  },

  course: {
    code:             'UNIDAD 1',
    name:             'Cómo se escribe un artículo académico',
    subtitle:         'Nombre del curso',
    duration:         '',
    iso:              '',
    licencia:         '',
    preset:           'andina',
    pdf:              '',
    portadaFullBleed: true,
  },

  /* MENÚ · la estructura RED (la misma de Scala Learning):
       - `tipo: 'especial'`  → secciones estructurales que tiene toda unidad
                               (inicio, contenido, introducción, conclusión,
                               evaluación, glosario, referencias). Icono, no número.
       - `tipo: 'tema'`      → contenido temático, numerado 1, 2, 3…
     Las `secciones` con `ancla` aparecen en el menú como sub-ítems y bajan a la
     `.ua-seccion` con ese `id` (único en todo el curso). */
  /* PLANTILLA BASE (2026-10-18): la estructura RED completa más la sección Créditos que pidió
     Scala en la revisión del 2026-10-16. Cada tema reúne una familia de componentes; el texto de
     los ejemplos es un solo tema real («Cómo se escribe un artículo académico») para que el
     catálogo se lea como un curso. */
  menu: [
    { id: 'portada',      titulo: 'Inicio',                  tipo: 'especial', icon: 'mdi:home-outline' },
    { id: 'temario',      titulo: 'Contenido de la unidad',  tipo: 'especial', icon: 'mdi:map-outline' },

    { id: 'introduccion', titulo: 'Introducción',            tipo: 'especial', icon: 'mdi:information-variant',
      secciones: [ { titulo: 'Qué va a lograr en esta unidad', ancla: 'que-va-a-lograr' },
                   { titulo: 'Cómo está organizada la unidad', ancla: 'como-esta-organizada' } ] },

    { id: 'tema1',        titulo: 'Texto y énfasis', tipo: 'tema',
      secciones: [ { titulo: 'Títulos, párrafos y listas', ancla: 'titulos-parrafos-listas' },
                   { titulo: 'Bloques de texto destacado', ancla: 'bloques-destacados' },
                   { titulo: 'Citas, cifras y banner', ancla: 'citas-cifras-banner' },
                   { titulo: 'Bloque de código', ancla: 'bloque-de-codigo' } ] },

    { id: 'tema2',        titulo: 'Estructura del contenido', tipo: 'tema',
      secciones: [ { titulo: 'Acordeones', ancla: 'acordeones' },
                   { titulo: 'Pestañas', ancla: 'pestanas' },
                   { titulo: 'Pasos y ciclos', ancla: 'pasos-y-ciclos' },
                   { titulo: 'Líneas de tiempo', ancla: 'lineas-de-tiempo' },
                   { titulo: 'Comparativos y tablas', ancla: 'comparativos-y-tablas' } ] },

    { id: 'tema3',        titulo: 'Tarjetas y galerías', tipo: 'tema',
      secciones: [ { titulo: 'Tarjetas', ancla: 'tarjetas' },
                   { titulo: 'Carrusel y slide', ancla: 'carrusel-y-slide' },
                   { titulo: 'Galería de imágenes', ancla: 'galeria' } ] },

    { id: 'tema4',        titulo: 'Imagen, video, audio y descargas', tipo: 'tema',
      secciones: [ { titulo: 'Imágenes y figuras', ancla: 'imagenes-y-figuras' },
                   { titulo: 'Puntos de interés y ventanas', ancla: 'puntos-de-interes' },
                   { titulo: 'Video', ancla: 'video' },
                   { titulo: 'Pódcast', ancla: 'podcast' },
                   { titulo: 'Descargas y enlaces', ancla: 'descargas-y-enlaces' } ] },

    { id: 'tema5',        titulo: 'Actividades', tipo: 'tema',
      secciones: [ { titulo: 'Pregunta de selección', ancla: 'pregunta' },
                   { titulo: 'Relacionar términos', ancla: 'relacionar' },
                   { titulo: 'Ordenar y clasificar', ancla: 'ordenar-y-clasificar' },
                   { titulo: 'Lista de verificación', ancla: 'lista-de-verificacion' } ] },

    { id: 'evaluacion',   titulo: 'Evaluación de la unidad', tipo: 'especial', icon: 'mdi:clipboard-check-outline' },
    { id: 'referencias',  titulo: 'Referencias',             tipo: 'especial', icon: 'mdi:bookmark-outline' },
    { id: 'creditos',     titulo: 'Créditos',                tipo: 'especial', icon: 'mdi:account-group-outline' },
  ],

  /* REFERENCIAS · APA literal del DI §Referencias. Estilo de la línea: autor y año sin
     negrilla, título de la obra en cursiva, URL en texto sin hipervínculo. */
  referencias: [],

  creditos: {
    institucion: 'Universidad Andina Virtual · Escuela de Posgrado',
  },
};
