/* ================================================================
   TRAVELMATE - Lógica del Login y Registro Mundial v1.0
   js/login.js
   - Galería de destinos con crossfade en el panel visual izquierdo.
   - Toggle animado entre modo Login y Registro.
   - Validación en tiempo real de todos los campos del formulario.
   - Indicador de seguridad de contraseña (fuerza: débil, media, fuerte).
   - Mostrar/ocultar contraseña con toggle 👁️.
   - Persistencia de usuarios en localStorage (clave: 'tm_usuarios').
   - Sesión activa en localStorage / sessionStorage (clave: 'tm_sesion').
   - Login con Google y Apple (simulado, listo para integrar con OAuth).
   - Toast de notificaciones flotante animado.
   ================================================================ */

'use strict';

/* ================================================================
   DATOS DE DESTINOS PARA EL PANEL VISUAL IZQUIERDO
   Cada objeto define la imagen, el texto del tag, la frase
   inspiradora y el subtexto que aparece en el panel izquierdo.
   ================================================================ */
var DESTINOS_VISUAL = [
  {
    img: '../assets/img/cartagena.jpg',
    tag: 'Colombia · América del Sur',
    frase: '"El mundo es un libro, y quienes no viajan solo leen una página."',
    sub: 'Únete a millones de viajeros que descubren el mundo con TravelMate.'
  },
  {
    img: '../assets/img/paris.jpg',
    tag: 'Francia · Europa',
    frase: '"Viajar es la única cosa que compras que te hace más rico."',
    sub: 'Descubre el arte, la gastronomía y el romance de los destinos más icónicos.'
  },
  {
    img: '../assets/img/tokio.jpg',
    tag: 'Japón · Asia',
    frase: '"No hay camino hacia la aventura, la aventura es el camino."',
    sub: 'Experimenta culturas únicas y momentos que recordarás toda la vida.'
  },
  {
    img: '../assets/img/rio.jpg',
    tag: 'Brasil · América del Sur',
    frase: '"La vida se acorta, así que bésala lento, ama de verdad y viaja sin miedo."',
    sub: 'Tu próxima gran aventura comienza con una sola cuenta en TravelMate.'
  },
  {
    img: '../assets/img/bali.jpg',
    tag: 'Indonesia · Asia',
    frase: '"El mar serena el alma. El viento lleva los sueños. El viaje te hace libre."',
    sub: 'Playas, cultura y naturaleza sin igual. Todo a un clic de distancia.'
  }
];

/* Variables de estado del panel visual */
var destinoActual = 0;
var fondos = [];
var intervalPanel;

/* ================================================================
   INICIALIZAR PANEL VISUAL IZQUIERDO
   Crea los elementos de fondo y los puntos indicadores en el DOM.
   ================================================================ */
function inicializarPanel() {
  var panelVisual = document.getElementById('panelVisual');

  /* Crear un div de fondo por cada destino y anexarlo al panel */
  DESTINOS_VISUAL.forEach(function(d, i) {
    var fondo = document.createElement('div');
    fondo.className = 'panel-bg ' + (i === 0 ? 'activo' : 'inactivo');
    fondo.style.backgroundImage = 'url(' + d.img + ')';
    /* Insertar antes de la capa overlay para que quede detrás */
    panelVisual.insertBefore(fondo, panelVisual.firstChild);
    fondos.push(fondo);
  });

  /* Crear puntos indicadores clicables */
  var puntosCont = document.getElementById('panelPuntos');
  DESTINOS_VISUAL.forEach(function(_, i) {
    var p = document.createElement('span');
    p.className = 'panel-punto ' + (i === 0 ? 'activo' : '');
    p.onclick = function() {
      clearInterval(intervalPanel); /* Detener autoavance al hacer clic manual */
      irADestino(i);
    };
    puntosCont.appendChild(p);
  });

  actualizarTextoPanel();

  /* Autoavance del panel: cambia cada 5 segundos */
  intervalPanel = setInterval(function() {
    destinoActual = (destinoActual + 1) % DESTINOS_VISUAL.length;
    irADestino(destinoActual);
  }, 5000);
}

/* Cambia visualmente al destino indicado por índice */
function irADestino(idx) {
  /* Ocultar fondo actual y activar el nuevo */
  fondos[destinoActual].className = 'panel-bg inactivo';
  destinoActual = idx;
  fondos[destinoActual].className = 'panel-bg activo';

  /* Actualizar estado activo de los puntos */
  var puntos = document.querySelectorAll('.panel-punto');
  puntos.forEach(function(p, i) {
    p.className = 'panel-punto ' + (i === idx ? 'activo' : '');
  });

  actualizarTextoPanel();
}

/* Actualiza el tag, frase y subtexto del destino actual */
function actualizarTextoPanel() {
  var d = DESTINOS_VISUAL[destinoActual];
  document.getElementById('destinoTag').textContent   = d.tag;
  document.getElementById('destinoFrase').textContent = d.frase;
  document.getElementById('destinoSub').textContent   = d.sub;
}

/* ================================================================
   TOGGLE ENTRE MODO LOGIN Y MODO REGISTRO
   Cambia la visibilidad de los formularios y actualiza los textos.
   ================================================================ */
function cambiarModo(modo) {
  var esLogin = (modo === 'login');

  /* Mostrar u ocultar cada formulario */
  document.getElementById('formLogin').style.display    = esLogin ? 'block' : 'none';
  document.getElementById('formRegistro').style.display = esLogin ? 'none'  : 'block';

  /* Resaltar el botón del modo activo en el toggle */
  document.getElementById('btnLogin').className    = 'toggle-btn ' + (esLogin ? 'activo' : '');
  document.getElementById('btnRegistro').className = 'toggle-btn ' + (!esLogin ? 'activo' : '');

  /* Actualizar textos del encabezado según el modo */
  document.getElementById('labelBienvenida').textContent = esLogin
    ? '👋 Bienvenido de vuelta'
    : '✨ Únete al mundo';

  document.getElementById('tituloForm').textContent = esLogin
    ? 'Inicia sesión'
    : 'Crea tu cuenta';

  document.getElementById('subForm').textContent = esLogin
    ? 'Accede a tu cuenta para continuar explorando el mundo.'
    : 'Es gratis. Miles de destinos te esperan.';

  /* Actualizar texto del pie del formulario */
  document.getElementById('pieTxt').innerHTML = esLogin
    ? '¿No tienes cuenta? <a onclick="cambiarModo(\'registro\')">Créala gratis →</a>'
    : '¿Ya tienes cuenta? <a onclick="cambiarModo(\'login\')">Inicia sesión →</a>';
}

/* ================================================================
   VALIDACIONES EN TIEMPO REAL
   Cada función valida un campo específico y aplica estilos visuales.
   ================================================================ */

/* Valida formato de correo electrónico con expresión regular */
function validarEmail(campoId, msgId) {
  var input = document.getElementById(campoId);
  var msg   = document.getElementById(msgId);
  var val   = input.value.trim();
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (val === '') {
    setEstado(input, msg, '', '', '');
  } else if (!regex.test(val)) {
    setEstado(input, msg, 'invalido', 'error', '⚠️ Ingresa un correo válido (ej: nombre@email.com)');
  } else {
    setEstado(input, msg, 'valido', 'ok', '✅ Correo válido');
  }
}

/* Valida que el nombre tenga al menos 3 caracteres */
function validarNombre() {
  var input = document.getElementById('regNombre');
  var msg   = document.getElementById('msgNombre');
  var icono = document.getElementById('iconoNombre');
  var val   = input.value.trim();

  if (val.length < 3) {
    setEstado(input, msg, 'invalido', 'error', '⚠️ Ingresa tu nombre completo (mínimo 3 letras)');
    icono.textContent = '❌';
  } else {
    setEstado(input, msg, 'valido', 'ok', '✅ Nombre registrado');
    icono.textContent = '✅';
  }
}

/* Valida que un campo no esté vacío */
function validarCampoVacio(campoId, msgId, textoError) {
  var input = document.getElementById(campoId);
  var msg   = document.getElementById(msgId);
  if (!input.value.trim()) {
    setEstado(input, msg, 'invalido', 'error', '⚠️ ' + textoError);
  } else {
    setEstado(input, msg, 'valido', 'ok', '');
  }
}

/* ================================================================
   INDICADOR DE FUERZA DE CONTRASEÑA
   Evalúa longitud, mayúsculas, números y símbolos para asignar nivel.
   ================================================================ */
function validarFuerzaPass() {
  var input  = document.getElementById('regPass');
  var val    = input.value;
  var msg    = document.getElementById('msgRegPass');
  var wrap   = document.getElementById('fuerzaWrap');
  var texto  = document.getElementById('fuerzaTexto');
  var barras = [
    document.getElementById('barra1'),
    document.getElementById('barra2'),
    document.getElementById('barra3'),
    document.getElementById('barra4')
  ];

  /* Mostrar indicador solo cuando haya contenido */
  wrap.style.display = val.length ? 'block' : 'none';

  /* Calcular puntos de seguridad de 0 a 4 */
  var puntos = 0;
  if (val.length >= 8)            puntos++; /* Longitud mínima */
  if (/[A-Z]/.test(val))         puntos++; /* Al menos una mayúscula */
  if (/[0-9]/.test(val))         puntos++; /* Al menos un número */
  if (/[^a-zA-Z0-9]/.test(val)) puntos++; /* Al menos un símbolo especial */

  /* Resetear barras */
  barras.forEach(function(b) { b.className = 'fuerza-barra'; });

  /* Asignar color según nivel */
  var clase = puntos <= 1
    ? 'activa-debil'
    : puntos <= 2
      ? 'activa-media'
      : 'activa-fuerte';

  for (var i = 0; i < puntos; i++) {
    barras[i].className = 'fuerza-barra ' + clase;
  }

  /* Texto descriptivo del nivel */
  var niveles = [
    '',
    'Débil — Agrega números o símbolos',
    'Regular — Casi segura',
    'Buena',
    '🔒 Contraseña muy segura'
  ];
  texto.textContent = niveles[puntos] || 'Escribe una contraseña';

  /* Mostrar error si es muy corta */
  if (val.length < 8) {
    setEstado(input, msg, 'invalido', 'error', '⚠️ Mínimo 8 caracteres');
  } else {
    setEstado(input, msg, 'valido', 'ok', '');
  }
}

/* Valida que la confirmación de contraseña coincida con la original */
function validarConfPass() {
  var pass  = document.getElementById('regPass').value;
  var conf  = document.getElementById('regPassConf');
  var msg   = document.getElementById('msgConfPass');
  var icono = document.getElementById('iconoConfPass');

  if (!conf.value) {
    setEstado(conf, msg, '', '', '');
    icono.textContent = '';
    return;
  }
  if (conf.value !== pass) {
    setEstado(conf, msg, 'invalido', 'error', '⚠️ Las contraseñas no coinciden');
    icono.textContent = '❌';
  } else {
    setEstado(conf, msg, 'valido', 'ok', '✅ Contraseñas coinciden');
    icono.textContent = '✅';
  }
}

/* Helper que aplica clases CSS y texto de mensaje a un campo */
function setEstado(input, msg, claseInput, claseMsg, texto) {
  input.className = 'campo-input' + (claseInput ? ' ' + claseInput : '');
  msg.className   = 'campo-msg'   + (claseMsg   ? ' ' + claseMsg   : '');
  msg.textContent = texto;
}

/* Alterna la visibilidad de un campo de contraseña */
function togglePass(inputId, btn) {
  var input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

/* ================================================================
   LÓGICA DE INICIO DE SESIÓN
   Busca el usuario en localStorage y guarda la sesión activa.
   ================================================================ */
function ejecutarLogin() {
  var email = document.getElementById('loginEmail').value.trim();
  var pass  = document.getElementById('loginPass').value;

  if (!email || !pass) {
    mostrarToast('⚠️ Completa todos los campos', 'error-t');
    return;
  }

  /* Mostrar spinner mientras se procesa */
  setLoadingBtn('textoLoginBtn', 'spinnerLogin', true);

  /* Simular tiempo de respuesta del servidor */
  setTimeout(function() {
    setLoadingBtn('textoLoginBtn', 'spinnerLogin', false);

    /* Buscar el usuario en la lista guardada en localStorage */
    var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
    var usuario  = usuarios.find(function(u) {
      return u.email === email && u.password === pass;
    });

    if (!usuario) {
      mostrarToast('❌ Email o contraseña incorrectos', 'error-t');
      document.getElementById('loginEmail').classList.add('invalido');
      document.getElementById('loginPass').classList.add('invalido');
      return;
    }

    /* Guardar sesión según preferencia de "Recuérdame" */
    if (document.getElementById('recuerdame').checked) {
      localStorage.setItem('tm_sesion', JSON.stringify(usuario));
    } else {
      sessionStorage.setItem('tm_sesion', JSON.stringify(usuario));
    }

    mostrarToast('✅ ¡Bienvenido de vuelta, ' + usuario.nombre.split(' ')[0] + '!', 'exito');
    setTimeout(function() { mostrarBienvenida(usuario); }, 1200);
  }, 1800);
}

/* ================================================================
   LÓGICA DE REGISTRO DE NUEVO USUARIO
   Valida campos, verifica que el email no exista y guarda en localStorage.
   ================================================================ */
function ejecutarRegistro() {
  var nombre    = document.getElementById('regNombre').value.trim();
  var email     = document.getElementById('regEmail').value.trim();
  var pais      = document.getElementById('regPais').value;
  var pass      = document.getElementById('regPass').value;
  var passConf  = document.getElementById('regPassConf').value;
  var terminos  = document.getElementById('aceptaTerminos').checked;

  /* Validar todos los campos antes de continuar */
  if (!nombre || nombre.length < 3) {
    mostrarToast('⚠️ Ingresa tu nombre completo', 'error-t'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarToast('⚠️ Ingresa un correo válido', 'error-t'); return;
  }
  if (!pais) {
    mostrarToast('⚠️ Selecciona tu país', 'error-t'); return;
  }
  if (pass.length < 8) {
    mostrarToast('⚠️ La contraseña debe tener mínimo 8 caracteres', 'error-t'); return;
  }
  if (pass !== passConf) {
    mostrarToast('⚠️ Las contraseñas no coinciden', 'error-t'); return;
  }
  if (!terminos) {
    mostrarToast('⚠️ Acepta los términos para continuar', 'error-t'); return;
  }

  /* Verificar que el email no esté ya registrado */
  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
  var yaExiste = usuarios.find(function(u) { return u.email === email; });
  if (yaExiste) {
    mostrarToast('❌ Este email ya está registrado', 'error-t'); return;
  }

  /* Mostrar spinner durante el proceso */
  setLoadingBtn('textoRegBtn', 'spinnerReg', true);

  setTimeout(function() {
    setLoadingBtn('textoRegBtn', 'spinnerReg', false);

    /* Crear el objeto del nuevo usuario */
    var nuevoUsuario = {
      id:       Date.now(),           /* ID único basado en timestamp */
      nombre:   nombre,
      email:    email,
      pais:     pais,
      password: pass,
      fechaReg: new Date().toISOString(),
      avatar:   obtenerEmoji(pais)   /* Emoji representativo del país */
    };

    /* Guardar en localStorage y activar sesión */
    usuarios.push(nuevoUsuario);
    localStorage.setItem('tm_usuarios', JSON.stringify(usuarios));
    sessionStorage.setItem('tm_sesion', JSON.stringify(nuevoUsuario));

    mostrarToast('🎉 ¡Cuenta creada exitosamente!', 'exito');
    setTimeout(function() { mostrarBienvenida(nuevoUsuario); }, 1200);
  }, 2000);
}

/* Devuelve un emoji representativo según el país del usuario */
function obtenerEmoji(pais) {
  var map = {
    'Colombia': '🌴', 'México': '🌮', 'Argentina': '🥩', 'Brasil': '🌴',
    'Chile': '🏔️', 'Perú': '🏔️', 'España': '💃', 'Francia': '🗼',
    'Italia': '🍕', 'Japón': '🌸', 'Estados Unidos': '🗽', 'Australia': '🦘',
    'Alemania': '🍺', 'India': '🎨', 'default': '🌍'
  };
  for (var key in map) {
    if (pais.includes(key)) return map[key];
  }
  return map['default'];
}

/* Controla el estado visual del botón (spinner visible o texto visible) */
function setLoadingBtn(textoId, spinnerId, cargando) {
  document.getElementById(textoId).style.display  = cargando ? 'none'  : 'inline';
  document.getElementById(spinnerId).style.display = cargando ? 'block' : 'none';
}

/* ================================================================
   PANEL DE BIENVENIDA POST-LOGIN
   Oculta el formulario y muestra un saludo personalizado.
   ================================================================ */
function mostrarBienvenida(usuario) {
  document.getElementById('formCaja').style.display        = 'none';
  document.getElementById('panelBienvenida').style.display = 'flex';
  document.getElementById('bienNombre').textContent =
    '¡Hola, ' + usuario.nombre.split(' ')[0] + '! ' + (usuario.avatar || '🌍');
}

/* ================================================================
   CERRAR SESIÓN
   Elimina la sesión activa de localStorage y sessionStorage.
   ================================================================ */
function cerrarSesion() {
  localStorage.removeItem('tm_sesion');
  sessionStorage.removeItem('tm_sesion');
  document.getElementById('formCaja').style.display        = 'flex';
  document.getElementById('panelBienvenida').style.display = 'none';
  mostrarToast('👋 Sesión cerrada correctamente', '');
}

/* ================================================================
   RECUPERAR CONTRASEÑA
   Verifica el email en localStorage y simula el envío de instrucciones.
   ================================================================ */
function olvidoContrasena() {
  var email    = document.getElementById('loginEmail').value.trim();
  if (!email) {
    mostrarToast('📧 Escribe tu correo primero', 'error-t');
    document.getElementById('loginEmail').focus();
    return;
  }
  var usuarios = JSON.parse(localStorage.getItem('tm_usuarios') || '[]');
  var usuario  = usuarios.find(function(u) { return u.email === email; });

  if (!usuario) {
    mostrarToast('❌ No existe una cuenta con ese correo', 'error-t');
  } else {
    mostrarToast('📨 Instrucciones enviadas a ' + email, 'exito');
  }
}

/* ================================================================
   LOGIN SOCIAL SIMULADO (Google / Apple)
   Muestra un mensaje informativo. Listo para integrar con OAuth 2.0.
   ================================================================ */
function loginSocial(proveedor) {
  mostrarToast('🔄 Conectando con ' + proveedor + '...', '');
  setTimeout(function() {
    mostrarToast('ℹ️ Integración con ' + proveedor + ' disponible próximamente', '');
  }, 1500);
}

/* ================================================================
   TOAST DE NOTIFICACIÓN FLOTANTE
   Aparece desde la parte inferior, se anima y desaparece automáticamente.
   ================================================================ */
function mostrarToast(texto, tipo) {
  var toast   = document.getElementById('toastMsg');
  var textoEl = document.getElementById('toastTexto');
  textoEl.textContent = texto;
  toast.className = 'toast ' + (tipo || '');
  toast.classList.add('visible');

  /* Limpiar temporizador previo para evitar conflictos */
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.classList.remove('visible');
  }, 3500);
}

/* ================================================================
   VERIFICAR SESIÓN ACTIVA AL CARGAR LA PÁGINA
   Si ya existe una sesión guardada, muestra el panel de bienvenida.
   ================================================================ */
function verificarSesion() {
  var sesionLS  = localStorage.getItem('tm_sesion');
  var sesionSS  = sessionStorage.getItem('tm_sesion');
  var sesionStr = sesionLS || sesionSS;

  if (sesionStr) {
    try {
      var sesion = JSON.parse(sesionStr);
      mostrarBienvenida(sesion);
    } catch (e) {
      /* Si el JSON está corrupto, limpiar y seguir */
      localStorage.removeItem('tm_sesion');
      sessionStorage.removeItem('tm_sesion');
    }
  }
}

/* ================================================================
   INICIALIZACIÓN AL CARGAR EL DOM
   ================================================================ */
document.addEventListener('DOMContentLoaded', function() {
  inicializarPanel();   /* Galería del panel izquierdo */
  verificarSesion();    /* Verificar si ya hay sesión activa */
});
