#!/bin/bash

pass="A123456789a!"

nom="$1"

expect << EOF
    spawn -noecho scp -P 3222 noti-fi@noti-fi.ddns.net:/home/.openvpn/$nom.ovpn /home/ubuntu/notifitec/certs/
    expect "Enter passphrase for key '/home/ubuntu/.ssh/id_rsa': "
    send "$pass\r"
    expect eof
EOF
