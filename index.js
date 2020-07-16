const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const CONFIG = require("./configs")
const PREFIX = require("./shortcuts")
client.once('ready', () => {
    console.log('Ready!');
});
let msgCounter = 0
let randomCount = 10
client.on('message', message => {
    lowerCasement = message.content.toLowerCase()
    console.log(lowerCasement)
    const user = message.author
    // if (msgCounter === randomCount) {
    //     axios.get(PREFIX.insultApiUrl).then(resp => {
    //         message.channel.send(`${user} ` + resp.data.insult);
    //     });

    //     randomCount = Math.floor(Math.random() * 50)
    //     msgCounter = 0
    // }
    // if (message.content.includes(" ")) {
    //     msgCounter += 1
    //     console.log(msgCounter)
    //     console.log("random number is "+randomCount)
    // }
    if (lowerCasement.includes("!insult")||lowerCasement.includes("cranial rectalitis")||lowerCasement.includes("cranial rectalitis")||lowerCasement.includes("daphne")||lowerCasement.includes("blaze")||lowerCasement.includes("asshole")||lowerCasement.includes("cunt")) {

        let insult
        axios.get(PREFIX.insultApiUrl).then(resp => {
            message.channel.send(`${user} ` + resp.data.insult);
            // console.log(resp.data.insult);
        });
        console.log(insult)

    }
    if (message.content.includes('shut up bot')) {
        message.channel.send(`blow me ${user}!!!`);
    }
});

client.login(CONFIG.token);