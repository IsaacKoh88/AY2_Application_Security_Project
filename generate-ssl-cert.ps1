# Create directory for certs if it does not exist
$FolderName = ".\reverse-proxy\certs"
if (Test-Path $FolderName) {
    Write-Host ".\reverse-proxy\certs exists"
    # Perform Delete file from folder operation
}
else
{
    #PowerShell Create directory if not exists
    New-Item $FolderName -ItemType Directory
    Write-Host "Folder Created successfully"
}

# Generate ssl certs and private key
openssl req -x509 -out reverse-proxy/certs/localhost.crt -keyout reverse-proxy/certs/localhost.key `
    -days 7 `
    -newkey rsa:2048 -nodes -sha256 `
    -subj '/CN=localhost'

# Add ssl cert to trusted cert list
#certutil -addstore -f "ROOT" app/certs/localhost.crt
