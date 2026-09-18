/* ================================================================
   TRAVELMATE - Motor de Afinidades y Cuestionario
   js/cuestionario.js
   Lógica del wizard por pasos y algoritmo de compatibilidad de viajes.
   ================================================================ */

'use strict';

/* --- 1. BASE DE DATOS MOCK DE DESTINOS --- */
var DESTINOS_BASE = [
  {
    id: 'cartagena',
    nombre: 'Cartagena de Indias',
    pais: 'Colombia',
    img: '../assets/img/cartagena.jpg',
    tag: 'Caribe & Historia',
    presupuesto: 'economico', // o moderado
    presupuestoEstimado: 2450000,
    companias: ['pareja', 'amigos', 'familia', 'solo'],
    intereses: ['playa', 'gastronomia', 'cultura', 'romance', 'fiesta', 'fotografia'],
    descripcionCorta: 'La joya colonial amurallada con atardeceres mágicos, islas paradisíacas y gastronomía caribeña.',
    diasRecomendados: '3 a 5 días'
  },
  {
    id: 'machupicchu',
    nombre: 'Machu Picchu & Cusco',
    pais: 'Perú',
    img: '../assets/img/machupicchu.jpg',
    tag: 'Aventura & Historia Mística',
    presupuesto: 'moderado',
    presupuestoEstimado: 3800000,
    companias: ['solo', 'amigos', 'pareja'],
    intereses: ['aventura', 'cultura', 'naturaleza', 'fotografia', 'gastronomia'],
    descripcionCorta: 'Ciudadela inca en las nubes, senderos andinos sagrados y una de las capitales gastronómicas del mundo.',
    diasRecomendados: '5 a 8 días'
  },
  {
    id: 'mexicocity',
    nombre: 'Ciudad de México',
    pais: 'México',
    img: '../assets/img/mexicocity.jpg',
    tag: 'Cultura & Gastronomía',
    presupuesto: 'moderado',
    presupuestoEstimado: 3400000,
    companias: ['amigos', 'pareja', 'familia', 'solo'],
    intereses: ['gastronomia', 'cultura', 'fiesta', 'fotografia'],
    descripcionCorta: 'Metrópolis vibrante llena de museos de clase mundial, gastronomía callejera y alta cocina inigualable.',
    diasRecomendados: '5 a 7 días'
  },
  {
    id: 'buenosaires',
    nombre: 'Buenos Aires',
    pais: 'Argentina',
    img: '../assets/img/buenosaires.jpg',
    tag: 'Arte, Tango & Bohemio',
    presupuesto: 'moderado',
    presupuestoEstimado: 3600000,
    companias: ['pareja', 'amigos', 'solo'],
    intereses: ['cultura', 'gastronomia', 'romance', 'fiesta', 'fotografia'],
    descripcionCorta: 'Arquitectura europea, pasión por el tango, cafés históricos y la mejor carne y vino del cono sur.',
    diasRecomendados: '5 a 8 días'
  },
  {
    id: 'paris',
    nombre: 'París',
    pais: 'Francia',
    img: '../assets/img/paris.jpg',
    tag: 'Romance & Vanguardia',
    presupuesto: 'premium',
    presupuestoEstimado: 6200000,
    companias: ['pareja', 'solo', 'familia'],
    intereses: ['romance', 'cultura', 'gastronomia', 'fotografia'],
    descripcionCorta: 'La capital de la luz, el arte y la alta costura con el Sena, la Torre Eiffel y sus encantadores bistrós.',
    diasRecomendados: '7 a 10 días'
  },
  {
    id: 'barcelona',
    nombre: 'Barcelona',
    pais: 'España',
    img: '../assets/img/barcelona.jpg',
    tag: 'Mediterráneo & Modernismo',
    presupuesto: 'premium',
    presupuestoEstimado: 5600000,
    companias: ['amigos', 'pareja', 'solo'],
    intereses: ['playa', 'cultura', 'gastronomia', 'fiesta', 'fotografia'],
    descripcionCorta: 'Obras maestras de Gaudí, playas activas sobre el Mediterráneo y una noche llena de tapas y diversión.',
    diasRecomendados: '6 a 9 días'
  },
  {
    id: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
    img: '../assets/img/roma.jpg',
    tag: 'Historia Viva & Dolce Vita',
    presupuesto: 'premium',
    presupuestoEstimado: 5800000,
    companias: ['pareja', 'familia', 'solo', 'amigos'],
    intereses: ['cultura', 'gastronomia', 'fotografia', 'romance'],
    descripcionCorta: 'Un museo al aire libre con el Coliseo, la Fontana di Trevi y la auténtica cocina italiana.',
    diasRecomendados: '6 a 8 días'
  }
];

/* --- 2. CONTROL DEL WIZARD (PASO A PASO) --- */
var pasoActual = 1;
var totalPasos = 4;

var titulosPasos = [
  'Paso 1 de 4: Origen y Duración',
  'Paso 2 de 4: Compañía de Viaje',
  'Paso 3 de 4: Presupuesto Estimado',
  'Paso 4 de 4: Experiencias Deseadas'
];

function actualizarWizard() {
  // Ocultar todos los pasos y mostrar el activo
  var pasos = document.querySelectorAll('.paso-wizard');
  pasos.forEach(function(paso) {
    var num = parseInt(paso.dataset.paso, 10);
    paso.classList.toggle('activo', num === pasoActual);
  });

  // Actualizar barra de progreso y texto
  var porcentaje = (pasoActual / totalPasos) * 100;
  var barra = document.getElementById('barraProgreso');
  var texto = document.getElementById('textoProgreso');
  if (barra) barra.style.width = porcentaje + '%';
  if (texto) texto.textContent = titulosPasos[pasoActual - 1];

  // Controlar botones Anterior / Siguiente / Finalizar
  var btnPrev = document.getElementById('btnPasoAnterior');
  var btnNext = document.getElementById('btnPasoSiguiente');
  var btnFin = document.getElementById('btnFinalizar');

  if (btnPrev) btnPrev.style.display = (pasoActual > 1) ? 'inline-flex' : 'none';
  if (btnNext) btnNext.style.display = (pasoActual < totalPasos) ? 'inline-flex' : 'none';
  if (btnFin)  btnFin.style.display  = (pasoActual === totalPasos) ? 'inline-flex' : 'none';

  // Desplazar la vista suavemente hacia arriba del cuestionario
  var wrapper = document.querySelector('.cuestionario-wrapper');
  if (wrapper) {
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* --- 3. SELECCIÓN VISUAL DE TARJETAS Y CHIPS --- */
function configurarSeleccionVisual() {
  // Manejo de tarjetas tipo radio (duración, compañía, presupuesto)
  var tarjetas = document.querySelectorAll('.opcion-tarjeta');
  tarjetas.forEach(function(tarjeta) {
    var input = tarjeta.querySelector('input[type="radio"]');
    if (!input) return;

    tarjeta.addEventListener('click', function() {
      var grupo = input.name;
      document.querySelectorAll('input[name="' + grupo + '"]').forEach(function(r) {
        var p = r.closest('.opcion-tarjeta');
        if (p) p.classList.remove('seleccionada');
      });
      input.checked = true;
      tarjeta.classList.add('seleccionada');
    });
  });

  // Manejo de chips de intereses múltiples (checkbox)
  var chips = document.querySelectorAll('.chip-interes');
  chips.forEach(function(chip) {
    var check = chip.querySelector('input[type="checkbox"]');
    if (!check) return;

    chip.addEventListener('click', function(e) {
      // Dejar que el evento natural del label actualice el checked
      setTimeout(function() {
        chip.classList.toggle('activo', check.checked);
      }, 10);
    });
  });
}

/* --- 4. ALGORITMO DE MATCHING Y COMPATIBILIDAD --- */
function calcularCompatibilidad(respuestas) {
  var resultados = [];

  DESTINOS_BASE.forEach(function(dest) {
    var puntos = 60; // Puntuación base de entrada

    // 1. Coincidencia de presupuesto (hasta +15 puntos)
    if (dest.presupuesto === respuestas.presupuesto) {
      puntos += 15;
    } else if (
      (respuestas.presupuesto === 'moderado' && (dest.presupuesto === 'economico' || dest.presupuesto === 'premium')) ||
      (respuestas.presupuesto === 'premium') // Quien tiene premium puede pagar cualquier viaje
    ) {
      puntos += 8;
    }

    // 2. Coincidencia de compañía (hasta +10 puntos)
    if (dest.companias.indexOf(respuestas.compania) !== -1) {
      puntos += 10;
    } else {
      puntos += 4;
    }

    // 3. Coincidencia de intereses (hasta +15 puntos)
    var coincidencias = 0;
    respuestas.intereses.forEach(function(interes) {
      if (dest.intereses.indexOf(interes) !== -1) {
        coincidencias++;
      }
    });

    if (respuestas.intereses.length > 0) {
      var ratioIntereses = coincidencias / respuestas.intereses.length;
      puntos += Math.round(ratioIntereses * 15);
    } else {
      puntos += 8;
    }

    // Variación aleatoria controlada para naturalidad (+/- 2 puntos)
    puntos += Math.floor(Math.random() * 5) - 2;

    // Asegurar que el porcentaje quede entre 72% y 98%
    var compatFinal = Math.min(98, Math.max(72, puntos));

    resultados.push({
      destino: dest,
      compatibilidad: compatFinal,
      interesesCoincidentes: coincidencias
    });
  });

  // Ordenar de mayor a menor compatibilidad
  resultados.sort(function(a, b) {
    return b.compatibilidad - a.compatibilidad;
  });

  // Devolver los 3 mejores destinos
  return resultados.slice(0, 3);
}

/* --- 5. RENDERIZADO DE RESULTADOS --- */
function mostrarResultados(mejoresMatches, respuestas) {
  var grid = document.getElementById('gridResultados');
  if (!grid) return;

  grid.innerHTML = '';

  mejoresMatches.forEach(function(item, idx) {
    var d = item.destino;
    var precioCOP = '$' + d.presupuestoEstimado.toLocaleString('es-CO') + ' COP';

    var medalla = (idx === 0) ? '🥇 Tu Mejor Coincidencia' : (idx === 1 ? '🥈 Excelente Opción' : '🥉 Gran Alternativa');

    var card = document.createElement('div');
    card.className = 'resultado-card animable visible';

    card.innerHTML =
      '<div class="resultado-img-cont">' +
        '<img src="' + d.img + '" alt="' + d.nombre + '" loading="lazy">' +
        '<span class="resultado-medalla">' + medalla + '</span>' +
        '<div class="resultado-porcentaje">★ ' + item.compatibilidad + '% Compatible</div>' +
      '</div>' +
      '<div class="resultado-body">' +
        '<span class="resultado-tag">' + d.tag + '</span>' +
        '<h4 class="resultado-nombre">' + d.nombre + ' <small>(' + d.pais + ')</small></h4>' +
        '<p class="resultado-desc">' + d.descripcionCorta + '</p>' +
        '<div class="resultado-detalles">' +
          '<div class="resultado-item">' +
            '<span>Presupuesto est.</span>' +
            '<strong>' + precioCOP + '</strong>' +
          '</div>' +
          '<div class="resultado-item">' +
            '<span>Duración ideal</span>' +
            '<strong>' + d.diasRecomendados + '</strong>' +
          '</div>' +
        '</div>' +
        '<div class="resultado-acciones">' +
          '<a href="detalle.html?destino=' + encodeURIComponent(d.nombre) + '" class="boton-cta" style="width: 100%; text-align: center;">' +
            'Ver viaje y actividades →' +
          '</a>' +
        '</div>' +
      '</div>';

    grid.appendChild(card);
  });

  // Guardar en localStorage para que otras páginas puedan usarlo
  try {
    localStorage.setItem('travelmate_ultimo_match', JSON.stringify({
      respuestas: respuestas,
      recomendaciones: mejoresMatches
    }));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage');
  }
}

/* --- 6. INICIALIZACIÓN DE EVENTOS --- */
document.addEventListener('DOMContentLoaded', function() {
  configurarSeleccionVisual();

  var btnPrev = document.getElementById('btnPasoAnterior');
  var btnNext = document.getElementById('btnPasoSiguiente');
  var form = document.getElementById('formCuestionario');
  var pantallaCargando = document.getElementById('pantallaCargando');
  var seccionResultados = document.getElementById('seccionResultados');
  var btnReiniciar = document.getElementById('btnReiniciarCuestionario');

  // Botón Siguiente
  if (btnNext) {
    btnNext.addEventListener('click', function() {
      if (pasoActual < totalPasos) {
        pasoActual++;
        actualizarWizard();
      }
    });
  }

  // Botón Anterior
  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      if (pasoActual > 1) {
        pasoActual--;
        actualizarWizard();
      }
    });
  }

  // Envío del Cuestionario
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Recopilar respuestas
      var origen = document.getElementById('cuestOrigen').value;
      var duracion = (form.querySelector('input[name="duracion"]:checked') || {}).value || 'escapada';
      var compania = (form.querySelector('input[name="compania"]:checked') || {}).value || 'solo';
      var presupuesto = (form.querySelector('input[name="presupuesto"]:checked') || {}).value || 'moderado';

      var intereses = [];
      form.querySelectorAll('input[name="intereses"]:checked').forEach(function(chk) {
        intereses.push(chk.value);
      });

      var respuestas = {
        origen: origen,
        duracion: duracion,
        compania: compania,
        presupuesto: presupuesto,
        intereses: intereses
      };

      // Ocultar formulario y mostrar pantalla de carga con animación
      form.style.display = 'none';
      if (pantallaCargando) pantallaCargando.style.display = 'flex';

      var frases = [
        'Analizando tu perfil viajero...',
        'Comparando intereses y presupuestos en pesos...',
        '¡Encontramos tus destinos ideales!'
      ];
      var idxFrase = 0;
      var cargandoTexto = document.getElementById('cargandoTexto');

      var intervaloTexto = setInterval(function() {
        idxFrase++;
        if (cargandoTexto && idxFrase < frases.length) {
          cargandoTexto.textContent = frases[idxFrase];
        }
      }, 500);

      // Finalizar animación a los 1.5 segundos y mostrar resultados
      setTimeout(function() {
        clearInterval(intervaloTexto);
        if (pantallaCargando) pantallaCargando.style.display = 'none';

        var matches = calcularCompatibilidad(respuestas);
        mostrarResultados(matches, respuestas);

        if (seccionResultados) {
          seccionResultados.style.display = 'block';
          seccionResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1600);
    });
  }

  // Botón Reiniciar Cuestionario
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', function() {
      if (seccionResultados) seccionResultados.style.display = 'none';
      if (form) form.style.display = 'block';
      pasoActual = 1;
      actualizarWizard();
    });
  }
});
