/* ==========================================================
   TravelMate - script.js  v0.2
   Carrusel Hero 3D con crossfade de fondo
   Imagenes locales en assets/img/
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   DATOS DE DESTINOS
   img: ruta local desde la raiz del proyecto (donde esta index.html)
   Para cambiar una imagen: reemplaza el archivo .jpg en assets/img/
   ---------------------------------------------------------- */
var DESTINOS = [
  {
    nombre : 'Cartagena',
    pais   : 'Colombia',
    tag    : 'Caribe',
    desc   : 'Ciudad amurallada de colores y magia caribena',
    img    : 'assets/img/cartagena.jpg'
  },
  {
    nombre : 'Machu Picchu',
    pais   : 'Peru',
    tag    : 'America del Sur',
    desc   : 'La maravilla perdida entre las nubes de los Andes',
    img    : 'assets/img/machupicchu.jpg'
  },
  {
    nombre : 'Ciudad de Mexico',
    pais   : 'Mexico',
    tag    : 'America Central',
    desc   : 'Cultura, historia y gastronomia sin igual',
    img    : 'assets/img/mexicocity.jpg'
  },
  {
    nombre : 'Buenos Aires',
    pais   : 'Argentina',
    tag    : 'America del Sur',
    desc   : 'El Paris de America: arte, tango y pasion',
    img    : 'assets/img/buenosaires.jpg'
  },
  {
    nombre : 'Paris',
    pais   : 'Francia',
    tag    : 'Europa',
    desc   : 'La ciudad del amor, la moda y la gastronomia',
    img    : 'assets/img/Torre_Eiffel.jpg'
  },
  {
    nombre : 'Barcelona',
    pais   : 'Espana',
    tag    : 'Europa',
    desc   : 'Arquitectura modernista, playa y vida mediterranea',
    img    : 'assets/img/Sagrada_Familia.jpg'
  },
  {
    nombre : 'Roma',
    pais   : 'Italia',
    tag    : 'Europa',
    desc   : 'La ciudad eterna donde la historia cobra vida',
    img    : 'assets/img/roma.jpg'
  }
];

/* ----------------------------------------------------------
   ESTADO DEL CARRUSEL
   ---------------------------------------------------------- */
var TOTAL          = DESTINOS.length;
var indiceActivo   = 0;
var fondoActual    = 'A';   // alterna A/B para el crossfade del fondo
var tempAutoavance = null;
var enTransicion   = false;

/* ----------------------------------------------------------
   REFERENCIAS AL DOM
   (son los elementos HTML que JavaScript va a controlar)
   ---------------------------------------------------------- */
var pista      = document.getElementById('carruselPista');
var puntosCont = document.getElementById('carruselPuntos');
var infoPanel  = document.getElementById('carruselInfo');
var elTag      = document.getElementById('destTag');
var elNombre   = document.getElementById('destNombre');
var elPais     = document.getElementById('destPais');
var elDesc     = document.getElementById('destDesc');
var fondoA     = document.getElementById('fondoA');
var fondoB     = document.getElementById('fondoB');
var btnPrev    = document.getElementById('btnPrev');
var btnNext    = document.getElementById('btnNext');

/* ----------------------------------------------------------
   CLASES DE POSICION PARA LAS TARJETAS
   distancia: -3 (muy izq) ... 0 (centro) ... +3 (muy der)
   ---------------------------------------------------------- */
var CLASES_POS = [
  'pos-hidden-left',   // distancia -3
  'pos-far-left',      // distancia -2
  'pos-left',          // distancia -1
  'pos-center',        // distancia  0  <-- tarjeta activa
  'pos-right',         // distancia +1
  'pos-far-right',     // distancia +2
  'pos-hidden-right'   // distancia +3
];

/* Devuelve la clase CSS segun la distancia al centro */
function clasePorDistancia(dist) {
  var d = Math.max(-3, Math.min(3, dist));
  return CLASES_POS[d + 3];
}

/* ----------------------------------------------------------
   CREAR TARJETAS EN EL DOM
   Se llama una sola vez al inicio
   ---------------------------------------------------------- */
function crearTarjetas() {
  pista.innerHTML = '';

  DESTINOS.forEach(function(dest, i) {
    /* Contenedor de la tarjeta */
    var tarjeta = document.createElement('div');
    tarjeta.classList.add('carr-tarjeta');
    tarjeta.dataset.index = i;

    /* Imagen del destino (archivo local en assets/img/) */
    var img = document.createElement('img');
    img.src      = dest.img;
    img.alt      = dest.nombre + ', ' + dest.pais;
    img.loading  = (i < 3) ? 'eager' : 'lazy';   // primeras 3 carga inmediata
    img.decoding = 'async';

    tarjeta.appendChild(img);

    /* Clic en una tarjeta lateral -> la mueve al centro */
    tarjeta.addEventListener('click', function() {
      moverA(i);
    });

    pista.appendChild(tarjeta);
  });
}

/* ----------------------------------------------------------
   CREAR PUNTOS INDICADORES
   ---------------------------------------------------------- */
function crearPuntos() {
  puntosCont.innerHTML = '';

  DESTINOS.forEach(function(_, i) {
    var punto = document.createElement('button');
    punto.classList.add('carr-punto');
    punto.setAttribute('aria-label', 'Destino ' + (i + 1));
    punto.addEventListener('click', function() {
      moverA(i);
    });
    puntosCont.appendChild(punto);
  });
}

/* ----------------------------------------------------------
   RENDERIZAR: asigna posicion a cada tarjeta
   Llama a esta funcion cada vez que cambia el destino activo
   ---------------------------------------------------------- */
function renderizar(nuevoIndice, animar) {
  if (typeof animar === 'undefined') animar = true;
  if (enTransicion && animar) return; // evita clics rapidos

  enTransicion = true;

  /* Calcular nuevo indice circular (ej: 7 -> 0, -1 -> 6) */
  indiceActivo = ((nuevoIndice % TOTAL) + TOTAL) % TOTAL;

  /* --- Actualizar clases de posicion en cada tarjeta --- */
  var tarjetas = pista.querySelectorAll('.carr-tarjeta');
  tarjetas.forEach(function(tarjeta, i) {
    /* Quitar todas las clases de posicion anteriores */
    CLASES_POS.forEach(function(cls) { tarjeta.classList.remove(cls); });

    /* Calcular distancia relativa al destino activo */
    var dist = i - indiceActivo;

    /* Ajuste circular: si la distancia es mayor que la mitad, da la vuelta */
    if (dist >  TOTAL / 2) dist -= TOTAL;
    if (dist < -TOTAL / 2) dist += TOTAL;

    /* Asignar clase de posicion */
    tarjeta.classList.add(clasePorDistancia(dist));
  });

  /* --- Actualizar puntos indicadores --- */
  var puntos = puntosCont.querySelectorAll('.carr-punto');
  puntos.forEach(function(p, i) {
    p.classList.toggle('activo', i === indiceActivo);
  });

  /* --- Actualizar texto e imagen de fondo --- */
  actualizarInfo(animar);
  actualizarFondo();

  /* Desbloquear despues de la transicion CSS (0.65s) */
  setTimeout(function() { enTransicion = false; }, 680);
}

/* ----------------------------------------------------------
   ACTUALIZAR TEXTO DEL DESTINO ACTIVO
   ---------------------------------------------------------- */
function actualizarInfo(animar) {
  var dest = DESTINOS[indiceActivo];

  if (animar) {
    /* Fade out -> cambiar texto -> fade in */
    infoPanel.classList.add('cambiando');
    setTimeout(function() {
      aplicarTextos(dest);
      infoPanel.classList.remove('cambiando');
    }, 230);
  } else {
    aplicarTextos(dest);
  }
}

function aplicarTextos(dest) {
  elTag.textContent    = dest.tag;
  elNombre.textContent = dest.nombre;
  elPais.textContent   = '- ' + dest.pais;
  elDesc.textContent   = dest.desc;
}

/* ----------------------------------------------------------
   CROSSFADE DEL FONDO
   Alterna entre dos divs (#fondoA y #fondoB) para un cambio
   de imagen suave sin parpadeo
   ---------------------------------------------------------- */
function actualizarFondo() {
  var url = "url('" + DESTINOS[indiceActivo].img + "')";

  if (fondoActual === 'A') {
    /* Poner nueva imagen en B y mostrar B, ocultar A */
    fondoB.style.backgroundImage = url;
    fondoA.classList.remove('visible');
    fondoA.classList.add('oculto');
    fondoB.classList.remove('oculto');
    fondoB.classList.add('visible');
    fondoActual = 'B';
  } else {
    /* Poner nueva imagen en A y mostrar A, ocultar B */
    fondoA.style.backgroundImage = url;
    fondoB.classList.remove('visible');
    fondoB.classList.add('oculto');
    fondoA.classList.remove('oculto');
    fondoA.classList.add('visible');
    fondoActual = 'A';
  }
}

/* ----------------------------------------------------------
   NAVEGACION
   ---------------------------------------------------------- */
function moverA(i) {
  if (i === indiceActivo) return;
  reiniciarAutoavance();
  renderizar(i);
}

function siguiente() {
  reiniciarAutoavance();
  renderizar(indiceActivo + 1);
}

function anterior() {
  reiniciarAutoavance();
  renderizar(indiceActivo - 1);
}

/* ----------------------------------------------------------
   AUTOAVANCE (cambia solo cada 5.5 segundos)
   ---------------------------------------------------------- */
function iniciarAutoavance() {
  tempAutoavance = setInterval(function() {
    renderizar(indiceActivo + 1);
  }, 5500);
}

function reiniciarAutoavance() {
  clearInterval(tempAutoavance);
  iniciarAutoavance();
}

/* ----------------------------------------------------------
   EVENTOS
   ---------------------------------------------------------- */
function configurarEventos() {
  /* Flechas */
  btnPrev.addEventListener('click', anterior);
  btnNext.addEventListener('click', siguiente);

  /* Teclas del teclado: flecha izquierda / derecha */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') siguiente();
    if (e.key === 'ArrowLeft')  anterior();
  });

  /* Swipe en pantallas tactiles */
  var touchInicioX = 0;
  pista.addEventListener('touchstart', function(e) {
    touchInicioX = e.touches[0].clientX;
  }, { passive: true });

  pista.addEventListener('touchend', function(e) {
    var diferencia = touchInicioX - e.changedTouches[0].clientX;
    if (Math.abs(diferencia) > 45) {
      if (diferencia > 0) {
        siguiente(); // swipe hacia la izquierda -> siguiente
      } else {
        anterior();  // swipe hacia la derecha -> anterior
      }
    }
  }, { passive: true });

  /* Pausar autoavance cuando el mouse esta sobre el hero */
  var seccion = document.querySelector('.hero-carrusel');
  seccion.addEventListener('mouseenter', function() {
    clearInterval(tempAutoavance);
  });
  seccion.addEventListener('mouseleave', function() {
    iniciarAutoavance();
  });
}

/* ----------------------------------------------------------
   INICIALIZAR TODO
   Se ejecuta cuando el HTML termina de cargar
   ---------------------------------------------------------- */
function inicializar() {
  crearTarjetas();
  crearPuntos();

  /* Precargar el fondo del primer destino */
  fondoA.style.backgroundImage = "url('" + DESTINOS[0].img + "')";

  renderizar(0, false);      // mostrar sin animacion al cargar
  configurarEventos();
  iniciarAutoavance();
}

document.addEventListener('DOMContentLoaded', inicializar);



/* ================================================================
   SECCION 3: DATOS DE DESTINOS DESTACADOS
   Estos datos son MOCK (inventados) para la version academica.
   En una version real vendrÃ­an de una base de datos o API.

   Campos:
   - nombre: nombre del destino
   - pais: pais donde esta
   - tag: tipo de viaje
   - compat: porcentaje de compatibilidad (mock)
   - precio: precio estimado en pesos colombianos (mock)
   - img: ruta a la imagen local (carpeta assets/img/)
   - url: pagina de detalle del destino
   ================================================================ */
var DESTINOS_DESTACADOS = [
  {
    nombre  : 'Cartagena',
    pais    : 'Colombia',
    tag     : 'Caribe',
    compat  : 94,
    precio  : 2800000,
    img     : 'assets/img/cartagena.jpg',
    url     : 'pages/catalogos.html'
  },
  {
    nombre  : 'Machu Picchu',
    pais    : 'Peru',
    tag     : 'Aventura',
    compat  : 91,
    precio  : 3500000,
    img     : 'assets/img/machupicchu.jpg',
    url     : 'pages/catalogos.html'
  },
  {
    nombre  : 'Paris',
    pais    : 'Francia',
    tag     : 'Romantico',
    compat  : 88,
    precio  : 5200000,
    img     : 'assets/img/paris.jpg',
    url     : 'pages/catalogos.html'
  },
  {
    nombre  : 'Roma',
    pais    : 'Italia',
    tag     : 'Cultural',
    compat  : 85,
    precio  : 4800000,
    img     : 'assets/img/roma.jpg',
    url     : 'pages/catalogos.html'
  }
];


/* ================================================================
   SECCION 3: GENERAR TARJETAS DE DESTINOS
   Esta funcion crea el HTML de cada tarjeta de destino
   y lo inserta en el #destinosGrid del HTML.

   toLocaleString('es-CO') formatea el numero en pesos colombianos:
   ejemplo: 2800000 -> "2.800.000"
   ================================================================ */
function generarTarjetasDestinos() {
  var grid = document.getElementById('destinosGrid');

  /* Si el elemento no existe (no estamos en index.html), salimos */
  if (!grid) return;

  grid.innerHTML = ''; /* Limpiar por si acaso */

  DESTINOS_DESTACADOS.forEach(function(dest, i) {
    /* Crear el elemento <a> que es el enlace de toda la tarjeta */
    var tarjeta = document.createElement('a');
    tarjeta.href = dest.url;
    tarjeta.classList.add('dest-card', 'animable');

    /* Retraso escalonado: cada tarjeta aparece un poco despues de la anterior */
    tarjeta.dataset.delay = i * 120;

    /* Formatear el precio en pesos colombianos */
    var precioFormateado = '$' + dest.precio.toLocaleString('es-CO');

    /* Construir el HTML interno de la tarjeta */
    tarjeta.innerHTML =
      '<div class="dest-card-img">' +
        '<img src="' + dest.img + '" alt="' + dest.nombre + ', ' + dest.pais + '" loading="lazy">' +
        '<span class="dest-compat-badge">★ ' + dest.compat + '% compat.</span>' +
      '</div>' +
      '<div class="dest-card-info">' +
        '<p class="dest-card-nombre">' + dest.nombre + '</p>' +
        '<p class="dest-card-pais">' + dest.pais + ' — ' + dest.tag + '</p>' +
        '<div class="dest-card-footer">' +
          '<div class="dest-card-precio">' +
            '<span>Desde</span>' +
            '<strong>' + precioFormateado + '</strong>' +
          '</div>' +
          '<span class="dest-card-link">Ver mas →</span>' +
        '</div>' +
      '</div>';

    grid.appendChild(tarjeta);
  });
}


/* ================================================================
   SECCION 4: BUSCADOR TRADICIONAL
   Maneja los clics en las pestanas (Vuelo / Hotel / Paquete)
   y el envio del formulario.
   ================================================================ */
function inicializarBuscador() {
  var formulario = document.getElementById('formBuscador');
  var tabs       = document.querySelectorAll('.tab-btn');

  /* Si no existe el formulario, no estamos en index.html */
  if (!formulario) return;

  /* --- Logica de las pestanas --- */
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      /* Quitar clase 'activo' de todos los tabs */
      tabs.forEach(function(t) { t.classList.remove('activo'); });
      /* Agregar clase 'activo' solo al tab que se hizo clic */
      tab.classList.add('activo');

      /*
         Aqui podriamos mostrar/ocultar campos segun la pestana activa.
         Por ahora el formulario es el mismo para todos.
         En el futuro: si tab es "hotel", ocultar "Fecha de regreso", etc.
      */
    });
  });

  /* --- Envio del formulario --- */
  formulario.addEventListener('submit', function(e) {
    e.preventDefault(); /* Evitar que la pagina recargue (comportamiento por defecto) */

    /* Leer los valores de los campos */
    var origen    = document.getElementById('origen').value.trim();
    var destino   = document.getElementById('destinoBusq').value.trim();
    var fechaIda  = document.getElementById('fechaIda').value;
    var pasajeros = document.getElementById('pasajeros').value;

    /* Validacion basica: al menos origen y destino son requeridos */
    if (!origen || !destino) {
      alert('Por favor ingresa el origen y el destino.');
      return;
    }

    /*
       Construir la URL de destino con los parametros de busqueda.
       encodeURIComponent() convierte caracteres especiales para la URL.
       Ejemplo: "Ciudad de Mexico" -> "Ciudad%20de%20Mexico"
    */
    var url = 'pages/catalogos.html' +
              '?origen='   + encodeURIComponent(origen) +
              '&destino='  + encodeURIComponent(destino) +
              '&ida='      + encodeURIComponent(fechaIda) +
              '&personas=' + encodeURIComponent(pasajeros);

    /* Redirigir a catalogos.html con los parametros de busqueda */
    window.location.href = url;
  });
}


/* ================================================================
   SECCION 5: SORPRENDEME
   Cuando el usuario hace clic en "Sorprendeme", elegimos un
   destino al azar del array DESTINOS (el del carrusel) y lo
   enviamos a la pagina de sorprendeme con ese destino.
   ================================================================ */
function inicializarSorprendeme() {
  var boton = document.getElementById('btnSorprendeme');
  if (!boton) return;

  boton.addEventListener('click', function() {
    /* Math.random() devuelve un numero entre 0 y 1 (sin incluir el 1) */
    /* Multiplicamos por TOTAL y usamos Math.floor para obtener un entero */
    /* Resultado: un indice aleatorio entre 0 y TOTAL-1 */
    var indiceAleatorio = Math.floor(Math.random() * TOTAL);
    var destinoElegido  = DESTINOS[indiceAleatorio];

    /*
       Efecto visual antes de navegar:
       El boton muestra un mensaje de "cargando" por 1.5 segundos
       y luego navega a la pagina del destino sorpresa.
    */
    var textoOriginal = boton.querySelector('.btn-s-texto').textContent;
    boton.querySelector('.btn-s-texto').textContent = '✨ Eligiendo...';
    boton.disabled = true; /* Desactivar para evitar doble clic */

    setTimeout(function() {
      /* Redirigir a sorprendeme.html con el destino elegido */
      var url = 'pages/sorprendeme.html' +
                '?destino=' + encodeURIComponent(destinoElegido.nombre) +
                '&pais='    + encodeURIComponent(destinoElegido.pais);
      window.location.href = url;
    }, 1500);
  });
}


/* ================================================================
   SECCION 6: ANIMACIONES AL HACER SCROLL
   IntersectionObserver es una API del navegador que nos avisa
   cuando un elemento entra en el area visible de la pantalla.

   Sin esto, tendriamos que calcular la posicion del scroll
   manualmente en cada evento 'scroll', lo que es muy costoso
   para el rendimiento.

   Con IntersectionObserver, el navegador hace ese calculo
   de forma eficiente y nos llama solo cuando algo cambia.
   ================================================================ */
function inicializarAnimacionesScroll() {
  /*
     Seleccionar todos los elementos con la clase .animable.
     Son los que queremos animar al hacer scroll.
  */
  var elementosAnimables = document.querySelectorAll('.animable');

  if (elementosAnimables.length === 0) return;

  /*
     Crear el observador.
     La funcion callback se llama cuando un elemento
     entra o sale del area visible.

     entries: la lista de elementos que cambiaron
     observer: el observador mismo (para dejarlo de usar si es necesario)
  */
  var observador = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      /*
         entry.isIntersecting es true cuando el elemento
         es visible en la pantalla.
      */
      if (entry.isIntersecting) {
        var elemento = entry.target;

        /*
           Si el elemento tiene data-delay, esperamos ese tiempo
           antes de agregar la clase .visible.
           Esto crea el efecto escalonado donde cada tarjeta
           aparece un poco despues de la anterior.
        */
        var retraso = parseInt(elemento.dataset.delay) || 0;

        setTimeout(function() {
          elemento.classList.add('visible');
        }, retraso);

        /*
           Dejar de observar este elemento una vez que se animo.
           Si no hacemos esto, el observador seguiria activo
           y el elemento se volveria a animar si sube y baja.
        */
        observador.unobserve(elemento);
      }
    });
  }, {
    /*
       threshold: 0.15 significa que el observador se activa
       cuando el 15% del elemento es visible en pantalla.
       Un valor de 0 se activa apenas el elemento aparece.
       Un valor de 1 se activa cuando el elemento es 100% visible.
    */
    threshold: 0.15
  });

  /*
     Decirle al observador que vigile cada elemento animable.
  */
  elementosAnimables.forEach(function(el) {
    observador.observe(el);
  });
}


/* ================================================================
   AGREGAR LAS NUEVAS FUNCIONES A LA INICIALIZACION PRINCIPAL
   ================================================================

   Modificamos la funcion inicializar() que ya existe
   para que tambien llame a las nuevas funciones.

   NOTA: Este codigo REEMPLAZA la funcion inicializar() original.
   Si copias este archivo completo, elimina la funcion
   inicializar() anterior.
   ================================================================ */
document.removeEventListener('DOMContentLoaded', inicializar);

document.addEventListener('DOMContentLoaded', function() {
  /* === Inicializar el carrusel hero (ya existia) === */
  crearTarjetas();
  crearPuntos();
  fondoA.style.backgroundImage = "url('" + DESTINOS[0].img + "')";
  renderizar(0, false);
  configurarEventos();
  iniciarAutoavance();

  /* === Inicializar las nuevas secciones === */
  generarTarjetasDestinos();   /* SecciÃ³n 3: tarjetas de destinos */
  inicializarBuscador();       /* SecciÃ³n 4: formulario de bÃºsqueda */
  inicializarSorprendeme();    /* SecciÃ³n 5: botÃ³n sorprÃ©ndeme */
  inicializarAnimacionesScroll(); /* SecciÃ³n 6: animaciones scroll */
});
