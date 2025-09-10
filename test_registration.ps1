$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    action = "register"
    email = "test@example.com"
    password = "Password123!"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3013/api/auth" -Method POST -Headers $headers -Body $body
    Write-Host "Registration successful:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Registration failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
}
