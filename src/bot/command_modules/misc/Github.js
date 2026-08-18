const {PermissionsBitField, ButtonBuilder, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Github",
    Description: "Visit and view the bot's code, maybe help fix issues",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
        const GithubButton = new ButtonBuilder()
            .setEmoji("💻")
            .setStyle(ButtonStyle.Link)
            .setLabel("Github repository")
            .setURL("https://github.com/Just-Some-Studio/Wapur")

        const ButtonActionRow = new ActionRowBuilder()
            .addComponents(GithubButton)

        await Interaction.reply({
            content: "Below is a link to the github repository for Wapur",
            components: [ButtonActionRow],
            ephemeral: true
        })
    }
}