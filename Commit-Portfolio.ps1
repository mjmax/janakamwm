param(
    [switch]$SkipPush
)

$ErrorActionPreference = 'Stop'

function Invoke-PortfolioGit {
    param([string[]]$GitArguments)
    & git -C $PSScriptRoot @GitArguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git failed: git $($GitArguments -join ' ')"
    }
}

function New-PortfolioCommit {
    param([string]$Message, [string[]]$Paths)
    Invoke-PortfolioGit -GitArguments (@('add', '--') + $Paths)
    & git -C $PSScriptRoot diff --cached --quiet
    $differenceStatus = $LASTEXITCODE
    if ($differenceStatus -eq 0) {
        Write-Host "Already committed: $Message"
        return
    }
    if ($differenceStatus -ne 1) {
        throw 'Could not inspect the staged changes.'
    }
    Invoke-PortfolioGit -GitArguments @('diff', '--cached', '--check')
    Invoke-PortfolioGit -GitArguments @('commit', '-m', $Message)
}

function Test-PortfolioStaticFiles {
    param([string]$Root)
    $htmlPath = Join-Path $Root 'index.html'
    $html = Get-Content -LiteralPath $htmlPath -Raw -Encoding UTF8
    $ids = @{}
    foreach ($match in [regex]::Matches($html, '\bid="([^"]+)"')) {
        $id = $match.Groups[1].Value
        if ($ids.ContainsKey($id)) { throw "Duplicate HTML ID: $id" }
        $ids[$id] = $true
    }
    foreach ($match in [regex]::Matches($html, '\bhref="#([^"]+)"')) {
        $id = $match.Groups[1].Value
        if (-not $ids.ContainsKey($id)) { throw "Missing section anchor: $id" }
    }
    foreach ($match in [regex]::Matches($html, '(?:src|href)="([^"#:]+)"')) {
        $relativePath = $match.Groups[1].Value
        if ($relativePath -match '^(https?:|mailto:|tel:)') { continue }
        if (-not (Test-Path -LiteralPath (Join-Path $Root $relativePath) -PathType Leaf)) {
            throw "Missing local file: $relativePath"
        }
    }
    $galleryScript = Get-Content -LiteralPath (Join-Path $Root 'galleries.js') -Raw -Encoding UTF8
    $galleryMatch = [regex]::Match($galleryScript, '(?s)const PROJECT_GALLERIES = (\{.*?\});')
    if (-not $galleryMatch.Success) { throw 'Gallery data was not found.' }
    $galleryData = $galleryMatch.Groups[1].Value | ConvertFrom-Json
    foreach ($gallery in $galleryData.PSObject.Properties) {
        foreach ($image in $gallery.Value) {
            if (-not (Test-Path -LiteralPath (Join-Path $Root $image.src) -PathType Leaf)) {
                throw "Missing gallery image: $($image.src)"
            }
        }
    }
    Write-Host 'Passed: local file references, section anchors, unique IDs, and gallery images.'
}

Invoke-PortfolioGit -GitArguments @('rev-parse', '--show-toplevel')
$stagedPaths = & git -C $PSScriptRoot diff --cached --name-only
if ($LASTEXITCODE -ne 0) { throw 'Could not inspect existing staged changes.' }
if ($stagedPaths) {
    throw 'There are already staged changes. Commit or unstage them before running this script.'
}

# This static site can be committed without installing Node.js locally.
Test-PortfolioStaticFiles -Root $PSScriptRoot
$nodeCommand = Get-Command node -CommandType Application -ErrorAction SilentlyContinue
Push-Location -LiteralPath $PSScriptRoot
try {
    if ($null -ne $nodeCommand) {
        & $nodeCommand.Source scripts/check.mjs
        if ($LASTEXITCODE -ne 0) { throw 'Portfolio checks failed.' }
        & $nodeCommand.Source scripts/build.mjs
        if ($LASTEXITCODE -ne 0) { throw 'Portfolio build failed.' }
    }
    else {
        Write-Host 'Node.js is not on PATH. Static checks passed; GitHub Actions will run the full checks and build.'
    }
}
finally { Pop-Location }

New-PortfolioCommit -Message 'feat: build biography-first engineering portfolio with project galleries' -Paths @(
    '.gitignore', 'index.html', 'styles.css', 'biography.css',
    'app.js', 'config.js', 'galleries.js', 'assets'
)

New-PortfolioCommit -Message 'build: add local preview, validation, and static site packaging' -Paths @(
    'package.json', 'scripts', '.nojekyll', 'Commit-Portfolio.ps1'
)

New-PortfolioCommit -Message 'ci: deploy portfolio to GitHub Pages and document setup' -Paths @(
    '.github/workflows/pages.yml', 'README.md'
)

Invoke-PortfolioGit -GitArguments @('log', '-3', '--oneline')
if (-not $SkipPush) {
    # A normal push preserves GitHub history and stops if the remote has diverged.
    Invoke-PortfolioGit -GitArguments @('push', '-u', 'origin', 'HEAD')
}
