# Create directory for certs if it does not exist
mkdir -p app/certs
# Generate ssl certs and private key
openssl req -x509 -out app/certs/localhost.crt -keyout app/certs/localhost.key \
    -days 365 \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' -extensions EXT -config <( \
    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
# Add ssl cert to trusted cert list
OS="`uname`"
case $OS in
    'Linux'*)
        sudo cp app/certs/localhost.crt /usr/local/share/ca-certificates/localhost.crt
        sudo update-ca-certificates
        ;;
    'Darwin'*)
        sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain app/certs/localhost.crt
        ;;
    'Windows'*)
        certutil -addstore -f "ROOT" app/certs/localhost.crt
        ;;
esac