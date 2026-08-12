# ==========================================================
#  Advantys AI — PASO 4: enlaces muertos y redirecciones
#
#  1. CTA principal de la home (href="#") -> /solicitud
#  2. Icono de LinkedIn de la home (href="#") -> perfil real
#  3. Los tres CTA a #contacto (ancla inexistente) -> /solicitud
#  4. Enlaces que provocan una redireccion 308:
#       pages/sistema-advantys.html -> /sistema-advantys
#       /pages/partners.html        -> /partners
#       /politica-priv              -> /politica-privacidad
#
#  Ejecutar desde la RAIZ del repo, en la rama claude-edits.
# ==========================================================

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # UTF-8 sin BOM

if (-not (Test-Path './vercel.json')) {
    throw "No encuentro vercel.json. Ejecuta el script desde la raiz del repo."
}

$total = 0

function Reemplazar($rel, $pares, $etiqueta) {
    if (-not (Test-Path $rel)) { Write-Host "  (omitida) $rel" -ForegroundColor DarkGray; return 0 }
    $path = (Resolve-Path $rel).Path
    $html = [System.IO.File]::ReadAllText($path)
    $antes = $html
    $n = 0
    foreach ($par in $pares) {
        $n += ([regex]::Matches($html, [regex]::Escape($par[0]))).Count
        $html = $html.Replace($par[0], $par[1])
    }
    if ($html -ne $antes) {
        [System.IO.File]::WriteAllText($path, $html, $utf8)
        Write-Host ("  OK  {0,-52} {1} ({2})" -f $rel, $etiqueta, $n) -ForegroundColor Green
    } else {
        Write-Host ("  --  {0,-52} sin cambios" -f $rel) -ForegroundColor DarkGray
    }
    return $n
}

# ----------------------------------------------------------
# 1 + 2. Home: CTA principal y LinkedIn
# ----------------------------------------------------------
$total += Reemplazar 'index.html' @(
    ,@('<a href="#" class="btn-glass-primary">',        '<a href="/solicitud" class="btn-glass-primary">')
    ,@('<a href="#" aria-label="LinkedIn" class="icon-link">', '<a href="https://www.linkedin.com/company/advantys-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="icon-link">')
    ,@('<a href="pages/sistema-advantys.html" class="btn-glass">', '<a href="/sistema-advantys" class="btn-glass">')
) 'CTA + LinkedIn + enlace directo'

# ----------------------------------------------------------
# 3. Anclas #contacto inexistentes
# ----------------------------------------------------------
foreach ($p in @('pages/iso-42001.html','pages/sistema-advantys.html')) {
    $total += Reemplazar $p @(
        ,@('href="#contacto"', 'href="/solicitud"')
    ) 'anclas #contacto'
}

# LinkedIn vacio tambien en solicitud.html
$total += Reemplazar 'pages/solicitud.html' @(
    ,@('<a href="#" aria-label="LinkedIn" class="icon-link">', '<a href="https://www.linkedin.com/company/advantys-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="icon-link">')
) 'LinkedIn'

# ----------------------------------------------------------
# 4. Enlaces que redirigen (308), en todas las paginas
# ----------------------------------------------------------
Write-Host ""
Write-Host "Normalizando enlaces con redireccion:" -ForegroundColor Cyan

Get-ChildItem -Path . -Filter *.html -Recurse -File | ForEach-Object {
    $path = $_.FullName
    $html = [System.IO.File]::ReadAllText($path)
    $antes = $html
    $html = $html.Replace('href="/politica-priv"',       'href="/politica-privacidad"')
    $html = $html.Replace('href="/pages/partners.html"', 'href="/partners"')
    if ($html -ne $antes) {
        [System.IO.File]::WriteAllText($path, $html, $utf8)
        $rel = $path.Replace((Get-Location).Path + [IO.Path]::DirectorySeparatorChar, '')
        Write-Host "  OK  $rel" -ForegroundColor Green
        $script:total++
    }
}

# ----------------------------------------------------------
# Verificacion final
# ----------------------------------------------------------
Write-Host ""
Write-Host "Verificacion:" -ForegroundColor Cyan

$restos = @{
    'CTA vacios (href="#")'      = 'href="#"'
    'anclas #contacto'           = 'href="#contacto"'
    'enlaces a /politica-priv'   = 'href="/politica-priv"'
    'enlaces a /pages/*.html'    = 'href="/pages/'
}

foreach ($clave in $restos.Keys | Sort-Object) {
    $encontrados = @()
    Get-ChildItem -Path . -Filter *.html -Recurse -File |
        Where-Object { $_.FullName -notmatch '\\components\\' } |
        ForEach-Object {
            $t = [System.IO.File]::ReadAllText($_.FullName)
            if ($t.Contains($restos[$clave])) { $encontrados += $_.Name }
        }
    if ($encontrados.Count -eq 0) {
        Write-Host ("   {0,-26} limpio" -f $clave) -ForegroundColor Green
    } else {
        Write-Host ("   {0,-26} quedan en: {1}" -f $clave, ($encontrados -join ', ')) -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "PASO 4 completado." -ForegroundColor Cyan