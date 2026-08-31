const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "example", // The name of the command and what is input when typeing
    Description: "This is an example command", // The description provided to slash commands

    // Makes a command only viewable/usable for bot owner.
    DevOnly: true,

    // Permissions required to view and use a command.
    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],

    // This is the arguement boxes provided when using a slash command
    SlashCommandOptions: [
        {"Name": "Example1", "Description": "Example with choices and is required", "Required": true, "Type": "String", "Choices": [
            {"Name": "Choice1", "Value": "Example1"},
            {"Name": "Choice2", "Value": "Example2"},
            {"Name": "Choice3", "Value": "Example3"},
        ]},
        {"Name": "Example2", "Description": "Example without choices and not required", "Required": false, "Type": "String", "Choices": []}
    ],


    // Interaction is the interaction, PassedArguments are obvious..., BotClient is the bot itself
    async execute(Interaction, PassedArguments, BotClient) {
    }
}