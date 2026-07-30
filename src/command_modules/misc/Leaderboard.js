const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Leaderboard",
    Description: "Get various leaderboards",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    

    async execute(message, arguements, botClient) {
    }
}