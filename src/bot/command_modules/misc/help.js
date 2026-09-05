const {PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Help",
    Description: "Get help using the bot",
    Subset: "Misc",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguements, BotClient) {
        const GithubButton = new ButtonBuilder()
            .setEmoji("💻")
            .setStyle(ButtonStyle.Link)
            .setLabel("Github repository")
            .setURL("https://github.com/Just-Some-Studio/Wapur")

        const DiscordButton = new ButtonBuilder()
            .setEmoji("🫂")
            .setStyle(ButtonStyle.Link)
            .setLabel("Discord Community")
            .setURL("https://discord.com/invite/pNPJFkqWBW")

        const ButtonActionRow = new ActionRowBuilder()
            .addComponents(GithubButton)
            .addComponents(DiscordButton)

        const EmbeddedMessage = BotModules.embedMessage(
            "Below are links to the github repository and discord server for Wapur! \n\nYou can also use /configure to begin setting up Wapur.",
            null,
            "Help"
        )

        await Interaction.reply({
            content: "",
            embeds: [EmbeddedMessage.embeds[0]],
            components: [ButtonActionRow],
            flags: MessageFlags.Ephemeral
        })
    }
}