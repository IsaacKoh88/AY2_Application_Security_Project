# Remove ssl cert from trusted cert list
OS="`uname`"
case $OS in
    'Linux'*)
        sudo rm /usr/local/share/ca-certificates/localhost.crt
        sudo update-ca-certificates --fresh
        ;;
    'Darwin'*)
        sudo security delete-certificate -c "localhost"
        ;;
    'Windows'*)
        certutil -delstore "ROOT" serial-number-hex
        ;;
esac