const {PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")
const { json } = require("express")
const dataHandler = require("../../dataHandler.js")

module.exports = {
    Name: "Leaderboard",
    Description: "Get various leaderboards",

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

        const LeaderboardMessage = `
        1\u200B. <@${LeaderboardData[0].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[0].exp))}
        2\u200B. <@${LeaderboardData[1].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[1].exp))}
        3\u200B. <@${LeaderboardData[2].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[2].exp))}
        4\u200B. <@${LeaderboardData[3].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[3].exp))}
        5\u200B. <@${LeaderboardData[4].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[4].exp))}
        6\u200B. <@${LeaderboardData[5].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[5].exp))}
        7\u200B. <@${LeaderboardData[6].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[6].exp))}
        8\u200B. <@${LeaderboardData[7].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[7].exp))}
        9\u200B. <@${LeaderboardData[8].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[8].exp))}
        10\u200B. <@${LeaderboardData[9].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[9].exp))}
        11\u200B. <@${LeaderboardData[10].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[10].exp))}
        12\u200B. <@${LeaderboardData[11].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[11].exp))}
        13\u200B. <@${LeaderboardData[12].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[12].exp))}
        14\u200B. <@${LeaderboardData[13].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[13].exp))}
        15\u200B. <@${LeaderboardData[14].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[14].exp))}
        `

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

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT dailyStreak, userId FROM userdata ORDER BY dailyStreak DESC LIMIT 15", "all")

            const LeaderboardMessage = `
            1\u200B. <@${LeaderboardData[0].userId}>: ${parseInt(LeaderboardData[0].dailyStreak)} days
            2\u200B. <@${LeaderboardData[1].userId}>: ${parseInt(LeaderboardData[1].dailyStreak)} days
            3\u200B. <@${LeaderboardData[2].userId}>: ${parseInt(LeaderboardData[2].dailyStreak)} days
            4\u200B. <@${LeaderboardData[3].userId}>: ${parseInt(LeaderboardData[3].dailyStreak)} days
            5\u200B. <@${LeaderboardData[4].userId}>: ${parseInt(LeaderboardData[4].dailyStreak)} days
            6\u200B. <@${LeaderboardData[5].userId}>: ${parseInt(LeaderboardData[5].dailyStreak)} days
            7\u200B. <@${LeaderboardData[6].userId}>: ${parseInt(LeaderboardData[6].dailyStreak)} days
            8\u200B. <@${LeaderboardData[7].userId}>: ${parseInt(LeaderboardData[7].dailyStreak)} days
            9\u200B. <@${LeaderboardData[8].userId}>: ${parseInt(LeaderboardData[8].dailyStreak)} days
            10\u200B. <@${LeaderboardData[9].userId}>: ${parseInt(LeaderboardData[9].dailyStreak)} days
            11\u200B. <@${LeaderboardData[10].userId}>: ${parseInt(LeaderboardData[10].dailyStreak)} days
            12\u200B. <@${LeaderboardData[11].userId}>: ${parseInt(LeaderboardData[11].dailyStreak)} days
            13\u200B. <@${LeaderboardData[12].userId}>: ${parseInt(LeaderboardData[12].dailyStreak)} days
            14\u200B. <@${LeaderboardData[13].userId}>: ${parseInt(LeaderboardData[13].dailyStreak)} days
            15\u200B. <@${LeaderboardData[14].userId}>: ${parseInt(LeaderboardData[14].dailyStreak)} days
            `

            MessageEmbed = BotModules.embedMessage(LeaderboardMessage, "03fca1", "Daily Leaderboard")

            
        } else if (interaction.customId === "EconomyLeaderboard") {
            LevelButton.setStyle(ButtonStyle.Secondary)
            DailyStreakButton.setStyle(ButtonStyle.Secondary)
            EconomyButton.setStyle(ButtonStyle.Primary)

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT credits, userId FROM userdata ORDER BY credits DESC LIMIT 15", "all")

            const LeaderboardMessage = `
            1\u200B. <@${LeaderboardData[0].userId}>: ${parseInt(LeaderboardData[0].credits)} credits
            2\u200B. <@${LeaderboardData[1].userId}>: ${parseInt(LeaderboardData[1].credits)} credits
            3\u200B. <@${LeaderboardData[2].userId}>: ${parseInt(LeaderboardData[2].credits)} credits
            4\u200B. <@${LeaderboardData[3].userId}>: ${parseInt(LeaderboardData[3].credits)} credits
            5\u200B. <@${LeaderboardData[4].userId}>: ${parseInt(LeaderboardData[4].credits)} credits
            6\u200B. <@${LeaderboardData[5].userId}>: ${parseInt(LeaderboardData[5].credits)} credits
            7\u200B. <@${LeaderboardData[6].userId}>: ${parseInt(LeaderboardData[6].credits)} credits
            8\u200B. <@${LeaderboardData[7].userId}>: ${parseInt(LeaderboardData[7].credits)} credits
            9\u200B. <@${LeaderboardData[8].userId}>: ${parseInt(LeaderboardData[8].credits)} credits
            10\u200B. <@${LeaderboardData[9].userId}>: ${parseInt(LeaderboardData[9].credits)} credits
            11\u200B. <@${LeaderboardData[10].userId}>: ${parseInt(LeaderboardData[10].credits)} credits
            12\u200B. <@${LeaderboardData[11].userId}>: ${parseInt(LeaderboardData[11].credits)} credits
            13\u200B. <@${LeaderboardData[12].userId}>: ${parseInt(LeaderboardData[12].credits)} credits
            14\u200B. <@${LeaderboardData[13].userId}>: ${parseInt(LeaderboardData[13].credits)} credits
            15\u200B. <@${LeaderboardData[14].userId}>: ${parseInt(LeaderboardData[14].credits)} credits
            `

            MessageEmbed = BotModules.embedMessage(LeaderboardMessage, "03fca1", "Economy Leaderboard")


        } else if (interaction.customId === "LevelLeaderboard") {
            LevelButton.setStyle(ButtonStyle.Primary)
            DailyStreakButton.setStyle(ButtonStyle.Secondary)
            EconomyButton.setStyle(ButtonStyle.Secondary)

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT exp, userId FROM userdata ORDER BY exp DESC LIMIT 15", "all")

            const LeaderboardMessage = `
            1\u200B. <@${LeaderboardData[0].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[0].exp))}
            2\u200B. <@${LeaderboardData[1].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[1].exp))}
            3\u200B. <@${LeaderboardData[2].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[2].exp))}
            4\u200B. <@${LeaderboardData[3].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[3].exp))}
            5\u200B. <@${LeaderboardData[4].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[4].exp))}
            6\u200B. <@${LeaderboardData[5].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[5].exp))}
            7\u200B. <@${LeaderboardData[6].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[6].exp))}
            8\u200B. <@${LeaderboardData[7].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[7].exp))}
            9\u200B. <@${LeaderboardData[8].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[8].exp))}
            10\u200B. <@${LeaderboardData[9].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[9].exp))}
            11\u200B. <@${LeaderboardData[10].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[10].exp))}
            12\u200B. <@${LeaderboardData[11].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[11].exp))}
            13\u200B. <@${LeaderboardData[12].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[12].exp))}
            14\u200B. <@${LeaderboardData[13].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[13].exp))}
            15\u200B. <@${LeaderboardData[14].userId}>: level ${parseInt(BotModules.getLevelFromXp(LeaderboardData[14].exp))}
            `

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