const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "RemoveEXP",
    Description: "Removes experience points from a user",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
    }
}