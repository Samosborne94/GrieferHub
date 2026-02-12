param(
    [string]$Tool = "claude",
    [int]$MaxIterations = 10
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$prdFile = Join-Path $scriptDir "prd.json"
$progressFile = Join-Path $scriptDir "progress.txt"
$lastBranchFile = Join-Path $scriptDir ".last-branch"
$claudeFile = Join-Path $scriptDir "CLAUDE.md"
$promptFile = Join-Path $scriptDir "prompt.md"

if ($Tool -eq "claude" -and !(Test-Path $claudeFile)) {
    Write-Error "CLAUDE.md not found in $scriptDir"
    return
}
if ($Tool -eq "amp" -and !(Test-Path $promptFile)) {
    Write-Error "prompt.md not found in $scriptDir"
    return
}

Write-Host "Starting Ralph - Tool: $Tool - Max iterations: $MaxIterations" -ForegroundColor Cyan

for ($i = 1; $i -le $MaxIterations; $i++) {
    Write-Host ""
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host "  Ralph Iteration $i of $MaxIterations ($Tool)" -ForegroundColor Yellow
    Write-Host "===============================================================" -ForegroundColor Yellow

    $output = ""
    if ($Tool -eq "claude") {
        # Using Get-Content | claude to pipe instructions
        $output = Get-Content $claudeFile | claude --dangerously-skip-permissions --print 2>&1
    } elseif ($Tool -eq "amp") {
        $output = Get-Content $promptFile | amp --dangerously-allow-all 2>&1
    }

    # Print output to console
    $output | ForEach-Object { Write-Host $_ }

    # Check for completion signal
    $flatOutput = $output -join "`n"
    if ($flatOutput -like "*<promise>COMPLETE</promise>*") {
        Write-Host ""
        Write-Host "Ralph completed all tasks!" -ForegroundColor Green
        return
    }

    Write-Host "Iteration $i complete. Continuing..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Ralph reached max iterations ($MaxIterations) without completing all tasks." -ForegroundColor Red
exit 1
