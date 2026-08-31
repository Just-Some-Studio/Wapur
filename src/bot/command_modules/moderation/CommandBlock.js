const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "CommandBlock",
    Description: "Blocks a user from using commands",
    Subset: "Moderation",
    
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to blacklist", "Required": true, "Type": "User", "Choices": []},
    ],

    async execute(Interaction, PassedArguments, BotClient) {
    }
}