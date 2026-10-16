/* ================================================================
   TRAVELMATE - Lógica de Favoritos v1.0
   js/favoritos.js
   - Renderizado dinámico de destinos guardados por el usuario.
   - Eliminación interactiva con animación fluida y toast.
   - Estado vacío con llamado a la acción al catálogo.
   - Persistencia local en localStorage ('tm_favoritos').
   ================================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function() {
  inicializarFavoritos();
});

function inicializarFavoritos() {
  var grid = document.getElementById('gridFavoritos');
  var cajaVacia = document.getElementById('vacioFavoritos');
  var txtContador = document.getElementById('contadorFavoritos');
  var btnVaciar = document.getElementById('btnVaciarFavoritos');

  if (!grid) return;

  // Si es la primera vez que se visita y no hay favoritos guardados,
  // sembrar 3 destinos de demostración para que la página luzca viva y completa
  if (localStorage.getItem('tm_favoritos') === null) {
    var semillero = [
      {
        id: 'cartagena',
        nombre: 'Cartagena de Indias',
        pais: 'Colombia',
        img: '../assets/img/cartagena.jpg',
        precio: 2450000,
        tag: '#Caribe',
        duracion: '3 a 5 días',
        compatibilidad: 95,
        descripcion: 'Calles coloniales llenas de color, atardeceres sobre la muralla y playas cálidas en las Islas del Rosario.'
      },
      {
        id: 'tokio',
        nombre: 'Tokio & Kioto',
        pais: 'Japón · Asia',
        img: '../assets/img/tokio.jpg',
        precio: 8600000,
        tag: '#Futuro & Tradición',
        duracion: '10 a 15 días',
        compatibilidad: 94,
        descripcion: 'Rascacielos futuristas, santuarios milenarios, gastronomía Michelin y jardines zen de ensueño.'
      },
      {
        id: 'paris',
        nombre: 'París',
        pais: 'Francia · Europa',
        img: '../assets/img/paris.jpg',
        precio: 6200000,
        tag: '#Romance',
        duracion: '7 a 10 días',
        compatibilidad: 89,
        descripcion: 'La ciudad luz: paseos por el río Sena, la Torre Eiffel iluminada, museos icónicos y alta cocina francesa.'
      }
    ];
    localStorage.setItem('tm_favoritos', JSON.stringify(semillero));
  }

  renderizarListaFavoritos();

  if (btnVaciar) {
    btnVaciar.addEventListener('click', function() {
      var favs = obtenerFavoritos();
      if (favs.length === 0) {
        if (typeof mostrarToastGlobal === 'function') {
          mostrarToastGlobal('Tu lista ya está vacía', 'info');
        }
        return;
      }

      if (confirm('¿Estás seguro de que deseas eliminar todos los destinos de tus favoritos?')) {
        localStorage.setItem('tm_favoritos', JSON.stringify([]));
        renderizarListaFavoritos();
        if (typeof mostrarToastGlobal === 'function') {
          mostrarToastGlobal('Se han eliminado todos tus favoritos', 'info');
        }
      }
    });
  }
}

function renderizarListaFavoritos() {
  var grid = document.getElementById('gridFavoritos');
  var cajaVacia = document.getElementById('vacioFavoritos');
  var txtContador = document.getElementById('contadorFavoritos');
  var btnVaciar = document.getElementById('btnVaciarFavoritos');

  var favs = typeof obtenerFavoritos === 'function' ? obtenerFavoritos() : [];

  if (txtContador) {
    if (favs.length === 0) {
      txtContador.textContent = '0 destinos guardados';
    } else if (favs.length === 1) {
      txtContador.textContent = '1 destino guardado';
    } else {
      txtContador.textContent = favs.length + ' destinos guardados';
    }
  }

  if (btnVaciar) {
    btnVaciar.style.display = favs.length > 0 ? 'inline-block' : 'none';
  }

  if (favs.length === 0) {
    grid.innerHTML = '';
    if (cajaVacia) cajaVacia.style.display = 'block';
    return;
  }

  if (cajaVacia) cajaVacia.style.display = 'none';
  grid.innerHTML = '';

  favs.forEach(function(d) {
    var precioCOP = '$' + (d.precio || 0).toLocaleString('es-CO') + ' COP';

    var card = document.createElement('div');
    card.className = 'dest-card animable visible';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.position = 'relative';

    card.innerHTML =
      '<div class="dest-card-img">' +
        '<img src="' + d.img + '" alt="' + d.nombre + '" loading="lazy">' +
        '<button type="button" class="dest-card-fav-btn activo" title="Quitar de favoritos" aria-label="Quitar de favoritos">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">' +
            '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
          '</svg>' +
        '</button>' +
        '<span class="dest-compat-badge">★ ' + (d.compatibilidad || 92) + '% compat.</span>' +
        '<span class="dest-duracion-badge">⏱️ ' + (d.duracion || '4 a 6 días') + '</span>' +
      '</div>' +
      '<div class="dest-card-info" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">' +
        '<div>' +
          '<span class="dest-tag-mini">' + (d.tag || '#Destino') + '</span>' +
          '<p class="dest-card-nombre">' + d.nombre + '</p>' +
          '<p class="dest-card-pais">' + (d.pais || '') + '</p>' +
          '<p class="dest-card-desc-corta">' + (d.descripcion || 'Descubre la magia y cultura de este destino imperdible.') + '</p>' +
        '</div>' +
        '<div class="dest-card-footer">' +
          '<div class="dest-card-precio">' +
            '<span>Presupuesto desde</span>' +
            '<strong>' + precioCOP + '</strong>' +
          '</div>' +
          '<a href="detalle.html?destino=' + encodeURIComponent(d.nombre) + '" class="dest-card-link" style="text-decoration:none;">Ver Detalle →</a>' +
        '</div>' +
      '</div>';

    // Manejar clic en el botón de corazón para quitar
    var btnQuitar = card.querySelector('.dest-card-fav-btn');
    if (btnQuitar) {
      btnQuitar.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (typeof eliminarFavorito === 'function') {
          eliminarFavorito(d.id || d.nombre);
        }

        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(function() {
          renderizarListaFavoritos();
          if (typeof mostrarToastGlobal === 'function') {
            mostrarToastGlobal('Destino eliminado de tus favoritos', 'info');
          }
        }, 280);
      });
    }

    grid.appendChild(card);
  });
}
