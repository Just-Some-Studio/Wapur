const { PermissionsBitField, GuildAuditLogsEntry, AllowedMentionsTypes } = require("discord.js")

module.exports = {
    Name: "leaderboard",
    Description: "Get various leaderboards",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: false,
    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    RequiresAllPermissions: true,
    SlashCommandOptions: [
    ],

    async execute(message, arguements, botClient) {
    }
}