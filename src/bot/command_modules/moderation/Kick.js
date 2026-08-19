const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Kick",
    Description: "Kicks a player from the server",
    Subset: "Moderation",
    
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
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