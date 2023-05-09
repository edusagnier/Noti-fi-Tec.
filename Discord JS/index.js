require('dotenv').config();
const Discord = require('discord.js');
const { exec } = require('child_process');
const { stdout } = require('process');
const fs = require('fs');

const client = new Discord.Client();

const prefix = "!"

client.on('ready', () => {
	console.log(`Bot encendido ${client.user.tag}!`);
});

client.on('message', message => {
if(message.content.includes("ping")) {
	message.reply("pong");
}
});

client.on("message", message => {
if(message.content.toLocaleLowerCase().startsWith(prefix + "help") || message.content.toLocaleLowerCase().startsWith(prefix + "h")) {
	const embed = new Discord.MessageEmbed()
    .setTitle("Noti-Fi Tec Help")
    .setThumbnail(client.user.displayAvatarURL())
    .setColor("#ffffff")
    .addFields(
      { name: "Tickets", value: "If you want to contact with our support, go to <#1099418332375023762> and open a Ticket."},
      { name: "Commands", value: "If you want to see all the available commands, use !commands."},
      { name: "Website", value: "This is our website https://noti-fi.ddns.net"}
    )
    .setTimestamp(new Date().toLocaleString("es-ES"))
    .setFooter("Developed by Noti-Fi Tec")
  message.channel.send(embed)
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

  if(message.content.startsWith(prefix + "makecert") && !message.member.roles.cache.has("1099418331167064224")) {
    message.reply("You don't have permissions to execute this command.").then(msg => msg.delete({timeout: 15000}))
  }

  else if(message.content.startsWith(prefix + "makecert") && message.content.length >= 11 && message.member.roles.cache.has("1099418331167064224")) {
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
        if(stdout.toLocaleLowerCase().includes("invalid name")) {
          message.reply(`The name that you've used is invald or it's not available, if you want to download it, use ${prefix}getcert **name**`)
          .then(msg => msg.delete({timeout: 30000}));
        }
        else if(!stdout.toLocaleLowerCase().includes("invalid name")) {
        message.reply(`Here you have your OVPN Certificate:`, {
          files: [{
            attachment: archivo,
            name: `${args[0]}.ovpn`
          }]
        }).then(msg => msg.delete({timeout: 30000}));
      }
      })
  })
  } else if(message.content.startsWith(prefix + "makecert") && message.content.length <= 10 && message.member.roles.cache.has("1099418331167064224")) {
    message.reply("You must specify a name for the certificate after the command ``!makecert **yourname**``")
    .then(msg => msg.delete({timeout: 30000}));
  }
});

client.on("message", async message => {
  const lista = ['a','b','c','d','e','f','g','h','i','j',
  'k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x',
  'y','z','0','1','2','3','4','5','6','7','8','9'];
  const argslista = message.content.slice(9).trim();

  if (message.content.startsWith(prefix + "getcert") && argslista.split('').some(c => !lista.includes(c.toLowerCase()))) {
    message.reply("The specified name contains special characters, the name must use A-Z letters or/and 0-9 numbers.")
      .then(msg => msg.delete({timeout: 30000}));
    return;
  }

  if(message.content.startsWith(prefix + "getcert") && !message.member.roles.cache.has("1099418331167064224")) {
    message.reply("You don't have permissions to execute this command.").then(msg => msg.delete({timeout: 15000}))
  }

  if(message.content.startsWith(prefix + "getcert") && message.content.length <= 9 && message.member.roles.cache.has("1099418331167064224")) {
    message.reply("You must specify a name for the certificate after the command ``!getcert **yourname**``")
    .then(msg => msg.delete({timeout: 30000}));
  }

  else if(message.content.startsWith(prefix + "getcert") && message.content.length >= 10 && message.member.roles.cache.has("1099418331167064224")) {
    const args = message.content.slice(9).trim().split(' ');
    exec(`bash /home/ubuntu/notifitec/get.sh ${args[0]}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error al ejecutar el comando: ${err}`)
        return;
      }
      console.log(`Resultado: ${stdout}`)
      if(stdout.includes("No such file")) {
        message.reply(`The certificate that you've specified doesn't exist, if you want to create it, use ${prefix}makecert **name**`)
        .then(msg => msg.delete({timeout: 30000}));
      }
      const archivo = `/home/ubuntu/notifitec/certs/${args[0]}.ovpn`
      fs.access(archivo, fs.constants.F_OK, (err) => {
        if(err) {
          console.error(`Error al acceder al archivo: ${err}`)
          return;
        }
        else if(!stdout.includes("No such file") || stdout.includes("100%")) {
        message.reply(`Here you have your OVPN Certificate:`, {
          files: [{
            attachment: archivo,
            name: `${args[0]}.ovpn`
          }]
        }).then(msg => msg.delete({timeout: 30000}));
      }
      })
  })
  }
});

client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.cache.get("1099418331867529419")
  if(!channel) return;

  channel.send(`Welcome to the server ${member}!`)
  member.roles.add("1099418331167064219");
});


// EMBEDS //
client.on("message", message => {
  if(message.content.startsWith(prefix + "rules") && message.member.hasPermission("ADMINISTRATOR")) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Rules")
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription("The Noti-Fi Tec Discord server rules")
      .addFields(
        { name: "Respect all members", value: "Be kind and courteous to everyone on the server, regardless of their position or status."},
        { name: "Keep conversations relevant", value: "Ensure that all conversations are related to the company's products or services."},
        { name: "No self-promotion", value: "Do not promote your own products or services on the server (Except sponsors)."},
        { name: "Keep it professional", value: "This is a professional server for a business, so maintain a professional demeanor at all times."},
        { name: "No harassment or bullying", value: "Do not harass, bully, or intimidate other members of the server."},
        { name: "No discrimination", value: "Do not discriminate against others based on their race, gender, sexuality, religion, or any other factor."},
        { name: "No spamming or flooding", value: "Do not spam or flood the server with unnecessary messages or content."},
        { name: "No offensive content", value: "Do not post any offensive or inappropriate content on the server."},
        { name: "No poltical discussions", value: "Avoid political discussions as they can be polarizing and distracting."},
      )
      .setColor("#ffffff")
      .setFooter("Noti-Fi Tec")
    message.channel.send(embed)

    const embed2 = new Discord.MessageEmbed()
      .setTitle("Consecuences")
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription("Consecuences for violating the rules")
      .addFields(
        { name: "Warning", value: " A verbal warning can be given to members who have violated a rule for the first time."},
        { name: "Muting", value: "If a member continues to violate the rules, they can be muted for a set period of time, such as 24 hours, to prevent them from posting any further messages."},
        { name: "Kick", value: "If a member repeatedly violates the rules, they can be removed from the server with a kick."},
        { name: "Ban", value: "If a member continues to violate the rules even after being warned and muted, they can be banned from the server."},
      )
      .setColor("#ffffff")
      .setFooter("Noti-Fi Tec");
    message.channel.send(embed2)
          
  }
  if(message.content.startsWith(prefix + "faq") && message.member.hasPermission("ADMINISTRATOR")) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Frequest Asked Questions")
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription("Some of the most Frequent Asked Questions")
      .addFields(
        { name: "Can I install your Noti-Fi doorbell myself, or do I need to hire a professional?", value: "Our Noti-Fi doorbell is designed to be easy to install, and most customers can install it themselve. However if you don't feel installing it, you can contract a professional to install it."},
        { name: "What is your warranty policy?", value: "We offer a limited warranty on the Noti-Fi doorbell, covering manufacturing defects and workmanship for a period of three years from the date of purchase."},
        { name: "What is your return policy?", value: "If you are not satisfied with your purchase, you can return it within 30 days of purchase for a refund or exchange, as long as the item is in its original packaging and condition."},
      )
      .setColor("#ffffff")
      .setFooter("Noti-Fi Tec")
    message.channel.send(embed)
  }
});

client.on("message", message => {
  if(message) {
    console.log(`[${message.channel.name}] - [${message.author.tag}]: ${message.content}`)
  }
});

// EMBED CREATOR //
client.on("message", message => {
  const args = message.content.slice(7).trim().split(' - ');
  if(message.content.toLocaleLowerCase().startsWith(prefix + "embed") && message.member.roles.cache.has("1099418331167064224") || message.content.toLocaleLowerCase().startsWith(prefix + "embed") && message.member.hasPermission("ADMINISTRATOR")) {
    message.delete()
    const embed = new Discord.MessageEmbed()
      .setTitle("Announcement")
      .setDescription('@everyone')
      .addFields(
        {name: args[0], value: args[1]}
        )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor("#ffffff")
      .setFooter(`Noti-Fi Tec`)
      .setTimestamp(new Date().toLocaleString('ES-es'))
  message.channel.send(embed)
  message.channel.send("@everyone").then(msg => msg.delete({timeout: 1000}))
    }
});

// DELETE MESSAGES // //NO HECHO AÚN//
client.on("message", message => {
  const args = message.content.slice(prefix.length).trim().split(' ')
  if(message.content.startsWith(prefix + "delete") && message.member.hasPermission("ADMINISTRATOR")) {
  try {
    message.channel.bulkDelete(parseInt(args[0]))
  } catch (err) {
    console.log(err)
  }
  }
});

client.login(process.env.TOKEN);
