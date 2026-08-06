const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "ping",
    Description: "Measures bot and API latency",

    DevOnly: true,
    
    RequiredPermissions: [PermissionsBitField.Flags.ViewAuditLog],
    SlashCommandOptions: [
        {"Name": "Check_Type", "Description": "The type of check to perform", "Required": false, "Type": "String", "Choices": [
            {"Name": "All", "Value": "all"},
            {"Name": "Latency", "Value": "latency"},
            {"Name": "Integrity", "Value": "integrity"},
        ]}
    ],

    async execute(message, arguements, botClient) {
        const CheckType = arguements[0]?.toLowerCase() || "all"

        if (CheckType === "latency") {
            const SentMessage = await message.reply("Pinging...")
            const BotLatency = SentMessage.createdTimestamp - message.createdTimestamp
            const APILatency = Math.round(botClient.ws.ping)
            return SentMessage.edit(`Round trip latency: ${BotLatency} ms \nAPI Latency: ${APILatency} ms`)

        } else if (CheckType === "integrity") {
            // Warnings/Errors/Etc get printed here

        } else if (CheckType === "all") {
            const SentMessage = await message.reply("Pinging...")
            const BotLatency = SentMessage.createdTimestamp - message.createdTimestamp
            const APILatency = Math.round(botClient.ws.ping)
            return SentMessage.edit(`Round trip latency: ${BotLatency} ms \nAPI Latency: ${APILatency} ms`)

        } else {
            return message.reply({
                content: "Invalid arguement provided. Valid arguements are `all`, `latency`, and `integrity`",
                allowedMentions: {repliedUser: false}
            })
        }
    }
}