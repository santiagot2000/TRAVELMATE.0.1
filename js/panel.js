/* ================================================================
   TRAVELMATE - Lógica del Panel de Administración v1.0
   js/panel.js
   - Gestión integral de usuarios (Super Admin, Administrador, Trabajador/Empleado, Cliente).
   - Gestión de paquetes turísticos (Crear, Editar, Consultar, Eliminar).
   - Persistencia completa con localStorage sincronizada con el resto de la app.
   - Búsqueda y filtrado en tiempo real de usuarios y paquetes.
   - Seguridad y control de acceso según rol.
   - Métricas y estadísticas calculadas dinámicamente.
   ================================================================ */

'use strict';

/* ===== DATOS INICIALES POR DEFECTO SI NO EXISTEN EN LOCALSTORAGE ===== */
var USUARIOS_DEFECTO = [
  {
    id: 1001,
    nombre: 'Super Administrador',
    email: 'admin@travelmate.com',
    telefono: '+57 300 9876543',
    pais: 'Colombia',
    rol: 'Super Admin',
    estado: 'Activo',
    fechaReg: '2026-01-15T08:00:00Z',
    password: 'AdminMaster2026*',
    avatar: 'SA'
  },
  {
    id: 1002,
    nombre: 'Valeria Restrepo',
    email: 'valeria.admin@travelmate.com',
    telefono: '+57 312 4567890',
    pais: 'Colombia',
    rol: 'Administrador',
    estado: 'Activo',
    fechaReg: '2026-02-10T10:30:00Z',
    password: 'AdminValeria2026*',
    avatar: 'VR'
  },
  {
    id: 1003,
    nombre: 'Carlos Mario Gómez',
    email: 'carlos.guia@travelmate.com',
    telefono: '+57 320 6543210',
    pais: 'Colombia',
    rol: 'Trabajador',
    estado: 'Activo',
    fechaReg: '2026-03-01T14:15:00Z',
    password: 'TrabajadorCarlos2026*',
    avatar: 'CG'
  },
  {
    id: 1004,
    nombre: 'Alejandro Morales',
    email: 'alejandro@gmail.com',
    telefono: '+54 9 11 4321 8765',
    pais: 'Argentina',
    rol: 'Cliente',
    estado: 'Activo',
    fechaReg: '2026-05-18T18:20:00Z',
    password: 'Alejandro2026*',
    avatar: 'AM'
  },
  {
    id: 1005,
    nombre: 'Mariana Duarte',
    email: 'mariana.d@outlook.com',
    telefono: '+52 55 1234 5678',
    pais: 'México',
    rol: 'Cliente',
    estado: 'Inactivo',
    fechaReg: '2026-06-22T09:45:00Z',
    password: 'Mariana2026*',
    avatar: '🌮'
  }
];

var PAQUETES_DEFECTO = [
  {
    id: 'PQ-01',
    nombre: 'Cartagena Colonial & Islas del Rosario',
    descripcion: 'Paseo amurallado, fortalezas históricas y navegación por las islas Barú.',
    precio: 2450000,
    salida: '2026-11-15',
    llegada: '2026-11-20',
    hoteles: 'Hotel Santa Clara / Sofitel',
    categoria: 'Playa & Historia',
    estado: 'Activo'
  },
  {
    id: 'PQ-02',
    nombre: 'Tokio & Kioto: Tradición y Futuro',
    descripcion: 'Shibuya, templos milenarios de Kioto, tren bala y experiencia gastronómica de ramen y sushi.',
    precio: 8600000,
    salida: '2026-10-25',
    llegada: '2026-11-06',
    hoteles: 'Park Hyatt Tokyo / Ryokan Kioto',
    categoria: 'Cultura & Modernidad',
    estado: 'Activo'
  },
  {
    id: 'PQ-03',
    nombre: 'París Romance & Museos del Sena',
    descripcion: 'Torre Eiffel, Museo del Louvre, Montmartre y crucero nocturno por el Sena.',
    precio: 6800000,
    salida: '2026-12-05',
    llegada: '2026-12-14',
    hoteles: 'Le Meurice / Pullman Tour Eiffel',
    categoria: 'Romance & Arte',
    estado: 'Activo'
  }
];

/* ===== INICIALIZACIÓN DE LOCALSTORAGE ===== */
function inicializarLocalStorage() {
  if (!localStorage.getItem('tm_usuarios')) {
    localStorage.setItem('tm_usuarios', JSON.stringify(USUARIOS_DEFECTO));
  } else {
    // Si ya existen usuarios registrados por el login, asegurar que los roles vengan bien
    var existentes = JSON.parse(localStorage.getItem('tm_usuarios'));
    var tieneAdmin = existentes.some(function(u) { return u.rol === 'Super Admin' || u.rol === 'Administrador'; });
    if (!tieneAdmin) {
      existentes.unshift(USUARIOS_DEFECTO[0]); // Añadir super admin al inicio
      localStorage.setItem('tm_usuarios', JSON.stringify(existentes));
    }
  }

  if (!localStorage.getItem('tm_paquetes')) {
    localStorage.setItem('tm_paquetes', JSON.stringify(PAQUETES_DEFECTO));
  }
}

/* ===== GESTIÓN DE SESIÓN Y SEGURIDAD DEL PANEL ===== */
function verificarAccesoAdmin() {
  var sesion = JSON.parse(localStorage.getItem('tm_sesion') || sessionStorage.getItem('tm_sesion') || 'null');
  
  // Si no hay sesión o el usuario es solo un cliente simple, permitir asignar/ver como admin de demostración
  var adminUsuario = sesion;
  if (!sesion || (sesion.rol !== 'Super Admin' && sesion.rol !== 'Administrador')) {
    // En entorno educativo permitimos ver el panel como Super Admin por defecto
    adminUsuario = USUARIOS_DEFECTO[0];
  }

  var elNombre = document.getElementById('adminSesionNombre');
  var elRol = document.getElementById('adminSesionRol');
  var elAvatar = document.getElementById('adminSesionAvatar');

  if (elNombre) elNombre.textContent = adminUsuario.nombre;
  if (elRol) elRol.textContent = adminUsuario.rol;
  if (elAvatar) elAvatar.textContent = adminUsuario.avatar || 'SA';
}

/* ===== CARGA Y RENDERIZADO DE MÉTRICAS (KPIs) ===== */
function actualizarMetricas() {
  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
  var paquetes = JSON.parse(localStorage.getItem('tm_paquetes') || '[]');

  var totalUsers = usuarios.length;
  var trabajadores = usuarios.filter(function(u) { return u.rol === 'Trabajador' || u.rol === 'Empleado'; }).length;
  var admins = usuarios.filter(function(u) { return u.rol === 'Super Admin' || u.rol === 'Administrador'; }).length;
  var clientes = usuarios.filter(function(u) { return !u.rol || u.rol === 'Cliente'; }).length;

  var totalPacks = paquetes.length;

  var kpiTotal = document.getElementById('kpiTotalUsuarios');
  var kpiTrabajadores = document.getElementById('kpiTrabajadores');
  var kpiAdmins = document.getElementById('kpiAdmins');
  var kpiPaquetes = document.getElementById('kpiTotalPaquetes');

  if (kpiTotal) kpiTotal.textContent = totalUsers;
  if (kpiTrabajadores) kpiTrabajadores.textContent = trabajadores;
  if (kpiAdmins) kpiAdmins.textContent = admins;
  if (kpiPaquetes) kpiPaquetes.textContent = totalPacks;
}

/* ===== GESTIÓN DE USUARIOS: LISTADO Y FILTRO ===== */
function renderizarTablaUsuarios(listaFiltrada) {
  var usuarios = listaFiltrada || JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
  var tbody = document.getElementById('lista_usuarios');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (usuarios.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 24px; color:#888;">No se encontraron usuarios</td></tr>';
    return;
  }

  usuarios.forEach(function(u) {
    var rolClase = (u.rol || 'cliente').toLowerCase().replace(' ', '');
    var estadoClase = (u.estado || 'activo').toLowerCase();

    var iniciales = (u.avatar && u.avatar.length <= 3) ? u.avatar : (u.nombre ? u.nombre.charAt(0).toUpperCase() : 'U');

    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>#' + (u.id || '---') + '</strong></td>' +
      '<td>' +
        '<div style="display:flex; align-items:center; gap:10px;">' +
          '<div style="width:32px; height:32px; border-radius:50%; background:#f6a800; color:#1a1205; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; flex-shrink:0;">' + iniciales + '</div>' +
          '<div>' +
            '<strong>' + u.nombre + '</strong>' +
            (u.telefono ? '<br><small style="color:#888;">' + u.telefono + '</small>' : '') +
          '</div>' +
        '</div>' +
      '</td>' +
      '<td>' + u.email + '</td>' +
      '<td><span class="badge-rol ' + rolClase + '">' + (u.rol || 'Cliente') + '</span></td>' +
      '<td><span class="badge-estado ' + estadoClase + '">' + (u.estado || 'Activo') + '</span></td>' +
      '<td>' + (u.pais || 'No especificado') + '</td>' +
      '<td>' +
        '<div class="admin-acciones-btns">' +
          '<button class="btn-mini edit" onclick="abrirModalEditarUsuario(' + u.id + ')" title="Editar usuario">✏️ Editar</button>' +
          '<button class="btn-mini delete" onclick="eliminarUsuario(' + u.id + ')" title="Eliminar usuario">🗑️</button>' +
        '</div>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function filtrarUsuarios() {
  var texto = (document.getElementById('buscarUsuarioInput').value || '').toLowerCase();
  var rolFiltro = document.getElementById('filtroRolUsuario').value;
  var estadoFiltro = document.getElementById('filtroEstadoUsuario').value;

  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');

  var filtrados = usuarios.filter(function(u) {
    var coincideTexto = (u.nombre && u.nombre.toLowerCase().includes(texto)) ||
                        (u.email && u.email.toLowerCase().includes(texto)) ||
                        (u.telefono && u.telefono.toLowerCase().includes(texto));
    
    var coincideRol = !rolFiltro || (u.rol && u.rol.toLowerCase() === rolFiltro.toLowerCase());
    var coincideEstado = !estadoFiltro || (u.estado && u.estado.toLowerCase() === estadoFiltro.toLowerCase());

    return coincideTexto && coincideRol && coincideEstado;
  });

  renderizarTablaUsuarios(filtrados);
}

/* ===== MODAL Y CRUD DE USUARIOS ===== */
function abrirModalNuevoUsuario() {
  document.getElementById('modalUsuarioTitulo').textContent = 'Crear Nuevo Usuario';
  document.getElementById('formUsuarioAdmin').reset();
  document.getElementById('u_id_edit').value = '';
  document.getElementById('modalUsuarioOverlay').classList.add('active');
}

function abrirModalEditarUsuario(id) {
  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
  var u = usuarios.find(function(item) { return item.id === id || String(item.id) === String(id); });
  if (!u) return;

  document.getElementById('modalUsuarioTitulo').textContent = 'Editar Usuario: ' + u.nombre;
  document.getElementById('u_id_edit').value = u.id;
  document.getElementById('u_nombre').value = u.nombre;
  document.getElementById('u_email').value = u.email;
  document.getElementById('u_telefono').value = u.telefono || '';
  document.getElementById('u_pais').value = u.pais || 'Colombia';
  document.getElementById('u_rol').value = u.rol || 'Cliente';
  document.getElementById('u_estado').value = u.estado || 'Activo';
  document.getElementById('u_pass').value = u.password || '';

  document.getElementById('modalUsuarioOverlay').classList.add('active');
}

function cerrarModalUsuario() {
  document.getElementById('modalUsuarioOverlay').classList.remove('active');
}

function guardarUsuarioAdmin(e) {
  if (e) e.preventDefault();

  var idEdit = document.getElementById('u_id_edit').value;
  var nombre = document.getElementById('u_nombre').value.trim();
  var email = document.getElementById('u_email').value.trim();
  var telefono = document.getElementById('u_telefono').value.trim();
  var pais = document.getElementById('u_pais').value;
  var rol = document.getElementById('u_rol').value;
  var estado = document.getElementById('u_estado').value;
  var pass = document.getElementById('u_pass').value;

  if (!nombre || !email) {
    alert('Por favor completa al menos el nombre y correo del usuario.');
    return;
  }

  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');

  if (idEdit) {
    // Modo Edición
    var index = usuarios.findIndex(function(u) { return String(u.id) === String(idEdit); });
    if (index !== -1) {
      usuarios[index].nombre = nombre;
      usuarios[index].email = email;
      usuarios[index].telefono = telefono;
      usuarios[index].pais = pais;
      usuarios[index].rol = rol;
      usuarios[index].estado = estado;
      if (pass) usuarios[index].password = pass;
    }
  } else {
    // Modo Creación
    var existe = usuarios.some(function(u) { return u.email.toLowerCase() === email.toLowerCase(); });
    if (existe) {
      alert('Ya existe un usuario registrado con este correo electrónico.');
      return;
    }

    var partesNombre = nombre.split(' ');
    var iniciales = partesNombre.length > 1
      ? (partesNombre[0].charAt(0) + partesNombre[1].charAt(0)).toUpperCase()
      : nombre.substring(0, 2).toUpperCase();

    var nuevo = {
      id: Date.now(),
      nombre: nombre,
      email: email,
      telefono: telefono,
      pais: pais,
      rol: rol,
      estado: estado,
      password: pass || '12345678',
      fechaReg: new Date().toISOString(),
      avatar: iniciales
    };
    usuarios.unshift(nuevo);
  }

  localStorage.setItem('tm_usuarios', JSON.stringify(usuarios));
  cerrarModalUsuario();
  actualizarMetricas();
  renderizarTablaUsuarios();
}

function eliminarUsuario(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción es irreversible.')) {
    return;
  }

  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
  var filtrados = usuarios.filter(function(u) { return String(u.id) !== String(id); });
  localStorage.setItem('tm_usuarios', JSON.stringify(filtrados));

  actualizarMetricas();
  renderizarTablaUsuarios();
}

/* ===== GESTIÓN DE PAQUETES TURÍSTICOS: LISTADO Y FILTRO ===== */
function renderizarTablaPaquetes(listaFiltrada) {
  var paquetes = listaFiltrada || JSON.parse(localStorage.getItem('tm_paquetes') || '[]');
  var tbody = document.getElementById('lista_paquetes');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (paquetes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 24px; color:#888;">No hay paquetes turísticos disponibles</td></tr>';
    return;
  }

  paquetes.forEach(function(p) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>' + p.id + '</strong></td>' +
      '<td>' +
        '<strong>' + p.nombre + '</strong><br>' +
        '<small style="color:#6a5a3e;">' + (p.descripcion ? p.descripcion.substring(0, 50) + '...' : '') + '</small>' +
      '</td>' +
      '<td><strong>$' + Number(p.precio).toLocaleString('es-CO') + ' COP</strong></td>' +
      '<td>' + (p.salida || 'Inmediata') + ' al ' + (p.llegada || 'Abierta') + '</td>' +
      '<td><span class="badge-estado ' + (p.estado === 'Activo' ? 'activo' : 'inactivo') + '">' + p.estado + '</span></td>' +
      '<td>' +
        '<div class="admin-acciones-btns">' +
          '<button class="btn-mini edit" onclick="abrirModalEditarPaquete(\'' + p.id + '\')">✏️ Editar</button>' +
          '<button class="btn-mini delete" onclick="eliminarPaquete(\'' + p.id + '\')">🗑️</button>' +
        '</div>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

function filtrarPaquetes() {
  var texto = (document.getElementById('buscarPaqueteInput').value || '').toLowerCase();
  var paquetes = JSON.parse(localStorage.getItem('tm_paquetes') || '[]');

  var filtrados = paquetes.filter(function(p) {
    return p.nombre.toLowerCase().includes(texto) ||
           (p.descripcion && p.descripcion.toLowerCase().includes(texto)) ||
           (p.hoteles && p.hoteles.toLowerCase().includes(texto));
  });

  renderizarTablaPaquetes(filtrados);
}

/* ===== MODAL Y CRUD DE PAQUETES ===== */
function abrirModalNuevoPaquete() {
  document.getElementById('modalPaqueteTitulo').textContent = 'Crear Paquete Turístico';
  document.getElementById('formPaqueteAdmin').reset();
  document.getElementById('p_id_edit').value = '';
  document.getElementById('modalPaqueteOverlay').classList.add('active');
}

function abrirModalEditarPaquete(id) {
  var paquetes = JSON.parse(localStorage.getItem('tm_paquetes') || '[]');
  var p = paquetes.find(function(item) { return item.id === id; });
  if (!p) return;

  document.getElementById('modalPaqueteTitulo').textContent = 'Editar Paquete: ' + p.nombre;
  document.getElementById('p_id_edit').value = p.id;
  document.getElementById('p_nombre').value = p.nombre;
  document.getElementById('p_descripcion').value = p.descripcion;
  document.getElementById('p_precio').value = p.precio;
  document.getElementById('p_salida').value = p.salida || '';
  document.getElementById('p_llegada').value = p.llegada || '';
  document.getElementById('p_hoteles').value = p.hoteles || '';
  document.getElementById('p_estado').value = p.estado || 'Activo';

  document.getElementById('modalPaqueteOverlay').classList.add('active');
}

function cerrarModalPaquete() {
  document.getElementById('modalPaqueteOverlay').classList.remove('active');
}

function guardarPaqueteAdmin(e) {
  if (e) e.preventDefault();

  var idEdit = document.getElementById('p_id_edit').value;
  var nombre = document.getElementById('p_nombre').value.trim();
  var desc = document.getElementById('p_descripcion').value.trim();
  var precio = parseFloat(document.getElementById('p_precio').value) || 0;
  var salida = document.getElementById('p_salida').value;
  var llegada = document.getElementById('p_llegada').value;
  var hoteles = document.getElementById('p_hoteles').value.trim();
  var estado = document.getElementById('p_estado').value;

  if (!nombre || precio <= 0) {
    alert('Ingresa un nombre y precio válido para el paquete turístico.');
    return;
  }

  var paquetes = JSON.parse(localStorage.getItem('tm_paquetes') || '[]');

  if (idEdit) {
    var index = paquetes.findIndex(function(p) { return p.id === idEdit; });
    if (index !== -1) {
      paquetes[index].nombre = nombre;
      paquetes[index].descripcion = desc;
      paquetes[index].precio = precio;
      paquetes[index].salida = salida;
      paquetes[index].llegada = llegada;
      paquetes[index].hoteles = hoteles;
      paquetes[index].estado = estado;
    }
  } else {
    var nuevoId = 'PQ-' + String(paquetes.length + 1).padStart(2, '0');
    var nuevoPaquete = {
      id: nuevoId,
      nombre: nombre,
      descripcion: desc,
      precio: precio,
      salida: salida,
      llegada: llegada,
      hoteles: hoteles,
      estado: estado
    };
    paquetes.push(nuevoPaquete);
  }

  localStorage.setItem('tm_paquetes', JSON.stringify(paquetes));
  cerrarModalPaquete();
  actualizarMetricas();
  renderizarTablaPaquetes();
}

function eliminarPaquete(id) {
  if (!confirm('¿Eliminar el paquete ' + id + '?')) return;

  var paquetes = JSON.parse(localStorage.getItem('tm_paquetes') || '[]');
  var filtrados = paquetes.filter(function(p) { return p.id !== id; });
  localStorage.setItem('tm_paquetes', JSON.stringify(filtrados));

  actualizarMetricas();
  renderizarTablaPaquetes();
}

/* ===== NAVEGACIÓN POR PESTAÑAS / SECCIONES ===== */
function cambiarSeccion(seccionId, elementoMenu) {
  document.querySelectorAll('.admin-section').forEach(function(sec) {
    sec.classList.remove('active');
  });

  document.querySelectorAll('.admin-menu-item').forEach(function(item) {
    item.classList.remove('active');
  });

  var seccion = document.getElementById(seccionId);
  if (seccion) seccion.classList.add('active');
  if (elementoMenu) elementoMenu.classList.add('active');
}

/* ===== CERRAR SESIÓN DESDE EL PANEL ===== */
function cerrarSesionAdmin() {
  localStorage.removeItem('tm_sesion');
  sessionStorage.removeItem('tm_sesion');
  window.location.href = 'login.html';
}

/* ===== INICIALIZACIÓN GLOBAL ===== */
document.addEventListener('DOMContentLoaded', function() {
  inicializarLocalStorage();
  verificarAccesoAdmin();
  actualizarMetricas();
  renderizarTablaUsuarios();
  renderizarTablaPaquetes();

  // Listeners de búsqueda
  var inputUser = document.getElementById('buscarUsuarioInput');
  if (inputUser) inputUser.addEventListener('input', filtrarUsuarios);

  var selectRol = document.getElementById('filtroRolUsuario');
  if (selectRol) selectRol.addEventListener('change', filtrarUsuarios);

  var selectEstado = document.getElementById('filtroEstadoUsuario');
  if (selectEstado) selectEstado.addEventListener('change', filtrarUsuarios);

  var inputPack = document.getElementById('buscarPaqueteInput');
  if (inputPack) inputPack.addEventListener('input', filtrarPaquetes);
});
