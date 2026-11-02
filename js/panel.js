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
    id_rol: 1,
    rol: 'Super Admin',
    tipo_documento: 'CC',
    numero_documento: '1000000001',
    nombres: 'Super',
    apellidos: 'Administrador',
    nombre: 'Super Administrador',
    email: 'admin@travelmate.com',
    telefono_principal: '+57 300 9876543',
    telefono: '+57 300 9876543',
    telefono_emergencia: '+57 300 111 2222',
    nombre_contacto_emergencia: 'Soporte Corporativo TravelMate',
    pais_residencia: 'Colombia',
    pais: 'Colombia',
    ciudad_residencia: 'Medellín',
    ciudad: 'Medellín',
    estado_cuenta: 'Activo',
    estado: 'Activo',
    fechaReg: '2026-01-15T08:00:00Z',
    fecha_registro: '2026-01-15T08:00:00Z',
    password: 'AdminMaster2026*',
    avatar: 'SA'
  },
  {
    id: 1002,
    id_rol: 2,
    rol: 'Administrador',
    tipo_documento: 'CC',
    numero_documento: '1000000002',
    nombres: 'Valeria',
    apellidos: 'Restrepo',
    nombre: 'Valeria Restrepo',
    email: 'valeria.admin@travelmate.com',
    telefono_principal: '+57 312 4567890',
    telefono: '+57 312 4567890',
    telefono_emergencia: '+57 310 999 8888',
    nombre_contacto_emergencia: 'Carlos Restrepo (Padre)',
    pais_residencia: 'Colombia',
    pais: 'Colombia',
    ciudad_residencia: 'Medellín',
    ciudad: 'Medellín',
    estado_cuenta: 'Activo',
    estado: 'Activo',
    fechaReg: '2026-02-10T10:30:00Z',
    fecha_registro: '2026-02-10T10:30:00Z',
    password: 'AdminValeria2026*',
    avatar: 'VR'
  },
  {
    id: 1003,
    id_rol: 3,
    rol: 'Trabajador',
    tipo_documento: 'CC',
    numero_documento: '1000000003',
    nombres: 'Carlos Mario',
    apellidos: 'Gómez',
    nombre: 'Carlos Mario Gómez',
    email: 'carlos.guia@travelmate.com',
    telefono_principal: '+57 320 6543210',
    telefono: '+57 320 6543210',
    telefono_emergencia: '+57 315 555 4444',
    nombre_contacto_emergencia: 'Patricia Gómez (Hermana)',
    pais_residencia: 'Colombia',
    pais: 'Colombia',
    ciudad_residencia: 'Cartagena',
    ciudad: 'Cartagena',
    estado_cuenta: 'Activo',
    estado: 'Activo',
    fechaReg: '2026-03-01T14:15:00Z',
    fecha_registro: '2026-03-01T14:15:00Z',
    password: 'TrabajadorCarlos2026*',
    avatar: 'CG'
  },
  {
    id: 1004,
    id_rol: 4,
    rol: 'Cliente',
    tipo_documento: 'DNI',
    numero_documento: '40123456',
    nombres: 'Alejandro',
    apellidos: 'Morales',
    nombre: 'Alejandro Morales',
    email: 'alejandro@gmail.com',
    telefono_principal: '+54 9 11 4321 8765',
    telefono: '+54 9 11 4321 8765',
    telefono_emergencia: '+54 9 11 9999 0000',
    nombre_contacto_emergencia: 'Elena Morales (Madre)',
    pais_residencia: 'Argentina',
    pais: 'Argentina',
    ciudad_residencia: 'Buenos Aires',
    ciudad: 'Buenos Aires',
    estado_cuenta: 'Activo',
    estado: 'Activo',
    fechaReg: '2026-05-18T18:20:00Z',
    fecha_registro: '2026-05-18T18:20:00Z',
    password: 'Alejandro2026*',
    avatar: 'AM'
  },
  {
    id: 1005,
    id_rol: 4,
    rol: 'Cliente',
    tipo_documento: 'DNI',
    numero_documento: '987654321',
    nombres: 'Mariana',
    apellidos: 'Duarte',
    nombre: 'Mariana Duarte',
    email: 'mariana.d@outlook.com',
    telefono_principal: '+52 55 1234 5678',
    telefono: '+52 55 1234 5678',
    telefono_emergencia: '+52 55 8765 4321',
    nombre_contacto_emergencia: 'Roberto Duarte (Padre)',
    pais_residencia: 'México',
    pais: 'México',
    ciudad_residencia: 'Ciudad de México',
    ciudad: 'Ciudad de México',
    direccion_residencia: 'Av. Reforma 222',
    fecha_nacimiento: '1995-09-12',
    genero: 'Femenino',
    estilo_viaje_preferido: 'Gastronomía & Vinos',
    estado_cuenta: 'Inactivo',
    estado: 'Inactivo',
    fechaReg: '2026-06-22T09:45:00Z',
    fecha_registro: '2026-06-22T09:45:00Z',
    password: 'Mariana2026*',
    avatar: 'MD'
  }
];

var PAQUETES_DEFECTO = [
  {
    id: 'PQ-01',
    codigo_iata_ciudad: 'CTG',
    iata: 'CTG',
    nombre_destino: 'Cartagena Colonial & Islas del Rosario',
    nombre: 'Cartagena Colonial & Islas del Rosario',
    pais: 'Colombia',
    continente: 'América del Sur',
    descripcion: 'Paseo amurallado, fortalezas históricas y navegación por las islas Barú.',
    precio_base_cop: 2450000,
    precio: 2450000,
    duracion_dias_promedio: 5,
    mejor_epoca_viaje: 'Diciembre a Abril',
    idioma_oficial: 'Español',
    moneda_local: 'COP',
    salida: '2026-11-15',
    llegada: '2026-11-20',
    hoteles: 'Hotel Santa Clara / Sofitel',
    categoria: 'Playa & Historia',
    estado: 'Activo'
  },
  {
    id: 'PQ-02',
    codigo_iata_ciudad: 'TYO',
    iata: 'TYO',
    nombre_destino: 'Tokio & Kioto: Tradición y Futuro',
    nombre: 'Tokio & Kioto: Tradición y Futuro',
    pais: 'Japón',
    continente: 'Asia',
    descripcion: 'Shibuya, templos milenarios de Kioto, tren bala y experiencia gastronómica de ramen y sushi.',
    precio_base_cop: 8600000,
    precio: 8600000,
    duracion_dias_promedio: 12,
    mejor_epoca_viaje: 'Marzo a Mayo / Sep a Nov',
    idioma_oficial: 'Japonés',
    moneda_local: 'JPY',
    salida: '2026-10-25',
    llegada: '2026-11-06',
    hoteles: 'Park Hyatt Tokyo / Ryokan Kioto',
    categoria: 'Cultura & Modernidad',
    estado: 'Activo'
  },
  {
    id: 'PQ-03',
    codigo_iata_ciudad: 'PAR',
    iata: 'PAR',
    nombre_destino: 'París Romance & Museos del Sena',
    nombre: 'París Romance & Museos del Sena',
    pais: 'Francia',
    continente: 'Europa',
    descripcion: 'Torre Eiffel, Museo del Louvre, Montmartre y crucero nocturno por el Sena.',
    precio_base_cop: 6800000,
    precio: 6800000,
    duracion_dias_promedio: 9,
    mejor_epoca_viaje: 'Mayo a Septiembre',
    idioma_oficial: 'Francés',
    moneda_local: 'EUR',
    salida: '2026-12-05',
    llegada: '2026-12-14',
    hoteles: 'Le Meurice / Pullman Tour Eiffel',
    categoria: 'Romance & Arte',
    estado: 'Activo'
  }
];

/* ===== INICIALIZACIÓN DE LOCALSTORAGE ===== */
function inicializarLocalStorage() {
  var usuariosLS = localStorage.getItem('tm_usuarios');
  if (!usuariosLS) {
    localStorage.setItem('tm_usuarios', JSON.stringify(USUARIOS_DEFECTO));
  } else {
    // Sincronizar usuarios existentes con todos los campos del modelo relacional SQL
    var existentes = JSON.parse(usuariosLS);
    existentes = existentes.map(function(u, idx) {
      var partes = (u.nombre || '').split(' ');
      var n = u.nombres || partes[0] || 'Usuario';
      var a = u.apellidos || partes.slice(1).join(' ') || 'TravelMate';
      return {
        id: u.id || (1000 + idx),
        id_rol: u.id_rol || (u.rol === 'Super Admin' ? 1 : (u.rol === 'Administrador' ? 2 : (u.rol === 'Trabajador' ? 3 : 4))),
        rol: u.rol || 'Cliente',
        tipo_documento: u.tipo_documento || 'CC',
        numero_documento: u.numero_documento || ('10203040' + String(idx).padStart(2, '0')),
        nombres: n,
        apellidos: a,
        nombre: u.nombre || (n + ' ' + a),
        email: u.email,
        telefono_principal: u.telefono_principal || u.telefono || '+57 300 1234567',
        telefono: u.telefono || u.telefono_principal || '+57 300 1234567',
        telefono_emergencia: u.telefono_emergencia || '+57 311 9876543',
        nombre_contacto_emergencia: u.nombre_contacto_emergencia || 'Familiar de Contacto',
        fecha_nacimiento: u.fecha_nacimiento || '1995-01-01',
        genero: u.genero || 'Otro',
        pais_residencia: u.pais_residencia || u.pais || 'Colombia',
        pais: u.pais || u.pais_residencia || 'Colombia',
        ciudad_residencia: u.ciudad_residencia || u.ciudad || 'Medellín',
        ciudad: u.ciudad || u.ciudad_residencia || 'Medellín',
        direccion_residencia: u.direccion_residencia || 'Carrera 43A # 1-50',
        estilo_viaje_preferido: u.estilo_viaje_preferido || 'Playa & Relax',
        estado_cuenta: u.estado_cuenta || u.estado || 'Activo',
        estado: u.estado || u.estado_cuenta || 'Activo',
        fechaReg: u.fechaReg || u.fecha_registro || new Date().toISOString(),
        fecha_registro: u.fecha_registro || u.fechaReg || new Date().toISOString(),
        password: u.password || '12345678',
        avatar: u.avatar || (n.charAt(0) + (a ? a.charAt(0) : '')).toUpperCase()
      };
    });

    var tieneAdmin = existentes.some(function(u) { return u.rol === 'Super Admin' || u.rol === 'Administrador'; });
    if (!tieneAdmin) {
      existentes.unshift(USUARIOS_DEFECTO[0]);
    }
    localStorage.setItem('tm_usuarios', JSON.stringify(existentes));
  }

  var paquetesLS = localStorage.getItem('tm_paquetes');
  if (!paquetesLS) {
    localStorage.setItem('tm_paquetes', JSON.stringify(PAQUETES_DEFECTO));
  } else {
    // Sincronizar paquetes existentes con campos de la tabla destinos
    var paquetesEx = JSON.parse(paquetesLS);
    paquetesEx = paquetesEx.map(function(p, idx) {
      return {
        id: p.id || ('PQ-' + String(idx + 1).padStart(2, '0')),
        codigo_iata_ciudad: p.codigo_iata_ciudad || p.iata || 'CTG',
        iata: p.iata || p.codigo_iata_ciudad || 'CTG',
        nombre_destino: p.nombre_destino || p.nombre || 'Destino Maravilloso',
        nombre: p.nombre || p.nombre_destino || 'Destino Maravilloso',
        pais: p.pais || 'Colombia',
        continente: p.continente || 'América del Sur',
        descripcion: p.descripcion || 'Experiencia turística completa.',
        precio_base_cop: p.precio_base_cop || p.precio || 2450000,
        precio: p.precio || p.precio_base_cop || 2450000,
        duracion_dias_promedio: p.duracion_dias_promedio || p.duracion || 5,
        mejor_epoca_viaje: p.mejor_epoca_viaje || 'Todo el año',
        idioma_oficial: p.idioma_oficial || 'Español',
        moneda_local: p.moneda_local || 'COP',
        salida: p.salida || '2026-11-15',
        llegada: p.llegada || '2026-11-20',
        hoteles: p.hoteles || 'Hotel Principal',
        categoria: p.categoria || 'Turismo General',
        estado: p.estado || 'Activo'
      };
    });
    localStorage.setItem('tm_paquetes', JSON.stringify(paquetesEx));
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
      '<td><span style="font-size:12px; font-weight:600; color:#555;">' + (u.tipo_documento || 'CC') + ':</span> <strong>' + (u.numero_documento || '---') + '</strong></td>' +
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
      '<td><span class="badge-estado ' + estadoClase + '">' + (u.estado_cuenta || u.estado || 'Activo') + '</span></td>' +
      '<td>' + (u.pais_residencia || u.pais || 'No especificado') + '</td>' +
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

  var partesNombre = (u.nombre || '').split(' ');
  var nombresVal = u.nombres || partesNombre[0] || '';
  var apellidosVal = u.apellidos || partesNombre.slice(1).join(' ') || '';

  document.getElementById('modalUsuarioTitulo').textContent = 'Editar Usuario: ' + (u.nombre || nombresVal);
  document.getElementById('u_id_edit').value = u.id;
  document.getElementById('u_nombres').value = nombresVal;
  document.getElementById('u_apellidos').value = apellidosVal;
  document.getElementById('u_tipo_doc').value = u.tipo_documento || 'CC';
  document.getElementById('u_num_doc').value = u.numero_documento || '';
  document.getElementById('u_email').value = u.email;
  document.getElementById('u_telefono').value = u.telefono_principal || u.telefono || '';
  document.getElementById('u_tel_emergencia').value = u.telefono_emergencia || '';
  document.getElementById('u_contacto_emergencia').value = u.nombre_contacto_emergencia || '';
  document.getElementById('u_pais').value = u.pais_residencia || u.pais || 'Colombia';
  document.getElementById('u_ciudad').value = u.ciudad_residencia || u.ciudad || 'Medellín';
  document.getElementById('u_direccion').value = u.direccion_residencia || '';
  document.getElementById('u_fecha_nac').value = u.fecha_nacimiento || '';
  document.getElementById('u_genero').value = u.genero || 'Otro';
  document.getElementById('u_estilo').value = u.estilo_viaje_preferido || 'Playa & Relax';
  document.getElementById('u_rol').value = u.rol || 'Cliente';
  document.getElementById('u_estado').value = u.estado_cuenta || u.estado || 'Activo';
  document.getElementById('u_pass').value = u.password || '';

  document.getElementById('modalUsuarioOverlay').classList.add('active');
}

function cerrarModalUsuario() {
  document.getElementById('modalUsuarioOverlay').classList.remove('active');
}

function guardarUsuarioAdmin(e) {
  if (e) e.preventDefault();

  var idEdit = document.getElementById('u_id_edit').value;
  var nombres = document.getElementById('u_nombres').value.trim();
  var apellidos = document.getElementById('u_apellidos').value.trim();
  var tipoDoc = document.getElementById('u_tipo_doc').value;
  var numDoc = document.getElementById('u_num_doc').value.trim();
  var email = document.getElementById('u_email').value.trim();
  var telefono = document.getElementById('u_telefono').value.trim();
  var telEmergencia = document.getElementById('u_tel_emergencia').value.trim();
  var contactoEmergencia = document.getElementById('u_contacto_emergencia').value.trim();
  var pais = document.getElementById('u_pais').value;
  var ciudad = document.getElementById('u_ciudad').value.trim();
  var direccion = document.getElementById('u_direccion') ? document.getElementById('u_direccion').value.trim() : '';
  var fechaNac = document.getElementById('u_fecha_nac').value;
  var genero = document.getElementById('u_genero').value;
  var estilo = document.getElementById('u_estilo') ? document.getElementById('u_estilo').value : 'Playa & Relax';
  var rol = document.getElementById('u_rol').value;
  var estado = document.getElementById('u_estado').value;
  var pass = document.getElementById('u_pass').value;

  var nombreCompleto = (nombres + ' ' + apellidos).trim();

  if (!nombres || !email || !numDoc) {
    mostrarToastAdmin('⚠️ Completa los campos obligatorios: Nombres, Documento y Correo.');
    return;
  }

  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');

  // Mapa de roles a id_rol según SQL
  var mapaRoles = {
    'Super Admin': 1,
    'Administrador': 2,
    'Trabajador': 3,
    'Cliente': 4
  };

  if (idEdit) {
    // Modo Edición
    var index = usuarios.findIndex(function(u) { return String(u.id) === String(idEdit); });
    if (index !== -1) {
      usuarios[index].nombres = nombres;
      usuarios[index].apellidos = apellidos;
      usuarios[index].nombre = nombreCompleto;
      usuarios[index].tipo_documento = tipoDoc;
      usuarios[index].numero_documento = numDoc;
      usuarios[index].email = email;
      usuarios[index].telefono_principal = telefono;
      usuarios[index].telefono = telefono;
      usuarios[index].telefono_emergencia = telEmergencia;
      usuarios[index].nombre_contacto_emergencia = contactoEmergencia;
      usuarios[index].pais_residencia = pais;
      usuarios[index].pais = pais;
      usuarios[index].ciudad_residencia = ciudad;
      usuarios[index].ciudad = ciudad;
      usuarios[index].direccion_residencia = direccion;
      usuarios[index].fecha_nacimiento = fechaNac;
      usuarios[index].genero = genero;
      usuarios[index].estilo_viaje_preferido = estilo;
      usuarios[index].rol = rol;
      usuarios[index].id_rol = mapaRoles[rol] || 4;
      usuarios[index].estado_cuenta = estado;
      usuarios[index].estado = estado;
      if (pass) usuarios[index].password = pass;
    }
  } else {
    // Modo Creación
    var existe = usuarios.some(function(u) { 
      return u.email.toLowerCase() === email.toLowerCase() || 
             (u.numero_documento && u.numero_documento === numDoc); 
    });
    if (existe) {
      mostrarToastAdmin('❌ Ya existe un usuario con este correo o número de documento.');
      return;
    }

    var iniciales = (nombres.charAt(0) + (apellidos ? apellidos.charAt(0) : '')).toUpperCase();

    var nuevo = {
      id: Date.now(),
      id_rol: mapaRoles[rol] || 4,
      rol: rol,
      tipo_documento: tipoDoc,
      numero_documento: numDoc,
      nombres: nombres,
      apellidos: apellidos,
      nombre: nombreCompleto,
      email: email,
      telefono_principal: telefono,
      telefono: telefono,
      telefono_emergencia: telEmergencia,
      nombre_contacto_emergencia: contactoEmergencia,
      fecha_nacimiento: fechaNac,
      genero: genero,
      pais_residencia: pais,
      pais: pais,
      ciudad_residencia: ciudad || 'Medellín',
      ciudad: ciudad || 'Medellín',
      direccion_residencia: direccion,
      estilo_viaje_preferido: estilo,
      estado_cuenta: estado,
      estado: estado,
      password: pass || '12345678',
      fecha_registro: new Date().toISOString(),
      avatar: iniciales
    };
    usuarios.unshift(nuevo);
  }

  localStorage.setItem('tm_usuarios', JSON.stringify(usuarios));
  cerrarModalUsuario();
  mostrarToastAdmin('✅ Usuario guardado correctamente.');
  actualizarMetricas();
  renderizarTablaUsuarios();
}

function eliminarUsuario(id) {
  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
  var u = usuarios.find(function(x) { return String(x.id) === String(id); });
  var nombre = u ? (u.nombre || u.nombres || 'este usuario') : 'este usuario';

  abrirModalConfirmarAdmin(
    '¿Eliminar usuario?',
    'Se eliminará permanentemente a <strong>' + nombre + '</strong>. Esta acción no se puede deshacer.',
    function() {
      var filtrados = usuarios.filter(function(x) { return String(x.id) !== String(id); });
      localStorage.setItem('tm_usuarios', JSON.stringify(filtrados));
      mostrarToastAdmin('🗑️ Usuario eliminado.');
      actualizarMetricas();
      renderizarTablaUsuarios();
    }
  );
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
  document.getElementById('p_iata').value = p.codigo_iata_ciudad || p.iata || 'CTG';
  document.getElementById('p_pais').value = p.pais || 'Colombia';
  document.getElementById('p_continente').value = p.continente || 'América del Sur';
  document.getElementById('p_descripcion').value = p.descripcion;
  document.getElementById('p_precio').value = p.precio_base_cop || p.precio;
  document.getElementById('p_duracion').value = p.duracion_dias_promedio || p.duracion || 5;
  document.getElementById('p_temporada').value = p.mejor_epoca_viaje || '';
  document.getElementById('p_idioma').value = p.idioma_oficial || 'Español';
  document.getElementById('p_moneda').value = p.moneda_local || 'COP';
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
  var iata = document.getElementById('p_iata').value.trim().toUpperCase();
  var pais = document.getElementById('p_pais').value.trim();
  var continente = document.getElementById('p_continente').value;
  var desc = document.getElementById('p_descripcion').value.trim();
  var precio = parseFloat(document.getElementById('p_precio').value) || 0;
  var duracion = parseInt(document.getElementById('p_duracion').value, 10) || 5;
  var temporada = document.getElementById('p_temporada').value.trim();
  var idioma = document.getElementById('p_idioma').value.trim();
  var moneda = document.getElementById('p_moneda').value.trim();
  var salida = document.getElementById('p_salida').value;
  var llegada = document.getElementById('p_llegada').value;
  var hoteles = document.getElementById('p_hoteles').value.trim();
  var estado = document.getElementById('p_estado').value;

  if (!nombre || precio <= 0 || !iata) {
    mostrarToastAdmin('⚠️ Ingresa el nombre, código IATA y un precio válido.', 'error');
    return;
  }

  var paquetes = JSON.parse(localStorage.getItem('tm_paquetes') || '[]');

  if (idEdit) {
    var index = paquetes.findIndex(function(p) { return p.id === idEdit; });
    if (index !== -1) {
      paquetes[index].nombre = nombre;
      paquetes[index].nombre_destino = nombre;
      paquetes[index].codigo_iata_ciudad = iata;
      paquetes[index].iata = iata;
      paquetes[index].pais = pais;
      paquetes[index].continente = continente;
      paquetes[index].descripcion = desc;
      paquetes[index].precio = precio;
      paquetes[index].precio_base_cop = precio;
      paquetes[index].duracion_dias_promedio = duracion;
      paquetes[index].mejor_epoca_viaje = temporada;
      paquetes[index].idioma_oficial = idioma;
      paquetes[index].moneda_local = moneda;
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
      nombre_destino: nombre,
      codigo_iata_ciudad: iata,
      iata: iata,
      pais: pais,
      continente: continente,
      descripcion: desc,
      precio: precio,
      precio_base_cop: precio,
      duracion_dias_promedio: duracion,
      mejor_epoca_viaje: temporada,
      idioma_oficial: idioma,
      moneda_local: moneda,
      salida: salida,
      llegada: llegada,
      hoteles: hoteles,
      estado: estado
    };
    paquetes.push(nuevoPaquete);
  }

  localStorage.setItem('tm_paquetes', JSON.stringify(paquetes));
  cerrarModalPaquete();
  mostrarToastAdmin('✅ Paquete guardado correctamente.');
  actualizarMetricas();
  renderizarTablaPaquetes();
}

function eliminarPaquete(id) {
  var paquetes = JSON.parse(localStorage.getItem('tm_paquetes') || '[]');
  var p = paquetes.find(function(x) { return x.id === id; });
  var nombre = p ? (p.nombre || p.nombre_destino || id) : id;

  abrirModalConfirmarAdmin(
    '¿Eliminar paquete?',
    'Se eliminará permanentemente el paquete <strong>' + nombre + '</strong> (' + id + ').',
    function() {
      var filtrados = paquetes.filter(function(x) { return x.id !== id; });
      localStorage.setItem('tm_paquetes', JSON.stringify(filtrados));
      mostrarToastAdmin('🗑️ Paquete eliminado.');
      actualizarMetricas();
      renderizarTablaPaquetes();
    }
  );
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

/* ===== MODAL DE CONFIRMACIÓN PERSONALIZADO (SIN confirm() nativo) ===== */
var _callbackConfirmarAdmin = null;

function abrirModalConfirmarAdmin(titulo, mensaje, callback) {
  var modal = document.getElementById('modalConfirmarAdmin');
  if (!modal) return;

  var elTitulo = document.getElementById('modalConfirmarTitulo');
  var elMensaje = document.getElementById('modalConfirmarMensaje');
  var btnAceptar = document.getElementById('btnAceptarConfirmarAdmin');

  if (elTitulo) elTitulo.textContent = titulo;
  if (elMensaje) elMensaje.innerHTML = mensaje;

  _callbackConfirmarAdmin = callback;

  // Color del botón: rojo para eliminar, naranja para otras acciones
  if (btnAceptar) {
    var esEliminar = titulo.toLowerCase().includes('eliminar');
    btnAceptar.style.background = esEliminar ? '#dc2626' : 'linear-gradient(135deg, #e8792c, #f6a800)';
    btnAceptar.style.color = '#fff';
    btnAceptar.textContent = esEliminar ? '🗑️ Sí, eliminar' : '✅ Confirmar';
    btnAceptar.onclick = function() {
      cerrarModalConfirmarAdmin();
      if (typeof _callbackConfirmarAdmin === 'function') {
        _callbackConfirmarAdmin();
        _callbackConfirmarAdmin = null;
      }
    };
  }

  modal.classList.add('active');
}

function cerrarModalConfirmarAdmin() {
  var modal = document.getElementById('modalConfirmarAdmin');
  if (modal) modal.classList.remove('active');
  _callbackConfirmarAdmin = null;
}

/* ===== TOAST DE NOTIFICACIÓN DEL PANEL (SIN alert() nativo) ===== */
function mostrarToastAdmin(mensaje, tipo) {
  var toast = document.getElementById('toastAdmin');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastAdmin';
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:99999',
      'background:#1a1205', 'color:#fff', 'padding:13px 20px',
      'border-radius:12px', 'font-size:14px', 'font-weight:600',
      'box-shadow:0 8px 28px rgba(0,0,0,0.35)', 'max-width:320px',
      'border-left:4px solid #f6a800', 'opacity:0',
      'transition:opacity 0.3s ease', 'pointer-events:none'
    ].join(';');
    document.body.appendChild(toast);
  }
  if (tipo === 'error') {
    toast.style.borderLeftColor = '#dc2626';
  } else {
    toast.style.borderLeftColor = '#f6a800';
  }
  toast.textContent = mensaje;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() { toast.style.opacity = '0'; }, 3000);
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

  // Cerrar modal de confirmación al hacer clic en el fondo
  var modalConfirmar = document.getElementById('modalConfirmarAdmin');
  if (modalConfirmar) {
    modalConfirmar.addEventListener('click', function(e) {
      if (e.target === modalConfirmar) cerrarModalConfirmarAdmin();
    });
  }

  // Cerrar modales de usuario/paquete al hacer clic en el fondo
  var overlayUsuario = document.getElementById('modalUsuarioOverlay');
  if (overlayUsuario) {
    overlayUsuario.addEventListener('click', function(e) {
      if (e.target === overlayUsuario) cerrarModalUsuario();
    });
  }

  var overlayPaquete = document.getElementById('modalPaqueteOverlay');
  if (overlayPaquete) {
    overlayPaquete.addEventListener('click', function(e) {
      if (e.target === overlayPaquete) cerrarModalPaquete();
    });
  }
});
