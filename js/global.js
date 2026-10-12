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

    // Insertarlo en el encabezado
    contenedorNav.appendChild(btnBurger);

    btnBurger.addEventListener('click', function(e) {
      e.stopPropagation();
      var estaActivo = nav.classList.toggle('menu-movil-activo');
      btnBurger.classList.toggle('activo', estaActivo);
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !btnBurger.contains(e.target)) {
        nav.classList.remove('menu-movil-activo');
        btnBurger.classList.remove('activo');
      }
    });

    // Permitir abrir submenús en móvil al tocar un nav-item
    var items = nav.querySelectorAll('.nav-item');
    items.forEach(function(item) {
      var link = item.querySelector('.nav-link');
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 920) {
            e.preventDefault();
            // Alternar submenú
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
            '<a href="#" onclick="cerrarSesionGlobal(event)">Cerrar Sesión</a>' +
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

