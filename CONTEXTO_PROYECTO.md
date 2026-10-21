# ROSI STUDIO — Contexto Integral y Estado del Proyecto

> **Fecha de creación del documento:** 21 de octubre de 2026  
> **Estado actual:** Etapa 1 completada con éxito (Estructura base, arquitectura desacoplada, interfaz visual responsiva y motor de disponibilidad).  
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
    │   │   ├── Navbar.tsx                # Barra de navegación con drawer táctil móvil
    │   │   ├── Footer.tsx                # Pie de página con información de contacto y horarios
    │   │   └── WhatsAppButton.tsx        # Botón flotante para WhatsApp
    │   ├── home/
    │   │   ├── HeroSection.tsx           # Portada con título «Tu belleza, tu momento»
    │   │   ├── FeaturedServices.tsx      # Servicios destacados con acceso directo a reserva
    │   │   ├── ExperienceGallery.tsx     # Muestra visual de trabajos realizados
    │   │   ├── ProductsTeaser.tsx        # Catálogo destacado de productos
    │   │   └── BusinessInfoSection.tsx   # Modalidades (Local vs Domicilio) y garantías de higiene
    │   └── booking/
    │       └── BookingWizard.tsx         # Asistente interactivo de reserva (5 pasos + éxito)
    └── app/
        ├── layout.tsx                    # Shell raíz con fuentes Playfair/Lato y metadata SEO
        ├── globals.css                   # Tokens de diseño y scrollbar personalizado
        ├── page.tsx                      # Página de Inicio
        ├── servicios/page.tsx            # Catálogo completo con buscador y filtro por categorías
        ├── productos/page.tsx            # Catálogo informativo con botón de consulta por WhatsApp
        ├── reservar/page.tsx             # Página de reserva de citas (Wizard guiado)
        ├── admin/page.tsx                # Panel de administración con KPIs y gestión de citas
        └── citas/[id]/page.tsx           # Consulta pública del estado de una cita por su código
```

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
6. **Paso 6 (Confirmación):** Emite el código identificador único (ej. `cita-mviq872c-j11t`), explica que la cita está **Pendiente de Aprobación** por la administradora y ofrece enlace directo para notificar por WhatsApp.

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

## 9. Próximos Pasos Recomendados para la Etapa 2

1. **Conexión a Firebase Real:**
   - Probar el inicio de sesión real con Google en el panel de administración.
   - Crear las primeras citas reales en la base de datos de producción.
2. **CRUD Administrativo en Tiempo Real:**
   - Permitir a la administradora agregar, pausar o modificar precios de servicios directamente desde la pestaña de gestión del panel.
   - Configuración editable de feriados y horarios especiales desde la interfaz.
3. **Despliegue Continuo:**
   - Configurar el despliegue automático hacia Firebase Hosting o servicio compatible con Next.js.
