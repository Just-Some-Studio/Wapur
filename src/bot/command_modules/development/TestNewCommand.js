const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "TestCommand",
    Description: "This is an testing command",
    Subset: "Development",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    Subcommands: [
        {"Name": "Subcommand1", "Description": "This is an example subcommand", "Options": []},
        {
            "Name": "Subcommand2", 
            "Description": "This is an example subcommand", 
            "Options": [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
        },
        {
            "Name": "Subcommand3", 
            "Description": "This is an example subcommand", 
            "Options": [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
        }
    ],

    async execute(Interaction, PassedArguments, BotClient) {
        if (Interaction.options.getSubcommand() === "subcommand1") {
            await Interaction.reply("You executed Subcommand1!")
        } else if (Interaction.options.getSubcommand() === "subcommand2") {
            await Interaction.reply("You executed Subcommand2!")
        } else if (Interaction.options.getSubcommand() === "subcommand3") {
            await Interaction.reply("You executed Subcommand3!")
        } else (
            await Interaction.reply("You executed the main command!")
        )
    }
}