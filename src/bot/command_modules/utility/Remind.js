const {PermissionsBitField, ButtonBuilder, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Remind",
    Description: "Sets a reminder to ping you with a message",
    Subset: "Utility",

    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}