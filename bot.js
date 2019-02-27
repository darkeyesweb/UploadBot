var http = require('http');
var auth = process.env.UPLOADBOT_TOKEN;
var url = require('url');
var fs = require('fs');
var strip = require("stripchar").StripChar;
var request = require('request');
var commands = require("./commands.js");

const {Client,RichEmbed} = require('discord.js');
const botjs = new Client();

botjs.on('ready', () => {
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


botjs.on('message', (message) => {
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
});

botjs.on('guildMemberUpdate', (olduser,newuser) => {commands.checkRoleUpdates(olduser, newuser);});
botjs.login(auth);
