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
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const KickedMember = Interaction.mentions.members?.first() || Interaction.guild.members.cache.get(PassedArguments[0])        
        if (!KickedMember) {
            return Interaction.reply({
                content: "Invalid user selection provided",
                allowedMentions: {repliedUser: false}
            })
        }

        const Reason = PassedArguments.slice(1).join(" ") || "No Reason Provided"

        try {
            await KickedMember.kick(Reason)
            await Interaction.channel.send(`Kicked ${KickedMember} for ${Reason}`)
        } catch (ThrownError) {
            console.error(ThrownError)
            await Interaction.channel.send(`${ThrownError}`)
        }
    }
}