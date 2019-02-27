var http = require('http');
var auth = process.env.UPLOADBOT_TOKEN;
var url = require('url');
var fs = require('fs');
var strip = require("stripchar").StripChar;
var request = require('request');
var commands = require("./commands.js");

const {Client,RichEmbed} = require('discord.js');
const botjs = new Client();

botjs.on('ready', () => {commands.readyHandle(botjs);});
botjs.on('message', (m) => {commands.messageHandler(botjs,m);});
botjs.on('guildMemberUpdate', (olduser,newuser) => {commands.checkRoleUpdates(olduser, newuser);});

botjs.login(auth);
