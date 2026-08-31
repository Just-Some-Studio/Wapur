const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Give",
    Description: "Give items to another user",
    Subset: "Economy",
   
    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const userId = Interaction.author?.id || Interaction.user?.id
    }
}