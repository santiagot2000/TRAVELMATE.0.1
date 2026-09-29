/* ================================================================
   TRAVELMATE - JavaScript Global v1.2
   js/global.js
   - Control de Modo Oscuro (Persistencia con localStorage).
   - Botón Flotante de la derecha "Volver Arriba" (Scroll a Top).
   ================================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function() {

  // 1. Inyectar contenedor flotante inferior derecho si no existe
  if (!document.getElementById('flotantesDerecha')) {
    var contFlotante = document.createElement('div');
    contFlotante.id = 'flotantesDerecha';
    contFlotante.className = 'flotantes-derecha';
    contFlotante.innerHTML =
      '<button id="btnModoOscuro" class="btn-modo-oscuro-flotante" title="Alternar Modo Oscuro / Claro" aria-label="Modo Oscuro">🌙</button>' +
      '<button id="btnVolverArriba" class="btn-volver-arriba" title="Volver al inicio de la página" aria-label="Volver arriba">⬆️</button>';
    document.body.appendChild(contFlotante);
  }

  var btnModo = document.getElementById('btnModoOscuro');
  var btnSubir = document.getElementById('btnVolverArriba');

  // 2. Lógica de Modo Oscuro con LocalStorage
  var temaGuardado = localStorage.getItem('travelmate_tema');

  function aplicarTema(esOscuro) {
    if (esOscuro) {
      document.body.classList.add('modo-oscuro');
      if (btnModo) btnModo.textContent = '☀️';
      localStorage.setItem('travelmate_tema', 'oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
      if (btnModo) btnModo.textContent = '🌙';
      localStorage.setItem('travelmate_tema', 'claro');
    }
  }

  // Cargar preferencia guardada
  if (temaGuardado === 'oscuro') {
    aplicarTema(true);
  } else {
    aplicarTema(false);
  }

  // Alternar al dar clic
  if (btnModo) {
    btnModo.addEventListener('click', function() {
      var estaOscuro = document.body.classList.contains('modo-oscuro');
      aplicarTema(!estaOscuro);
    });
  }

  // 3. Lógica del Botón "Volver Arriba"
  if (btnSubir) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 280) {
        btnSubir.classList.add('visible');
      } else {
        btnSubir.classList.remove('visible');
      }
    });

    btnSubir.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
