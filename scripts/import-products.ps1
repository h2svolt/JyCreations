<#
  Copies the client's photo folders into the project, mapping each source folder
  to its collection id, and routing non-product files (category covers and group
  shots) out of the product folders.

  Usage — run from the project root:
      powershell -ExecutionPolicy Bypass -File scripts\import-products.ps1 -Source "C:\Users\TechDotPK\Desktop\H2S Volt\Collection Pictures"

  Re-running is safe: product folders are cleared and re-copied each time.
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$Source
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$productsRoot = Join-Path $projectRoot "src\assets\products"
$coversRoot  = Join-Path $projectRoot "src\assets\covers"

if (-not (Test-Path $Source)) {
  Write-Error "Source folder not found: $Source"
}

# Source folder name -> collection id in src/lib/collections.ts
$folderMap = @{
  "BookMarks"         = "bookmarks"
  "Bracelets"         = "bracelets"
  "Coasters"          = "coasters"
  "Dream Catchers"    = "dream-catchers"
  "Frame_hoop"        = "frame-hoops"
  "key_chains"        = "key-chains"
  "Purses_clutches"   = "wallets-purses-clutches"
  "Spectacles_covers" = "glasses-covers"
  "Table_covers"      = "table-mats"
}

# Files that are category covers rather than products. Key is the source
# folder; value is the filename to use as that category's cover.
$coverFiles = @{
  "Bracelets"  = "Bracelet_Category_Cover_Image.PNG"
  "key_chains" = "Cover_Image_1.WEBP"
}

# Group shots: real photos, but they show several items at once, so they must
# not appear as buyable products. Prefixed with "_" so products.ts skips them.
$groupShots = @(
  "Wallets (Image 1).PNG",
  "Wallets (Image 2).PNG",
  "Spectacle_Covers (Image 1).PNG",
  "Spectacle_Covers (Image 2).PNG",
  "Spectacle_Covers (Image 3).PNG"
)

New-Item -ItemType Directory -Force -Path $coversRoot | Out-Null

$summary = @()

foreach ($folder in $folderMap.Keys) {
  $srcDir = Join-Path $Source $folder
  $id     = $folderMap[$folder]
  $dstDir = Join-Path $productsRoot $id

  if (-not (Test-Path $srcDir)) {
    Write-Warning "Missing source folder, skipped: $folder"
    continue
  }

  New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
  Get-ChildItem -Path $dstDir -File -ErrorAction SilentlyContinue | Remove-Item -Force

  $productCount = 0
  $fileCount    = 0

  foreach ($file in Get-ChildItem -Path $srcDir -File) {
    if ($file.Extension -notmatch '^\.(jpe?g|png|webp|avif|gif)$') { continue }

    # Category cover -> src/assets/covers/<id>.<ext>, picked up automatically.
    if ($coverFiles.ContainsKey($folder) -and $file.Name -eq $coverFiles[$folder]) {
      Copy-Item $file.FullName (Join-Path $coversRoot "$id$($file.Extension)") -Force
      continue
    }

    # Any other file with "Cover_Image" in the name is a spare cover: keep it
    # in the folder but prefix it so it is not treated as a product.
    if ($file.Name -match 'Cover_Image') {
      Copy-Item $file.FullName (Join-Path $dstDir "_$($file.Name)") -Force
      continue
    }

    if ($groupShots -contains $file.Name) {
      Copy-Item $file.FullName (Join-Path $dstDir "_$($file.Name)") -Force
      continue
    }

    Copy-Item $file.FullName (Join-Path $dstDir $file.Name) -Force
    $fileCount++
  }

  # Count distinct products by stripping the image markers.
  $bases = Get-ChildItem -Path $dstDir -File |
    Where-Object { $_.Name -notlike "_*" } |
    ForEach-Object {
      $n = $_.Name -replace '\.(jpe?g|png|webp|avif|gif)$', ''
      $n = $n -replace '\.(jpe?g|png|webp|avif|gif)$', ''
      $n = $n -replace '\s*\(\s*[Ii]mage\s*\d+\s*\)\s*$', ''
      $n = $n -replace '[_-][Ii]mage[_-]\d+$', ''
      $n.Trim()
    } | Sort-Object -Unique

  $productCount = $bases.Count
  $summary += [PSCustomObject]@{
    Category = $id
    Products = $productCount
    Files    = $fileCount
  }
}

Write-Host ""
Write-Host "Import complete." -ForegroundColor Green
$summary | Sort-Object Category | Format-Table -AutoSize
Write-Host ("Total products: " + ($summary | Measure-Object -Property Products -Sum).Sum)
Write-Host ""
Write-Host "Covers written to src\assets\covers\ :" -ForegroundColor Cyan
Get-ChildItem -Path $coversRoot -File -ErrorAction SilentlyContinue |
  ForEach-Object { Write-Host ("  " + $_.Name) }
Write-Host ""
Write-Host "Still to do: create covers for the categories not listed above," -ForegroundColor Yellow
Write-Host "and save each as src\assets\covers\<collection-id>.png" -ForegroundColor Yellow
