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

    RequiredPermissions: [],
    SlashCommandOptions: [],
    Subcommands: [],
    

    async execute(Interaction, PassedArguments, BotClient) {
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

        if (JSON.parse(DataHandler.getServer(Interaction.guild.id).economySettings)[0] === false && JSON.parse(DataHandler.getServer(Interaction.guild.id).levelSettings)[5] === false) {
            const MessageEmbed = BotModules.embedMessage(
                "Oh no! It looks like there are no leaderboards to display. Try activating economy or leveling first.", 
                "03fca1", 
                "Leaderboard disabled",
                Date.now(),
                `\"Hey, Listen\"`
            )

            return Interaction.reply({
                content: "",
                components: [],
                embeds: [MessageEmbed.embeds[0]]
            })
        }

        if (JSON.parse(DataHandler.getServer(Interaction.guild.id).economySettings)[0] === false) {
            EconomyButton.setDisabled(true)
            DailyStreakButton.setDisabled(true)
        }

        if (JSON.parse(DataHandler.getServer(Interaction.guild.id).levelSettings)[5] === false) {
            LevelButton.setDisabled(true)

            const MessageEmbed = BotModules.embedMessage(
                "Looks like leveling is disabled, but you can still check economy!", 
                "03fca1", 
                "Level Leaderboard",
                Date.now()
            )

            Interaction.reply({
                embeds: [MessageEmbed.embeds[0]],
                components: [LeadboardOptionActionRow]
            })


        } else {
            const LeaderboardData = dataHandler.customDataQuery(Interaction.guild.id, "SELECT exp, userId FROM userdata ORDER BY exp DESC LIMIT 15", "all")

            const LeaderboardMessageBroken = LeaderboardData.map((userData, index) => {
                return `${index + 1}\u200B. <@${userData.userId}>: level ${parseInt(BotModules.getLevelFromXp(userData.exp))}`
            })

            const LeaderboardMessage = LeaderboardMessageBroken.length > 0 ? LeaderboardMessageBroken.join(`\n`) : "Oh no! It looks like nobody has gotten on the leaderboard. \nTalk in some channels to gain EXP"

            const MessageEmbed = BotModules.embedMessage(
                LeaderboardMessage, 
                "03fca1", 
                "Level Leaderboard",
                Date.now()
            )

            Interaction.reply({
                embeds: [MessageEmbed.embeds[0]],
                components: [LeadboardOptionActionRow]
            })
        }
    },

    async manageButtonInteraction(interaction, BotClient) {
        const LevelButton = new ButtonBuilder()
            .setLabel("Level")
            .setCustomId("LevelLeaderboard")

        const EconomyButton = new ButtonBuilder()
            .setLabel("Economy")
            .setCustomId("EconomyLeaderboard")

        const DailyStreakButton = new ButtonBuilder()
            .setLabel("Daily Streak")
            .setCustomId("DailyLeaderboard")

        if (JSON.parse(DataHandler.getServer(interaction.guild.id).economySettings)[0] === false) {
            EconomyButton.setDisabled(true)
            DailyStreakButton.setDisabled(true)
        }

        if (JSON.parse(DataHandler.getServer(interaction.guild.id).levelSettings)[5] === false) {
            LevelButton.setDisabled(true)
        }


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

            MessageEmbed = BotModules.embedMessage(
                LeaderboardMessage, 
                "03fca1", 
                "Daily Leaderboard",
                Date.now()
            )

            
        } else if (interaction.customId === "EconomyLeaderboard") {
            LevelButton.setStyle(ButtonStyle.Secondary)
            DailyStreakButton.setStyle(ButtonStyle.Secondary)
            EconomyButton.setStyle(ButtonStyle.Primary)

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT credits, userId FROM userdata ORDER BY credits DESC LIMIT 15", "all")


            const LeaderboardMessageBroken = LeaderboardData.map((userData, index) => {
                return `${index + 1}\u200B. <@${userData.userId}>: ${parseInt(userData.credits)} credits`
            })

            const LeaderboardMessage = LeaderboardMessageBroken.length > 0 ? LeaderboardMessageBroken.join(`\n`) : "Oh no! It looks like nobody has gotten on the leaderboard. \nTalk in some channels to gain EXP"

            MessageEmbed = BotModules.embedMessage(
                LeaderboardMessage, 
                "03fca1", 
                "Economy Leaderboard",
                Date.now()
            )


        } else if (interaction.customId === "LevelLeaderboard") {
            LevelButton.setStyle(ButtonStyle.Primary)
            DailyStreakButton.setStyle(ButtonStyle.Secondary)
            EconomyButton.setStyle(ButtonStyle.Secondary)

            const LeaderboardData = dataHandler.customDataQuery(interaction.guild.id, "SELECT exp, userId FROM userdata ORDER BY exp DESC LIMIT 15", "all")

            const LeaderboardMessageBroken = LeaderboardData.map((userData, index) => {
                return `${index + 1}\u200B. <@${userData.userId}>: level ${parseInt(BotModules.getLevelFromXp(userData.exp))}`
            })

            const LeaderboardMessage = LeaderboardMessageBroken.length > 0 ? LeaderboardMessageBroken.join(`\n`) : "Oh no! It looks like nobody has gotten on the leaderboard. \nTalk in some channels to gain EXP"

            MessageEmbed = BotModules.embedMessage(
                LeaderboardMessage, 
                "03fca1", 
                "Level Leaderboard",
                Date.now()
            )
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