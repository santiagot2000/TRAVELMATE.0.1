/* ================================================================
   TRAVELMATE - Lógica Dinámica de la Página de Detalle v1.1
   js/detalle.js
   - Detecta el MES ACTUAL REAL del sistema (ej. Septiembre/Octubre).
   - Muestra eventos del mes real y calendario anual completo.
   - Nueva Sección 9: Las 4 Estaciones del Año (Primavera, Verano, Otoño, Invierno).
   ================================================================ */

'use strict';

var MESES_NOMBRE = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/* --- MAPA DE IMÁGENES ÚNICAS PARA LOS 28 DESTINOS --- */
var MAPA_IMAGENES = {
  'Cartagena de Indias': '../assets/img/cartagena.jpg',
  'Santa Marta & Tayrona': '../assets/img/santamarta.jpg',
  'Eje Cafetero (Salento & Cocora)': '../assets/img/ejecafetero.jpg',
  'San Andrés Islas': '../assets/img/sanandres.jpg',
  'Cancún & Riviera Maya': '../assets/img/cancun.jpg',
  'Punta Cana': '../assets/img/puntacana.jpg',
  'Machu Picchu & Cusco': '../assets/img/machupicchu.jpg',
  'Ciudad de México': '../assets/img/mexicocity.jpg',
  'Buenos Aires': '../assets/img/buenosaires.jpg',
  'Río de Janeiro': '../assets/img/rio.jpg',
  'Salar de Uyuni': '../assets/img/uyuni.jpg',
  'Santiago & Viñedos': '../assets/img/santiago.jpg',
  'Bariloche & Lagos': '../assets/img/bariloche.jpg',
  'París': '../assets/img/paris.jpg',
  'Barcelona': '../assets/img/barcelona.jpg',
  'Roma': '../assets/img/roma.jpg',
  'Madrid': '../assets/img/Palacio_Real_Madrid.jpg',
  'Berlín': '../assets/img/berlin.jpg',
  'Ámsterdam': '../assets/img/amsterdam.jpg',
  'Londres': '../assets/img/londres.jpg',
  'Nueva York': '../assets/img/nuevayork.jpg',
  'Bali': '../assets/img/bali.jpg',
  'Tokio & Kioto': '../assets/img/tokio.jpg',
  'Dubái & Desierto': '../assets/img/dubai.jpg',
  'El Cairo & Las Pirámides': '../assets/img/elcairo.jpg',
  'Marrakech & Sahara': '../assets/img/marrakech.jpg',
  'Sídney & Gran Barrera': '../assets/img/sidney.jpg',
  'Ciudad del Cabo & Safari': '../assets/img/ciudaddelcabo.jpg'
};

/* --- BASE DE DATOS EXTENDIDA DE DETALLES --- */
var BASE_DETALLES = {

  'Tokio & Kioto': {
    nombre: 'Tokio & Kioto',
    pais: 'Japón · Asia',
    img: '../assets/img/tokio.jpg',
    tag: '#Futuro & Tradición',
    compatibilidad: 94,
    duracion: '10 a 15 Días',
    temporada: 'Marzo a Mayo / Sep a Nov',
    precioTotal: 8600000,
    idioma: 'Japonés',
    descripcion: 'Japón es un contraste deslumbrante entre el futuro hipertecnológico de Tokio con sus luces de neón en Shibuya y la paz milenaria de Kioto entre bosques de bambú, toriis rojos y santuarios shintoístas.',
    presupuesto: { vuelo: 4200000, hotel: 2800000, comida: 1100000, tours: 500000 },
    itinerario: [
      { dia: 'Día 1', titulo: 'Luces de Shibuya y Shinjuku', desc: 'Llegada a Tokio, cruce de Shibuya, vista desde rascacielos y cena en un izakaya tradicional.' },
      { dia: 'Día 2', titulo: 'Templos y Tradición en Asakusa', desc: 'Templo Senso-ji, recorrido por Akihabara y paseo por los jardines del Palacio Imperial.' },
      { dia: 'Día 3', titulo: 'Tren Bala hacia Kioto', desc: 'Viaje en el Shinkansen a 300 km/h, visita al santuario Fushimi Inari con sus miles de toriis rojos.' },
      { dia: 'Día 4', titulo: 'Bosque de Bambú de Arashiyama', desc: 'Paseo matutino entre bambúes gigantes y visita al Pabellón Dorado Kinkaku-ji.' }
    ],
    gastronomia: [
      { nombre: 'Ramen Tonkotsu Auténtico', desc: 'Fideos en rico caldo de hueso de cerdo cocinado 12 horas con chashu y huevo marinado.', precio: 38000, icono: '🍜' },
      { nombre: 'Sushi & Sashimi de Mercado', desc: 'Cortes frescos de atún rojo, salmón y pez mantequilla preparados al instante.', precio: 65000, icono: '🍣' },
      { nombre: 'Tempura Mixta Crujiente', desc: 'Mariscos y vegetales frescos fritos en una masa ligera y crujiente.', precio: 42000, icono: '🍤' },
      { nombre: 'Matcha Latte & Mochi', desc: 'Té verde ceremonial japonés acompañado de pastelitos de arroz rellenos de judía dulce.', precio: 18000, icono: '🍵' }
    ],
    festividadesPorMes: {
      'Enero': { titulo: 'Hatsumode (Primer Viaje al Templo)', desc: 'Millones de personas visitan los santuarios para pedir buena suerte en el año nuevo.' },
      'Febrero': { titulo: 'Setsubun (Festival del Cambio de Estación)', desc: 'Rito tradicional para ahuyentar a los malos espíritus tirando semillas de soya cocidas.' },
      'Marzo': { titulo: 'Hina Matsuri (Día de las Niñas)', desc: 'Exposición de muñecas tradicionales ceremoniales y dulces de arroz coloreados.' },
      'Abril': { titulo: 'Hanami (Floración del Cerezo Sakura)', desc: 'Picnics y festivales bajo los cerezos en flor en los parques de Tokio y Kioto.' },
      'Mayo': { titulo: 'Kanda Matsuri & Golden Week', desc: 'Gran festival portátil Shinto en Tokio con desfiles de sacerdotes y músicos.' },
      'Junio': { titulo: 'Sanno Matsuri & Temporada de Hortensias', desc: 'Procesión tradicional en el centro de Tokio e iluminación de jardines.' },
      'Julio': { titulo: 'Gion Matsuri en Kioto', desc: 'El festival más famoso de Japón con desfile de gigantescas carrozas de madera.' },
      'Agosto': { titulo: 'Festival de Fuegos Artificiales de Sumidagawa', desc: 'Cielos iluminados sobre Tokio con miles de fuegos pirotécnicos y trajes yukata.' },
      'Septiembre': { titulo: 'Tsukimi (Festival de Contemplación de la Luna de Otoño)', desc: 'Celebración otoñal con ofrendas de pasteles de arroz y flores bajo la luna llena.' },
      'Octubre': { titulo: 'Momiji (Hojas Rojas de Otoño) & Halloween en Shibuya', desc: 'Los bosques de arce se tornan rojo intenso y Shibuya celebra la fiesta de disfraces más grande.' },
      'Noviembre': { titulo: 'Shichi-Go-San & Iluminaciones de Otoño', desc: 'Festividad tradicional para niños de 3, 5 y 7 años vestidos con kimonos.' },
      'Diciembre': { titulo: 'Iluminaciones Navideñas en Roppongi', desc: 'Espectaculares túneles de luces LED en Tokio y mercados de invierno.' }
    },
    calendarioAnual: [
      { mes: 'Abril', evento: 'Festival del Sakura (Floración del Cerezo)', tipo: 'Naturaleza & Tradición' },
      { mes: 'Julio', evento: 'Gion Matsuri en Kioto', tipo: 'Gran Desfile Histórico' },
      { mes: 'Septiembre / Octubre', evento: 'Tsukimi & Inicio del Momiji (Arce Rojo)', tipo: 'Paisaje Otoñal' },
      { mes: 'Diciembre', evento: 'Iluminaciones Navideñas de Roppongi & Año Nuevo', tipo: 'Espectáculo Nocturno' }
    ],
    estaciones: [
      { nombre: 'Primavera 🌸', meses: 'Marzo a Mayo', temp: '12°C a 20°C', desc: 'Clima fresco y templado. Época de la floración de los cerezos (Sakura).', recomendacion: 'Llevar chaqueta ligera, suéteres y calzado cómodo para caminar.' },
      { nombre: 'Verano ☀️', meses: 'Junio a Agosto', temp: '25°C a 34°C', desc: 'Clima cálido y húmedo. Temporada de festivales nocturnos (Matsuri) y fuegos artificiales.', recomendacion: 'Ropa de algodón muy fresca, protector solar y sombrilla.' },
      { nombre: 'Otoño 🍁', meses: 'Septiembre a Noviembre', temp: '14°C a 22°C', desc: 'Clima agradable y seco. Los bosques se tiñen de rojo y dorado intenso (Momiji).', recomendacion: 'Vestir en capas: abrigo medio, abrigos para la noche y bufanda.' },
      { nombre: 'Invierno ❄️', meses: 'Diciembre a Febrero', temp: '2°C a 10°C', desc: 'Frío seco con cielos despejados. Vistas increíbles del Monte Fuji y nieve en las montañas.', recomendacion: 'Abrigo grueso, guantes, gorro de lana y botas de invierno.' }
    ]
  },

  'Cartagena de Indias': {
    nombre: 'Cartagena de Indias',
    pais: 'Colombia · América del Sur',
    img: '../assets/img/cartagena.jpg',
    tag: '#Caribe & Historia',
    compatibilidad: 95,
    duracion: '3 a 5 Días',
    temporada: 'Diciembre a Abril',
    precioTotal: 2450000,
    idioma: 'Español',
    descripcion: 'Cartagena de Indias combina la majestuosidad de su arquitectura colonial amurallada con el encanto de sus plazas iluminadas por faroles. Declarada Patrimonio de la Humanidad por la UNESCO, ofrece playas paradisíacas e historia única.',
    presupuesto: { vuelo: 850000, hotel: 900000, comida: 450000, tours: 250000 },
    itinerario: [
      { dia: 'Día 1', titulo: 'Llegada y Paseo Colonial', desc: 'Check-in en el hotel, caminata por la Ciudad Amurallada al atardecer y cena en San Diego.' },
      { dia: 'Día 2', titulo: 'Islas del Rosario y Playa', desc: 'Excursión en lancha hacia Isla Barú o Playa Blanca. Snorkel y almuerzo marinero.' },
      { dia: 'Día 3', titulo: 'Historia y Fortalezas', desc: 'Castillo de San Felipe de Barajas y vista panorámica desde el Convento de la Popa.' }
    ],
    gastronomia: [
      { nombre: 'Posta Negra Cartagenera', desc: 'Corte suave de carne vacuna marinado en reducción dulce de panela y especias.', precio: 42000, icono: '🥩' },
      { nombre: 'Arroz de Coco con Pescado Frito', desc: 'Pargo rojo crujiente servido con arroz titoté dulce y patacones.', precio: 48000, icono: '🐟' },
      { nombre: 'Limonada de Coco', desc: 'Bebida helada y cremosa preparada con leche de coco natural y gotas de limón.', precio: 14000, icono: '🥥' }
    ],
    festividadesPorMes: {
      'Enero': { titulo: 'Festival Internacional de Música', desc: 'Conciertos de música clásica en escenarios coloniales e iglesias históricas.' },
      'Marzo': { titulo: 'Festival de Cine de Cartagena (FICCI)', desc: 'Proyecciones al aire libre de cine iberoamericano.' },
      'Julio': { titulo: 'Fiestas de la Virgen del Carmen', desc: 'Procesiones náuticas de lanchas decoradas en la bahía de Cartagena.' },
      'Septiembre': { titulo: 'Mes del Patrimonio & Festival de la Petacona', desc: 'Eventos culturales y muestras gastronómicas en el centro histórico.' },
      'Noviembre': { titulo: 'Fiestas de la Independencia & Reinado', desc: 'Desfiles de comparsas, bando popular y fiesta caribeña en las murallas.' }
    },
    calendarioAnual: [
      { mes: 'Enero', evento: 'Festival Internacional de Música', tipo: 'Música Clásica' },
      { mes: 'Marzo', evento: 'Festival de Cine (FICCI)', tipo: 'Cine & Arte' },
      { mes: 'Septiembre', evento: 'Mes del Patrimonio Histórico', tipo: 'Cultura Local' },
      { mes: 'Noviembre', evento: 'Fiestas Novembrinas de la Independencia', tipo: 'Carnaval & Fiestas' }
    ],
    estaciones: [
      { nombre: 'Verano Caribeño ☀️', meses: 'Diciembre a Abril', temp: '28°C a 32°C', desc: 'Temporada seca con brisa marina fresca. La mejor época para playa y navegación.', recomendacion: 'Ropa de playa ligera, protector solar y sombrero de ala ancha.' },
      { nombre: 'Temporada Verde 🌿', meses: 'Mayo a Noviembre', temp: '26°C a 31°C', desc: 'Lluvias breves por las tardes que refrescan el ambiente. Atardeceres muy fotogénicos.', recomendacion: 'Ropa fresca de algodón, sombrilla pequeña e impermeable ligero.' }
    ]
  }
};

/* --- GENERADOR DE DATOS DE RESPALDO --- */
function obtenerDetalleDestino(nombreBuscado) {
  var mesActualIdx = new Date().getMonth();
  var mesActualNombre = MESES_NOMBRE[mesActualIdx]; // ej. "Septiembre" o "Octubre"

  if (BASE_DETALLES[nombreBuscado]) {
    var d = BASE_DETALLES[nombreBuscado];
    // Asignar festividad del mes real si existe
    if (d.festividadesPorMes && d.festividadesPorMes[mesActualNombre]) {
      d.festividadDestacada = {
        mes: mesActualNombre,
        titulo: d.festividadesPorMes[mesActualNombre].titulo,
        desc: d.festividadesPorMes[mesActualNombre].desc
      };
    }
    return d;
  }

  var imgUnica = MAPA_IMAGENES[nombreBuscado] || '../assets/img/cartagena.jpg';

  return {
    nombre: nombreBuscado || 'Destino Increíble',
    pais: 'Destino Internacional',
    img: imgUnica,
    tag: '#Exploración',
    compatibilidad: 90,
    duracion: '5 a 7 Días',
    temporada: 'Todo el año',
    precioTotal: 4200000,
    idioma: 'Local / Español',
    descripcion: nombreBuscado + ' es un lugar mágico lleno de cultura, paisajes icónicos e infraestructura turística excepcional. Diseñado para ofrecer momentos inolvidables y experiencias únicas.',
    presupuesto: { vuelo: 1800000, hotel: 1400000, comida: 600000, tours: 400000 },
    itinerario: [
      { dia: 'Día 1', titulo: 'Llegada y Recorrido Inicial', desc: 'Check-in en el hotel y caminata por el centro histórico.' },
      { dia: 'Día 2', titulo: 'Tours de Naturaleza y Cultura', desc: 'Visita guiada a los sitios emblemáticos y monumentos principales.' },
      { dia: 'Día 3', titulo: 'Gastronomía y Noche Típica', desc: 'Degustación de la comida local y show cultural nocturno.' }
    ],
    gastronomia: [
      { nombre: 'Plato Emblemático de ' + nombreBuscado, desc: 'Especialidad culinaria de la región.', precio: 38000, icono: '🍲' },
      { nombre: 'Postre & Dulce Tradicional', desc: 'Receta dulce icónica del lugar.', precio: 16000, icono: '🍰' }
    ],
    festividadDestacada: {
      mes: mesActualNombre,
      titulo: 'Celebración Cultural de ' + mesActualNombre + ' en ' + nombreBuscado,
      desc: 'Evento y festividad tradicional activa durante el mes de ' + mesActualNombre + ' con muestras artísticas y gastronómicas.'
    },
    calendarioAnual: [
      { mes: mesActualNombre, evento: 'Feria & Evento de ' + mesActualNombre, tipo: 'Cultura Activa' },
      { mes: 'Julio', evento: 'Festival de Verano', tipo: 'Fiesta Popular' },
      { mes: 'Diciembre', evento: 'Alumbrados & Navidad', tipo: 'Tradición Local' }
    ],
    estaciones: [
      { nombre: 'Primavera 🌸', meses: 'Marzo a Mayo', temp: '15°C a 22°C', desc: 'Clima fresco y templado con flores en parques.', recomendacion: 'Ropa en capas y chaqueta ligera.' },
      { nombre: 'Verano ☀️', meses: 'Junio a Agosto', temp: '24°C a 32°C', desc: 'Días soleados y eventos al aire libre.', recomendacion: 'Ropa fresca y protector solar.' },
      { nombre: 'Otoño 🍁', meses: 'Septiembre a Noviembre', temp: '12°C a 20°C', desc: 'Temperaturas agradables y hojas doradas.', recomendacion: 'Abrigo medio y calzado cómodo.' },
      { nombre: 'Invierno ❄️', meses: 'Diciembre a Febrero', temp: '2°C a 10°C', desc: 'Clima frío con luces de temporada.', recomendacion: 'Abrigo grueso y bufanda.' }
    ]
  };
}

/* --- RENDERIZADO EN EL DOM --- */
function cargarPantallaDetalle(d) {
  var mesActualIdx = new Date().getMonth();
  var mesActualNombre = MESES_NOMBRE[mesActualIdx];

  // Banner Hero
  var detNombre = document.getElementById('detNombre');
  var detPais = document.getElementById('detPais');
  var detTag = document.getElementById('detTag');
  var detCompat = document.getElementById('detCompat');
  var heroFondo = document.getElementById('heroFondoImg');

  if (detNombre) detNombre.textContent = d.nombre;
  if (detPais) detPais.textContent = d.pais;
  if (detTag) detTag.textContent = d.tag;
  if (detCompat) detCompat.textContent = '★ ' + d.compatibilidad + '% Compatible';
  if (heroFondo && d.img) heroFondo.style.backgroundImage = "url('" + d.img + "')";

  // Datos Rápidos
  var detDuracion = document.getElementById('detDuracion');
  var detTemporada = document.getElementById('detTemporada');
  var detPrecioTotal = document.getElementById('detPrecioTotal');
  var detIdioma = document.getElementById('detIdioma');
  var detDesc = document.getElementById('detDescripcionCompleta');

  if (detDuracion) detDuracion.textContent = d.duracion;
  if (detTemporada) detTemporada.textContent = d.temporada;
  if (detPrecioTotal) detPrecioTotal.textContent = '$' + d.precioTotal.toLocaleString('es-CO') + ' COP';
  if (detIdioma) detIdioma.textContent = d.idioma;
  if (detDesc) detDesc.textContent = d.descripcion;

  // Desglose Presupuestal
  var pVuelo = document.getElementById('pMontoVuelo');
  var pHotel = document.getElementById('pMontoHotel');
  var pComida = document.getElementById('pMontoComida');
  var pTours = document.getElementById('pMontoTours');
  var pTotalGen = document.getElementById('pMontoTotalGeneral');

  if (pVuelo) pVuelo.textContent = '$' + d.presupuesto.vuelo.toLocaleString('es-CO') + ' COP';
  if (pHotel) pHotel.textContent = '$' + d.presupuesto.hotel.toLocaleString('es-CO') + ' COP';
  if (pComida) pComida.textContent = '$' + d.presupuesto.comida.toLocaleString('es-CO') + ' COP';
  if (pTours) pTours.textContent = '$' + d.presupuesto.tours.toLocaleString('es-CO') + ' COP';
  if (pTotalGen) pTotalGen.textContent = '$' + d.precioTotal.toLocaleString('es-CO') + ' COP';

  // Itinerario Día a Día
  var contItinerario = document.getElementById('contenedorItinerario');
  if (contItinerario && d.itinerario) {
    contItinerario.innerHTML = '';
    d.itinerario.forEach(function(item) {
      var elem = document.createElement('div');
      elem.className = 'timeline-item animable visible';
      elem.innerHTML =
        '<div class="timeline-badge">' + item.dia + '</div>' +
        '<div class="timeline-content">' +
          '<h4>' + item.titulo + '</h4>' +
          '<p>' + item.desc + '</p>' +
        '</div>';
      contItinerario.appendChild(elem);
    });
  }

  // Sección 7: Gastronomía Típica
  var contGastro = document.getElementById('contenedorGastronomia');
  if (contGastro && d.gastronomia) {
    contGastro.innerHTML = '';
    d.gastronomia.forEach(function(g) {
      var precioCOP = '$' + g.precio.toLocaleString('es-CO') + ' COP';
      var card = document.createElement('div');
      card.className = 'gastro-card animable visible';
      card.innerHTML =
        '<span class="gastro-icono">' + g.icono + '</span>' +
        '<div class="gastro-info">' +
          '<h4 class="gastro-nombre">' + g.nombre + '</h4>' +
          '<p class="gastro-desc">' + g.desc + '</p>' +
          '<strong class="gastro-precio">Promedio: ' + precioCOP + '</strong>' +
        '</div>';
      contGastro.appendChild(card);
    });
  }

  // Sección 8: Festividad del Mes Real
  var fMesBadge = document.getElementById('festMesNombre');
  var fMesTitulo = document.getElementById('festMesTitulo');
  var fMesDesc = document.getElementById('festMesDesc');

  if (d.festividadDestacada) {
    if (fMesBadge) fMesBadge.textContent = 'Celebración de ' + d.festividadDestacada.mes + ' (Mes Actual)';
    if (fMesTitulo) fMesTitulo.textContent = d.festividadDestacada.titulo;
    if (fMesDesc) fMesDesc.textContent = d.festividadDestacada.desc;
  }

  // Calendario Anual
  var contCal = document.getElementById('contenedorCalendarioAnual');
  if (contCal && d.calendarioAnual) {
    contCal.innerHTML = '';
    d.calendarioAnual.forEach(function(c) {
      var item = document.createElement('div');
      item.className = 'cal-item animable visible';
      item.innerHTML =
        '<span class="cal-mes">' + c.mes + '</span>' +
        '<div class="cal-detalles">' +
          '<strong>' + c.evento + '</strong>' +
          '<small>' + c.tipo + '</small>' +
        '</div>';
      contCal.appendChild(item);
    });
  }

  // Sección 9: Las 4 Estaciones del Año
  var contEstaciones = document.getElementById('contenedorEstaciones');
  if (contEstaciones && d.estaciones) {
    contEstaciones.innerHTML = '';
    d.estaciones.forEach(function(est) {
      var card = document.createElement('div');
      card.className = 'estacion-card animable visible';
      card.innerHTML =
        '<div class="estacion-header">' +
          '<h4>' + est.nombre + '</h4>' +
          '<span class="estacion-temp">' + est.temp + '</span>' +
        '</div>' +
        '<span class="estacion-meses">🗓️ ' + est.meses + '</span>' +
        '<p class="estacion-desc">' + est.desc + '</p>' +
        '<div class="estacion-tip">' +
          '<strong>🎒 Qué llevar:</strong> ' + est.recomendacion +
        '</div>';
      contEstaciones.appendChild(card);
    });
  }
}

/* --- INICIALIZACIÓN --- */
document.addEventListener('DOMContentLoaded', function() {
  var nombreDestino = 'Cartagena de Indias';
  try {
    var params = new URLSearchParams(window.location.search);
    var paramUrl = params.get('destino');
    if (paramUrl && paramUrl.trim() !== '') {
      nombreDestino = decodeURIComponent(paramUrl.trim());
    }
  } catch (e) {
    console.warn('No se pudo leer la URL');
  }

  var datosDestino = obtenerDetalleDestino(nombreDestino);
  cargarPantallaDetalle(datosDestino);
});
