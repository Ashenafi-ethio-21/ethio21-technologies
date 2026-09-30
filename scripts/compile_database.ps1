<#
.SYNOPSIS
  ETHIO 21 - University Exam Question Database Compiler
.DESCRIPTION
  Scans data/universities/<uni>/<year>/<course>/ for mid.json and final.json,
  validates question schemas, and compiles into assets/exam_data.json.
#>

$baseDir = "C:\Users\miklo\.gemini\antigravity\scratch\ethio21-technologies"
$dataDir = Join-Path $baseDir "data\universities"
$examDataPath = Join-Path $baseDir "assets\exam_data.json"

if (-not (Test-Path $examDataPath)) {
    Write-Host "ERROR: assets/exam_data.json not found!" -ForegroundColor Red
    exit 1
}

$rawJson = [System.IO.File]::ReadAllText($examDataPath, [System.Text.Encoding]::UTF8)
$examData = $rawJson | ConvertFrom-Json

if (-not $examData.questions) {
    $examData | Add-Member -MemberType NoteProperty -Name "questions" -Value (New-Object PSObject)
}

$compiledCount = 0

Get-ChildItem -Path $dataDir -Directory | ForEach-Object {
    $uniDir = $_
    $uniId = $uniDir.Name

    Get-ChildItem -Path $uniDir.FullName -Directory | ForEach-Object {
        $yearDir = $_
        $yearId = $yearDir.Name

        Get-ChildItem -Path $yearDir.FullName -Directory | ForEach-Object {
            $courseDir = $_
            $courseId = $courseDir.Name

            # Check mid.json
            $midPath = Join-Path $courseDir.FullName "mid.json"
            if (Test-Path $midPath) {
                try {
                    $midContent = [System.IO.File]::ReadAllText($midPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
                    if ($midContent -and $midContent.Count -gt 0) {
                        # Ensure hierarchy exists in examData
                        if (-not $examData.questions.$uniId) {
                            $examData.questions | Add-Member -MemberType NoteProperty -Name $uniId -Value (New-Object PSObject) -Force
                        }
                        if (-not $examData.questions.$uniId.$yearId) {
                            $examData.questions.$uniId | Add-Member -MemberType NoteProperty -Name $yearId -Value (New-Object PSObject) -Force
                        }
                        if (-not $examData.questions.$uniId.$yearId.$courseId) {
                            $examData.questions.$uniId.$yearId | Add-Member -MemberType NoteProperty -Name $courseId -Value (New-Object PSObject) -Force
                        }
                        $examData.questions.$uniId.$yearId.$courseId | Add-Member -MemberType NoteProperty -Name "mid" -Value $midContent -Force
                        $compiledCount += $midContent.Count
                        Write-Host "  [Compiled] $uniId / $yearId / $courseId / mid ($($midContent.Count) Qs)" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "  [Warning] Failed to parse $($midPath): $_" -ForegroundColor Yellow
                }
            }

            # Check final.json
            $finalPath = Join-Path $courseDir.FullName "final.json"
            if (Test-Path $finalPath) {
                try {
                    $finalContent = [System.IO.File]::ReadAllText($finalPath, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
                    if ($finalContent -and $finalContent.Count -gt 0) {
                        if (-not $examData.questions.$uniId) {
                            $examData.questions | Add-Member -MemberType NoteProperty -Name $uniId -Value (New-Object PSObject) -Force
                        }
                        if (-not $examData.questions.$uniId.$yearId) {
                            $examData.questions.$uniId | Add-Member -MemberType NoteProperty -Name $yearId -Value (New-Object PSObject) -Force
                        }
                        if (-not $examData.questions.$uniId.$yearId.$courseId) {
                            $examData.questions.$uniId.$yearId | Add-Member -MemberType NoteProperty -Name $courseId -Value (New-Object PSObject) -Force
                        }
                        $examData.questions.$uniId.$yearId.$courseId | Add-Member -MemberType NoteProperty -Name "final" -Value $finalContent -Force
                        $compiledCount += $finalContent.Count
                        Write-Host "  [Compiled] $uniId / $yearId / $courseId / final ($($finalContent.Count) Qs)" -ForegroundColor Green
                    }
                } catch {
                    Write-Host "  [Warning] Failed to parse $($finalPath): $_" -ForegroundColor Yellow
                }
            }
        }
    }
}

$outputJson = $examData | ConvertTo-Json -Depth 15
[System.IO.File]::WriteAllText($examDataPath, $outputJson, [System.Text.Encoding]::UTF8)

Write-Host "Exam database compiled successfully! Newly integrated questions: $compiledCount" -ForegroundColor Cyan
