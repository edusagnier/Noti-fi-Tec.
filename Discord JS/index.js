require('dotenv').config();
const Discord = require('discord.js');
const { exec } = require('child_process');
const { stdout } = require('process');
const fs = require('fs');

const client = new Discord.Client();

const prefix = "!"

client.on('ready', () => {
	console.log("Bot encendido ${client.user.tag}!");
});

client.on('ready', () => {
	client.guilds.cache.get("1099418331167064218").channels.cache.get("1099418331867529424").send("Hola que tal");
});

client.on('message', message => {
if(message.content.includes("ping")) {
	message.reply("pong");
}
});

client.on("message", message => {
if(message.content.toLocaleLowerCase().startsWith(prefix + "help")) {
	message.reply("Si");
}
});

client.on("message", async message => {
  const lista = ['a','b','c','d','e','f','g','h','i','j',
  'k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x',
  'y','z','0','1','2','3','4','5','6','7','8','9'];

  const argslista = message.content.slice(10).trim();

  if (message.content.startsWith(prefix + "makecert") && argslista.split('').some(c => !lista.includes(c.toLowerCase()))) {
    message.reply("The specified name contains special characters, the name must use A-Z letters or/and 0-9 numbers.");
    return;
  }

  else if(message.content.startsWith(prefix + "makecert") && message.content.length >= 11) {
    const args = message.content.slice(10).trim().split(' ');
    exec(`bash /home/ubuntu/notifitec/ssh.sh ${args[0]}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error al ejecutar el comando: ${err}`)
        return;
      }
      console.log(`Resultado: ${stdout}`)
      const archivo = `/home/ubuntu/notifitec/certs/${args[0]}.ovpn`
      fs.access(archivo, fs.constants.F_OK, (err) => {
        if(err) {
          console.error(`Error al acceder al archivo: ${err}`)
          return;
        }
        if(stdout.includes("invalid name")) {
          message.reply(`The name that you've used is invald or it's not available, if you want to download it, use ${prefix}getcert **name**`)
          exec(`rm -rf /home/ubuntu/notifitec/certs/${args[0]}`), (err, stdout, stderr) => {
            if (err) {
              console.error(`Error al ejecutar el comando: ${err}`)
              return;
            }
            console.log(`Resultado: ${stdout}`)
          }
        }
        else if(!stdout.includes("invalid name")) {
        message.reply(`Here you have your OVPN Certificate:`, {
          files: [{
            attachment: archivo,
            name: `${args[0]}.ovpn`
          }]
        });
      }
      })
  })
  } else if(message.content.startsWith(prefix + "makecert") && message.content.length <= 10) {
    message.reply("You must specify a name for the certificate after the command ``!makecert **yourname**``")
  }
});

client.login(process.env.TOKEN);
