const {PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")
const { json } = require("express")
const dataHandler = require("../../dataHandler.js")

module.exports = {
    Name: "Leaderboard",
    Description: "Get various leaderboards",
    Subset: "Utility",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    

    async execute(message, arguements, botClient) {
        const LevelButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("Level")
            .setCustomId("LevelLeaderboard")

        const EconomyButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Economy")
            .setCustomId("EconomyLeaderboard")

        const DailyStreakButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Daily Streak")
            .setCustomId("DailyLeaderboard")

        const LeadboardOptionActionRow = new ActionRowBuilder()
            .addComponents(LevelButton)
            .addComponents(EconomyButton)
            .addComponents(DailyStreakButton)

        const LeaderboardData = dataHandler.customDataQuery(message.guild.id, "SELECT exp, userId FROM userdata ORDER BY exp DESC LIMIT 15", "all")

        const LeaderboardMessageBroken = LeaderboardData.map((userData, index) => {
            return `${index + 1}\u200B. <@${userData.userId}>: level ${parseInt(BotModules.getLevelFromXp(userData.exp))}`
        })

        const LeaderboardMessage = LeaderboardMessageBroken.length > 0 ? LeaderboardMessageBroken.join(`\n`) : "Oh no! It looks like nobody has gotten on the leaderboard. \nTalk in some channels to gain EXP"

        const MessageEmbed = BotModules.embedMessage(LeaderboardMessage, "03fca1", "Level Leaderboard")

        message.reply({
            embeds: [MessageEmbed.embeds[0]],
            components: [LeadboardOptionActionRow]
        })
    },

    async manageButtonInteraction(interaction, botClient) {
        const LevelButton = new ButtonBuilder()
            .setLabel("Level")
            .setCustomId("LevelLeaderboard")

        const EconomyButton = new ButtonBuilder()
            .setLabel("Economy")
            .setCustomId("EconomyLeaderboard")

        const DailyStreakButton = new ButtonBuilder()
            .setLabel("Daily Streak")
            .setCustomId("DailyLeaderboard")


        var MessageEmbed = "" 

        if (interaction.customId === "DailyLeaderboard") {
            LevelButton.setStyle(ButtonStyle.Secondary)
            DailyStreakButton.setStyle(ButtonStyle.Primary)
            EconomyButton.setStyle(ButtonStyle.Secondary)

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT dailyStreak, userId FROM userdata WHERE (unixepoch('now') * 1000) - lastDaily < 2 * 24 * 60 * 60 * 1000 ORDER BY dailyStreak DESC LIMIT 15", "all")

            const LeaderboardMessageBroken = LeaderboardData.map((userData, index) => {
                return `${index + 1}\u200B. <@${userData.userId}>: ${parseInt(userData.dailyStreak)} days`
            })

            const LeaderboardMessage = LeaderboardMessageBroken.length > 0 ? LeaderboardMessageBroken.join(`\n`) : "Oh no! It looks like nobody has gotten on the leaderboard. \nTalk in some channels to gain EXP"

            MessageEmbed = BotModules.embedMessage(LeaderboardMessage, "03fca1", "Daily Leaderboard")

            
        } else if (interaction.customId === "EconomyLeaderboard") {
            LevelButton.setStyle(ButtonStyle.Secondary)
            DailyStreakButton.setStyle(ButtonStyle.Secondary)
            EconomyButton.setStyle(ButtonStyle.Primary)

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT credits, userId FROM userdata ORDER BY credits DESC LIMIT 15", "all")


            const LeaderboardMessageBroken = LeaderboardData.map((userData, index) => {
                return `${index + 1}\u200B. <@${userData.userId}>: ${parseInt(userData.credits)} credits`
            })

            const LeaderboardMessage = LeaderboardMessageBroken.length > 0 ? LeaderboardMessageBroken.join(`\n`) : "Oh no! It looks like nobody has gotten on the leaderboard. \nTalk in some channels to gain EXP"

            MessageEmbed = BotModules.embedMessage(LeaderboardMessage, "03fca1", "Economy Leaderboard")


        } else if (interaction.customId === "LevelLeaderboard") {
            LevelButton.setStyle(ButtonStyle.Primary)
            DailyStreakButton.setStyle(ButtonStyle.Secondary)
            EconomyButton.setStyle(ButtonStyle.Secondary)

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT exp, userId FROM userdata ORDER BY exp DESC LIMIT 15", "all")

            const LeaderboardMessageBroken = LeaderboardData.map((userData, index) => {
                return `${index + 1}\u200B. <@${userData.userId}>: level ${parseInt(BotModules.getLevelFromXp(userData.exp))}`
            })

            const LeaderboardMessage = LeaderboardMessageBroken.length > 0 ? LeaderboardMessageBroken.join(`\n`) : "Oh no! It looks like nobody has gotten on the leaderboard. \nTalk in some channels to gain EXP"

            MessageEmbed = BotModules.embedMessage(LeaderboardMessage, "03fca1", "Level Leaderboard")
        }


        // Found \u200B in the embed docs for discord.js and it had this useful property of removing indents from numbered lists



        const LeadboardOptionActionRow = new ActionRowBuilder()
            .addComponents(LevelButton)
            .addComponents(EconomyButton)
            .addComponents(DailyStreakButton)

        interaction.update({
            embeds: [MessageEmbed.embeds[0]],
            components: [LeadboardOptionActionRow]
        })
    }
}