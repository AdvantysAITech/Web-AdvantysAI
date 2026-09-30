---
name: Advantys Ai
description: Despacho de ingeniería de IA en tinta azulada, con una sola señal coral.
colors:
  ink-canvas: "#090d16"
  ink-block: "#0e131e"
  ink-raised: "#131926"
  ink-control: "#1a2131"
  bunker-navy: "#0c1a2e"
  text-main: "#f4f5f7"
  text-secondary: "#b3b7c2"
  text-muted: "#8a909e"
  signal-coral: "#FF5A3C"
  brand-coral: "#FF6B43"
  brand-red: "#FF3935"
  brand-orange: "#E49166"
  accent-ink: "#1a0703"
  line: "rgba(255, 255, 255, 0.08)"
  line-strong: "rgba(255, 255, 255, 0.14)"
  accent-line: "rgba(255, 90, 60, 0.38)"
  success-teal: "#108981"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.2rem + 5.2vw, 5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  statement:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1rem + 7.5vw, 7.5rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.5vw, 1.6rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1rem + 0.3vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'cv11', 'ss01'"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  md: "14px"
  float: "18px"
  lg: "24px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 2.5rem)"
  section: "clamp(5rem, 3rem + 7vw, 10rem)"
  grid-gap: "1.25rem"
  card-padding: "clamp(1.75rem, 1.25rem + 1.5vw, 2.5rem)"
  container: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.brand-coral}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.5rem 0.5rem 1.5rem"
    height: "3rem"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.03)"
    textColor: "{colors.text-main}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.4rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "rgba(255, 255, 255, 0.07)"
  card-bento:
    backgroundColor: "{colors.ink-block}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-padding}"
  card-bento-hover:
    backgroundColor: "{colors.ink-raised}"
  card-phase:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "clamp(1.75rem, 1rem + 3vw, 3.5rem)"
  nav-island:
    backgroundColor: "rgba(12, 16, 26, 0.62)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    padding: "0.375rem 0.375rem 0.375rem 1.25rem"
    height: "3.5rem"
  nav-link-active:
    textColor: "{colors.text-main}"
  icon-tile:
    backgroundColor: "{colors.ink-canvas}"
    textColor: "{colors.brand-coral}"
    rounded: "{rounded.md}"
    size: "44px"
  floating-panel:
    backgroundColor: "rgba(14, 19, 30, 0.96)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.float}"
---

# Design System: Advantys Ai

## Overview

**Creative North Star: "El Informe Técnico Nocturno"**

La web de Advantys se lee como el informe de un despacho de ingeniería impreso sobre tinta azulada casi negra, no como una landing de IA. Los titulares son Space Grotesk blanco sólido, alineados a la izquierda y con tracking cerrado; el texto de lectura es Inter en gris frío. La estructura es editorial: columnas asimétricas (5/7, 7/5), listas separadas por filetes de 1 px en lugar de cajas, y un bento asimétrico cuando hay que agrupar servicios. La densidad es baja y el ritmo vertical amplio: cada sección respira entre 5 y 10 rem.

El color trabaja por escasez. Todo el sistema es una escala de superficies del mismo tono tinta, escalonadas por luminosidad, y una única familia cálida (rojo-coral) que actúa como señal: foco, estado activo, iconos, una línea del titular del hero y el relleno del CTA principal. El degradado de marca rojo→coral→naranja existe, pero solo como relleno del botón primario; nunca en texto. La pieza de firma es el globo WebGL de nodos coral en la mitad derecha del hero (metáfora del tejido empresarial); en pantallas por debajo de 1024 px se sustituye por un halo coral radial.

El movimiento es sobrio y con intención: una entrada del titular por líneas que suben desde su máscara con desenfoque, apariciones suaves al hacer scroll y una pila pegajosa de fases de metodología donde la tarjeta anterior retrocede cuando llega la siguiente. Todo respeta `prefers-reduced-motion`. Esta es una evolución de la marca oscura existente, no un cambio de identidad.

**Key Characteristics:**
- Tinta azulada casi negra con cuatro superficies escalonadas por luminosidad.
- Una sola señal cálida (coral); el degradado de marca solo rellena el CTA principal.
- Titulares Space Grotesk 600, blanco sólido, a la izquierda, tracking negativo según tamaño.
- Filetes de 1 px como estructura; listas con línea, no con tarjetas.
- Radios de un solo sistema: bloques 24 px, internos 14 px, controles en píldora.
- Botón primario con flecha anidada en su propio círculo.
- Globo de nodos coral como firma del hero (halo radial en móvil).

## Colors

Paleta monocroma de tinta azul-noche con una única familia cálida rojo-coral como señal.

### Primary
- **Coral Señal** (`signal-coral`): el acento funcional. Anillo de foco (2 px, desplazamiento 3 px), punto del enlace activo en la navegación, filete izquierdo de las citas destacadas, base de `accent-soft` y `accent-line` y color de la selección de texto.
- **Coral de Marca** (`brand-coral`): el acento de contenido. Iconos (Phosphor) de listas y tarjetas, la línea resaltada del titular del hero, los marcadores de lista de las fases y el hover de los enlaces a verticales. Es también el color representativo del relleno del botón primario.
- **Tinta de Acento** (`accent-ink`): texto e iconos sobre cualquier relleno de marca (CTA, botones de cookies). Nunca blanco sobre el degradado.

### Secondary
- **Rojo Advantys** (`brand-red`) y **Naranja Tostado** (`brand-orange`): solo existen como extremos del degradado de marca (`linear-gradient(100deg, rojo 0%, coral 55%, naranja 100%)`). El rojo aparece suelto únicamente como color de error en formularios.

### Tertiary
- **Azul Búnker** (`bunker-navy`): superficie propia de la línea de Auditoría e ISO 42001, con filete azulado `rgba(120, 170, 220, 0.12)`. Solo marca esa línea de servicio.
- **Verde Verificado** (`success-teal`): mensaje de éxito en formularios. Sin otro uso.

### Neutral
- **Lienzo Tinta** (`ink-canvas`): fondo de página, pistas de scrollbar, fondo de las teselas de icono.
- **Bloque Tinta** (`ink-block`): tarjetas y paneles en reposo.
- **Tinta Elevada** (`ink-raised`): tarjetas en hover, cabecera del degradado de las fases, tarjeta de Sistema Advantys.
- **Tinta Control** (`ink-control`): controles y pulgar del scrollbar.
- **Blanco Papel** (`text-main`): titulares y texto enfatizado.
- **Gris Informe** (`text-secondary`): texto de lectura, descripciones, enlaces de navegación en reposo.
- **Gris Nota** (`text-muted`): metadatos, copyright, encabezados de columna del pie, números de fase, placeholders. Todos los textos cumplen 4.5:1 sobre `ink-block`.
- **Filete** (`line`) y **Filete Fuerte** (`line-strong`): toda la estructura del sistema; `line-strong` para hover, bordes de controles secundarios y tarjetas de fase.

### Named Rules
**La Regla de la Señal Única.** La única tinta cromática de la interfaz es la familia coral. Ningún otro tono compite con ella salvo el Azul Búnker, que solo identifica la línea ISO 42001.

**La Regla del Degradado Encerrado.** El degradado de marca solo rellena controles de acción primaria (CTA, envío de formulario, aceptar cookies, casillas marcadas). Nunca en texto, titulares, bordes ni fondos de sección.

## Typography

**Display Font:** Space Grotesk (con ui-sans-serif, system-ui)
**Body Font:** Inter (con ui-sans-serif, system-ui), `font-feature-settings: 'cv11', 'ss01'`
**Label/Mono Font:** JetBrains Mono está declarada como `--font-mono` para datos y código, sin uso todavía en la home.

**Character:** Space Grotesk aporta el filo técnico de un plano de ingeniería con tracking cerrado; Inter mantiene la lectura neutra y fría. El contraste es de familia y de peso, no de color.

### Hierarchy
- **Statement** (600, `clamp(2.75rem → 7.5rem)`, 0.95): la frase de cierre a toda anchura y el "¿Hablamos?" del pie (5.5 rem máx.). Una por página como mucho.
- **Display** (600, `clamp(2.6rem → 5rem)`, 1, −0.04em): titular del hero, en líneas independientes; en escritorio tres líneas con la última en Coral de Marca.
- **Headline** (600, `clamp(2rem → 3.5rem)`, 1.02, −0.035em): titular de sección, siempre a la izquierda y apilado sobre su entradilla.
- **Title** (600, `clamp(1.25rem → 1.6rem)`, 1.2, −0.015em): títulos de tarjeta y de ítem. Las tarjetas grandes del bento y las fases suben a `clamp(1.5rem → 2.5rem)` con tracking −0.03em.
- **Lead** (400, `clamp(1.05rem → 1.25rem)`, 1.6): entradillas y subtítulos, a 46–60ch.
- **Body** (400, 1rem, 1.6–1.7): texto corrido a 48–62ch.
- **Label** (500, 0.875rem): navegación, botones (0.95rem, 600), encabezados de columna del pie (0.8125rem, color Gris Nota). Sin mayúsculas forzadas.

### Named Rules
**La Regla del Tracking Proporcional.** Cuanto mayor el titular, más cerrado: −0.04em en display y statement, −0.035em en headline, −0.015em en title. El texto de lectura nunca lleva tracking negativo.

**La Regla del Blanco Sólido.** Los titulares son `text-main` sólido. El énfasis dentro de un titular es una línea o palabra en Coral de Marca sólido, nunca texto con degradado.

## Layout

Contenedor de 1240 px con márgenes fluidos (`gutter`). La isla de navegación se limita a 1120 px. Las secciones se separan con `section` (5–10 rem) y, cuando se encadenan, un filete de 1 px a lo ancho del contenedor marca el cambio en lugar de un cambio de fondo.

El modelo es editorial asimétrico: cabecera fija a la izquierda y contenido a la derecha en 5fr/7fr a partir de 960 px (la cabecera es `sticky` a 7.5 rem); bento 7fr/5fr a partir de 860 px con la tarjeta principal ocupando dos filas; fases de metodología en 1fr/1fr a partir de 900 px. Por debajo de esos cortes todo cae a una columna con huecos de 1–1.25 rem.

El hero ocupa la altura de la ventana (`100svh`), con el titular sobre la columna izquierda y el globo WebGL ocupando el 62 % derecho, sangrando un 8 % fuera del contenedor. La isla de navegación flota sobre el hero (margen negativo de 4.5 rem). En ≤640 px el hero pierde la altura mínima, las acciones se apilan a ancho completo y el titular fluye en línea con la frase coral en su propio renglón.

Puntos de corte observados: 640, 768, 860, 900, 960 y 1024 px (el de 1024 conmuta navegación de escritorio y globo).

## Elevation & Depth

Híbrido contenido: la profundidad se expresa sobre todo por luminosidad de superficie (lienzo → bloque → elevada → control) y por un brillo superior interior de 1 px (`inset 0 1px 0 rgba(255,255,255,0.06)`) que da canto a cada panel. Las sombras con desplazamiento y desenfoque, tintadas de azul noche, se reservan para lo que flota sobre el contenido: isla de navegación, desplegable, banner de cookies. El CTA primario lleva además un halo cálido propio. El material translúcido (backdrop-filter) solo existe en elementos fijos: cabecera, menú móvil y cookies.

### Shadow Vocabulary
- **Canto** (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06)`): todas las tarjetas y paneles en reposo.
- **Flotante** (`box-shadow: 0 2px 6px rgba(2, 4, 10, 0.35), 0 24px 60px -24px rgba(2, 4, 10, 0.8)`): desplegables y capas sobre contenido.
- **Isla** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 12px 40px -16px rgba(2,4,10,0.8)`): cabecera; se densifica al hacer scroll.
- **Halo de acción** (`box-shadow: 0 10px 30px -12px rgba(255, 70, 50, 0.55)` más cantos interiores): solo el botón primario.

### Named Rules
**La Regla de la Superficie, no del Salto.** Una tarjeta en hover cambia de superficie (`ink-block` → `ink-raised`) y de filete; no se levanta ni rebota.

**La Regla del Cristal Fijo.** El desenfoque de fondo solo se usa en elementos fijos sobre el contenido, con fallback opaco y respeto a `prefers-reduced-transparency`.

## Shapes

Un solo sistema de esquinas: bloques y tarjetas a 24 px (`lg`), elementos internos como teselas de icono a 14 px (`md`), capas flotantes (desplegable, cookies) a 18 px (`float`) con sus opciones a 12 px, y todos los controles (botones, isla de navegación, enlaces de nav, salto de teclado) en píldora. Los botones circulares (hamburguesa, cerrar, redes, flecha de tarjeta) son círculos de 2.5–2.75 rem con filete. Los bordes son siempre de 1 px. Los marcadores de lista son trazos horizontales de 12 × 1 px en coral, no viñetas ni iconos.

## Components

### Buttons
Confiados y táctiles; la acción principal se reconoce por su relleno cálido y su flecha anidada.
- **Shape:** píldora (999 px), altura mínima 3 rem (3.5 rem en el cierre del pie).
- **Primary:** relleno del degradado de marca, texto Tinta de Acento, Inter 600 a 0.95 rem. Con icono, padding asimétrico (0.5 / 0.5 / 0.5 / 1.5 rem) y la flecha diagonal convertida en círculo propio de 2 rem sobre `rgba(26,7,3,0.14)`. Sin icono, 0.75 × 1.5 rem.
- **Hover / Focus:** solo con puntero fino: brillo 1.06 y halo más amplio; la flecha se desplaza 2 px en diagonal. Pulsación `scale(0.97)` en 120 ms. Foco: anillo Coral Señal.
- **Secondary:** filete `line-strong` sobre blanco al 3 %, Inter 500, con brillo superior; hover a blanco al 7 % y borde al 24 %. Su icono (si lo hay) se desliza 3 px.
- **Disabled:** opacidad 0.55, saturación 0.6, sin transformación.

### Cards / Containers
- **Corner Style:** 24 px.
- **Background:** Bloque Tinta en reposo, Tinta Elevada en hover. Variantes del bento: halo radial coral al 10 % desde la esquina superior derecha (verticales), velo blanco al 3 % sobre Tinta Elevada (Sistema Advantys), Azul Búnker (ISO 42001).
- **Shadow Strategy:** solo Canto (ver Elevation & Depth).
- **Border:** `line`, `line-strong` en hover.
- **Internal Padding:** `card-padding` (1.75–2.5 rem); las tarjetas del bento hasta 2.75 rem.
- **Enlace:** el enlace vive en el título; su `::after` extiende el área de clic a toda la tarjeta y el foco se dibuja en la tarjeta con `:has()`. Las listas de enlaces internos quedan por encima.

### Inputs / Fields
- **Style:** fondo negro al 20 %, filete `line`, esquinas de 12 px, padding 0.875 × 1 rem.
- **Focus:** borde Coral de Marca con anillo de 1 px coral al 20 %.
- **Checkbox / Radio:** propios, marcados con el degradado de marca y marca blanca con entrada en escala de 140 ms.
- **Error / Éxito:** texto en Rojo Advantys / Verde Verificado bajo el formulario.

### Navigation
- **Isla flotante:** píldora translúcida (`blur(18px) saturate(160%)`) fija a 1 rem del borde superior; gana opacidad y sombra al hacer scroll (detectado con IntersectionObserver, sin listener de scroll).
- **Enlaces:** Inter 500 a 0.875 rem en Gris Informe; hover y activo en Blanco Papel. El activo se marca con un punto coral de 4 px bajo el texto. Una píldora blanca al 7 % sigue al puntero entre enlaces.
- **Desplegable:** capa flotante de 18 px que entra con escala 0.97 → 1 en 180 ms; abre por hover con puntero fino y por foco de teclado.
- **Móvil (<1024 px):** hoja a pantalla completa con desenfoque; enlaces en Space Grotesk grande, separados por filetes, que entran escalonados cada 40 ms; el CTA de área privada con relleno de marca al final.

### Pila de Fases (firma)
Tres tarjetas de metodología `sticky` con topes escalonados (7.5 / 8.75 / 10 rem en escritorio), fondo degradado de Tinta Elevada a Bloque Tinta y filete fuerte. Con `animation-timeline: view()`, la fase anterior se reduce a `scale(0.94)` y se oscurece con un velo al 55 % cuando llega la siguiente. Número de fase en Space Grotesk tabular, Gris Nota. Sin soporte o con movimiento reducido, las tarjetas simplemente se apilan.

### Globo de nodos (firma)
Canvas WebGL (three.js cargado tras `load`) con nodos interpolados entre `#FE4237` y `#FE7447`, montado en la mitad derecha del hero y fundido con opacidad en 1.2 s. No se monta por debajo de 1024 px; allí queda solo el halo radial coral del hero.

## Do's and Don'ts

### Do:
- **Do** alinear titulares y entradillas a la izquierda, con el titular de sección en `headline` y la entradilla en `lead` a 60ch máximo.
- **Do** expresar la jerarquía de superficies con Lienzo → Bloque → Elevada y filetes de 1 px (`line` / `line-strong`).
- **Do** reservar el degradado de marca para el relleno de la acción primaria, con texto Tinta de Acento.
- **Do** usar el botón primario con flecha anidada en círculo para la acción principal de cada página (una por página).
- **Do** separar ítems de lista con filetes y marcadores coral de 12 × 1 px en lugar de encerrarlos en tarjetas.
- **Do** limitar los hovers a `(hover: hover) and (pointer: fine)` y dar a cada control una pulsación `scale(0.97)`.
- **Do** usar las curvas `ease-out` `cubic-bezier(0.23, 1, 0.32, 1)` y duraciones 120 / 180 / 240 / 450 ms, y desactivar desplazamientos con `prefers-reduced-motion`.

### Don't:
- **Don't** aplicar degradado a texto ni a titulares; el énfasis es coral sólido.
- **Don't** centrar titulares de sección ni componer filas de tres tarjetas iguales como estructura por defecto.
- **Don't** añadir antetítulos o etiquetas en píldora sobre los titulares.
- **Don't** introducir un segundo color de acento; el Azul Búnker es exclusivo de la línea ISO 42001.
- **Don't** hacer que las tarjetas salten o reboten en hover; cambian de superficie.
- **Don't** envolver una tarjeta entera en `<a>`; el enlace va en el título y extiende su área con un pseudo-elemento.
- **Don't** usar emojis en la interfaz; los iconos son Phosphor o SVG en línea.
