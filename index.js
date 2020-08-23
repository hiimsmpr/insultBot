const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const CONFIG = require("./configs")
const PREFIX = require("./shortcuts")
const { prefix } = require('./config.json');
client.once('ready', () => {
    console.log('Ready!');
});
let msgCounter = 0
let randomCount = 10
client.on('message', message => {
  
    lowerCasement = message.content.toLowerCase()
    const user = message.author
    console.log(`${user}: ` + message.content)
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
    if (lowerCasement.includes("cranial rectalitis")||lowerCasement.includes("cranial rectalitis")||lowerCasement.includes("daphne")||lowerCasement.includes("blaze")||lowerCasement.includes("asshole")||lowerCasement.includes("cunt")) {

        let insult
        axios.get(PREFIX.insultApiUrl).then(resp => {
            message.channel.send(`${user} ` + resp.data.insult);
        });
    }
    if (message.content.includes('shut up bot')) {
        message.channel.send(`blow me ${user}!!!`);
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'sutime') {
        if (args.length < 2) {
            message.channel.send("Please provide a distance and speed dumb ass")
        } else {
            const minuteConv = .0166667
            let distanceToTravel = parseFloat(args[0]) * 200
            let speed = parseInt(args[1])
            let timeCalculated = distanceToTravel / speed
            let timeCalculatedMinutes = Math.trunc(timeCalculated / minuteConv)
            let timeInHours = Math.trunc(timeCalculatedMinutes / 60)
            let timeInMinutes = timeCalculatedMinutes % 60
            message.channel.send("Esitmated time: " + timeInHours + " hours and " + timeInMinutes + " minutes.")
        }
    }else if (command === 'insult') {
        if (args.length === 1) {
            let insult
            axios.get(PREFIX.insultApiUrl).then(resp => {
                message.channel.send(resp.data.insult+args[0]);
            });
            return
        } else {
            let insult
            axios.get(PREFIX.insultApiUrl).then(resp => {
                message.channel.send(`${user} ` + resp.data.insult);
            });
        }
    }
    
});

client.login(CONFIG.token);