var auth = process.env.UPLOADBOT_TOKEN;
var commands = require("./commands.js");
var events = require('events');

const {Client,RichEmbed} = require('discord.js');
const botjs = new Client();

botjs.on('ready', () => {commands.readyHandle(botjs);});
botjs.on('message', (m) => {commands.messageHandler(botjs,m);});
botjs.on('guildMemberUpdate', (olduser,newuser) => {commands.checkRoleUpdates(olduser, newuser);});

botjs.login(auth);
