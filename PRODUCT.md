# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Dirección (CEO, gerencia) de empresas medianas y grandes en Andorra y España que evalúan invertir en IA: leen en diagonal, deciden por beneficio y riesgo.
- Perfil técnico (CTO, responsable de sistemas) que valida la propuesta: necesita profundidad técnica bajo demanda (patrón `.adv-disclosure-block`, "Ver detalle técnico").
- Inversores y socios interesados en las spin-offs verticales de Advantys (Educación, Hospitality, Residencia Fiscal, Trazabilidad Agroalimentaria).

## Product Purpose

Web corporativa de Advantys Ai, SL (Andorra la Vella). Explica qué hace la empresa (diseñar, implantar y auditar soluciones de IA orientadas a la rentabilidad operativa) y convierte visitas en solicitudes de consultoría (`/consultoria-estrategica`, `/solicitud`) o en contactos de partner/inversor (`/partners`). Éxito: un directivo entiende la propuesta en segundos y pide una consultoría.

## Positioning

Consultoría tecnológica y venture builder desde Andorra que combina tres cosas en una sola casa: implantación de IA vertical, metodología propia (Sistema Advantys) y auditoría/gobernanza de IA (ISO/IEC 42001, Reglamento UE 2024/1689).

## Operating Context

- Sitio estático HTML/CSS/JS sin build, desplegado en Vercel desde `main`; URLs limpias vía `vercel.json`.
- Cabecera y pie duplicados en línea en cada HTML (no hay includes).
- Medición GA4 con Consent Mode v2 y banner de cookies propio.

## Capabilities and Constraints

- Idioma: español (es-ES). Estructura trilingüe prevista en subdirectorios.
- Clases propias con prefijo `adv-`. Iconos Phosphor. Sin emojis en la UI.
- Nunca envolver una tarjeta entera en `<a>`: enlaces solo en títulos, imágenes o CTAs.
- La herramienta interna de CRM se nombra siempre "Sistema Advantys" en todo lo público.

## Brand Commitments

- Wordmark «advantys Ai» (`assets/images/Logo advantys blanco y color.png`).
- Paleta de marca: rojo `#FF3935`, coral `#FF6B43`, naranja `#E49166`; fondo oscuro.
- Tipografías: Space Grotesk (titulares), Inter (texto), JetBrains Mono (datos/código).
- Estética oscura confirmada por el cliente (sep 2026): evolucionar la marca oscura, no cambiarla.
- Globo WebGL de nodos en el hero de la home (metáfora del "tejido empresarial").

## Evidence on Hand

- Datos corporativos reales en el JSON-LD de `index.html` (dirección Torre Zenit, teléfono, email, redes).
- Cuatro páginas de soluciones verticales y páginas de Sistema Advantys, ISO 42001, Partners.
- No hay testimonios, logos de clientes, casos de éxito ni métricas publicadas: no inventarlos.

## Product Principles

1. Rentabilidad antes que tendencia: cada bloque responde a "qué gana la empresa".
2. Rigor verificable: normas y metodología citadas con nombre, nunca promesas vagas.
3. Doble lectura: el directivo entiende sin clicar; el técnico encuentra el detalle.
4. Una acción clara por página.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste de texto, foco visible, navegación por teclado, `prefers-reduced-motion`.
