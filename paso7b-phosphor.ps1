# ==========================================================
#  Advantys AI — PASO 7b: quitar la carga duplicada de Phosphor
#
#  El Paso 7 no lo consiguio porque comparaba el salto de linea
#  como LF y tus archivos estan en CRLF (checkout de Windows).
#  Esta version usa una expresion regular que acepta ambos.
#
#  Ejecutar desde la RAIZ del repo, en la rama claude-edits.
# ==========================================================

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # UTF-8 sin BOM

if (-not (Test-Path './vercel.json')) {
    throw "No encuentro vercel.json. Ejecuta el script desde la raiz del repo."
}

# Dos <script> de Phosphor consecutivos -> deja solo el primero
$patron = '(?m)^([ \t]*<script src="https://unpkg\.com/@phosphor-icons/web"[^>]*></script>[ \t]*\r?\n)(?:[ \t]*<script src="https://unpkg\.com/@phosphor-icons/web"[^>]*></script>[ \t]*\r?\n)+'

$total = 0

Get-ChildItem -Path . -Filter *.html -Recurse -File | ForEach-Object {
    $path = $_.FullName
    $html = [System.IO.File]::ReadAllText($path)
    $antes = $html

    $html = [regex]::Replace($html, $patron, '$1')

    if ($html -ne $antes) {
        [System.IO.File]::WriteAllText($path, $html, $utf8)
        $script:total++
        Write-Host ("  OK  {0}" -f $_.Name) -ForegroundColor Green
    }
}

# ----------------------------------------------------------
# Verificacion
# ----------------------------------------------------------
$dup = @()
Get-ChildItem -Path . -Filter *.html -Recurse -File | ForEach-Object {
    $t = [System.IO.File]::ReadAllText($_.FullName)
    $n = ([regex]::Matches($t, [regex]::Escape('unpkg.com/@phosphor-icons/web'))).Count
    if ($n -gt 1) { $dup += ("{0} ({1})" -f $_.Name, $n) }
}

Write-Host ""
if ($dup.Count -eq 0) {
    Write-Host "   Phosphor duplicado en : ninguna" -ForegroundColor Green
} else {
    Write-Host ("   Phosphor duplicado en : {0}" -f ($dup -join ', ')) -ForegroundColor Yellow
}

Write-Host ""
Write-Host "PASO 7b completado ($total archivos)." -ForegroundColor Cyan