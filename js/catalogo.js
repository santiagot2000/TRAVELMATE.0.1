/* ================================================================
   TRAVELMATE - Catálogo de Destinos
   js/catalogo.js
   Lógica interactiva de búsqueda, filtrado por categorías,
   rangos de presupuesto en COP y ordenamiento dinámico.
   ================================================================ */

'use strict';

/* --- 1. BASE DE DATOS MOCK DE DESTINOS --- */
var CATALOGO_DESTINOS = [
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
    descripcion: 'Pueblos mágicos urbanos, pirámides ancestrales de Teotihuacán y una cultura gastronómica declarada Patrimonio.'
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
    // 1. Filtro por texto (nombre de ciudad o país o tag)
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
    // 'recomendados': orden base con balance
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

  // Actualizar contador
  if (contador) {
    if (destinos.length === 1) {
      contador.textContent = '1 destino encontrado';
    } else {
      contador.textContent = destinos.length + ' destinos encontrados';
    }
  }

  // Actualizar etiqueta de filtro si hay búsqueda activa
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

  // Manejo de estado vacío
  if (destinos.length === 0) {
    grid.innerHTML = '';
    if (estadoVacio) estadoVacio.style.display = 'block';
    return;
  }

  if (estadoVacio) estadoVacio.style.display = 'none';
  grid.innerHTML = '';

  // Generar tarjetas
  destinos.forEach(function(d) {
    var precioCOP = '$' + d.precio.toLocaleString('es-CO') + ' COP';

    var card = document.createElement('a');
    card.href = 'detalle.html?destino=' + encodeURIComponent(d.nombre);
    card.className = 'dest-card animable visible';

    card.innerHTML =
      '<div class="dest-card-img">' +
        '<img src="' + d.img + '" alt="' + d.nombre + ', ' + d.pais + '" loading="lazy">' +
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

  // 1. Leer parámetros de la URL (si viene del buscador de index.html)
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

  // 2. Evento del input de búsqueda en tiempo real
  if (inputBuscar) {
    inputBuscar.addEventListener('input', function() {
      estadoFiltros.texto = this.value;
      if (btnLimpiar) {
        btnLimpiar.style.display = (this.value.trim() !== '') ? 'block' : 'none';
      }
      aplicarFiltros();
    });
  }

  // 3. Botón para limpiar búsqueda
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

  // 4. Botones de Categorías
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

  // 5. Select de Presupuesto
  if (selectPresupuesto) {
    selectPresupuesto.addEventListener('change', function() {
      estadoFiltros.presupuesto = this.value;
      aplicarFiltros();
    });
  }

  // 6. Select de Ordenamiento
  if (selectOrden) {
    selectOrden.addEventListener('change', function() {
      estadoFiltros.orden = this.value;
      aplicarFiltros();
    });
  }

  // 7. Botón Restablecer Filtros
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

  // Render inicial
  aplicarFiltros();
});
