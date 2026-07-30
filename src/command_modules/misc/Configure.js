const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Configure",
    Description: "Change the settings and set up the bot for your server.",

    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ManageGuild],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}