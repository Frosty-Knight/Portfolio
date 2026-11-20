# Windows: copies your compressed clips into assets/video under the names the site expects.
# Matching ignores case, spaces, '+', '-' and '_' in your filenames.
# Usage (PowerShell, from the portfolio folder):
#   powershell -ExecutionPolicy Bypass -File .\tools\place_videos.ps1 -Source "C:\Users\Adhvaith\Videos\Portfolio\Compressed"
param([Parameter(Mandatory = $true)][string]$Source)
$map = [ordered]@{
  'elevatorweaponpickup'  = 'arena-elevator-weapon-pickup'
  'spawnscore'            = 'arena-spawn-score'
  'navmeshinviswalls'     = 'arena-navmesh-invisible-walls'
  'shootdeath'            = 'arena-shoot-death'
  'rangedenemy'           = 'souls-ranged-enemy'
  'player'                = 'souls-player'
  'chainattackhiteffects' = 'souls-chain-attack-hit-effects'
  'attacksense'           = 'souls-attack-sense'
  'soundenemyattacks'     = 'souls-sound-enemy-attacks'
  'enemypathsightdeath'   = 'souls-enemy-path-sight-death'
  'blockforget'           = 'souls-block-forget'
}
$dest = Join-Path $PSScriptRoot '..\assets\video'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$files = @(Get-ChildItem -Path $Source -File | Where-Object { $_.Extension -ieq '.mp4' })
foreach ($k in $map.Keys) {
  $f = $files | Where-Object { ($_.BaseName.ToLower() -replace '[^a-z0-9]', '').Contains($k) } | Select-Object -First 1
  if ($f) {
    Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $dest ($map[$k] + '.mp4')) -Force
    Write-Host ("OK       {0}  ->  {1}.mp4" -f $f.Name, $map[$k])
  } else {
    Write-Host ("MISSING  no .mp4 whose name contains '{0}'" -f $k) -ForegroundColor Yellow
  }
}
