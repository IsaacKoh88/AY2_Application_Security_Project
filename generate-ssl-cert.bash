# Create directory for certs if it does not exist
mkdir -p reverse-proxy/certs
# Generate ssl certs and private key
openssl req -x509 -out reverse-proxy/certs/localhost.crt -keyout reverse-proxy/certs/localhost.key \
    -days 7 \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' -extensions EXT -config <( \
    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
# Add ssl cert to trusted cert list
OS="`uname`"
case $OS in
    'Linux'*)
        sudo cp reverse-proxy/certs/localhost.crt /usr/local/share/ca-certificates/localhost.crt
        sudo update-ca-certificates
        ;;
    'Darwin'*)
        sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain reverse-proxy/certs/localhost.crt
        ;;
    'Windows'*)
        certutil -addstore -f "ROOT" reverse-proxy/certs/localhost.crt
        ;;
esac