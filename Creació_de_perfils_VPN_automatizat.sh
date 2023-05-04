#!/bin/bash
cd /home/noti-fi

echo "Introduce el nombre del archivo"
read nom

# Verificar que la entrada solo contenga letras y números
if [[ $nom =~ ^[a-zA-Z0-9]+$ ]]; then
    echo "La entrada es válida: $nom"
else
    echo "La entrada no es válida. Solo se permiten letras y números sin espacios ni caracteres especiales."
fi

sleep 1

expect << EOF
    set timeout 3
    spawn -noecho ./openvpn.sh
    expect "Option: "
    send "1\r"
    expect "Name: "
    send "$nom\r"
    expect eof
EOF

clear

sudo su <<EOF
echo "Root Successful"
cd /root/ && pwd
sudo cp /root/$nom.ovpn /home/.openvpn && echo "Copy Successful"
sudo chown -R noti-fi /home/.openvpn/$nom.ovpn && echo "Change Ownership Successful"
echo "Mostrando contenido de /home/.openvpn:"
ls -la /home/.openvpn
exit
EOF
