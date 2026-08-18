const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "DevStats",
    Description: "Gets all bot stats, including dev information",

    DevOnly: true,
    
    RequiredPermissions: [PermissionsBitField.Flags.ViewAuditLog],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const SentMessage = await message.reply("Pinging...")
        const BotLatency = SentMessage.createdTimestamp - message.createdTimestamp
        const APILatency = Math.round(botClient.ws.ping)
        return SentMessage.edit(`Round trip latency: ${BotLatency} ms \nAPI Latency: ${APILatency} ms`)
    }
}