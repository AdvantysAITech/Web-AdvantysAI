# ==========================================================
#  Advantys AI — PASO 5a: reparar consultoria-estrategica.html
#
#  Esta pagina no existia cuando hice la auditoria sobre main,
#  y arrastra los dos mismos fallos que corregimos en el Paso 1:
#
#  1. config.js esta entre </head> y <body> (HTML invalido).
#  2. Tiene el formulario de contacto del footer pero no carga
#     footer-contact-form.js -> el formulario no envia nada.
#
#  Los scripts se insertan DESPUES de main.js y ANTES del script
#  inline del calendario, que necesita window.ADV_CALENDAR_URL
#  ya definido para enlazar los dos CTA de reserva.
#
#  Ejecutar desde la RAIZ del repo, en la rama claude-edits.
# ==========================================================

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # UTF-8 sin BOM

if (-not (Test-Path './vercel.json')) {
    throw "No encuentro vercel.json. Ejecuta el script desde la raiz del repo."
}

$rel = './pages/consultoria-estrategica.html'
if (-not (Test-Path $rel)) { throw "No encuentro $rel" }

$path = (Resolve-Path $rel).Path
$html = [System.IO.File]::ReadAllText($path)
$antes = $html

# --- 1. Quitar scripts locales colocados fuera del <body> ---
$bodyIdx = $html.IndexOf('<body')
$movidos = 0
if ($bodyIdx -gt 0) {
    $cabecera = $html.Substring(0, $bodyIdx)
    $resto    = $html.Substring($bodyIdx)
    $fuera = "(?m)^[ \t]*<script\s+src=""/assets/js/[^""]+""\s*></script>[ \t]*\r?\n(?:[ \t]*\r?\n)?"
    $movidos  = [regex]::Matches($cabecera, $fuera).Count
    $cabecera = [regex]::Replace($cabecera, $fuera, '')
    $html = $cabecera + $resto
}

# --- 2. Insertar config.js y footer-contact-form.js tras main.js ---
$ancla = '<script src="/assets/js/main.js"></script>'
if ($html -notmatch [regex]::Escape($ancla)) { throw "No encuentro main.js en la pagina; revisar a mano." }

$anadidos = @()
$bloque = $ancla
foreach ($js in @('config.js','footer-contact-form.js')) {
    $tag = "<script src=""/assets/js/$js""></script>"
    if ($html -notmatch [regex]::Escape($tag)) {
        $bloque = $bloque + "`n" + $tag
        $anadidos += $js
    }
}
if ($anadidos.Count -gt 0) {
    $idx = $html.IndexOf($ancla)
    $html = $html.Substring(0, $idx) + $bloque + $html.Substring($idx + $ancla.Length)
}

if ($html -ne $antes) {
    [System.IO.File]::WriteAllText($path, $html, $utf8)
    Write-Host ("  OK  consultoria-estrategica.html   movidos: {0} | anadidos: {1}" -f $movidos, ($anadidos -join ', ')) -ForegroundColor Green
} else {
    Write-Host "  --  consultoria-estrategica.html   sin cambios" -ForegroundColor DarkGray
}

# ----------------------------------------------------------
# Verificacion
# ----------------------------------------------------------
$final = [System.IO.File]::ReadAllText($path)
$cuerpo = $final.Substring($final.IndexOf('<body'))
$pre    = $final.Substring(0, $final.IndexOf('<body'))

$posConfig   = $cuerpo.IndexOf('/assets/js/config.js')
$posCalendar = $cuerpo.IndexOf('ADV_CALENDAR_URL')

Write-Host ""
Write-Host "Verificacion:" -ForegroundColor Cyan
Write-Host ("   scripts fuera del body      : {0}" -f $(if ($pre -match '/assets/js/') { 'SIGUEN AHI' } else { 'ninguno' })) `
    -ForegroundColor $(if ($pre -match '/assets/js/') { 'Red' } else { 'Green' })
Write-Host ("   footer-contact-form.js      : {0}" -f $(if ($cuerpo -match 'footer-contact-form\.js') { 'cargado' } else { 'FALTA' })) `
    -ForegroundColor $(if ($cuerpo -match 'footer-contact-form\.js') { 'Green' } else { 'Red' })
Write-Host ("   config.js antes del calendar: {0}" -f $(if ($posConfig -gt 0 -and $posConfig -lt $posCalendar) { 'si' } else { 'NO — revisar orden' })) `
    -ForegroundColor $(if ($posConfig -gt 0 -and $posConfig -lt $posCalendar) { 'Green' } else { 'Red' })

Write-Host ""
Write-Host "PASO 5a completado." -ForegroundColor Cyan