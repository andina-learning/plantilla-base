/* =========================================================
   CURSO · Catálogo de componentes (plantilla base de Andina)
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
    code:             'Plantilla base',
    name:             'Catálogo de componentes',
    subtitle:         'Plantilla base del recurso educativo',
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
      secciones: [ { titulo: 'Subtítulos', ancla: 'subtitulos' },
                   { titulo: 'Listas', ancla: 'listas' },
                   { titulo: 'Tablas', ancla: 'tablas' },
                   { titulo: 'Bloque destacado', ancla: 'bloques-de-texto' },
                   { titulo: 'Descarga', ancla: 'descarga' },
                   { titulo: 'Recursos y enlaces', ancla: 'recursos-y-enlaces' },
                   { titulo: 'Citas', ancla: 'citas' },
                   { titulo: 'Banner destacado', ancla: 'banner-destacado' },
                   { titulo: 'Comparativo', ancla: 'comparativo' },
                   { titulo: 'Bloque de código', ancla: 'bloque-de-codigo' } ] },

    { id: 'tema2',        titulo: 'Figuras, video y podcast', tipo: 'tema',
      secciones: [ { titulo: 'Imagen con leyenda', ancla: 'imagenes-y-figuras' },
                   { titulo: 'Figura pendiente', ancla: 'figura-pendiente' },
                   { titulo: 'Ilustración explicativa', ancla: 'ilustracion-explicativa' },
                   { titulo: 'Video', ancla: 'video' },
                   { titulo: 'Pódcast · con foto', ancla: 'podcast' } ] },

    { id: 'tema3',        titulo: 'Componentes básicos', tipo: 'tema',
      secciones: [ { titulo: 'Acordeón', ancla: 'acordeones' },
                   { titulo: 'Carrusel', ancla: 'carrusel-y-slide' },
                   { titulo: 'Carrusel de fotos', ancla: 'carrusel-de-fotos' },
                   { titulo: 'Slide', ancla: 'slide' },
                   { titulo: 'Pestañas', ancla: 'pestanas' },
                   { titulo: 'Pestañas - línea', ancla: 'pestanas-linea' },
                   { titulo: 'Pestañas verticales', ancla: 'pestanas-verticales' } ] },

    { id: 'tema4',        titulo: 'Componentes de pasos y líneas de tiempo', tipo: 'tema',
      secciones: [ { titulo: 'Acordeón numerado', ancla: 'acordeon-numerado' },
                   { titulo: 'Ruta en zigzag', ancla: 'ruta-en-zigzag' },
                   { titulo: 'Ruta de inicio a meta', ancla: 'ruta-de-inicio-a-meta' },
                   { titulo: 'Slider de pasos', ancla: 'slider-de-pasos' },
                   { titulo: 'Listado de pasos vertical', ancla: 'listado-de-pasos-vertical' },
                   { titulo: 'Listado de pasos con tarjetas', ancla: 'listado-de-pasos-con-tarjetas' },
                   { titulo: 'Línea de tiempo tipo 1', ancla: 'linea-de-tiempo-tipo-1' },
                   { titulo: 'Línea de tiempo tipo 2', ancla: 'linea-de-tiempo-tipo-2' },
                   { titulo: 'Línea de tiempo tipo 3', ancla: 'linea-de-tiempo-tipo-3' } ] },

    { id: 'tema5',        titulo: 'Tarjetas', tipo: 'tema',
      secciones: [ { titulo: 'Tarjetas con icono - izquierda', ancla: 'tarjetas-con-icono-izquierda' },
                   { titulo: 'Ejemplo de uso de tarjetas con icono - izquierda', ancla: 'ejemplo-tarjetas-con-icono-izquierda' },
                   { titulo: 'Tarjetas con icono - centrado', ancla: 'tarjetas-con-icono-centrado' },
                   { titulo: 'Ejemplo de uso de tarjetas con icono', ancla: 'ejemplo-tarjetas-con-icono' },
                   { titulo: 'Tarjetas conectadas - clara', ancla: 'tarjetas-conectadas' },
                   { titulo: 'Tarjetas conectadas - oscura', ancla: 'tarjetas-conectadas-oscura' },
                   { titulo: 'Ejemplo de uso de tarjetas conectadas', ancla: 'ejemplo-tarjetas-conectadas' },
                   { titulo: 'Tarjetas con foto', ancla: 'tarjetas-con-foto' },
                   { titulo: 'Tarjetas con foto y descripción', ancla: 'tarjetas-con-foto-y-descripcion' },
                   { titulo: 'Tarjetas que giran', ancla: 'tarjetas-que-giran' },
                   { titulo: 'Tarjeta con botón', ancla: 'tarjeta-con-boton' } ] },

    { id: 'tema6',        titulo: 'Infografías e interactivos', tipo: 'tema',
      secciones: [ { titulo: 'Imagen con puntos interactivos (hotspots)', ancla: 'imagen-con-puntos-interactivos' },
                   { titulo: 'Tarjeta con cifra destacada - clara', ancla: 'tarjeta-con-cifra-destacada' },
                   { titulo: 'Tarjeta con cifra destacada - oscura', ancla: 'tarjeta-con-cifra-destacada-oscura' },
                   { titulo: 'Bloque con Cifra destacada - clara', ancla: 'cifra-destacada' },
                   { titulo: 'Bloque con Cifra destacada - oscura', ancla: 'cifra-destacada-oscura' },
                   { titulo: 'Proceso escalonado', ancla: 'proceso-escalonado' },
                   { titulo: 'Antes y después', ancla: 'antes-y-despues' } ] },

    { id: 'tema7',        titulo: 'Actividades', tipo: 'tema',
      secciones: [ { titulo: 'Pregunta', ancla: 'pregunta' },
                   { titulo: 'Verdadero o falso', ancla: 'verdadero-o-falso' },
                   { titulo: 'Relacionar', ancla: 'relacionar' },
                   { titulo: 'Ordenar', ancla: 'ordenar-y-clasificar' },
                   { titulo: 'Clasificar', ancla: 'clasificar' },
                   { titulo: 'Lista de verificación', ancla: 'lista-de-verificacion' },
                   { titulo: 'Para reflexionar', ancla: 'para-reflexionar' } ] },

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
