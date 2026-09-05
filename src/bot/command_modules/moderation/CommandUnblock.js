const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "CommandUnblock",
    Description: "Unblocks a user from using commands",
    Subset: "Moderation",
    
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to remove from blacklist", "Required": true, "Type": "User", "Choices": []},
    ],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
    }
}