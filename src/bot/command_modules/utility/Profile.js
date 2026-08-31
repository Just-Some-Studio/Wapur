const {PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Profile",
    Description: "View your profile information",
    Subset: "Utility",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const userId = Interaction.author?.id || Interaction.user?.id
        const User = await BotClient.users?.fetch(userId)
        const UserData = DataHandler.getUser(Interaction.guild.id, userId)

        const BalanceButton = new ButtonBuilder()
            .setCustomId("Credits")
            .setEmoji("💰")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Balance")

        const LevelButton = new ButtonBuilder()
            .setCustomId("Level")
            .setEmoji("🔖")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Level")

        const InventoryButton = new ButtonBuilder()
            .setCustomId("Inventory")
            .setEmoji("📦")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Inventory")

        const ModerationButton = new ButtonBuilder()
            .setCustomId("Moderation")
            .setEmoji("🛡️")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Moderation")

        const ActionRow = new ActionRowBuilder()
            .addComponents(LevelButton)
            .addComponents(BalanceButton)
            .addComponents(InventoryButton)
            .addComponents(ModerationButton)

        const Embed = BotModules.embedMessage(`You currently have **${UserData.credits}** credits \n\nInventory coming soon!`, "03c2fc", `${User.globalName}'s profile`)

        return Interaction.reply({
            embeds: [Embed.embeds[0]],
            components: [ActionRow]
        })
    }
}