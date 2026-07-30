const { PermissionsBitField, GuildAuditLogsEntry, AllowedMentionsTypes, User } = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const modules = require("../../modules.js")

module.exports = {
    Name: "ticketsettings",
    Description: "View and modify ticket settings",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: false,
    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    RequiresAllPermissions: true,
    SlashCommandOptions: [
    ],

    async execute(message, arguements, botClient) {
    }
}