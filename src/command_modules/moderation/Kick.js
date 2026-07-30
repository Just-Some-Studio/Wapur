const { PermissionsBitField, GuildAuditLogsEntry, AllowedMentionsTypes } = require("discord.js")

module.exports = {
    Name: "kick",
    Description: "Kicks a player from the server",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: false,
    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    RequiresAllPermissions: true,
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to kick", "Required": true, "Type": "User", "Choices": []},
        {"Name": "Reason", "Description": "The reason for the kick", "Required": false, "Type": "String", "Choices": []}
    ],

    async execute(message, arguements, botClient) {
        const KickedMember = message.mentions.members?.first() || message.guild.members.cache.get(arguements[0])        
        if (!KickedMember) {
            return message.reply({
                content: "Invalid user selection provided",
                allowedMentions: {repliedUser: false}
            })
        }

        const Reason = arguements.slice(1).join(" ") || "No Reason Provided"

        try {
            await KickedMember.kick(Reason)
            await message.channel.send(`Kicked ${KickedMember} for ${Reason}`)
        } catch (ThrownError) {
            console.error(ThrownError)
            await message.channel.send(`${ThrownError}`)
        }
    }
}