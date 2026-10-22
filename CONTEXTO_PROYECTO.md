# ROSI STUDIO — Contexto Integral y Estado del Proyecto

> **Fecha de creación del documento:** 21 de octubre de 2026  
> **Estado actual:** Etapa 1 completada + **Rediseño UX/UI Mobile App First (PWA-Ready) completado con éxito.**  
> **Propósito:** Registrar todos los requisitos, decisiones arquitectónicas, código implementado, configuraciones pendientes y próximos pasos para retomar el desarrollo en cualquier momento sin pérdida de alcance.

---

## 1. Visión del Proyecto y Requisitos Principales

**ROSI STUDIO — Expertos en Belleza** es una aplicación web responsiva pensada para un negocio de belleza y barbería (cortes de varón y dama, trenzas africanas y pegadas, manicure rusa y semipermanente, pedicure spa, tintes, mechas balayage, peinados y diseño de cejas, además de venta de productos capilares).

### Objetivos Clave
- **Mobile-first:** Experiencia óptima en teléfonos inteligentes (Android y iPhone), adaptable a tablets y computadoras de escritorio.
- **Elegancia y Confianza:** Diseño visual refinado y luminoso que transmite profesionalismo e higiene.
- **Cero Costos Iniciales:** Arquitectura adaptada para mantenerse estrictamente en el **plan gratuito Spark de Firebase**.
- **Flujo Guiado de Citas:** Selección de servicios, cálculo acumulativo de tiempo y precio, modalidad (local o domicilio), selector inteligente de turnos libres y confirmación con estado **Pendiente de Aprobación**.
- **Panel Administrativo Privado:** Dashboard con indicadores en tiempo real, gestión de estados de citas (`PENDIENTE`, `ACEPTADA`, `RECHAZADA`, `COMPLETADA`, `CANCELADA`), visualización de horarios y configuración.

---

## 2. Identidad Visual y Sistema de Diseño

### Paleta de Colores Oficial
- **Fondo principal marfil:** `#F8F6F2` (Luminoso, limpio y espacioso).
- **Dorado de marca (acento):** `#C9A34E` (Botones de acción, realces y detalles selectos).
- **Negro elegante:** `#171717` (Cabeceras de contraste, pie de página, botones secundarios).
- **Beige secundario:** `#E9E1D4` (Fondos suaves, tarjetas secundarias y divisores sutiles).
- **Blanco para tarjetas:** `#FFFFFF` (Superficies principales con bordes sutiles `#E5E0D8`).
- **Gris para textos secundarios:** `#6B6863` (Alta legibilidad y contraste adecuado).

### Tipografías (Google Fonts optimizadas con Next.js)
- **Playfair Display (`--font-playfair`):** Títulos principales, encabezados (`h1`, `h2`, `h3`) y nombres de especialidades.
- **Lato (`--font-lato`):** Textos de lectura, botones, formularios, tablas y navegación.

### Logotipo de la Marca
- Se implementó el componente vectorial [BrandLogo.tsx](file:///Users/roy-asmad/Documents/Web/RosiStudio/src/components/layout/BrandLogo.tsx) que reproduce fielmente el sello circular negro con doble anillo dorado, tipografía serif dorada para `ROSI STUDIO` y el lema `EXPERTOS EN BELLEZA`.

---

## 3. Pila Tecnológica y Configuración

- **Framework:** Next.js 16.4.2 con **App Router**, Turbopack y Renderizado Parcial (PPR).
- **Lenguaje:** TypeScript 5.
- **Estilos:** Tailwind CSS v4 configurado en [globals.css](file:///Users/roy-asmad/Documents/Web/RosiStudio/src/app/globals.css) con tokens temáticos (`--color-marfil`, `--color-gold`, etc.).
- **Autenticación:** Firebase Authentication (Google OAuth y verificación de administradoras).
- **Base de Datos:** Cloud Firestore.
- **Iconografía:** `lucide-react`.
- **Control de Versiones:** Git inicializado con commit inicial `feat: initial release of Rosi Studio web booking and management app`.

---

## 4. Estructura de Archivos del Proyecto

```text
/Users/roy-asmad/Documents/Web/RosiStudio/
├── .env.example                          # Plantilla de variables de entorno para Firebase
├── .gitignore                            # Exclusión de credenciales sensibles y artefactos
├── firestore.rules                       # Reglas de seguridad de mínimo privilegio para Firestore
├── firestore.indexes.json                # Índices compuestos para consultas de citas
├── package.json                          # Dependencias: next, react 19, firebase, lucide-react, tailwindcss v4
├── tsconfig.json                         # Configuración estricta de TypeScript
├── CONTEXTO_PROYECTO.md                  # Este documento de contexto integral
├── public/
│   ├── manifest.json                     # PWA Web App Manifest (standalone, theme_color, icons)
│   └── icon.svg                          # Emblema oficial en SVG para icono de aplicación
└── src/
    ├── types/
    │   └── index.ts                      # Interfaces de Dominio (Service, Product, Appointment, etc.)
    ├── lib/
    │   ├── availability.ts               # Motor de cálculo de turnos y prevención de colisiones
    │   ├── firebase/
    │   │   ├── config.ts                 # Inicialización condicional y segura de Firebase
    │   │   ├── auth.ts                   # Servicio de Google OAuth y verificación de roles
    │   │   └── firestore.ts              # Repositorio CRUD con fallback de memoria demo
    │   └── data/
    │       ├── demo-data.ts              # Catálogo inicial de servicios, productos, horarios y negocio
    │       └── demo-appointments.ts      # Citas de prueba deterministas para el panel admin
    ├── components/
    │   ├── layout/
    │   │   ├── BrandLogo.tsx             # Emblema circular oficial
    │   │   ├── AppHeader.tsx             # Cabecera compacta app móvil / barra horizontal desktop
    │   │   ├── BottomNav.tsx             # Barra fija inferior móvil de 5 pestañas (Safe-Area)
    │   │   ├── Navbar.tsx                # Re-export de AppHeader para retrocompatibilidad
    │   │   ├── Footer.tsx                # Pie de página con información de contacto y horarios
    │   │   └── WhatsAppButton.tsx        # Componente desactivado (WhatsApp removido)
    │   ├── home/
    │   │   ├── MobileAppHero.tsx         # Tarjeta de acción inmediata VIP con botón "Reservar cita"
    │   │   ├── CategoryChips.tsx         # Fila táctil de acceso rápido a categorías (scroll horizontal)
    │   │   ├── PopularServicesScroll.tsx # Carrusel snap de servicios populares
    │   │   ├── LooksGalleryScroll.tsx    # Historias/looks recientes realizados
    │   │   ├── ProductsScroll.tsx        # Carrusel de productos recomendados disponibles en salón
    │   │   └── CompactSalonInfo.tsx      # Información compacta del local y atención a domicilio
    │   └── booking/
    │       └── BookingWizard.tsx         # Asistente interactivo de reserva (5 pasos + éxito)
    └── app/
        ├── layout.tsx                    # Shell raíz con metadata PWA, viewportFit cover y fuentes
        ├── globals.css                   # Tokens, safe-area padding inferior y no-scrollbar utilities
        ├── page.tsx                      # Pantalla de Inicio estilo App Móvil
        ├── servicios/page.tsx            # Catálogo móvil con chips de categoría y buscador reactivo
        ├── productos/page.tsx            # Catálogo de productos disponibles en el salón
        ├── reservar/page.tsx             # Asistente de reserva adaptado a teléfonos
        ├── citas/page.tsx                # "Mis Citas" con filtros por estado y buscador por código
        ├── citas/[id]/page.tsx           # Consulta directa y seguimiento de cita específica
        ├── perfil/page.tsx               # Perfil de usuario, Google Auth y menú de cuenta
        └── admin/page.tsx                # Panel de administración con vista dual (tarjetas móvil / tabla desktop)
```

---

## 5. Rediseño UX/UI — Enfoque Mobile App First (PWA-Ready)

En esta etapa se transformó la experiencia web convencional en una **interfaz de aplicación móvil nativa (PWA)**, optimizada para anchos de pantalla táctil entre **360px y 430px** (iPhone / Android), manteniendo total funcionalidad en computadoras de escritorio.

### A. Barra de Navegación Fija Inferior (`BottomNav.tsx`)
- **5 destinos clave:** `Inicio`, `Servicios`, `Reservar`, `Mis Citas` y `Perfil`.
- **Botón Reservar Destacado:** Posicionado en el centro en color dorado de marca (`#C9A34E`) con sombra suave y elevación ergonómica al alcance directo del pulgar.
- **Respeto a Áreas Seguras:** Implementa `env(safe-area-inset-bottom)` y clase de padding inferior global `pb-[calc(4.5rem+env(safe-area-inset-bottom))]` en móviles para garantizar que el contenido nunca quede oculto detrás de la barra.
- **Comportamiento en Escritorio:** Se oculta automáticamente en pantallas grandes (`md:hidden`), delegando la navegación al menú horizontal de `AppHeader`.

### B. Encabezado Compacto de Aplicación (`AppHeader.tsx`)
- Sustituye la cabecera corporativa pesada por una barra superior limpia y de baja altura (56px) con:
  - Logotipo vectorial `ROSI STUDIO` a la izquierda.
  - Indicador de ubicación de salón a la derecha en móvil y atajo directo al perfil del cliente.
  - Menú de navegación horizontal compacto con estado activo en versión de escritorio (`md:flex`).

### C. Nueva Pantalla de Inicio Estilo Aplicación
1. **Tarjeta VIP de Reserva Rápida (`MobileAppHero.tsx`):** Saludo personalizado, título «Tu belleza, tu momento» y llamada a la acción prominente que no desplaza la pantalla.
2. **Chips de Categoría (`CategoryChips.tsx`):** Fila con desplazamiento táctil horizontal fluido (`no-scrollbar`) para saltar de inmediato a cualquier especialidad (Cortes, Trenzas, Manicure, Pedicure, Tintes, Cejas, Peinados).
3. **Servicios Populares (`PopularServicesScroll.tsx`):** Carrusel horizontal con ajuste por parada (`snap-x-mandatory`) con insignias de duración, precio en Soles y botón táctil de reserva.
4. **Galería de Looks Recientes (`LooksGalleryScroll.tsx`):** Formato tipo tarjeta de historias de Instagram para apreciar resultados reales de trenzas, cortes y color.
5. **Productos Destacados (`ProductsScroll.tsx`):** Productos con indicación de disponibilidad directa en salón.
6. **Información Compacta (`CompactSalonInfo.tsx`):** Horarios, ubicación física y transparencia sobre la modalidad a domicilio.

### D. Nuevas Pantallas de Aplicación
- **`/citas` (Mis Citas):**
  - Control segmentado deslizable para filtrar citas por estado: `TODAS`, `PENDIENTES`, `CONFIRMADAS`, `COMPLETADAS`, `CANCELADAS`.
  - Buscador en tiempo real por código de reserva o nombre de cliente.
  - Tarjetas de cita táctiles compactas con fecha, hora, modalidad, desglose de servicios, costo y botón para consultar detalles completos.
- **`/perfil` (Perfil de Usuario):**
  - Identificación visual del cliente (avatar, nombre, correo y etiqueta de estado).
  - Autenticación con Google conectada a `signInWithGoogle` / `signOut` con fallback seguro para modo invitado.
  - Menú de accesos directos: Mis Citas, Reservar Turno, Contacto Telefónico y Acceso al Panel Administrativo.

### E. Panel de Administración Responsivo (`/admin`)
- En dispositivos móviles (`md:hidden`), las reservas se presentan en **tarjetas táctiles interactivas individuales**, eliminando el scroll horizontal forzado de tablas anchas.
- Cada tarjeta incluye botones directos de acción táctil con el pulgar: **Aceptar**, **Rechazar** y **Completar**, con modal de confirmación de seguridad.
- En pantallas grandes (`hidden md:block`), se preserva la tabla de alta densidad para gestión rápida de múltiples citas.

### F. Preparación para PWA (Progressive Web App)
- `public/manifest.json`: Configurado con `display: "standalone"`, `name: "ROSI STUDIO — Expertos en Belleza"`, `short_name: "ROSI STUDIO"`, `theme_color: "#171717"` y `background_color: "#F8F6F2"`.
- `public/icon.svg`: Icono vectorial nítido con el sello oficial de la marca para la pantalla de inicio del teléfono.
- `src/app/layout.tsx`: Configuración `viewportFit: "cover"` para soporte de bordes redondeados y notch en iPhone/Android.

---

## 5. Lógica de Negocio y Reglas Implementadas

### A. Proceso de Reserva de Citas (`/reservar`)
1. **Paso 1 (Servicios):** Selección múltiple de servicios. Calcula en tiempo real el tiempo total acumulado (minutos) y el precio estimado en Soles (S/.).
2. **Paso 2 (Modalidad de Atención):**
   - **En el Local:** Sin recargo adicional.
   - **A Domicilio:** Habilita campos de dirección y referencia, desglosando con transparencia el recargo referencial de S/ 15.00.
3. **Paso 3 (Fecha y Horario):**
   - Bloquea fechas anteriores al día de hoy y días cerrados (ej. Domingos).
   - Genera slots en intervalos de 30 minutos dentro de la jornada (ej. 09:00 a 20:00).
   - Bloquea cualquier horario que colisione con una cita existente en estado `PENDIENTE` o `ACEPTADA`, contemplando además un margen de descanso/esterilización de 10 minutos.
4. **Paso 4 (Datos del Cliente):** Solicita Nombre y Teléfono (obligatorios) y Correo/Notas (opcionales). Cuenta con opción de autocompletado mediante Google.
5. **Paso 5 (Revisión):** Resumen detallado de servicios, modalidad, fecha, horario estimado y precio total.
6. **Paso 6 (Confirmación):** Emite el código identificador único (ej. `cita-mviq872c-j11t`), explica que la cita está **Pendiente de Aprobación** por la administradora y ofrece enlace para consultar el estado o hacer otra reserva.

### B. Snapshots Históricos en Citas
Cada documento de cita almacena una copia estática del nombre, precio y duración de los servicios seleccionados al momento de reservar. Si los precios del catálogo cambian en el futuro, las citas históricas no se alteran.

### C. Panel de Administración (`/admin`)
- **4 Tarjetas KPI:** Citas por aprobar, citas aceptadas, citas del día e ingresos proyectados.
- **Tabla de Citas con Filtros:** Filtros rápidos por estado (`TODAS`, `PENDIENTE`, `ACEPTADA`, `COMPLETADA`, `RECHAZADA`, `CANCELADA`) y buscador en tiempo real.
- **Acciones con Confirmación:** Aceptar o rechazar solicitudes pendientes, o marcar como completadas las aceptadas, solicitando confirmación modal para prevenir errores humanos.
- **Vistas Adicionales:** Horarios semanales, servicios activos y configuración general de la tienda.

---

## 6. Estrategia de Costos y Restricciones de Firebase

| Servicio | Implementación | Consumo Estimado | Costo |
| :--- | :--- | :--- | :--- |
| **Cloud Firestore** | Documentos planos, lecturas indexadas por fecha. | < 500 lecturas/día (el plan Spark incluye 50,000/día). | **S/ 0.00 (Gratis)** |
| **Firebase Auth** | Google OAuth para administradora y clientes. | Operaciones ilimitadas con proveedores sociales. | **S/ 0.00 (Gratis)** |
| **Firebase Hosting** | Exportación o despliegue estático optimizado. | Hasta 10 GB de transferencia mensual. | **S/ 0.00 (Gratis)** |
| **WhatsApp** | Enlaces `wa.me/` directos desde el navegador. | No requiere servidores intermedios ni APIs de pago. | **S/ 0.00 (Gratis)** |

---

## 7. Paso a Paso para Conectar Firebase en la Siguiente Sesión

El código está completamente preparado y cuenta con el archivo [.env.example](file:///Users/roy-asmad/Documents/Web/RosiStudio/.env.example). Cuando se disponga de la consola de Firebase:

1. **Crear el proyecto en [Firebase Console](https://console.firebase.google.com):**
   - Nombre sugerido: `rosi-studio-app`.
2. **Crear la aplicación Web (`</>`):**
   - Copiar las credenciales públicas proporcionadas.
3. **Crear el archivo `.env.local` en la raíz del proyecto:**
   ```bash
   cp .env.example .env.local
   ```
   Rellenar con los valores correspondientes:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rosi-studio-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=rosi-studio-app
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rosi-studio-app.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=1:...
   NEXT_PUBLIC_ADMIN_EMAILS=administradora@rosistudio.com
   NEXT_PUBLIC_WHATSAPP_NUMBER=51987654321
   ```
4. **Habilitar Authentication:**
   - Activar el proveedor **Google** en la pestaña Sign-in method.
5. **Crear la base de datos Firestore:**
   - Crear en modo Producción.
   - Copiar las reglas de [firestore.rules](file:///Users/roy-asmad/Documents/Web/RosiStudio/firestore.rules) a la pestaña de reglas en la consola.
   - En la colección `admin_roles`, crear un documento con el UID del usuario de Google administrador con el campo `{ active: true }`.

---

## 8. Comandos Útiles para el Desarrollador

```bash
# Iniciar servidor de desarrollo (puerto 3000 por defecto)
npm run dev

# Ejecutar verificación de tipos y ESLint
npm run lint

# Compilar para producción (genera las rutas estáticas y PPR)
npm run build

# Ver el estado del repositorio Git
git status
```

---

## 9. Registro Detallado de Pendientes y Hoja de Ruta para Siguientes Sesiones

Esta sección desglosa de manera exhaustiva todos los elementos que requieren configuración, desarrollo o definición en las siguientes etapas del proyecto.

---

### A. Configuraciones de Entorno e Infraestructura (Firebase Real)

- [ ] **Creación del Proyecto en Firebase Console:**
  - [ ] Registrar proyecto nuevo (ej. `rosi-studio-prod` o similar) en [Firebase Console](https://console.firebase.google.com).
  - [ ] Registrar la aplicación web (`</>`) y obtener las credenciales públicas (`apiKey`, `projectId`, `messagingSenderId`, `appId`, etc.).
- [ ] **Archivo de Variables de Entorno (`.env.local`):**
  - [ ] Copiar `.env.example` a `.env.local`.
  - [ ] Completar las variables `NEXT_PUBLIC_FIREBASE_*` con los valores reales.
  - [ ] Configurar los correos de las administradoras en `NEXT_PUBLIC_ADMIN_EMAILS`.
  - [ ] Configurar el número real de WhatsApp del negocio en `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] **Habilitación de Firebase Authentication:**
  - [ ] Activar el método de inicio de sesión **Google**.
  - [ ] Añadir los dominios autorizados de desarrollo (`localhost`) y del dominio final de producción.
- [ ] **Despliegue de Base de Datos Cloud Firestore:**
  - [ ] Inicializar Firestore en modo de Producción en la región deseada (ej. `southamerica-east1` o `us-central1`).
  - [ ] Publicar y activar el contenido de [firestore.rules](file:///Users/roy-asmad/Documents/Web/RosiStudio/firestore.rules).
  - [ ] Publicar los índices compuestos definidos en [firestore.indexes.json](file:///Users/roy-asmad/Documents/Web/RosiStudio/firestore.indexes.json).
- [ ] **Inicialización del Primer Administrador Confiable:**
  - [ ] Iniciar sesión una vez con la cuenta Google de la administradora para generar su `UID` en Authentication.
  - [ ] Crear el documento en la colección `admin_roles/{UID_ADMINISTRADORA}` con el campo `{ active: true }`.

---

### B. Limitaciones Técnicas y de Seguridad Pendientes

- [ ] **Garantía Contra Reservas Simultáneas en el Mismo Segundo (Concurrencia):**
  - *Estado actual:* Dos clientes que soliciten el mismo horario en el mismo milisegundo se registran como `PENDIENTE` y la administradora resuelve la colisión manualmente al revisar y aceptar.
  - *Pendiente para etapas avanzadas:* Evaluar si es necesario implementar un bloqueo transaccional a nivel de milisegundos mediante un Route Handler de Next.js (`/api/reservas`) o Cloud Function que use transacciones de Firestore (`runTransaction`).
- [ ] **Seguridad de Consulta de Citas sin Cuenta:**
  - *Estado actual:* Los clientes consultan su cita mediante el código generado en la URL `/citas/[id]`.
  - *Pendiente:* Evaluar si se requiere un token temporal firmado o verificación por código OTP para proteger citas de clientes no autenticados sin depender únicamente del ID.

---

### C. Funcionalidades Funcionales Pendientes (Etapa 2)

- [ ] **Mutación y Edición del Catálogo desde el Panel Admin:**
  - [ ] Formulario interactivo en `/admin` para agregar nuevos servicios y productos.
  - [ ] Edición de precios en Soles (PEN), duraciones en minutos y descripciones.
  - [ ] Interruptores para activar o pausar servicios sin eliminarlos.
- [ ] **Gestión Dinámica de Días No Laborables y Feriados:**
  - [ ] Permitir a la administradora agregar fechas festivas o días libres específicos directamente desde la pestaña de horarios del panel.
  - [ ] Soporte para bloqueo de franjas horarias específicas (ej. mantenimiento, receso o almuerzo).
- [ ] **Edición de Datos de la Empresa:**
  - [ ] Formulario editable en `/admin` para actualizar teléfono, dirección, horario habitual y tarifa por atención a domicilio.
- [ ] **Soporte Futuro Multi-Profesional:**
  - [ ] La arquitectura actual está modelada para un profesional individual (Rosi).
  - [ ] Dejar abierta la posibilidad de asociar servicios y turnos a especialistas específicos si el negocio suma más personal.

---

### D. Contenido, Activos Visuales y Publicación

- [ ] **Sustitución de Contenidos y Precios Oficiales:**
  - [ ] Validar con la dueña del negocio los precios reales de los servicios (actualmente identificados como referenciales de demostración).
  - [ ] Validar el importe exacto del recargo por atención a domicilio (actualmente referencial en S/ 15.00).
- [ ] **Activos Gráficos Definitivos:**
  - [ ] Reemplazar las fotos de demostración de Unsplash por fotografías de trabajos reales del salón cuando estén disponibles.
  - [ ] Integrar el archivo vectorial final del logotipo original si se proporciona en formato SVG o PNG en alta resolución.
- [ ] **Despliegue a Producción (Hosting):**
  - [ ] Configurar el archivo `firebase.json` para despliegue en **Firebase Hosting**.
  - [ ] Validar si se utiliza exportación estática (`output: 'export'`) o Firebase App Hosting según las necesidades de funciones de servidor.
