# 🌍 TravelMate — Tu Compañero Inteligente de Viajes

> **Slogan:** *"No sabes a dónde viajar. Descubre tu próximo viaje."*  
> **Diferencial:** *"Las demás plataformas empiezan preguntando '¿A dónde quieres ir?'; TravelMate empieza preguntando '¿Qué quieres vivir?'"*

---

## 📌 1. Información del Proyecto

* **Institución:** Universidad Católica Luis Amigó / CESDE
* **Semestre:** Segundo Semestre
* **Asignatura:** Electiva 1 - Programación Web
* **Proyecto:** TravelMate (Prototipo Front-End v0.4)
* **Stack Tecnológico:** HTML5 Semántico, CSS3 (perspectiva 3D, Flexbox y Grid) y JavaScript Vanilla (sin frameworks ni librerías externas).

---

## 🧭 2. Propósito y Enfoque

TravelMate es una plataforma web orientada a transformar la forma en que las personas planifican sus vacaciones. A diferencia de las agencias tradicionales que asumen que el usuario ya sabe a dónde ir, TravelMate analiza:
1. **La experiencia deseada:** Aventura, descanso en playa, inmersión cultural, gastronomía o romance.
2. **El presupuesto real:** Estimación y desglose en pesos colombianos (COP).
3. **El tipo de compañía:** Viajero solitario, en pareja, con amigos, familia o adultos mayores.
4. **Compatibilidad personalizada:** Porcentaje de afinidad calculado entre el perfil del viajero y cada destino.

---

## 📁 3. Estructura de Archivos y Carpetas

```text
TRAVELMATE.0.1/
├── index.html               # Página principal (Landing Page con 6 secciones completas)
├── README.md                # Documentación oficial y bitácora del proyecto
├── css/
│   ├── style.css            # Hoja de estilos principal, responsive y comentada
│   └── style.backup.css     # Copia de seguridad de estilos previa
├── js/
│   └── script.js            # Lógica completa: carrusel 3D, buscador, sorpréndeme y scroll
├── assets/
│   └── img/                 # Imágenes locales en alta resolución (sin enlaces externos)
│       ├── cartagena.jpg
│       ├── machupicchu.jpg
│       ├── mexicocity.jpg
│       ├── buenosaires.jpg
│       ├── paris.jpg
│       ├── barcelona.jpg
│       └── roma.jpg
└── pages/                   # Módulos y vistas del proyecto
    ├── cuestionario.html    # Motor de preguntas para descubrir el viaje
    ├── catalogos.html       # Catálogo general de destinos y filtros
    ├── preferencias.html    # Configuración de intereses del viajero
    ├── presupuestos.html    # Desglose y estimación económica
    ├── itinerario.html      # Planificador día a día
    ├── actividades.html     # Actividades y experiencias recomendadas
    ├── compatibilidad.html  # Detalle de cálculo de afinidad
    ├── sorprendeme.html     # Destino sorpresa aleatorio
    ├── favoritos.html       # Guardados del usuario
    ├── viajes.html          # Historial de viajes planificados
    ├── cuenta.html          # Panel de perfil de usuario
    └── login.html           # Inicio de sesión / Registro
```

---

## 🚀 4. Módulos Implementados en la Página Principal (`index.html`)

### 1. Encabezado Flotante y Menú Desplegable (Dropdowns)
* Header con clase `encabezado--hero` que flota con fondo transparente sobre la sección oscura.
* Logotipo de marca en tipografía *Georgia italic*.
* Menús desplegables en cascada (*Hover Dropdowns*) organizados en: Descubrir, Destinos, Recomendaciones, Planificador y Perfil.
* Botón destacado de ingreso rápido (*Login*).

### 2. Sección 1: Hero con Carrusel 3D Interactivo
* **Efecto visual 3D:** 7 destinos organizados en perspectiva cónica y profundidad con `transform: scale()` y `rotateY()`.
* **Crossfade de fondo dinámico:** La imagen de fondo de pantalla completa cambia sincronizadamente con la tarjeta central mediante un suave fundido fotográfico (*blur* y atenuación de contraste).
* **Navegación multimodal:** Flechas laterales con efecto cristal (*glassmorphism*), cápsulas indicadoras inferiores, teclas de dirección (`←` / `→`) y soporte para gestos táctiles (*swipe*) en móviles.
* **Autoavance inteligente:** Rota cada 5.5 segundos y se pausa automáticamente al colocar el cursor encima.

### 3. Sección 2: ¿Cómo funciona? (El Proceso en 3 Pasos)
* Tarjetas estructuradas con números de gran formato y emojis descriptivos:
  * **01 🎯 Cuéntanos qué quieres vivir:** Cuestionario de gustos, tiempo y presupuesto.
  * **02 🔍 TravelMate analiza tu perfil:** Motor de cálculo y afinidad.
  * **03 ✈️ Recibe tu viaje perfecto:** Destinos recomendados, itinerario sugerido y costo en COP.

### 4. Sección 3: Destinos Destacados (Grid Dinámico en JS)
* Tarjetas generadas mediante JavaScript desde un arreglo de datos locales (`DESTINOS_DESTACADOS`).
* Cada tarjeta cuenta con imagen local, etiqueta de categoría, insignia de **porcentaje de compatibilidad** (ej. ★ 94%), precio base formateado en moneda colombiana (`COP`) y botón de exploración.

### 5. Sección 4: Buscador Tradicional
* Pensado para aquellos viajeros que ya saben exactamente a dónde quieren ir.
* Selector de pestañas para **Vuelo ✈️**, **Hotel 🏨** y **Paquete 🎒**.
* Formulario completo con campos de Origen, Destino, Fechas de ida y vuelta, y número de Pasajeros con validación nativa en JavaScript.

### 6. Sección 5: Modo "Sorpréndeme" ✨
* Diseñado para el usuario que desea explorar sin ataduras.
* Fondo nocturno inmersivo con botón animado con efecto de pulso luminoso (`@keyframes pulsarBoton`).
* Al dar clic, el motor en `script.js` selecciona aleatoriamente un destino del catálogo y redirige con los parámetros listos.

### 7. Sección 6: El Diferencial TravelMate (Tabla Comparativa)
* Comparación frente a frente: **Otras Agencias vs. TravelMate**.
* Resalta la transición de *"buscar ciudades en una lista interminable"* hacia *"descubrir vivencias personalizadas con plan y presupuesto resuelto"*.

### 8. Pie de Página (Footer)
* Distribución modular en 4 columnas: Marca, Enlaces de exploración, Herramientas de planificación y Nota legal/académica sobre los valores estimados.

---

## 📱 5. Diseño Adaptativo (Responsive Design)

El proyecto cuenta con reglas de adaptación específicas:
* **Escritorio (> 1200px):** Carrusel completo en 5 niveles de profundidad visible, menús desplegables y cuadrícula de 4 columnas.
* **Tablets (768px - 1024px):** Ajuste de dimensiones de tarjetas, cuadrícula de destinos a 2 columnas y pasos secuenciales reorganizados.
* **Móviles (<= 600px):** Navegación simplificada, carrusel focalizado en tarjeta activa y laterales inmediatas, pasos en columna vertical con conectores rotados a 90° y botones táctiles optimizados (> 44px de área de pulsación).

---

## 🛠️ 6. Bitácora de Versiones y Cambios (Changelog)

| Versión | Fecha | Descripción de Cambios Realizados |
| :--- | :--- | :--- |
| **v0.1** | Inicial | Estructura base del proyecto y creación de las páginas HTML secundarias. |
| **v0.2** | Sep 2026 | Creación del Hero Carrusel 3D con crossfade de fondo sincronizado. |
| **v0.3** | Sep 2026 | Descarga y vinculación de imágenes locales en `assets/img/`. Eliminación de dependencias de internet. |
| **v0.4** | Sep 2026 | Limpieza de entidades HTML por emojis nativos (🎯, 🔍, ✈️). Implementación de las 6 secciones completas en `index.html` (Cómo funciona, Destinos en JS, Buscador, Sorpréndeme, Comparativa y Animaciones de Scroll). |

---

## 💡 7. Próximos Pasos Sugeridos

1. [ ] Conectar la página de **Cuestionario** (`pages/cuestionario.html`) para calcular respuestas en tiempo real.
2. [ ] Desarrollar la vista de **Catálogo Detallado** con filtros por presupuesto y tipo de clima/turismo.
3. [ ] Implementar el generador de **Itinerarios y Presupuestos** dinámico.
