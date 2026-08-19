const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "MemberSweep",
    Description: "None",
    Subset: "Moderation",
   
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
    }
}