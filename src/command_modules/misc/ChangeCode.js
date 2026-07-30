const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "ChangeCode",
    Description: "Add a new code to your server",

    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ManageGuild],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}