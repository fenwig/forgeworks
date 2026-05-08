$projectRoot  = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputFolder = Join-Path $projectRoot 'Updates to be sent'

try {
    Write-Host ''
    Write-Host 'TI FORGEWORKS -- Clear Updates' -ForegroundColor Cyan
    Write-Host '------------------------------' -ForegroundColor DarkGray

    if (Test-Path $outputFolder) {
        $files = Get-ChildItem $outputFolder
        if ($files.Count -gt 0) {
            $files | Remove-Item -Force
            Write-Host "$($files.Count) file(s) cleared from 'Updates to be sent'." -ForegroundColor Green
        } else {
            Write-Host "'Updates to be sent' is already empty." -ForegroundColor Yellow
        }
    } else {
        New-Item -ItemType Directory -Path $outputFolder | Out-Null
        Write-Host 'Folder recreated.' -ForegroundColor Yellow
    }

    git -C $projectRoot tag -d distributed 2>$null | Out-Null
    git -C $projectRoot tag distributed
    Write-Host 'Baseline advanced to current version.' -ForegroundColor Green
    Write-Host 'Next collection will only include future changes.' -ForegroundColor DarkGray
} catch {
    Write-Host ''
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host ''
Start-Sleep -Seconds 3
