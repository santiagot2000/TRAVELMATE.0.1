/* ================================================================
   TRAVELMATE - Catálogo de Destinos (28 Destinos Completos)
   js/catalogo.js
   Lógica interactiva de búsqueda, filtrado por categorías,
   rangos de presupuesto en COP y ordenamiento dinámico.
   ================================================================ */

'use strict';

/* --- 1. BASE DE DATOS MOCK DE DESTINOS (28 Destinos) --- */
var CATALOGO_DESTINOS = [
  // --- COLOMBIA Y CARIBE ---
  {
    id: 'cartagena',
    nombre: 'Cartagena de Indias',
    pais: 'Colombia',
    img: '../assets/img/cartagena.jpg',
    tag: '#Caribe',
    categorias: ['playa', 'cultura', 'gastronomia', 'romance'],
    precio: 2450000,
    compatibilidad: 95,
    duracion: '3 a 5 días',
    descripcion: 'Calles coloniales llenas de color, atardeceres sobre la muralla y playas cálidas en las Islas del Rosario.'
  },
  {
    id: 'santamarta',
    nombre: 'Santa Marta & Tayrona',
    pais: 'Colombia',
    img: '../assets/img/santamarta.jpg',
    tag: '#Naturaleza',
    categorias: ['playa', 'aventura', 'naturaleza'],
    precio: 1850000,
    compatibilidad: 94,
    duracion: '4 a 6 días',
    descripcion: 'Senderismo en la selva tropical, playas vírgenes en el Parque Tayrona y la magia de la Sierra Nevada.'
  },
  {
    id: 'ejecafetero',
    nombre: 'Eje Cafetero (Salento & Cocora)',
    pais: 'Colombia',
    img: '../assets/img/ejecafetero.jpg',
    tag: '#Tradición',
    categorias: ['naturaleza', 'cultura', 'gastronomia'],
    precio: 1500000,
    compatibilidad: 93,
    duracion: '3 a 5 días',
    descripcion: 'Palmas de cera gigantes en el Valle del Cocora, fincas cafeteras tradicionales y pueblos coloridos.'
  },
  {
    id: 'sanandres',
    nombre: 'San Andrés Islas',
    pais: 'Colombia',
    img: '../assets/img/sanandres.jpg',
    tag: '#Caribe',
    categorias: ['playa', 'aventura', 'fiesta'],
    precio: 2200000,
    compatibilidad: 92,
    duracion: '4 a 6 días',
    descripcion: 'El mar de los siete colores, snorkel con peces tropicales, cayos de arena blanca y brisa caribeña.'
  },
  {
    id: 'cancun',
    nombre: 'Cancún & Riviera Maya',
    pais: 'México',
    img: '../assets/img/cancun.jpg',
    tag: '#Caribe',
    categorias: ['playa', 'fiesta', 'cultura'],
    precio: 3300000,
    compatibilidad: 91,
    duracion: '5 a 8 días',
    descripcion: 'Cenotes sagrados cristalinos, ruinas mayas frente al mar en Tulum y una animada vida nocturna.'
  },
  {
    id: 'puntacana',
    nombre: 'Punta Cana',
    pais: 'República Dominicana',
    img: '../assets/img/puntacana.jpg',
    tag: '#Relax',
    categorias: ['playa', 'romance', 'gastronomia'],
    precio: 3600000,
    compatibilidad: 89,
    duracion: '5 a 7 días',
    descripcion: 'Resorts de primera clase, cocoteros inclinados sobre el agua y descanso absoluto en el Caribe.'
  },

  // --- SUDAMÉRICA ---
  {
    id: 'machupicchu',
    nombre: 'Machu Picchu & Cusco',
    pais: 'Perú',
    img: '../assets/img/machupicchu.jpg',
    tag: '#Aventura',
    categorias: ['aventura', 'cultura', 'gastronomia'],
    precio: 3800000,
    compatibilidad: 92,
    duracion: '5 a 8 días',
    descripcion: 'La majestuosidad del imperio inca entre montañas místicas, historia viva y alta gastronomía andina.'
  },
  {
    id: 'mexicocity',
    nombre: 'Ciudad de México',
    pais: 'México',
    img: '../assets/img/mexicocity.jpg',
    tag: '#Gastronomía',
    categorias: ['gastronomia', 'cultura', 'fiesta'],
    precio: 3400000,
    compatibilidad: 90,
    duracion: '5 a 7 días',
    descripcion: 'Pueblos mágicos urbanos, pirámides ancestrales de Teotihuacán y una cultura gastronomía declarada Patrimonio.'
  },
  {
    id: 'buenosaires',
    nombre: 'Buenos Aires',
    pais: 'Argentina',
    img: '../assets/img/buenosaires.jpg',
    tag: '#Bohemio',
    categorias: ['cultura', 'gastronomia', 'romance', 'fiesta'],
    precio: 3600000,
    compatibilidad: 88,
    duracion: '5 a 8 días',
    descripcion: 'Librerías de ensueño, ritmo de tango en San Telmo, arquitectura parisina y los mejores asados del mundo.'
  },
  {
    id: 'rio',
    nombre: 'Río de Janeiro',
    pais: 'Brasil',
    img: '../assets/img/rio.jpg',
    tag: '#Samba',
    categorias: ['playa', 'fiesta', 'cultura'],
    precio: 3900000,
    compatibilidad: 90,
    duracion: '5 a 8 días',
    descripcion: 'El Cristo Redentor observando la bahía, las playas de Copacabana e Ipanema y el ritmo contagioso de la samba.'
  },
  {
    id: 'uyuni',
    nombre: 'Salar de Uyuni',
    pais: 'Bolivia',
    img: '../assets/img/uyuni.jpg',
    tag: '#Fotografía',
    categorias: ['aventura', 'naturaleza'],
    precio: 2950000,
    compatibilidad: 88,
    duracion: '4 a 6 días',
    descripcion: 'El desierto de sal y espejo natural más grande del planeta. Fotografía surrealista y paisajes de otro mundo.'
  },
  {
    id: 'santiago',
    nombre: 'Santiago & Viñedos',
    pais: 'Chile',
    img: '../assets/img/santiago.jpg',
    tag: '#Vinos',
    categorias: ['gastronomia', 'romance', 'cultura'],
    precio: 3700000,
    compatibilidad: 87,
    duracion: '4 a 7 días',
    descripcion: 'La Cordillera de los Andes como telón de fondo, valles de cata de vino y la modernidad de la capital chilena.'
  },
  {
    id: 'bariloche',
    nombre: 'Bariloche & Lagos',
    pais: 'Argentina',
    img: '../assets/img/bariloche.jpg',
    tag: '#Nieve',
    categorias: ['aventura', 'romance', 'naturaleza'],
    precio: 4100000,
    compatibilidad: 89,
    duracion: '5 a 8 días',
    descripcion: 'Lagos de color azul turquesa, arquitectura en madera al estilo suizo, chocolaterías artesanales y nieve.'
  },

  // --- EUROPA Y NORTEAMÉRICA ---
  {
    id: 'paris',
    nombre: 'París',
    pais: 'Francia',
    img: '../assets/img/paris.jpg',
    tag: '#Romance',
    categorias: ['romance', 'cultura', 'gastronomia'],
    precio: 6200000,
    compatibilidad: 89,
    duracion: '7 a 10 días',
    descripcion: 'La ciudad luz: paseos por el río Sena, la Torre Eiffel iluminada, museos icónicos y alta cocina francesa.'
  },
  {
    id: 'barcelona',
    nombre: 'Barcelona',
    pais: 'España',
    img: '../assets/img/barcelona.jpg',
    tag: '#Mediterráneo',
    categorias: ['playa', 'cultura', 'fiesta', 'gastronomia'],
    precio: 5600000,
    compatibilidad: 91,
    duracion: '6 a 9 días',
    descripcion: 'El genio de Gaudí en cada esquina, la playa de la Barceloneta y noches inolvidables de tapas en el Barrio Gótico.'
  },
  {
    id: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
    img: '../assets/img/roma.jpg',
    tag: '#Historia',
    categorias: ['cultura', 'gastronomia', 'romance'],
    precio: 5800000,
    compatibilidad: 87,
    duracion: '6 a 8 días',
    descripcion: 'Caminar por el Coliseo, pedir un deseo en la Fontana di Trevi y disfrutar la auténtica pasta y gelato italiano.'
  },
  {
    id: 'madrid',
    nombre: 'Madrid',
    pais: 'España',
    img: '../assets/img/Palacio_Real_Madrid.jpg',
    tag: '#Capital',
    categorias: ['cultura', 'gastronomia', 'fiesta'],
    precio: 5300000,
    compatibilidad: 86,
    duracion: '5 a 7 días',
    descripcion: 'El Palacio Real, el Museo del Prado, atardeceres en el Templo de Debod y la animada vida en la Gran Vía.'
  },
  {
    id: 'berlin',
    nombre: 'Berlín',
    pais: 'Alemania',
    img: '../assets/img/berlin.jpg',
    tag: '#Vanguardia',
    categorias: ['cultura', 'fiesta'],
    precio: 5900000,
    compatibilidad: 86,
    duracion: '6 a 8 días',
    descripcion: 'La Puerta de Brandeburgo, historia viva en el Muro de Berlín, museos de nivel mundial y cultura underground.'
  },
  {
    id: 'amsterdam',
    nombre: 'Ámsterdam',
    pais: 'Países Bajos',
    img: '../assets/img/amsterdam.jpg',
    tag: '#Canales',
    categorias: ['cultura', 'romance'],
    precio: 6100000,
    compatibilidad: 88,
    duracion: '5 a 7 días',
    descripcion: 'Recorridos en bicicleta junto a los canales, el museo de Van Gogh y casas históricas de fachada inclinada.'
  },
  {
    id: 'londres',
    nombre: 'Londres',
    pais: 'Reino Unido',
    img: '../assets/img/londres.jpg',
    tag: '#Realeza',
    categorias: ['cultura', 'gastronomia'],
    precio: 6600000,
    compatibilidad: 87,
    duracion: '7 a 10 días',
    descripcion: 'El imponente Big Ben, palacios reales, museos con entrada gratuita, cabinas rojas y ambiente cosmopolita.'
  },
  {
    id: 'nuevayork',
    nombre: 'Nueva York',
    pais: 'Estados Unidos',
    img: '../assets/img/nuevayork.jpg',
    tag: '#Metrópolis',
    categorias: ['cultura', 'gastronomia', 'fiesta'],
    precio: 6800000,
    compatibilidad: 90,
    duracion: '6 a 9 días',
    descripcion: 'Las luces deslumbrantes de Times Square, caminatas por Central Park, shows de Broadway y rascacielos inolvidables.'
  },

  // --- EXÓTICOS Y AVENTURA SOÑADA ---
  {
    id: 'bali',
    nombre: 'Bali',
    pais: 'Indonesia',
    img: '../assets/img/bali.jpg',
    tag: '#Místico',
    categorias: ['playa', 'aventura', 'romance', 'naturaleza'],
    precio: 7300000,
    compatibilidad: 93,
    duracion: '9 a 14 días',
    descripcion: 'Templos sagrados sobre acantilados, terrazas de arroz infinitas en Ubud, yoga y atardeceres mágicos.'
  },
  {
    id: 'tokio',
    nombre: 'Tokio & Kioto',
    pais: 'Japón',
    img: '../assets/img/tokio.jpg',
    tag: '#Futuro',
    categorias: ['cultura', 'gastronomia', 'aventura'],
    precio: 8600000,
    compatibilidad: 94,
    duracion: '10 a 15 días',
    descripcion: 'La síntesis perfecta entre tecnología futurista, luces neón, santuarios shintoístas milenarios y ramen único.'
  },
  {
    id: 'dubai',
    nombre: 'Dubái & Desierto',
    pais: 'Emiratos Árabes',
    img: '../assets/img/dubai.jpg',
    tag: '#Lujo',
    categorias: ['aventura', 'fiesta', 'romance'],
    precio: 7900000,
    compatibilidad: 88,
    duracion: '6 a 9 días',
    descripcion: 'El rascacielos más alto del planeta (Burj Khalifa), islas artificiales y safaris de aventura en las dunas doradas.'
  },

  // --- ÁFRICA Y OCEANÍA ---
  {
    id: 'elcairo',
    nombre: 'El Cairo & Las Pirámides',
    pais: 'Egipto',
    img: '../assets/img/elcairo.jpg',
    tag: '#Místico',
    categorias: ['cultura', 'aventura'],
    precio: 6900000,
    compatibilidad: 91,
    duracion: '7 a 10 días',
    descripcion: 'Las imponentes Pirámides de Giza, la Esfinge, navegación por el río Nilo y miles de años de historia faraónica.'
  },
  {
    id: 'marrakech',
    nombre: 'Marrakech & Sahara',
    pais: 'Marruecos',
    img: '../assets/img/marrakech.jpg',
    tag: '#Exótico',
    categorias: ['cultura', 'gastronomia', 'aventura'],
    precio: 5800000,
    compatibilidad: 89,
    duracion: '6 a 9 días',
    descripcion: 'Mercados llenos de especias en la Medina, palacios árabes y noche bajo las estrellas en las dunas del Sahara.'
  },
  {
    id: 'sidney',
    nombre: 'Sídney & Gran Barrera',
    pais: 'Australia',
    img: '../assets/img/sidney.jpg',
    tag: '#Oceanía',
    categorias: ['playa', 'aventura', 'naturaleza'],
    precio: 9200000,
    compatibilidad: 93,
    duracion: '10 a 15 días',
    descripcion: 'La icónica Ópera de Sídney, playas de surf en Bondi Beach y la Gran Barrera de Coral viva.'
  },
  {
    id: 'ciudaddelcabo',
    nombre: 'Ciudad del Cabo & Safari',
    pais: 'Sudáfrica',
    img: '../assets/img/ciudaddelcabo.jpg',
    tag: '#Safari',
    categorias: ['aventura', 'naturaleza', 'playa'],
    precio: 7500000,
    compatibilidad: 90,
    duracion: '8 a 12 días',
    descripcion: 'La imponente Table Mountain, encuentros con la fauna africana en safaris y la unión de dos océanos.'
  }
];

/* --- 2. ESTADO ACTUAL DE FILTROS --- */
var estadoFiltros = {
  texto: '',
  categoria: 'todos',
  presupuesto: 'todos',
  orden: 'recomendados'
};

/* --- 3. FUNCIONES DE FILTRADO Y ORDENAMIENTO --- */
function aplicarFiltros() {
  var textoMin = estadoFiltros.texto.toLowerCase().trim();

  var filtrados = CATALOGO_DESTINOS.filter(function(d) {
    // 1. Filtro por texto
    var coincideTexto = true;
    if (textoMin !== '') {
      var enNombre = d.nombre.toLowerCase().indexOf(textoMin) !== -1;
      var enPais   = d.pais.toLowerCase().indexOf(textoMin) !== -1;
      var enTag    = d.tag.toLowerCase().indexOf(textoMin) !== -1;
      coincideTexto = enNombre || enPais || enTag;
    }

    // 2. Filtro por categoría de experiencia
    var coincideCategoria = true;
    if (estadoFiltros.categoria !== 'todos') {
      coincideCategoria = d.categorias.indexOf(estadoFiltros.categoria) !== -1;
    }

    // 3. Filtro por presupuesto en COP
    var coincidePresupuesto = true;
    if (estadoFiltros.presupuesto === 'economico') {
      coincidePresupuesto = d.precio <= 3000000;
    } else if (estadoFiltros.presupuesto === 'moderado') {
      coincidePresupuesto = d.precio > 3000000 && d.precio <= 5000000;
    } else if (estadoFiltros.presupuesto === 'premium') {
      coincidePresupuesto = d.precio > 5000000;
    }

    return coincideTexto && coincideCategoria && coincidePresupuesto;
  });

  // 4. Ordenamiento
  if (estadoFiltros.orden === 'precio-menor') {
    filtrados.sort(function(a, b) { return a.precio - b.precio; });
  } else if (estadoFiltros.orden === 'precio-mayor') {
    filtrados.sort(function(a, b) { return b.precio - a.precio; });
  } else if (estadoFiltros.orden === 'compatibilidad') {
    filtrados.sort(function(a, b) { return b.compatibilidad - a.compatibilidad; });
  } else {
    filtrados.sort(function(a, b) { return b.compatibilidad - a.compatibilidad; });
  }

  renderizarDestinos(filtrados);
}

/* --- 4. RENDERIZADO EN EL DOM --- */
function renderizarDestinos(destinos) {
  var grid = document.getElementById('catalogoGrid');
  var estadoVacio = document.getElementById('estadoVacio');
  var contador = document.getElementById('contadorResultados');
  var tagFiltro = document.getElementById('tagFiltroActivo');

  if (!grid) return;

  if (contador) {
    if (destinos.length === 1) {
      contador.textContent = '1 destino encontrado';
    } else {
      contador.textContent = destinos.length + ' destinos encontrados';
    }
  }

  if (tagFiltro) {
    if (estadoFiltros.texto !== '' || estadoFiltros.categoria !== 'todos' || estadoFiltros.presupuesto !== 'todos') {
      var partes = [];
      if (estadoFiltros.texto) partes.push('"' + estadoFiltros.texto + '"');
      if (estadoFiltros.categoria !== 'todos') partes.push('Cat: ' + estadoFiltros.categoria);
      if (estadoFiltros.presupuesto !== 'todos') partes.push('Presupuesto: ' + estadoFiltros.presupuesto);
      tagFiltro.textContent = 'Filtros: ' + partes.join(' · ');
      tagFiltro.style.display = 'inline-block';
    } else {
      tagFiltro.style.display = 'none';
    }
  }

  if (destinos.length === 0) {
    grid.innerHTML = '';
    if (estadoVacio) estadoVacio.style.display = 'block';
    return;
  }

  if (estadoVacio) estadoVacio.style.display = 'none';
  grid.innerHTML = '';

  destinos.forEach(function(d) {
    var precioCOP = '$' + d.precio.toLocaleString('es-CO') + ' COP';
    var esFav = (typeof esFavorito === 'function') && (esFavorito(d.id) || esFavorito(d.nombre));
    var favClase = esFav ? ' activo' : '';
    var favTitulo = esFav ? 'Quitar de favoritos' : 'Guardar en favoritos';

    var card = document.createElement('a');
    card.href = 'detalle.html?destino=' + encodeURIComponent(d.nombre);
    card.className = 'dest-card animable visible';

    card.innerHTML =
      '<div class="dest-card-img">' +
        '<img src="' + d.img + '" alt="' + d.nombre + ', ' + d.pais + '" loading="lazy">' +
        '<button type="button" class="dest-card-fav-btn' + favClase + '" data-id="' + d.id + '" title="' + favTitulo + '" aria-label="Favorito">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">' +
            '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
          '</svg>' +
        '</button>' +
        '<span class="dest-compat-badge">★ ' + d.compatibilidad + '% compat.</span>' +
        '<span class="dest-duracion-badge">⏱️ ' + d.duracion + '</span>' +
      '</div>' +
      '<div class="dest-card-info">' +
        '<span class="dest-tag-mini">' + d.tag + '</span>' +
        '<p class="dest-card-nombre">' + d.nombre + '</p>' +
        '<p class="dest-card-pais">' + d.pais + '</p>' +
        '<p class="dest-card-desc-corta">' + d.descripcion + '</p>' +
        '<div class="dest-card-footer">' +
          '<div class="dest-card-precio">' +
            '<span>Presupuesto desde</span>' +
            '<strong>' + precioCOP + '</strong>' +
          '</div>' +
          '<span class="dest-card-link">Explorar →</span>' +
        '</div>' +
      '</div>';

    var btnFav = card.querySelector('.dest-card-fav-btn');
    if (btnFav) {
      btnFav.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof toggleFavorito === 'function') {
          var agregado = toggleFavorito(d);
          if (agregado) {
            btnFav.classList.add('activo');
            btnFav.title = 'Quitar de favoritos';
            if (typeof mostrarToastGlobal === 'function') {
              mostrarToastGlobal('❤️ ' + d.nombre + ' añadido a tus favoritos', 'exito');
            }
          } else {
            btnFav.classList.remove('activo');
            btnFav.title = 'Guardar en favoritos';
            if (typeof mostrarToastGlobal === 'function') {
              mostrarToastGlobal('Destino eliminado de tus favoritos', 'info');
            }
          }
        }
      });
    }

    grid.appendChild(card);
  });
}

/* --- 5. INICIALIZACIÓN Y EVENTOS --- */
document.addEventListener('DOMContentLoaded', function() {
  var inputBuscar = document.getElementById('inputBuscar');
  var btnLimpiar = document.getElementById('btnLimpiarBusqueda');
  var selectPresupuesto = document.getElementById('selectPresupuesto');
  var selectOrden = document.getElementById('selectOrden');
  var contenedorFiltros = document.getElementById('contenedorFiltros');
  var btnRestablecer = document.getElementById('btnRestablecerFiltros');

  try {
    var params = new URLSearchParams(window.location.search);
    var destinoParam = params.get('destino');
    if (destinoParam && inputBuscar) {
      inputBuscar.value = destinoParam;
      estadoFiltros.texto = destinoParam;
      if (btnLimpiar) btnLimpiar.style.display = 'block';
    }
  } catch (e) {
    console.warn('Parámetros de URL no procesados');
  }

  if (inputBuscar) {
    inputBuscar.addEventListener('input', function() {
      estadoFiltros.texto = this.value;
      if (btnLimpiar) {
        btnLimpiar.style.display = (this.value.trim() !== '') ? 'block' : 'none';
      }
      aplicarFiltros();
    });
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', function() {
      if (inputBuscar) {
        inputBuscar.value = '';
        estadoFiltros.texto = '';
        btnLimpiar.style.display = 'none';
        aplicarFiltros();
        inputBuscar.focus();
      }
    });
  }

  if (contenedorFiltros) {
    var botones = contenedorFiltros.querySelectorAll('.filtro-btn');
    botones.forEach(function(btn) {
      btn.addEventListener('click', function() {
        botones.forEach(function(b) { b.classList.remove('activo'); });
        btn.classList.add('activo');
        estadoFiltros.categoria = btn.dataset.categoria;
        aplicarFiltros();
      });
    });
  }

  if (selectPresupuesto) {
    selectPresupuesto.addEventListener('change', function() {
      estadoFiltros.presupuesto = this.value;
      aplicarFiltros();
    });
  }

  if (selectOrden) {
    selectOrden.addEventListener('change', function() {
      estadoFiltros.orden = this.value;
      aplicarFiltros();
    });
  }

  if (btnRestablecer) {
    btnRestablecer.addEventListener('click', function() {
      estadoFiltros.texto = '';
      estadoFiltros.categoria = 'todos';
      estadoFiltros.presupuesto = 'todos';
      estadoFiltros.orden = 'recomendados';

      if (inputBuscar) inputBuscar.value = '';
      if (btnLimpiar) btnLimpiar.style.display = 'none';
      if (selectPresupuesto) selectPresupuesto.value = 'todos';
      if (selectOrden) selectOrden.value = 'recomendados';

      if (contenedorFiltros) {
        var btns = contenedorFiltros.querySelectorAll('.filtro-btn');
        btns.forEach(function(b) {
          b.classList.toggle('activo', b.dataset.categoria === 'todos');
        });
      }

      aplicarFiltros();
    });
  }

  aplicarFiltros();
});
