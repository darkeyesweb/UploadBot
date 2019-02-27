var fs = require('fs');
var request = require('request');
var {Client,RichEmbed} = require('discord.js');

exports.getuser = function(g, m) {
	
	var args = m.content.split(" ", 3);
	var user = m.author;
	var authorized = false;
	var code = "";
	var possibleusers = {};
	var returndata = {};
	
	const authroles = {"545342506745725023": true};
	const authusers = {"395612767136251904": true};
	
	/*g.roles.array().forEach((role) => {
		if (authroles[role.id])
			if (g.roles.get(role.id).members.get(user.id) !== undefined)
				var authorized = true;
	});*/
	
	authorized = authusers[user.id];
	if (authorized === true) {
		console.log("user is authorized");
		fs.readFile("I:/xampp/AuthFiles/DiscordApp/users", "utf8", (err, data) => {
			if (err)
				return "Error reading file: \n```".err;
			//console.log(data);
			data.split("\n").forEach((user) => {
				if (user.split("::").length != 3)
					return;
					
				var userdata = user.split("\n");
				//console.log("Checking user "+userdata);
				if (userdata[0].search(args[1]) == 0 || userdata[2] == args[1]) {
					console.log("Matched user: "+userdata);
					return `*Username:* ${userdata[0]}\n*Password:* ${userdata[1]}\n*UserID:* ${userdata[2]}`;
				}
			});
		});
	} else {
		return "Command unknown or you're not authorized to run it";
	}
}

exports.getpass = function(m) {
	console.log(m.author.username.toLowerCase() + ": password command");
  fs.readFile("I:/xampp/AuthFiles/DiscordApp/users", "utf8", (err, data) => {
  	data.split("\n").forEach((val, i) => {
    	var un = val.split("::")[0];
      var p = val.split("::")[1];
      if (val.split("::")[2] == m.author.id) {
      	m.author.createDM().then((DMC) => {
        	DMC.send("Your Pisscord.org account credentials:\n```Username: "+un+"\nPassword: "+p+"```");
        });
      } else if (i == data.split("\n").length) {
      	m.author.createDM().then((DMC) => {
        	DMC.send("You do not have an account made currently. Please message @Ghost to register an account");
        });
      }
    });
  });
}

exports.attachments = function(g,m) {
	g.channels.find(channel => channel.name === args[1]).fetchMessages({limit: 100}).then((messages) => {
		messages.forEach((msg) => {
			var att = (msg.attachments).array();
			if (att.length) {
				att.forEach((a) => {
					console.log("Attachment: "+a.filename);
					if (fs.isFile(`M:/Pisscord/attachments/${args[1].toLowerCase()}/${a.filename}`)) {
						return;
					} else {
						request(a.url).pipe(fs.createWriteStream(`M:/Pisscord/attachments/${args[1].toLowerCase()}/${a.filename}`));
					}
				});
			}
		});
	}).catch(console.error);
}