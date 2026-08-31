const {PermissionsBitField, MessageActivityType} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

const Jokes = [
    "Did you hear the power went out at the school? The children were de-lighted",
    "Whats the hardest part of learning to ride a bike? The pavement",
    "what's the worst part of eating a clock? It's time consuming",
    "This is a joke."
]

module.exports = {
    Name: "Joke",
    Description: "Tells a random joke",
    Subset: "Fun",

    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
        const JokeIndex = Math.floor(Math.random() * Jokes.length)
        var JokeToSend = Jokes[JokeIndex]

        if (JokeToSend === null) {
            JokeToSend = Jokes[JokeIndex - 1]
        }

        const MessageEmbed = BotModules.embedMessage(
            JokeToSend,
            "fa00c4", 
            "Joke",
            Date.now(),
            `You got joke #${JokeIndex + 1} out of ${Jokes.length}`
        )

        Interaction.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]]
        })
    }
}