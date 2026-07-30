const { PermissionsBitField } = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const modules = require("../../modules.js")

module.exports = {
    Name: "use",
    Description: "Use an item",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: false,
    RequiredPermissions: [],
    RequiresAllPermissions: false,
    SlashCommandOptions: [
    ],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
    }
}