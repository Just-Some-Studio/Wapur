const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "SetupTicket",
    Description: "Sets up a new ticket button in the current channel",
   
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
    }
}