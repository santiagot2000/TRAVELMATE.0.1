# 🌍 TravelMate — Documentación Técnica y Funcional del Aplicativo

> **Slogan:** *"No sabes a dónde viajar. Descubre tu próximo viaje."*  
> **Diferencial:** *"Las demás plataformas empiezan preguntando '¿A dónde quieres ir?'; TravelMate empieza preguntando '¿Qué quieres vivir?'"*

---

## 📌 1. Información del Proyecto

* **Institución:** Universidad Católica Luis Amigó / CESDE
* **Semestre:** Segundo Semestre
* **Asignatura:** Electiva 1 - Programación Web
* **Proyecto:** TravelMate (Prototipo Front-End v1.2)
* **Stack Tecnológico:** HTML5 Semántico, CSS3 (perspectiva 3D, Flexbox y Grid) y JavaScript Vanilla (sin frameworks ni librerías externas).

---

## ⚙️ 2. Especificación de Requerimientos Funcionales (Funciones del Aplicativo)

### **RF-01: Hero Carrusel 3D e Impacto Visual Inicial**
* **Descripción:** Presentación interactiva de destinos destacados en 3D en la pantalla de inicio.
* **Comportamiento:** Las tarjetas giran en perspectiva 3D (`transform: scale() rotateY()`). La foto de fondo de pantalla completa cambia sincronizadamente con efecto de fundido fotográfico (*crossfade/blur*).
* **Entradas/Eventos:** Clic en tarjetas laterales, botones de dirección, flechas del teclado (`←` / `→`), gestos táctiles (*swipe*) o temporizador de autoavance (5.5s).

### **RF-02: Motor de Afinidades y Cuestionario Interactivo**
* **Descripción:** Algoritmo en 4 pasos que calcula el porcentaje de compatibilidad entre las preferencias del usuario y los destinos.
* **Comportamiento:** 
  1. *Paso 1:* Captura origen y duración del viaje.
  2. *Paso 2:* Define la compañía (Solo, Pareja, Amigos, Familia).
  3. *Paso 3:* Define el rango de presupuesto en pesos colombianos (COP).
  4. *Paso 4:* Selección múltiple de intereses (Playa, Cultura, Gastronomía, Aventura, Romance, Fiesta, Naturaleza).
* **Salida:** Animación de cálculo (*matching*) y despliegue del **Top 3 de destinos recomendados** con medallas (🥇, 🥈, 🥉), insignias de compatibilidad (ej. ★ 95%) y desglose económico.

### **RF-03: Catálogo Multicriterio con Búsqueda en Tiempo Real**
* **Descripción:** Módulo de exploración global con 28 destinos de los 5 continentes (América del Sur, América del Norte, Europa, Asia, África y Oceanía).
* **Comportamiento:** 
  * *Búsqueda instantánea:* Filtra en vivo mientras el usuario escribe la ciudad o país en el buscador.
  * *Filtrado por categorías:* Botones tipo chip (*Playa, Cultura, Aventura, Gastronomía, Romance, Fiesta*).
  * *Filtro de presupuesto:* Selector por rangos en COP (*Económico < $3M, Moderado $3M-$5M, Premium > $5M*).
  * *Ordenamiento:* Selector dinámico por *Recomendados, Mayor compatibilidad, Menor precio y Mayor precio*.

### **RF-04: Sistema de Modales Personalizados (Alertas)**
* **Descripción:** Sustitución de los `alert()` nativos por un modal emergente centrado.
* **Comportamiento:** Muestra una ventana con fondo desenfocado (*backdrop blur*), icono, mensaje claro y botón de acción. Se cierra mediante botón, clic externo o tecla `Escape`.

### **RF-05: Enlace Dinámico por URL (Deep Linking)**
* **Descripción:** Conexión transparente entre el buscador de la página de inicio y el catálogo.
* **Comportamiento:** Al enviar una búsqueda desde el formulario tradicional de la home, el catálogo lee los parámetros de la URL (`?destino=...`) y aplica la búsqueda de inmediato al cargar.

### **RF-06: Vista Detallada de Destino e Inteligencia de Viaje (`pages/detalle.html`)**
* **Descripción:** Pantalla detallada de cada destino con desglose económico, itinerario diario y tres secciones especializadas:
  1. *Sección 7 — Gastronomía Típica:* Muestra los platillos autóctonos de la región con precios promedios e íconos temáticos.
  2. *Sección 8 — Festividades y Calendario Cultural:* Detecta en tiempo real el mes actual del sistema (`new Date().getMonth()`) para destacar los carnavales y eventos vigentes en la fecha de consulta, junto a un calendario anual completo.
  3. *Sección 9 — Las 4 Estaciones del Año:* Muestra la guía climática de Primavera 🌸, Verano ☀️, Otoño 🍁 e Invierno ❄️ con rango de meses, temperaturas y recomendaciones de vestimenta ("🎒 Qué llevar").

### **RF-07: Modo Oscuro y Navegación Flotante Global (`js/global.js`)**
* **Descripción:** Widget flotante ubicado en la parte inferior derecha de todas las pantallas con dos controles esenciales:
  1. *Alternador de Modo Oscuro (🌙 / ☀️):* Cambia los colores del tema de la aplicación con persistencia en `localStorage`.
  2. *Botón Volver Arriba (⬆️):* Flecha inteligente que aparece dinámicamente cuando el usuario desciende más de 280px en el scroll y realiza un movimiento suave (*smooth scroll*) hacia el inicio de la página.

---

## 💻 3. Diccionario de Funciones del Código (Manual de Métodos JavaScript)

### **A. Módulo Global (`js/global.js`)**

* **`aplicarTema(esOscuro)`**: Alterna la clase `modo-oscuro` en el `body`, actualiza el icono del botón (🌙 / ☀️) y guarda la preferencia en `localStorage.setItem('travelmate_tema', ...)`.
* **`Inyección de Contenedor Flotante`**: Crea dinámicamente el widget `#flotantesDerecha` en el DOM para alojar el botón de Modo Oscuro y el botón Volver Arriba en todas las páginas.
* **`Evento Scroll & Smooth Scroll`**: Detecta el desplazamiento del usuario (`window.scrollY > 280`) para mostrar u ocultar la flecha flotante y ejecuta `window.scrollTo({ top: 0, behavior: 'smooth' })`.

### **B. Módulo Principal (`js/script.js`)**

* **`crearTarjetas()`**: Genera dinámicamente en el DOM las tarjetas del carrusel 3D a partir del arreglo de datos `DESTINOS`.
* **`renderizar(nuevoIndice, animar)`**: Calcula la distancia relativa de cada tarjeta al centro y asigna las clases CSS de posición (`pos-center`, `pos-left`, `pos-right`, etc.).
* **`actualizarFondo()`**: Intercambia la visibilidad de dos contenedores de fondo (`#fondoA` y `#fondoB`) aplicando *crossfade* de opacidad.
* **`iniciarAutoavance()` / `reiniciarAutoavance()`**: Maneja el temporizador de rotación automática del carrusel cada 5.5 segundos.
* **`mostrarModal(titulo, mensaje, icono)`**: Despliega el modal emergente con fondo bloqueado y contenido dinámico.
* **`cerrarModal()`**: Oculta el modal de alerta y restaura el scroll.
* **`inicializarAnimacionesScroll()`**: Utiliza la API `IntersectionObserver` para activar la clase `.visible` en elementos `.animable` a medida que el usuario hace scroll.

### **C. Módulo de Cuestionario (`js/cuestionario.js`)**

* **`actualizarWizard()`**: Gestiona el paso activo (1 al 4) del cuestionario, actualizando la barra de progreso y la visibilidad de los botones *Anterior / Siguiente / Finalizar*.
* **`calcularCompatibilidad(respuestas)`**: Algoritmo de ponderación que evalúa presupuesto, compañía e intereses para asignar un porcentaje de afinidad (72% a 98%) a cada destino.
* **`mostrarResultados(mejoresMatches, respuestas)`**: Construye el HTML de las tarjetas ganadoras con sus respectivas medallas e información presupuestal.

### **D. Módulo de Catálogo (`js/catalogo.js`)**

* **`aplicarFiltros()`**: Evalúa simultáneamente el texto del buscador, la categoría seleccionada, el rango de presupuesto y aplica el criterio de ordenamiento activo sobre el arreglo `CATALOGO_DESTINOS`.
* **`renderizarDestinos(destinos)`**: Renderiza las tarjetas resultantes en `#catalogoGrid` o muestra la vista `#estadoVacio` si no hay coincidencias.

### **E. Módulo de Vista de Detalle (`js/detalle.js`)**

* **`obtenerDetalleDestino(nombreBuscado)`**: Busca la información enriquecida del destino en `BASE_DETALLES` o genera un paquete completo de respaldo asignando imagen única desde `MAPA_IMAGENES` y detectando el mes real del sistema.
* **`cargarPantallaDetalle(datosDestino)`**: Inyecta dinámicamente en el DOM los datos del banner hero, rápida información general, presupuesto desglosado, itinerario timeline, tarjetas gastronómicas (Sección 7), festividad del mes real y calendario anual (Sección 8), y las tarjetas de las 4 estaciones del año (Sección 9).

---

## 🗄️ 4. Modelo de Datos del Aplicativo (Esquema de Destino)

Cada destino dentro del sistema está representado por un objeto estandarizado (compatible con futuras tablas en MySQL / SQL Server):

```javascript
{
  id: String,             // Identificador único (ej. 'cartagena')
  nombre: String,         // Nombre oficial del destino
  pais: String,           // País de ubicación
  img: String,            // Ruta a la imagen local en assets/img/
  tag: String,            // Etiqueta temática (ej. '#Caribe')
  categorias: Array,      // Categorías asociadas (['playa', 'cultura', 'gastronomia'])
  precio: Number,         // Precio estimado base en pesos colombianos (COP)
  compatibilidad: Number, // Porcentaje de afinidad base (ej. 95)
  duracion: String,       // Duración sugerida (ej. '3 a 5 días')
  descripcion: String     // Resumen descriptivo del destino
}
```

---

## 📁 5. Estructura de Archivos del Proyecto

```text
TRAVELMATE.0.1/
├── index.html               # Landing Page (Hero 3D, 6 Secciones y Modal)
├── README.md                # Documentación Técnica y Funcional Oficial
├── css/
│   ├── style.css            # Estilos globales, carrusel 3D, modo oscuro y botón volver arriba
│   ├── login.css            # Estilos exclusivos de la pantalla dividida de Login / Registro
│   ├── admin.css            # Estilos dedicados del Panel de Administración TravelMate
│   └── style.backup.css     # Copia de seguridad de estilos
├── js/
│   ├── global.js            # Lógica global: Modo oscuro (localStorage), botón volver arriba y estado de sesión
│   ├── script.js            # Lógica de la home, carrusel 3D, modal y scroll
│   ├── cuestionario.js      # Lógica del wizard de afinidades y matching
│   ├── catalogo.js          # Lógica de búsqueda, filtros y ordenamiento del catálogo
│   ├── detalle.js           # Lógica dinámica de detalles, gastronomía, eventos en tiempo real y 4 estaciones
│   ├── login.js             # Lógica de login/registro, validaciones, seguridad y persistencia localStorage
│   └── panel.js             # Control maestro del Panel Admin: CRUD usuarios/paquetes, roles y métricas
├── assets/
│   └── img/                 # 28 Imágenes locales en alta definición para todos los destinos
└── pages/
    ├── cuestionario.html    # Motor de preguntas para descubrir el viaje
    ├── catalogos.html       # Catálogo global de destinos (28 destinos)
    ├── detalle.html         # Vista detallada del destino seleccionado
    ├── login.html           # Vista de autenticación mundial (login / registro)
    ├── panelAdmin.html      # Panel de control de Super Admin, Administradores y Trabajadores
    └── ...                  # Módulos secundarios
```

---

## 🛠️ 6. Historial de Versiones (Changelog)

| Versión | Fecha | Resumen de Funcionalidades Implementadas |
| :--- | :--- | :--- |
| **v0.1** | Inicial | Estructura base del proyecto y plantillas iniciales. |
| **v0.2** | Sep 2026 | Hero Carrusel 3D con crossfade de fondo en la home. |
| **v0.3** | Sep 2026 | Integración de imágenes locales en `assets/img/`. |
| **v0.4** | Sep 2026 | Implementación de las 6 secciones principales en `index.html`. |
| **v0.5** | Sep 2026 | Módulo interactivo de Cuestionario (`cuestionario.html` y `cuestionario.js`) con motor de afinidad. |
| **v0.6** | Sep 2026 | Módulo de Catálogo de Destinos (`catalogos.html` y `catalogo.js`) con filtros y ordenamiento. |
| **v0.7** | Sep 2026 | Reemplazo de `alert()` por sistema de Modales Interactivos personalizados (`mostrarModal()`). |
| **v0.8** | Sep 2026 | Expansión del catálogo a 24 destinos internacionales. |
| **v0.9** | Sep 2026 | Cobertura global en los 5 continentes (28 destinos) y redacción de la **Documentación Técnica y Funcional Formal**. |
| **v1.0** | Sep 2026 | Implementación de la Vista de Detalle (`detalle.html`), Sección 7 (Gastronomía) y Sección 8 (Festividades). |
| **v1.1** | Sep 2026 | Detección del mes actual (`new Date()`), 28 imágenes únicas por destino y **Sección 9: Las 4 Estaciones del Año**. |
| **v1.2** | Sep 2026 | Módulo global `js/global.js`: **Modo Oscuro (Dark Mode)** con persistencia en `localStorage` y **Botón Flotante Flecha "Volver Arriba"** (`window.scrollTo({ top: 0, behavior: 'smooth' })`). |
| **v1.3** | Oct 2026 | **Módulo de Autenticación de Nivel Mundial**: Separación limpia en `pages/login.html`, `css/login.css` y `js/login.js`. Integración del estado de sesión en la barra de navegación global (`js/global.js`), mostrando píldora de usuario con avatar y menú desplegable para cerrar sesión. |
| **v1.4** | Oct 2026 | **Suite de Administración y Control Maestro**: Implementación completa de `pages/panelAdmin.html`, `css/admin.css` y `js/panel.js`. Control jerárquico de roles (*Super Admin, Administrador, Trabajador, Cliente*), métricas dinámicas (KPIs), CRUD de usuarios y paquetes turísticos, filtros en tiempo real y enlace directo desde el menú de navegación. |


