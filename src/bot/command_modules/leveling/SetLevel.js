const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "SetLevel",
    Description: "Sets a user's level",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageRoles],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
    }
}