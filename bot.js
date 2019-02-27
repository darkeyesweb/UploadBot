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



botjs.on('message', (m) => {commands.messageHandler(botjs,m);});
botjs.on('guildMemberUpdate', (olduser,newuser) => {commands.checkRoleUpdates(olduser, newuser);});

botjs.login(auth);
