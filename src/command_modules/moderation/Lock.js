const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Lock",
    Description: "Locks a channel",
    
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
    }
}