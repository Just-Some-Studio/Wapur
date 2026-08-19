const {PermissionsBitField, ButtonBuilder, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "AFK",
    Description: "Sets an afk status to tell others you won't be available",
    Subset: "Utility",

    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}