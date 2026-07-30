const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "TicketSettings",
    Description: "View and modify ticket settings",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
    }
}