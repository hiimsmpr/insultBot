const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const CONFIG = require("./configs")
const PREFIX = require("./shortcuts")
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content.includes("!insult") || message.content.includes('Virtual')) {
        
       let insult 
       axios.get(PREFIX.insultApiUrl).then(resp => {
        message.channel.send(resp.data.insult);
            // console.log(resp.data.insult);
        });
        console.log(insult)
        
    }
    if (message.content.includes('shut up bot')) {
        const user = message.author

        message.channel.send(`blow me ${user}!!!`);
    }
});

client.login(CONFIG.token);