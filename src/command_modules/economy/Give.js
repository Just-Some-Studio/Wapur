const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Give",
    Description: "Give items to another user",
   
    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
    }
}