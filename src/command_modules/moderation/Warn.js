const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Warn",
    Description: "Warns a user",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to warn", "Required": true, "Type": "User", "Choices": []},
        {"Name": "Reason", "Description": "The reason for the warning", "Required": false, "Type": "String", "Choices": []}
    ],

    async execute(message, arguements, botClient) {
        const SelectedUser = message.mentions.members?.first() || await botClient.users?.fetch(arguements[0])
        const Reason = arguements.slice(1).join(" ") || "No Reason Provided"

        if (!SelectedUser || !Reason) {
            return message.reply({
                content: "Invalid command arguements provided",
                allowedMentions: {repliedUser: false}
            })
        }

        const OldData = JSON.parse(DataHandler.getUser(message.guild.id, SelectedUser).warnings)
        OldData.push({"reason": Reason, "admin": message.author.id, "time": Date.now()})
        const NewJson = JSON.stringify(OldData)

        DataHandler.addWarning(message.guild.id, SelectedUser, NewJson)

        await message.channel.send(`Successfully warned ${SelectedUser} for ${Reason}`)
        await SelectedUser.send(`You have been warned for ${Reason}`)
    }
}