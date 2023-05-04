#!/bin/bash
cd /home/noti-fi

echo "Introduce el nombre del archivo"
nom="$1" 

# Verificar que la entrada solo contenga letras y números
if [[ $nom =~ ^[a-zA-Z0-9]+$ ]]; then
    echo "La entrada es válida: $nom"

    if [ ! -f "/home/.openvpn/$nom.ovpn" ]; then
    	echo "El archivo no existe"

	sleep 1

	expect << EOF
	    set timeout 3
            spawn ./openvpn.sh
            expect "Option: "
            send "1\r"
            expect "Name: "
            send "$nom\r"
            expect eof
EOF
	sudo su <<EOF
	echo "Root Successful"
	cd /root/ && pwd
	sudo cp /root/$nom.ovpn /home/.openvpn && echo "Copy Successful"
	sudo chown noti-fi /home/.openvpn/$nom.ovpn && echo "Change Ownership Successful"
	echo "Mostrando contenido de /home/.openvpn:"
	ls -la /home/.openvpn
	exit
EOF
    else
    	echo "invalid name"
    fi

else
    echo "La entrada no es válida. Solo se permiten letras y números sin espacios ni caracteres especiales."
fi
