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

  // 4. Gestión Global de Sesión en la Barra de Navegación
  actualizarBarraSesion();

  // 5. Inyección y Manejo del Menú Hamburguesa Móvil
  configurarMenuHamburguesa();
});

function configurarMenuHamburguesa() {
  var contenedorNav = document.querySelector('.contenedor-navegacion');
  var nav = document.querySelector('nav');
  if (!contenedorNav || !nav) return;

  // Inyectar botón si no existe
  if (!document.getElementById('btnMenuHamburguesa')) {
    var btnBurger = document.createElement('button');
    btnBurger.id = 'btnMenuHamburguesa';
    btnBurger.className = 'btn-hamburguesa';
    btnBurger.setAttribute('aria-label', 'Abrir menú');
    btnBurger.innerHTML = '<span></span><span></span><span></span>';

    // Insertar el botón hamburguesa dentro del contenedor de navegación
    contenedorNav.appendChild(btnBurger);

    btnBurger.addEventListener('click', function(e) {
      e.stopPropagation();
      var estaActivo = nav.classList.toggle('menu-movil-activo');
      btnBurger.classList.toggle('activo', estaActivo);
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !btnBurger.contains(e.target)) {
        nav.classList.remove('menu-movil-activo');
        btnBurger.classList.remove('activo');
      }
    });

    // Configurar comportamiento de items con dropdown y links normales
    var items = nav.querySelectorAll('.nav-item');
    items.forEach(function(item) {
      var dropdown = item.querySelector('.dropdown');
      var link = item.querySelector('.nav-link');

      if (dropdown && link) {
        // Tiene submenú: en móvil, al tocar el título se expande/contrae
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 920) {
            e.preventDefault();
            e.stopPropagation();
            var yaAbierto = item.classList.contains('sub-abierto');
            items.forEach(function(it) { it.classList.remove('sub-abierto'); });
            if (!yaAbierto) item.classList.add('sub-abierto');
          }
        });
      }
    });
  }
}

function actualizarBarraSesion() {
  var sesionLS = localStorage.getItem('tm_sesion');
  var sesionSS = sessionStorage.getItem('tm_sesion');
  var sesionStr = sesionLS || sesionSS;

  var btnPrincipal = document.querySelector('.boton-principal');
  if (!btnPrincipal) return;

  if (sesionStr) {
    try {
      var usuario = JSON.parse(sesionStr);
      var primerNombre = (usuario.nombre || 'Usuario').split(' ')[0];
      var inicial = (primerNombre.charAt(0) || 'U').toUpperCase();

      // Ocultar el ítem estático 'Perfil' del menú ya que al iniciar sesión aparece la píldora de cuenta
      var navItems = document.querySelectorAll('nav .nav-item');
      navItems.forEach(function(item) {
        var textoLink = item.querySelector('.nav-link');
        if (textoLink && textoLink.textContent.includes('Perfil')) {
          item.style.display = 'none';
        }
      });

      // Determinar rutas relativas
      var esSubcarpeta = window.location.pathname.includes('/pages/');
      var rutaCuenta = esSubcarpeta ? 'cuenta.html' : 'pages/cuenta.html';
      var rutaAdmin = esSubcarpeta ? 'panelAdmin.html' : 'pages/panelAdmin.html';
      var rutaViajes = esSubcarpeta ? 'viajes.html' : 'pages/viajes.html';
      var rutaFavoritos = esSubcarpeta ? 'favoritos.html' : 'pages/favoritos.html';

      var esSuperAdmin = usuario.rol === 'Super Admin' || usuario.rol === 'Administrador';

      // Si es Super Admin / Admin, el enlace principal de gestión es "Ver Panel de Administración"
      var accionPrincipalHtml = esSuperAdmin
        ? '<a href="' + rutaAdmin + '" style="font-weight:600; color:#b45309; background:#fffcf5;">⚙️ Panel de Administración</a>'
        : '<a href="' + rutaCuenta + '" style="font-weight:500;">Mi Perfil</a>';

      var enlacePerfilSecundario = esSuperAdmin
        ? '<a href="' + rutaCuenta + '">Mi Perfil Personal</a>'
        : '';

      btnPrincipal.outerHTML =
        '<div class="nav-usuario-sesion" id="navUsuarioSesion">' +
          '<div class="usuario-pill" id="btnToggleUsuarioPill" title="Cuenta de ' + usuario.nombre + '">' +
            '<span class="usuario-avatar">' + inicial + '</span>' +
            '<span class="usuario-nombre">' + primerNombre + '</span>' +
            '<span class="flecha"></span>' +
          '</div>' +
          '<div class="dropdown dropdown-usuario" id="dropdownUsuarioMenu">' +
            '<div class="dropdown-header">' +
              '<strong>' + usuario.nombre + '</strong>' +
              '<small>' + (usuario.email || '') + ' (' + (usuario.rol || 'Cliente') + ')</small>' +
            '</div>' +
            accionPrincipalHtml +
            enlacePerfilSecundario +
            '<a href="' + rutaViajes + '">✈️ Mis Viajes</a>' +
            '<a href="' + rutaFavoritos + '">❤️ Mis Favoritos</a>' +
            '<a href="#" onclick="cerrarSesionGlobal(event)" style="color:#dc2626;">Cerrar Sesión</a>' +
          '</div>' +
        '</div>';

      // Permitir también abrir y mantener abierto el menú al hacer clic
      setTimeout(function() {
        var pill = document.getElementById('btnToggleUsuarioPill');
        var cont = document.getElementById('navUsuarioSesion');
        if (pill && cont) {
          pill.addEventListener('click', function(e) {
            e.stopPropagation();
            cont.classList.toggle('abierto');
          });

          document.addEventListener('click', function(e) {
            if (!cont.contains(e.target)) {
              cont.classList.remove('abierto');
            }
          });
        }
      }, 50);

    } catch (e) {
      console.warn('Error leyendo sesión:', e);
    }
  }
}

function cerrarSesionGlobal(e) {
  if (e) e.preventDefault();
  localStorage.removeItem('tm_sesion');
  sessionStorage.removeItem('tm_sesion');
  window.location.reload();
}

/* ================================================================
   SISTEMA GLOBAL DE NOTIFICACIONES TOAST (TravelMate UI)
   ================================================================ */
function mostrarToastGlobal(mensaje, tipo) {
  tipo = tipo || 'exito';
  var cont = document.getElementById('tmContenedorToasts');
  if (!cont) {
    cont = document.createElement('div');
    cont.id = 'tmContenedorToasts';
    cont.className = 'tm-toasts-contenedor';
    document.body.appendChild(cont);
  }

  var toast = document.createElement('div');
  toast.className = 'tm-toast tm-toast-' + tipo;
  toast.innerHTML =
    '<span class="tm-toast-icono">' + (tipo === 'error' ? '⚠️' : (tipo === 'info' ? 'ℹ️' : '✨')) + '</span>' +
    '<span class="tm-toast-texto">' + mensaje + '</span>';

  cont.appendChild(toast);

  setTimeout(function() {
    toast.classList.add('visible');
  }, 10);

  setTimeout(function() {
    toast.classList.remove('visible');
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, 3200);
}

/* ================================================================
   GESTIÓN GLOBAL DE FAVORITOS (localStorage: 'tm_favoritos')
   ================================================================ */
function obtenerFavoritos() {
  try {
    var raw = localStorage.getItem('tm_favoritos');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function esFavorito(identificador) {
  if (!identificador) return false;
  var idNorm = String(identificador).toLowerCase().trim();
  var favs = obtenerFavoritos();
  return favs.some(function(item) {
    var itemId = String(item.id || '').toLowerCase().trim();
    var itemNombre = String(item.nombre || '').toLowerCase().trim();
    return itemId === idNorm || itemNombre === idNorm;
  });
}

function toggleFavorito(destino) {
  if (!destino) return false;
  var favs = obtenerFavoritos();
  var id = destino.id || (destino.nombre ? destino.nombre.toLowerCase().replace(/[^a-z0-9]/g, '') : 'dest');
  var idNorm = String(id).toLowerCase().trim();
  var nombreNorm = String(destino.nombre || '').toLowerCase().trim();

  var indice = favs.findIndex(function(item) {
    var itemId = String(item.id || '').toLowerCase().trim();
    var itemNombre = String(item.nombre || '').toLowerCase().trim();
    return itemId === idNorm || (nombreNorm && itemNombre === nombreNorm);
  });

  var agregado = false;
  if (indice >= 0) {
    favs.splice(indice, 1);
    agregado = false;
  } else {
    favs.push({
      id: id,
      nombre: destino.nombre,
      pais: destino.pais || '',
      img: destino.img || '../assets/img/cartagena.jpg',
      precio: destino.precio || destino.precioTotal || 0,
      tag: destino.tag || '#Destino',
      duracion: destino.duracion || '4 a 6 días',
      compatibilidad: destino.compatibilidad || 92,
      descripcion: destino.descripcion || ''
    });
    agregado = true;
  }

  localStorage.setItem('tm_favoritos', JSON.stringify(favs));
  return agregado;
}

function eliminarFavorito(identificador) {
  var favs = obtenerFavoritos();
  var idNorm = String(identificador).toLowerCase().trim();
  var filtrados = favs.filter(function(item) {
    var itemId = String(item.id || '').toLowerCase().trim();
    var itemNombre = String(item.nombre || '').toLowerCase().trim();
    return itemId !== idNorm && itemNombre !== idNorm;
  });
  localStorage.setItem('tm_favoritos', JSON.stringify(filtrados));
  return filtrados;
}

/* ================================================================
   GESTIÓN GLOBAL DE RESERVAS / MIS VIAJES (localStorage: 'tm_reservas')
   ================================================================ */
function obtenerSesionActual() {
  try {
    var sesionStr = localStorage.getItem('tm_sesion') || sessionStorage.getItem('tm_sesion');
    return sesionStr ? JSON.parse(sesionStr) : null;
  } catch (e) {
    return null;
  }
}

function obtenerTodasLasReservas() {
  try {
    var raw = localStorage.getItem('tm_reservas');
    if (!raw) {
      // Sembrar 2 reservas iniciales de muestra para que la experiencia sea visualmente rica
      var sesion = obtenerSesionActual();
      var emailUsuario = sesion ? sesion.email : 'superadmin@travelmate.com';
      var reservasIniciales = [
        {
          id: 'TM-78241',
          usuarioEmail: emailUsuario,
          destinoId: 'cartagena',
          destinoNombre: 'Cartagena de Indias',
          destinoPais: 'Colombia',
          destinoImg: '../assets/img/cartagena.jpg',
          fechaSalida: '2026-11-20',
          fechaRegreso: '2026-11-25',
          dias: 5,
          viajeros: 2,
          alojamiento: 'Confort Superior',
          precioTotal: 4900000,
          estado: 'Confirmada',
          fechaCreacion: '2026-10-10T14:30:00.000Z',
          titular: {
            nombre: sesion ? sesion.nombre : 'Viajero TravelMate',
            email: emailUsuario,
            telefono: '+57 300 234 5678'
          }
        },
        {
          id: 'TM-41902',
          usuarioEmail: emailUsuario,
          destinoId: 'paris',
          destinoNombre: 'París',
          destinoPais: 'Francia',
          destinoImg: '../assets/img/paris.jpg',
          fechaSalida: '2026-12-15',
          fechaRegreso: '2026-12-23',
          dias: 8,
          viajeros: 1,
          alojamiento: 'Boutique & Spa',
          precioTotal: 6200000,
          estado: 'Confirmada',
          fechaCreacion: '2026-10-05T09:15:00.000Z',
          titular: {
            nombre: sesion ? sesion.nombre : 'Viajero TravelMate',
            email: emailUsuario,
            telefono: '+57 300 234 5678'
          }
        }
      ];
      localStorage.setItem('tm_reservas', JSON.stringify(reservasIniciales));
      return reservasIniciales;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function obtenerReservasUsuario(email) {
  var reservas = obtenerTodasLasReservas();
  if (!email) return reservas;
  var emailNorm = email.toLowerCase().trim();
  return reservas.filter(function(r) {
    return r.usuarioEmail && r.usuarioEmail.toLowerCase().trim() === emailNorm;
  });
}

function crearNuevaReserva(datos) {
  var reservas = obtenerTodasLasReservas();
  var randomId = 'TM-' + Math.floor(10000 + Math.random() * 90000);

  var nueva = {
    id: randomId,
    usuarioEmail: datos.usuarioEmail || 'usuario@travelmate.com',
    destinoId: datos.destinoId || 'destino',
    destinoNombre: datos.destinoNombre || 'Destino Maravilloso',
    destinoPais: datos.destinoPais || '',
    destinoImg: datos.destinoImg || '../assets/img/cartagena.jpg',
    fechaSalida: datos.fechaSalida,
    fechaRegreso: datos.fechaRegreso,
    dias: datos.dias || 5,
    viajeros: datos.viajeros || 1,
    alojamiento: datos.alojamiento || 'Estándar',
    precioTotal: datos.precioTotal || 0,
    estado: 'Confirmada',
    fechaCreacion: new Date().toISOString(),
    titular: datos.titular || {}
  };

  reservas.unshift(nueva);
  localStorage.setItem('tm_reservas', JSON.stringify(reservas));
  return nueva;
}

function cancelarReserva(idReserva) {
  var reservas = obtenerTodasLasReservas();
  var encontrada = false;
  for (var i = 0; i < reservas.length; i++) {
    if (reservas[i].id === idReserva) {
      reservas[i].estado = 'Cancelada';
      encontrada = true;
      break;
    }
  }
  if (encontrada) {
    localStorage.setItem('tm_reservas', JSON.stringify(reservas));
  }
  return encontrada;
}

