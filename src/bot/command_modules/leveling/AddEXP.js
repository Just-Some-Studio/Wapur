const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "AddEXP",
    Description: "Adds experience points to a user",
    Subset: "Leveling",

    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ManageRoles, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
    }
}