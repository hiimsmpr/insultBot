const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
const CONFIG = require("./configs")
const PREFIX = require("./shortcuts")
const { prefix } = require('./config.json');
client.once('ready', () => {
    console.log('Ready!');
});


const storyPost = (storyId, name, current_state, url, description) => {
    const storyPost = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(name)
        .setURL(url)
        .setAuthor('IndyTracker', 'https://i.imgur.com/wSTFkRM.png', '')
        .setDescription(description)

        .addFields(
            { name: 'Current Status', value: current_state },
            // { name: '\u200B', value: '\u200B' },
            // { name: 'Ship Type', value: shipType, inline: true },
            // { name: 'Max Speed', value: maxSpeed, inline: true },
            // { name: 'Total Thrust', value: totalThrust, inline: true },
            // { name: 'Warp Class', value: warpClass, inline: true },
            // { name: 'Ore Crates', value: oreCrates, inline: true },
            // { name: 'Ship Weight', value: shipWeight, inline: true },
            // { name: 'Creator', value: shipCreator, inline: true },
            // { name: 'Ship Video', value: 'Some value here', inline: true },
        )
        // .setImage(shipImage)
        .setTimestamp()
        .setFooter(storyId, 'https://i.imgur.com/wSTFkRM.png');
    return storyPost
}
const commandPost = (title, description) => {
    const commandPost = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setAuthor('Valiant Bot', 'https://i.imgur.com/wSTFkRM.png', '')
        .setDescription(description)

        .addFields(
        // { name: 'Current Status', value: current_state },
        // { name: '\u200B', value: '\u200B' },
        // { name: 'Ship Type', value: shipType, inline: true },
        // { name: 'Max Speed', value: maxSpeed, inline: true },
        // { name: 'Total Thrust', value: totalThrust, inline: true },
        // { name: 'Warp Class', value: warpClass, inline: true },
        // { name: 'Ore Crates', value: oreCrates, inline: true },
        // { name: 'Ship Weight', value: shipWeight, inline: true },
        // { name: 'Creator', value: shipCreator, inline: true },
        // { name: 'Ship Video', value: 'Some value here', inline: true },
    )
        // .setImage(shipImage)
        .setTimestamp()
        .setFooter(title, 'https://i.imgur.com/wSTFkRM.png');
    return commandPost
}

let currentStep = 0
let createOrder = {}
let authorId
client.on('message', message => {

    const createTicket = async (ticket) => {
        let isLabelMade = false
        console.log(ticket)
        let storyId
        let labelId
        const pivotalStoryUrl = `https://www.pivotaltracker.com/services/v5/projects/${CONFIG.projectId}/stories`
        const pivotalLabelUrl = `https://www.pivotaltracker.com/services/v5/projects/${CONFIG.projectId}/labels`
        //get all labels
        axios.get(pivotalLabelUrl, {
            headers: {
                "Content-Type": "application/json",
                "X-TrackerToken": CONFIG.pivotalToken
            }
        }).then(res => {
            let allLabels = res.data
            console.log(ticket.requestor.toLowerCase())
            // console.log(allLabels.includes(ticket.requestor.toLowerCase()))
            const requestor = ticket.requestor.toLowerCase()
            console.log(allLabels)

            allLabels.find((label, index) => {
                if (label.name === ticket.requestor.toLowerCase()) {
                    labelId = label.id
                    return isLabelMade = true
                }
            })
            console.log(isLabelMade)
        })
        //create new label

        const makeNewLabel = () => {
            if (!isLabelMade) {
                const labelpackage = {
                    project_id: CONFIG.projectId,
                    name: ticket.requestor
                }
                axios.post(pivotalLabelUrl, labelpackage, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-TrackerToken": CONFIG.pivotalToken
                    }
                }).then(res => {
                    console.log(res.data)
                    labelId = res.data.id
                    console.log(labelId)
                })
            }
        }
        setTimeout(makeNewLabel, 500)
        const postTicket = () => {
            const storypackage = {
                kind: "story",
                current_state: "unstarted",
                estimate: 3,
                story_type: "feature",
                story_priority: "p3",
                name: ticket.title,
                description: ticket.description,
                labels: [{
                    id: labelId
                }]
            }
            console.log(storypackage)
            axios.post(pivotalStoryUrl, storypackage, {
                headers: {
                    "Content-Type": "application/json",
                    "X-TrackerToken": CONFIG.pivotalToken
                }
            }).then(res => {
                storyId = res.data.id
                client.channels.cache.get("1010310610300444762").send("There is a new request waiting.")
            })
        }
        setTimeout(postTicket, 750)


    }
    if (message.channel.type === "dm" && currentStep === 1 && authorId === message.author.id) {
        createOrder.title = message.content
        currentStep++
        message.author.send("```Question 2: Do we need to maintain this product? If yes: how many maintain? If no: please type Please make x ammount of y```");

    } else if (message.channel.type === "dm" && currentStep === 2 && authorId === message.author.id) {
        message.author.send("Thank you, your request will be processed. To check the status of your ticket type !getmyindyorders in chat.");
        createOrder.description = message.content
        // const channel = client.channels.cache.get(CONFIG.shipPostChan)
        createTicket(createOrder)
        createOrder = {}
        currentStep = 0
        authorId = undefined
    }

    lowerCasement = message.content.toLowerCase()
    const user = message.author.username
    const pivotalStoryUrl = `https://www.pivotaltracker.com/services/v5/projects/${CONFIG.projectId}/stories`
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // if (command === 'rock') {
    //     message.channel.send("fuck that guy")
    // }
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(args)
    if (command === 'getallindyorders') {

        axios.get(pivotalStoryUrl, {
            headers: {
                "Content-Type": "application/json",
                "X-TrackerToken": CONFIG.pivotalToken
            }
        }).then(res => {
            let allStories = res.data

            allStories.map(story => {
                if (story.current_state !== "accepted") {
                    message.channel.send(storyPost(story.id, story.name, story.current_state, story.url, story.description))
                }
            })
        })
    }
    if (command === 'rock') {
        message.channel.send("fuck that guy")
    }
    if (command === 'getmyindyorders') {
        axios.get(pivotalStoryUrl, {
            headers: {
                "Content-Type": "application/json",
                "X-TrackerToken": CONFIG.pivotalToken
            }
        }).then(res => {
            let allStories = res.data
            allStories.map(story => {
                if (user.toLowerCase() === story.labels[0].name) {
                    message.channel.send(storyPost(story.id, story.name, story.current_state, story.url, story.description))
                }
            })
        })
    }
    if (command === 'requestindyorder') {
        authorId = message.author.id
        createOrder.requestor = user
        message.author.send("```Question 1: What element are you wanting made?```");

        currentStep++
    }








    //display all commands in chat
    if (command === 'commands') {
        message.channel.send(commandPost("getallindyorders", "Returns all indy orders currently requested or active"))
        message.channel.send(commandPost("getmyindyorders", "Returns your indy orders currently requested or active"))
        message.channel.send(commandPost("requestindyorder", "Sends requestor detailedish questions about what is being requested of the amazing indy people who are really under appreciated...."))
        message.channel.send(commandPost("sutime DISTANCE SPEED", "Returns a travel time when providing distance and speed"))
        message.channel.send(commandPost("warp DISTANCE-IN-SU WEIGHT", "Returns a warp cost when you provide distance in su and weight of construct"))

    }








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
    } else if (command === 'warp') {
        if (args.length === 2) {
            const calculator = Math.ceil(args[0] * args[1] * .00025)
            console.log(isNaN(calculator))
            if (isNaN(calculator)) {
                message.channel.send("The proper format for this command is as follows: warp 'distance in su' 'weight of contruct'")
            } else {
                message.channel.send(calculator + " warp cells needed")
            }
            return
        } else {
            message.channel.send("The proper format for this command is as follows: warp 'distance in su' 'weight of contruct'")
        }
    }

});

client.login(CONFIG.token);
