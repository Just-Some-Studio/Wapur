const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Stats",
    Description: "Gets bot information about the server",
   
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ManageGuild],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        message.reply({
            content: "The bot is currently unsharded, no stats to show here!"
        })
    }
}