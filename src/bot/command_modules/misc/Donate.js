const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Donate",
    Description: "Support the bot's development",
    Subset: "Misc",

    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}