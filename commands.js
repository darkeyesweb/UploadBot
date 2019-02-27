var fs = require('fs');
var request = require('request');
var mysql = require('mysql');
var {Client,RichEmbed} = require('discord.js');


function signup(u,p,uid) {
    console.log("Stripping username");
    var un = strip.RSExceptUnsAlpNum(u);
    console.log(un);
    fs.appendFile("I:/xampp/AuthFiles/DiscordApp/users", "\n" + un + "::" + p + "::" + uid, "utf8", (err) => {
        if (err)
            return "ERROR: " + err;
				console.log('Ghost Bot: Created a new user! [' + un + ']');
        return `Congratulations on becoming a Pisscord Member!\nYou now have the ability to upload files! To do so head over to https://pisscord.org/ and signin using these credentials:\n\`\`\`Username: ${un}\nPassword: ${pass}\`\`\`\n\nHappy Posting ;)`;
    });
    return true;
}

function setPassword(g,i,m) {
	
}


function isAlphaNumeric(str) {
    var code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};

///////////////////////////
//     E X P O R T S     //
///////////////////////////

exports.readyHandle(botjs) {
    console.log("Ghost Bot: I'm online and ready!");
    const g = botjs.guilds.get("526111037573955584");

    http.createServer((req, res) => {
        console.log("HTTP request received");
        var q = url.parse(req.url, true).query;
        console.log(q);
        botjs.channels.get(q.ch).send({
            embed: {
                author: {
                    name: "Ghost Bot",
                    icon_url: g.iconURL
                },
                title: q.title,
                url: q.link,
                description: q.desc,
                fields: [{
                        name: "Filesize: ",
                        value: q.fs
                    },
                    {
                        name: "Filename: ",
                        value: q.fn
                    },
                    {
                        name: "Uploader: ",
                        value: q.un
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: botjs.user.avatarURL,
                    text: "Ghost Bot | Made by <@395612767136251904> "
                }
            }
        });
    }).listen(8788);
    console.log("HTTP Server Listening On Port 8788");
}

exports.getuser = function(g,m) {
	
	var args = m.content.split(" ", 3);
	var user = m.author;
	var guser = g.members.get(user.id);
	var authorized = false;
	var code = "";
	var possibleusers = {};
	var returndata = {};
	
	const authrole = "545342506745725023";
	const authusers = {"395612767136251904": true};
	
	authorized = authusers[user.id];
	if (!authorized)
		authorized = guser.roles.has(authrole);
		
	if (authorized === true) {
		console.log("user is authorized");
		fs.readFile("I:/xampp/AuthFiles/DiscordApp/users", "utf8", (err, data) => {
			if (err)
				return "Error reading file: \n```".err;
			//console.log(data);
			data.split("\n").forEach((user) => {
				if (user.split("::").length != 3)
					return;
					
				var userdata = user.split("::");
				//console.log("Checking user "+userdata);
				if (userdata[0].search(args[1]) == 0 || userdata[2] == args[1]) {
					console.log("Matched user: "+userdata);
					m.author.createDM().then((dmc) => {
						m.channel.stopTyping(1);
						dmc.send(`\`\`\`*Username:* ${userdata[0]}\n*Password:* ${userdata[1]}\n*UserID:* ${userdata[2]}\`\`\``);
					});
				}
			});
		});
	} else {
		m.author.createDM().then((dmc) => {
			m.channel.stopTyping(1);
			dmc.send("Command unknown or you're not authorized to run it");
		});
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

exports.checkRoleUpdates = function(old, newuser) {
    console.log("Member Update Event");
    var oldroles = [];
    var newroles = [];

    old.roles.forEach((role, key) => {
        oldroles[role.id] = true;
    });
    newuser.roles.forEach((role, key) => {
        newroles[role.id] = true;
    });

    if (oldroles["526113421943504927"] === true) {
        return;
    } else {
        if (newroles["526113421943504927"] === true) {
            fs.readFile("I:/xampp/AuthFiles/DiscordApp/users", "utf8", (err, data) => {
                if (err)
                    return console.log(err);
                else
                    console.log("User file read");

                data.split("\n").forEach((val, i) => {
                    if (val.split("::")[0] == newuser.user.username) {
                        console.log("Ghost Bot: User already has active account");
                        return false;
                    }
                });
                newuser.createDM().then((DMC) => {
                    fs.readFile("wordlist", 'utf8', (err, data) => {
                        var min = 0;
                        var max = data.split(",").length;
                        var i1 = Math.floor(Math.random() * (+max - +min)) + min;
                        var i2 = Math.floor(Math.random() * (+max - +min)) + min;

                        var words = data.split(",");
                        var word1 = words[i1].trim();
                        var word2 = words[i2].trim();

                        console.log("Calling sign-up function");
                        DMC.send(signup(newuser.user.username, word1 + word2, newuser.user.id, true));
                    });
                });
            });
        }
    }
}

exports.messageHandler = function(b,m) {
	if (m.author.bot)
        return;

    console.log("Message Event");
    var files = (m.attachments).array();
    var g = b.guilds.get("526111037573955584");

    if (m.channel.type == "dm") {
        var args = m.content.split(" ");
        if (args[0] == "/user") {
            m.channel.startTyping();
            exports.getuser(g, m);
        } else if (args[0]) {
            m.channel.startTyping();
            exports.getpass(m);
        }

    } else {
        if (files.length) {
            files.forEach((a) => {
                console.log("Attachment: " + a.url);
                request(a.url).pipe(fs.createWriteStream("M:/Pisscord/attachments/" + a.filename));
                var url = 'pisscord.org/attachments.php?fn=' + a.filename + '&uid=' + a.client + '&desc=' + a.message.content + '&ch=' + a.message.channel.id;
                request(url, (err, req, body) => {
                    console.log(err);
                    console.log(req);
                    console.log(body);
                });
            });
        }
    }
	}	
}
