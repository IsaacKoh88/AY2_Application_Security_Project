# Create directory for certs if it does not exist
$FolderName = ".\app\certs"
if (Test-Path $FolderName) {
    Write-Host "Folder Exists"
    # Perform Delete file from folder operation
}
else
{
    #PowerShell Create directory if not exists
    New-Item $FolderName -ItemType Directory
}

# Generate ssl certs and private key
openssl req -x509 -out app\certs\localhost.crt -keyout app\certs\localhost.key /
    -days 365 /
    -newkey rsa:2048 -nodes -sha256 /
    -subj '\CN=localhost' -extensions EXT -config <( /
    printf "[dn]/nCN=localhost/n[req]/ndistinguished_name = dn/n[EXT]/nsubjectAltName=DNS:localhost/nkeyUsage=digitalSignature/nextendedKeyUsage=serverAuth")

# Add ssl cert to trusted cert list
certutil -addstore -f "ROOT" app/certs/localhost.crt