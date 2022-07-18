mkdir -p app/certs
openssl req -x509 -out app/certs/localhost.crt -keyout app/certs/localhost.key \
    -days 365 \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' -extensions EXT -config <( \
    printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain app/certs/localhost.crt