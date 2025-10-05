param(
  [string]$BranchName = 'eleven-lab'
)

Write-Host "Checking for tracked .env..."
$tracked = git ls-files --error-unmatch .env 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host ".env is tracked in git! Removing from index now..." -ForegroundColor Yellow
  git rm --cached .env
  git commit -m "chore: remove .env from index" | Out-Null
}

Write-Host "Ensuring .env is in .gitignore"
if (-not (Select-String -Path .gitignore -Pattern '^\.env$' -Quiet)) {
  Add-Content -Path .gitignore -Value '.env'
  git add .gitignore
  git commit -m "chore: ignore .env" | Out-Null
}

Write-Host "Creating branch $BranchName and pushing..."
git checkout -b $BranchName
git add .
git commit -m "feat(voice): add Gemini + ElevenLabs voice page and demo" -q
git push -u origin $BranchName

Write-Host "Done. Branch '$BranchName' pushed to origin." -ForegroundColor Green
