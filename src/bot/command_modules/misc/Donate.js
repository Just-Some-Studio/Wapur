const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Donate",
    Description: "Support the bot's development",

    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}