# ==========================================================
#  Advantys AI — PASO 2: retirar pages/contacto.html
#
#  1. Comprueba que ninguna pagina la enlaza (si alguna lo
#     hace, aborta sin borrar nada).
#  2. Borra pages/contacto.html.
#  3. Verifica de paso que la limpieza de paginas retiradas
#     (about-us / ad-hoc / casos-exito) sigue aplicada.
#
#  Ejecutar desde la RAIZ del repo, en la rama claude-edits.
# ==========================================================

$ErrorActionPreference = 'Stop'

if (-not (Test-Path './vercel.json')) {
    throw "No encuentro vercel.json. Ejecuta el script desde la raiz del repo."
}

$objetivo = './pages/contacto.html'

# ----------------------------------------------------------
# 1. Comprobar que nadie la enlaza
# ----------------------------------------------------------
$referencias = @()

Get-ChildItem -Path . -Filter *.html -Recurse -File |
    Where-Object { $_.FullName -notmatch 'contacto\.html$' } |
    ForEach-Object {
        $texto = [System.IO.File]::ReadAllText($_.FullName)
        if ($texto -match 'href="(?:[^"]*/)?contacto(?:\.html)?"') {
            $referencias += $_.FullName
        }
    }

# vercel.json tampoco debe apuntar a ella
$vercel = [System.IO.File]::ReadAllText((Resolve-Path './vercel.json').Path)
$rutaVercel = $vercel -match 'contacto\.html'

if ($referencias.Count -gt 0 -or $rutaVercel) {
    Write-Host "ABORTADO: todavia hay referencias a contacto.html" -ForegroundColor Red
    $referencias | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    if ($rutaVercel) { Write-Host "   vercel.json" -ForegroundColor Red }
    Write-Host "Revisalas antes de borrar la pagina." -ForegroundColor Red
    exit 1
}

Write-Host "Comprobacion: ninguna pagina ni ruta enlaza contacto.html" -ForegroundColor Green

# ----------------------------------------------------------
# 2. Borrar
# ----------------------------------------------------------
if (Test-Path $objetivo) {
    Remove-Item $objetivo -Force
    Write-Host "Borrado: pages/contacto.html" -ForegroundColor Yellow
} else {
    Write-Host "pages/contacto.html ya no existia" -ForegroundColor DarkGray
}

# ----------------------------------------------------------
# 3. Estado de las paginas retiradas en la sesion anterior
# ----------------------------------------------------------
Write-Host ""
Write-Host "Estado de las paginas retiradas:" -ForegroundColor Cyan
foreach ($slug in @('about-us','ad-hoc','casos-exito')) {
    $existe = Test-Path "./pages/$slug.html"
    $enlazada = $false
    Get-ChildItem -Path . -Filter *.html -Recurse -File | ForEach-Object {
        if ([System.IO.File]::ReadAllText($_.FullName) -match "href=""[^""]*$slug") { $enlazada = $true }
    }
    $enRuta = $vercel -match $slug
    $estado = if (-not $existe -and -not $enlazada -and -not $enRuta) { "limpia" } else { "PENDIENTE" }
    $color  = if ($estado -eq 'limpia') { 'Green' } else { 'Red' }
    Write-Host ("   {0,-14} archivo:{1,-6} enlaces:{2,-6} vercel:{3,-6} -> {4}" -f `
        $slug, $(if($existe){'si'}else{'no'}), $(if($enlazada){'si'}else{'no'}), $(if($enRuta){'si'}else{'no'}), $estado) -ForegroundColor $color
}

Write-Host ""
Write-Host "PASO 2 completado." -ForegroundColor Cyan