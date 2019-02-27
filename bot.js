var http = require('http');
var auth = process.env.UPLOADBOT_TOKEN;
var url = require('url');
var fs = require('fs');
var strip = require("stripchar").StripChar;
var request = require('request');
var commands = require("./commands.js");

const {
  Client,
  RichEmbed
} = require('discord.js');
const botjs = new Client();

botjs.on('ready', () => {
  console.log("Ghost Bot: I'm online and ready!");
  const g = botjs.guilds.get("526111037573955584");
	
  http.createServer((req, res) => {
    console.log("HTTP request received");
    var q = url.parse(req.url, true).query;
    console.log(q);
    //botjs.channels.get(q.ch).send(q.un+"\n"+q.title+"\n"+q.desc+"\n"+q.link);
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
});

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


function signup(u, p, uid) {
	
  var g = botjs.guilds.get("526111037573955584");
  console.log("Stripping username");
  var un = strip.RSExceptUnsAlpNum(u);
  console.log(un);
  fs.appendFile("I:/xampp/AuthFiles/DiscordApp/users", "\n" + un + "::" + p + "::" + uid, "utf8", (err) => {
    if (err) {
      return "ERROR: " + err;
    }

		DMC.send(`Congratulations on becoming a Pisscord Member!\nYou now have the ability to upload files! To do so head over to https://pisscord.org/ and signin using these credentials:\n\`\`\`Username: ${un}\nPassword: ${pass}\`\`\`\n\nHappy Posting ;)`);
    console.log('Ghost Bot: Created a new user! [' + un + ']');
  });
  return true;
}

botjs.on('message', message => {
  if (message.author.bot)
    return;
		
	console.log("Message Event");
	var files = (message.attachments).array();
	var g = botjs.guilds.get("526111037573955584");
	
  if (message.channel.type == "dm") {
		  var args = message.content.split(" ");
			if (args[0] == "/user") {
				message.channel.startTyping();
				commands.getuser(g, message);
			} else if (args[0]) {
				message.channel.startTyping();
				commands.getpass(message);
			}
				 
    } else {
			if (files.length) {
				files.forEach((a) => {
					console.log("Attachment: "+a.url);
					request(a.url).pipe(fs.createWriteStream("M:/Pisscord/attachments/"+a.filename));
					var url = 'pisscord.org/attachments.php?fn='+a.filename+'&uid='+a.client+'&desc='+a.message.content+'&ch='+a.message.channel.id;
					request(url, (err, req, body) => {
						console.log(err);
						console.log(req);
						console.log(body);
					});
				});
			}
		}
});

botjs.on('guildMemberUpdate', function (old, newuser) {
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
            signup(newuser.user.username, word1 + word2, newuser.user.id, true);
          });
        });
      });
    }
  }
});

botjs.login(auth);