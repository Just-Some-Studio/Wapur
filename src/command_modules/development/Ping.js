const { PermissionsBitField } = require("discord.js")

module.exports = {
    Name: "ping",
    Description: "Measures bot and API latency",
    AllowedUsers: ["969022741053341716"], // This list overrides the public command thing
    PublicCommand: false,
    RequiredPermissions: [PermissionsBitField.Flags.ViewAuditLog],
    RequiresAllPermissions: true,
    SlashCommandOptions: [
        {"Name": "Check_Type", "Description": "The type of check to perform", "Required": false, "Type": "String", "Choices": [
            {"Name": "All", "Value": "all"},
            {"Name": "Ping", "Value": "ping"},
            {"Name": "Integrity", "Value": "integrity"},
        ]}
    ],

    async execute(message, arguements, botClient) {
        const CheckType = arguements[0]?.toLowerCase() || "all"

        if (CheckType === "ping") {
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
                content: "Invalid arguement provided. Valid arguements are `all`, `ping`, and `integrity`",
                allowedMentions: {repliedUser: false}
            })
        }
    }
}