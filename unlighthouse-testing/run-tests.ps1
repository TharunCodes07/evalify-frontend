# Run Unlighthouse tests for DevLabs application
# Usage: .\run-tests.ps1 [role] [-Static]
# Roles: admin, manager, staff, student, all

param(
    [Parameter(Position=0)]
    [string]$Role = "",
    
    [Parameter()]
    [switch]$Static
)

# Default credentials (change these if needed)
$credentials = @{
    "admin" = @{ username = "admin"; password = "1234" }
    "manager" = @{ username = "manager"; password = "1234" }
    "staff" = @{ username = "staff"; password = "1234" }
    "student" = @{ username = "student"; password = "1234" }
}

# Function to run test for a specific role
function Run-Test {
    param(
        [string]$TestRole,
        [bool]$GenerateStatic
    )
    
    if (-not $credentials.ContainsKey($TestRole)) {
        Write-Host "Error: Unknown role '$TestRole'" -ForegroundColor Red
        Write-Host "Available roles: admin, manager, staff, student"
        exit 1
    }
    
    $cred = $credentials[$TestRole]
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Running Unlighthouse for role: $TestRole" -ForegroundColor Green
    Write-Host "Username: $($cred.username)" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
    # Set environment variables
    $env:ROLE = $TestRole
    $env:KC_USERNAME = $cred.username
    $env:KC_PASSWORD = $cred.password
    
    # Change to the unlighthouse-testing directory
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    Push-Location $scriptDir
    
    try {
        if ($GenerateStatic) {
            Write-Host "Generating static report..." -ForegroundColor Yellow
            npx unlighthouse --config-file ./unlighthouse.config.mjs --build-static
            
            # Move the report to a role-specific folder
            if (Test-Path "./.unlighthouse") {
                $reportDir = "./reports/$TestRole"
                if (Test-Path $reportDir) {
                    Remove-Item -Recurse -Force $reportDir
                }
                New-Item -ItemType Directory -Force -Path "./reports" | Out-Null
                Move-Item "./.unlighthouse" $reportDir
                Write-Host "Report saved to: $reportDir" -ForegroundColor Green
            }
        } else {
            npx unlighthouse --config-file ./unlighthouse.config.mjs
        }
    }
    finally {
        Pop-Location
    }
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Completed test for role: $TestRole" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
}

# Main script
if ($Role -eq "") {
    Write-Host "Usage: .\run-tests.ps1 [role] [-Static]"
    Write-Host "Roles: admin, manager, staff, student, all"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\run-tests.ps1 admin              # Run interactive audit for admin"
    Write-Host "  .\run-tests.ps1 manager -Static    # Generate static report for manager"
    Write-Host "  .\run-tests.ps1 all                # Run audits for all roles"
    Write-Host "  .\run-tests.ps1 all -Static        # Generate static reports for all roles"
    exit 1
}

if ($Role -eq "all") {
    Write-Host "Running tests for all roles..." -ForegroundColor Yellow
    foreach ($roleName in @("admin", "manager", "staff", "student")) {
        Run-Test -TestRole $roleName -GenerateStatic $Static
        Write-Host ""
        Start-Sleep -Seconds 2  # Brief pause between tests
    }
    Write-Host "All tests completed!" -ForegroundColor Green
} else {
    Run-Test -TestRole $Role -GenerateStatic $Static
}
