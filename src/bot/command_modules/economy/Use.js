const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Use",
    Description: "Use an item",
    Subset: "Economy",

    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const userId = Interaction.author?.id || Interaction.user?.id
    }
}