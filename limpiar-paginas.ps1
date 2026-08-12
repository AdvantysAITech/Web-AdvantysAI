# ==========================================================
#  Advantys AI — Limpieza de páginas retiradas
#  Elimina about-us / ad-hoc / casos-exito y todos los
#  enlaces y bloques de la web que llevaban a ellas.
#
#  Ejecutar desde la RAÍZ del repo (donde está vercel.json).
# ==========================================================

$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)   # UTF-8 sin BOM

# Páginas a retirar (slug tal cual aparece en los href)
$slugs = @('about-us', 'ad-hoc', 'casos-exito')
$slugPattern = ($slugs | ForEach-Object { [regex]::Escape($_) }) -join '|'

# ----------------------------------------------------------
# 0. Comprobación de que estamos en la raíz del repo
# ----------------------------------------------------------
if (-not (Test-Path './vercel.json')) {
    throw "No encuentro vercel.json. Ejecuta el script desde la raíz del repo Web-AdvantysAI."
}

# ----------------------------------------------------------
# 1. Limpiar enlaces y bloques en todos los .html
# ----------------------------------------------------------
# Captura el <a>...</a> completo (una o varias líneas) cuyo href apunte a
# una de las páginas retiradas, junto con el comentario HTML que lo preceda
# y la línea en blanco que lo siga.
$anchorRegex = "(?sm)^[ \t]*(?:<!--(?:(?!-->).)*?-->[ \t]*\r?\n[ \t]*)?" +
               "<a\b[^>]*href=""[^""]*(?:$slugPattern)[^""]*""[^>]*>.*?</a>[ \t]*\r?\n(?:[ \t]*\r?\n)?"

$total = 0

Get-ChildItem -Path . -Filter *.html -Recurse -File |
    Where-Object { $_.FullName -notmatch '\\pages\\(about-us|ad-hoc|casos-exito)\.html$' } |
    ForEach-Object {
        $path = $_.FullName
        $original = [System.IO.File]::ReadAllText($path)
        $encontrados = [regex]::Matches($original, $anchorRegex).Count
        if ($encontrados -eq 0) { return }

        $clean = [regex]::Replace($original, $anchorRegex, '')
        [System.IO.File]::WriteAllText($path, $clean, $utf8)

        $total += $encontrados
        Write-Host ("  [{0} enlaces] {1}" -f $encontrados, $_.FullName.Replace((Get-Location).Path + [IO.Path]::DirectorySeparatorChar, '')) -ForegroundColor DarkGray
    }

Write-Host "$total enlaces eliminados en archivos .html" -ForegroundColor Green

# ----------------------------------------------------------
# 2. Limpiar las rutas de vercel.json
# ----------------------------------------------------------
$vercelPath = (Resolve-Path './vercel.json').Path
$vercel = [System.IO.File]::ReadAllText($vercelPath)

$rutaRegex = "(?m)^[ \t]*\{[^\r\n]*(?:$slugPattern)[^\r\n]*\},?[ \t]*\r?\n"
$rutasBorradas = [regex]::Matches($vercel, $rutaRegex).Count
$vercel = [regex]::Replace($vercel, $rutaRegex, '')

# Repara la coma sobrante si la línea borrada era la última de un array
$vercel = [regex]::Replace($vercel, "(?m),([ \t]*\r?\n[ \t]*\])", '$1')

[System.IO.File]::WriteAllText($vercelPath, $vercel, $utf8)
Write-Host "$rutasBorradas rutas eliminadas de vercel.json" -ForegroundColor Green

try {
    $null = $vercel | ConvertFrom-Json
    Write-Host "vercel.json sigue siendo JSON valido" -ForegroundColor Green
} catch {
    Write-Host "ATENCION: vercel.json ha quedado con sintaxis invalida. Revisalo antes de commitear." -ForegroundColor Red
}

# ----------------------------------------------------------
# 3. Borrar los archivos de las páginas retiradas
# ----------------------------------------------------------
foreach ($slug in $slugs) {
    $file = "./pages/$slug.html"
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Borrado: pages/$slug.html" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Listo. Revisa 'git diff' antes de commitear." -ForegroundColor Cyan