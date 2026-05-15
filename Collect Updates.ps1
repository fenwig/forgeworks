$projectRoot  = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputFolder = Join-Path $projectRoot 'Updates to be sent'
$appPatterns  = @('forgeworks_*.html', 'forgeworks_*.js', 'legacy_*.md', '*.png')

function Is-AppFile($filename) {
    foreach ($p in $appPatterns) { if ($filename -like $p) { return $true } }
    return $false
}

try {
    Write-Host ''
    Write-Host 'TI FORGEWORKS -- Collect Updates' -ForegroundColor Cyan
    Write-Host '--------------------------------' -ForegroundColor DarkGray

    $committed   = git -C $projectRoot diff --name-only distributed HEAD 2>$null
    $uncommitted = git -C $projectRoot status --porcelain 2>$null |
                   ForEach-Object { if ($_ -and $_.Length -gt 3) { $_.Substring(3).Trim() } }
    $allChanged  = ($committed + $uncommitted) | Where-Object { $_ } | Sort-Object -Unique

    $toCollect = $allChanged |
                 Where-Object { Is-AppFile (Split-Path $_ -Leaf) } |
                 Where-Object { Test-Path (Join-Path $projectRoot $_) }

    if (-not $toCollect) {
        Write-Host 'No app file changes since last distribution.' -ForegroundColor Yellow
    } else {
        if (-not (Test-Path $outputFolder)) {
            New-Item -ItemType Directory -Path $outputFolder | Out-Null
        }
        $copied = 0
        foreach ($file in $toCollect) {
            $leaf = Split-Path $file -Leaf
            Copy-Item (Join-Path $projectRoot $file) (Join-Path $outputFolder $leaf) -Force
            Write-Host "  + $leaf" -ForegroundColor Green
            $copied++
        }
        Write-Host ''
        Write-Host "$copied file(s) ready in 'Updates to be sent'." -ForegroundColor Cyan
        Write-Host 'Zip the folder and send to friends.' -ForegroundColor Cyan
        Write-Host "Run 'Clear Updates.ps1' after sending." -ForegroundColor DarkGray
    }
} catch {
    Write-Host ''
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ''
Start-Sleep -Seconds 3
