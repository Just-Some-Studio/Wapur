const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Unlock",
    Description: "Unlocks a channel",
    Subset: "Moderation",

    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
    }
}