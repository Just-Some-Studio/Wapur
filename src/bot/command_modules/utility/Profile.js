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

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
        const User = await botClient.users?.fetch(userId)
        const UserData = DataHandler.getUser(message.guild.id, userId)

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

        return message.reply({
            embeds: [Embed.embeds[0]],
            components: [ActionRow]
        })
    }
}