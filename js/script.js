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
