/* ================================================================
   TRAVELMATE - Lógica del Perfil y Cuenta de Usuario v1.0
   js/cuenta.js
   - Carga y visualización de la sesión activa del usuario.
   - Edición y guardado de datos personales (persistencia en tm_sesion y tm_usuarios).
   - Cambio seguro de contraseña con validación de credenciales.
   - Visualización de métricas en vivo (favoritos guardados y reservas).
   ================================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function() {
  inicializarPerfil();
});

function inicializarPerfil() {
  var sesionLS = localStorage.getItem('tm_sesion');
  var sesionSS = sessionStorage.getItem('tm_sesion');
  var sesionStr = sesionLS || sesionSS;

  var cajaInvitado = document.getElementById('perfilInvitadoCaja');
  var cajaUsuario = document.getElementById('perfilUsuarioCaja');

  if (!sesionStr) {
    if (cajaInvitado) cajaInvitado.style.display = 'block';
    if (cajaUsuario) cajaUsuario.style.display = 'none';
    return;
  }

  var usuario;
  try {
    usuario = JSON.parse(sesionStr);
  } catch (e) {
    console.warn('Error al parsear la sesión:', e);
    if (cajaInvitado) cajaInvitado.style.display = 'block';
    if (cajaUsuario) cajaUsuario.style.display = 'none';
    return;
  }

  if (cajaInvitado) cajaInvitado.style.display = 'none';
  if (cajaUsuario) cajaUsuario.style.display = 'block';

  // 1. Cargar datos en la cabecera de perfil
  var primerNombre = (usuario.nombre || 'Usuario').split(' ')[0];
  var inicial = (primerNombre.charAt(0) || 'U').toUpperCase();

  var avatarEl = document.getElementById('perfilAvatar');
  var nombreEl = document.getElementById('perfilNombreCompleto');
  var emailEl = document.getElementById('perfilEmailTxt');
  var badgeRol = document.getElementById('perfilRolBadge');
  var btnAdmin = document.getElementById('btnAdminPanelLink');
  var btnCerrar = document.getElementById('btnCerrarSesionPerfil');

  if (avatarEl) avatarEl.textContent = inicial;
  if (nombreEl) nombreEl.textContent = usuario.nombre || 'Usuario';
  if (emailEl) emailEl.textContent = usuario.email || 'usuario@travelmate.com';
  if (badgeRol) badgeRol.textContent = usuario.rol || 'Cliente';

  var esAdmin = usuario.rol === 'Super Admin' || usuario.rol === 'Administrador';
  if (btnAdmin) {
    btnAdmin.style.display = esAdmin ? 'inline-flex' : 'none';
  }

  if (btnCerrar) {
    btnCerrar.addEventListener('click', function(e) {
      if (confirm('¿Deseas cerrar tu sesión en TravelMate?')) {
        if (typeof cerrarSesionGlobal === 'function') {
          cerrarSesionGlobal(e);
        } else {
          localStorage.removeItem('tm_sesion');
          sessionStorage.removeItem('tm_sesion');
          window.location.reload();
        }
      }
    });
  }

  // 2. Cargar métricas en vivo
  var statFavs = document.getElementById('statNumFavoritos');
  var statViajes = document.getElementById('statNumViajes');
  var statRol = document.getElementById('statRolNombre');

  var favs = typeof obtenerFavoritos === 'function' ? obtenerFavoritos() : [];
  var viajes = typeof obtenerReservasUsuario === 'function' ? obtenerReservasUsuario(usuario.email) : [];

  if (statFavs) statFavs.textContent = favs.length;
  if (statViajes) statViajes.textContent = viajes.length;
  if (statRol) statRol.textContent = usuario.rol || 'Cliente';

  // 3. Prellenar Formulario de Datos Personales
  var inputNombre = document.getElementById('inputNombrePerfil');
  var inputEmail = document.getElementById('inputEmailPerfil');
  var inputTel = document.getElementById('inputTelefonoPerfil');
  var selectPais = document.getElementById('selectPaisPerfil');
  var inputCiudad = document.getElementById('inputCiudadPerfil');
  var selectEstilo = document.getElementById('selectEstiloPerfil');

  if (inputNombre) inputNombre.value = usuario.nombre || '';
  if (inputEmail) inputEmail.value = usuario.email || '';
  if (inputTel) inputTel.value = usuario.telefono || '';
  if (selectPais && usuario.pais) selectPais.value = usuario.pais;
  if (inputCiudad) inputCiudad.value = usuario.ciudad || 'Medellín';
  if (selectEstilo && usuario.estilo) selectEstilo.value = usuario.estilo;

  // 4. Manejo del Formulario de Datos Personales
  var formDatos = document.getElementById('formDatosPersonales');
  if (formDatos) {
    formDatos.addEventListener('submit', function(e) {
      e.preventDefault();

      var nuevoNombre = inputNombre.value.trim();
      var nuevoTel = inputTel.value.trim();
      var nuevoPais = selectPais.value;
      var nuevaCiudad = inputCiudad.value.trim();
      var nuevoEstilo = selectEstilo.value;

      if (nuevoNombre.length < 3) {
        if (typeof mostrarToastGlobal === 'function') {
          mostrarToastGlobal('⚠️ El nombre debe tener al menos 3 caracteres', 'error');
        }
        return;
      }

      // Actualizar objeto usuario
      usuario.nombre = nuevoNombre;
      usuario.telefono = nuevoTel;
      usuario.pais = nuevoPais;
      usuario.ciudad = nuevaCiudad;
      usuario.estilo = nuevoEstilo;

      // Actualizar sesión activa
      var sesionActualizada = JSON.stringify(usuario);
      if (localStorage.getItem('tm_sesion')) localStorage.setItem('tm_sesion', sesionActualizada);
      if (sessionStorage.getItem('tm_sesion')) sessionStorage.setItem('tm_sesion', sesionActualizada);

      // Actualizar base de datos de usuarios (tm_usuarios)
      try {
        var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
        var indice = usuarios.findIndex(function(u) { return u.email === usuario.email; });
        if (indice >= 0) {
          usuarios[indice].nombre = nuevoNombre;
          usuarios[indice].telefono = nuevoTel;
          usuarios[indice].pais = nuevoPais;
          usuarios[indice].ciudad = nuevaCiudad;
          usuarios[indice].estilo = nuevoEstilo;
          localStorage.setItem('tm_usuarios', JSON.stringify(usuarios));
        }
      } catch (err) {
        console.warn('Error actualizando tm_usuarios:', err);
      }

      // Actualizar elementos visuales en pantalla
      var nuevoPrimerNombre = nuevoNombre.split(' ')[0];
      if (avatarEl) avatarEl.textContent = (nuevoPrimerNombre.charAt(0) || 'U').toUpperCase();
      if (nombreEl) nombreEl.textContent = nuevoNombre;

      if (typeof mostrarToastGlobal === 'function') {
        mostrarToastGlobal('✅ Información personal guardada con éxito', 'exito');
      }
    });
  }

  // 5. Manejo del Formulario de Contraseña
  var formSeguridad = document.getElementById('formSeguridadPerfil');
  if (formSeguridad) {
    formSeguridad.addEventListener('submit', function(e) {
      e.preventDefault();

      var passActual = document.getElementById('inputPassActual').value;
      var passNueva = document.getElementById('inputPassNueva').value;
      var passNuevaConf = document.getElementById('inputPassNuevaConf').value;

      // Obtener clave real del usuario en tm_usuarios
      var passRegistrada = usuario.password;
      try {
        var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
        var uEncontrado = usuarios.find(function(u) { return u.email === usuario.email; });
        if (uEncontrado && uEncontrado.password) {
          passRegistrada = uEncontrado.password;
        }
      } catch (err) {}

      if (passRegistrada && passActual !== passRegistrada) {
        if (typeof mostrarToastGlobal === 'function') {
          mostrarToastGlobal('❌ La contraseña actual no es correcta', 'error');
        }
        return;
      }

      if (passNueva.length < 8) {
        if (typeof mostrarToastGlobal === 'function') {
          mostrarToastGlobal('⚠️ La nueva clave debe tener mínimo 8 caracteres', 'error');
        }
        return;
      }

      if (passNueva !== passNuevaConf) {
        if (typeof mostrarToastGlobal === 'function') {
          mostrarToastGlobal('⚠️ Las nuevas contraseñas no coinciden', 'error');
        }
        return;
      }

      // Actualizar clave
      usuario.password = passNueva;
      var sesionActualizada = JSON.stringify(usuario);
      if (localStorage.getItem('tm_sesion')) localStorage.setItem('tm_sesion', sesionActualizada);
      if (sessionStorage.getItem('tm_sesion')) sessionStorage.setItem('tm_sesion', sesionActualizada);

      try {
        var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
        var idx = usuarios.findIndex(function(u) { return u.email === usuario.email; });
        if (idx >= 0) {
          usuarios[idx].password = passNueva;
          localStorage.setItem('tm_usuarios', JSON.stringify(usuarios));
        }
      } catch (err) {}

      formSeguridad.reset();

      if (typeof mostrarToastGlobal === 'function') {
        mostrarToastGlobal('🔒 Contraseña actualizada correctamente', 'exito');
      }
    });
  }
}
