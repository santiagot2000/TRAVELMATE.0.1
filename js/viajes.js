/* ================================================================
   TRAVELMATE - Lógica de Mis Viajes y Reservas v1.0
   js/viajes.js
   - Carga y filtrado de reservas por estado (Todas, Confirmadas, Canceladas).
   - Renderizado con imágenes, códigos únicos, pasajeros y precios COP.
   - Cancelación interactiva de reservas con actualización en tiempo real.
   - Persistencia local en localStorage ('tm_reservas').
   ================================================================ */

'use strict';

var filtroEstadoActual = 'todos';

document.addEventListener('DOMContentLoaded', function() {
  inicializarViajes();
});

function inicializarViajes() {
  var sesionLS = localStorage.getItem('tm_sesion');
  var sesionSS = sessionStorage.getItem('tm_sesion');
  var sesionStr = sesionLS || sesionSS;

  var cajaInvitado = document.getElementById('viajesInvitadoCaja');
  var cajaUsuario = document.getElementById('viajesUsuarioCaja');

  if (!sesionStr) {
    if (cajaInvitado) cajaInvitado.style.display = 'block';
    if (cajaUsuario) cajaUsuario.style.display = 'none';
    return;
  }

  var usuario;
  try {
    usuario = JSON.parse(sesionStr);
  } catch (e) {
    console.warn('Error parseando sesión para viajes:', e);
    if (cajaInvitado) cajaInvitado.style.display = 'block';
    if (cajaUsuario) cajaUsuario.style.display = 'none';
    return;
  }

  if (cajaInvitado) cajaInvitado.style.display = 'none';
  if (cajaUsuario) cajaUsuario.style.display = 'block';

  // Configurar botones de filtro
  var contenedorFiltros = document.getElementById('contenedorFiltrosViajes');
  if (contenedorFiltros) {
    var btns = contenedorFiltros.querySelectorAll('.filtro-viaje-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        btns.forEach(function(b) { b.classList.remove('activo'); });
        btn.classList.add('activo');
        filtroEstadoActual = btn.getAttribute('data-filtro');
        renderizarListaViajes(usuario.email);
      });
    });
  }

  renderizarListaViajes(usuario.email);
}

function formatearFechaBonita(fechaStr) {
  if (!fechaStr) return 'Fecha a coordinar';
  try {
    var partes = fechaStr.split('-');
    if (partes.length === 3) {
      return partes[2] + '/' + partes[1] + '/' + partes[0];
    }
    return fechaStr;
  } catch (e) {
    return fechaStr;
  }
}

function renderizarListaViajes(emailUsuario) {
  var grid = document.getElementById('gridViajes');
  var cajaVacia = document.getElementById('vacioViajes');

  if (!grid) return;

  var todas = typeof obtenerReservasUsuario === 'function' ? obtenerReservasUsuario(emailUsuario) : [];

  var filtradas = todas.filter(function(r) {
    if (filtroEstadoActual === 'todos') return true;
    return r.estado && r.estado.toLowerCase() === filtroEstadoActual.toLowerCase();
  });

  if (filtradas.length === 0) {
    grid.innerHTML = '';
    if (cajaVacia) cajaVacia.style.display = 'block';
    return;
  }

  if (cajaVacia) cajaVacia.style.display = 'none';
  grid.innerHTML = '';

  filtradas.forEach(function(r) {
    var precioCOP = '$' + (r.precioTotal || 0).toLocaleString('es-CO') + ' COP';
    var esConfirmada = r.estado === 'Confirmada';
    var badgeClase = esConfirmada ? 'badge-confirmada' : (r.estado === 'Cancelada' ? 'badge-cancelada' : 'badge-completada');

    var fechaIda = formatearFechaBonita(r.fechaSalida);
    var fechaVuelta = formatearFechaBonita(r.fechaRegreso);

    var card = document.createElement('div');
    card.className = 'viaje-item-card animable visible';

    card.innerHTML =
      '<div class="viaje-card-foto">' +
        '<img src="' + (r.destinoImg || '../assets/img/cartagena.jpg') + '" alt="' + r.destinoNombre + '" loading="lazy">' +
      '</div>' +
      '<div class="viaje-card-info">' +
        '<div>' +
          '<div class="viaje-header-linea">' +
            '<div>' +
              '<span class="viaje-codigo">Código: ' + (r.id || 'TM-00000') + '</span>' +
              '<h3 class="viaje-nombre-dest">' + (r.destinoNombre || 'Destino') + '</h3>' +
              '<small style="color:#8c7b6e;">' + (r.destinoPais || '') + '</small>' +
            '</div>' +
            '<span class="viaje-badge-estado ' + badgeClase + '">' + (r.estado || 'Confirmada') + '</span>' +
          '</div>' +

          '<div class="viaje-detalles-grid">' +
            '<div class="v-detalle-item">' +
              '<span>Fechas de Viaje</span>' +
              '<strong>' + fechaIda + ' - ' + fechaVuelta + '</strong>' +
            '</div>' +
            '<div class="v-detalle-item">' +
              '<span>Duración</span>' +
              '<strong>' + (r.dias || 5) + ' días</strong>' +
            '</div>' +
            '<div class="v-detalle-item">' +
              '<span>Pasajeros</span>' +
              '<strong>' + (r.viajeros || 1) + (r.viajeros === 1 ? ' Viajero' : ' Viajeros') + '</strong>' +
            '</div>' +
            '<div class="v-detalle-item">' +
              '<span>Categoría</span>' +
              '<strong>' + (r.alojamiento || 'Confort') + '</strong>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="viaje-footer-acciones">' +
          '<div class="viaje-precio-total">' +
            '<span>Inversión Total Estimada</span>' +
            '<strong>' + precioCOP + '</strong>' +
          '</div>' +
          '<div class="viaje-btns-grupo">' +
            '<a href="detalle.html?destino=' + encodeURIComponent(r.destinoNombre) + '" class="btn-viaje-detalle">Ver Destino →</a>' +
            (esConfirmada
              ? '<button type="button" class="btn-viaje-cancelar btn-cancelar-accion" data-id="' + r.id + '">Cancelar Reserva</button>'
              : '<span style="font-size: 13px; color: #8c7b6e; align-self: center;">Reserva inactiva</span>') +
          '</div>' +
        '</div>' +
      '</div>';

    // Evento de cancelación
    var btnCancelar = card.querySelector('.btn-cancelar-accion');
    if (btnCancelar) {
      btnCancelar.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cancelar la reserva ' + r.id + ' para ' + r.destinoNombre + '?\n\nNo se aplicarán penalizaciones según las políticas de TravelMate.')) {
          if (typeof cancelarReserva === 'function') {
            cancelarReserva(r.id);
          }
          if (typeof mostrarToastGlobal === 'function') {
            mostrarToastGlobal('Reserva ' + r.id + ' cancelada', 'info');
          }
          renderizarListaViajes(emailUsuario);
        }
      });
    }

    grid.appendChild(card);
  });
}
