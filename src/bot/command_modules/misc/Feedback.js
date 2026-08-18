const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Feedback",
    Description: "Send feedback on the bot or its features",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}