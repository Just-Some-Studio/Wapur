const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Ban",
    Description: "Bans a user from the server",
    Subset: "Moderation",
    
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to ban", "Required": true, "Type": "User", "Choices": []},
        {"Name": "Reason", "Description": "The reason for the ban", "Required": false, "Type": "String", "Choices": []}
    ],

    async execute(Interaction, PassedArguments, BotClient) {
    }
}