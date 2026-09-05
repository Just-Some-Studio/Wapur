const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Warn",
    Description: "Warns a user",
    Subset: "Moderation",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to warn", "Required": true, "Type": "User", "Choices": []},
        {"Name": "Reason", "Description": "The reason for the warning", "Required": false, "Type": "String", "Choices": []}
    ],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const SelectedUser = Interaction.mentions.members?.first() || await BotClient.users?.fetch(PassedArguments[0])
        const Reason = PassedArguments.slice(1).join(" ") || "No Reason Provided"

        if (!SelectedUser || !Reason) {
            return Interaction.reply({
                content: "Invalid command PassedArguments provided",
                allowedMentions: {repliedUser: false}
            })
        }

        const OldData = JSON.parse(DataHandler.getUser(Interaction.guild.id, SelectedUser).warnings)
        OldData.push({"reason": Reason, "admin": Interaction.author.id, "time": Date.now()})
        const NewJson = JSON.stringify(OldData)

        DataHandler.addWarning(Interaction.guild.id, SelectedUser, NewJson)

        await Interaction.channel.send(`Successfully warned ${SelectedUser} for ${Reason}`)
        await SelectedUser.send(`You have been warned for ${Reason}`)
    }
}