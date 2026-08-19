const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Daily",
    Description: "Work for a day to gain credtis",
    Subset: "Economy",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
        
        const CurrentTime = Date.now()
        const CooldownTime = 24 * 60 * 60 * 1000

        const UserData = DataHandler.getUser(message.guild.id, userId)

        if (CurrentTime - UserData.lastDaily < CooldownTime) {
            const CooldownTimeLeft = CooldownTime - (CurrentTime - UserData.lastDaily)
            let MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 1000))

            if (MinutesLeft > 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 60 * 1000))
                return message.reply(BotModules.embedMessage(`You cannot claim your daily reward for another **${MinutesLeft}** more hours.`, 'c9c175'))
            } else if (CooldownTimeLeft / (1000) <= 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (1000))
                return message.reply(BotModules.embedMessage(`You cannot claim your daily reward for another **${MinutesLeft}** more seconds.`, 'c9c175'))
            } else {
                return message.reply(BotModules.embedMessage(`You cannot claim your daily reward for another **${MinutesLeft}** more minutes.`, 'c9c175'))
            }


        } else if (CurrentTime - UserData.lastDaily > (2 * CooldownTime)) {
            const CreditsEarned = Math.floor(Math.random() * 50) + 1
            DataHandler.addWorkCredits(message.guild.id, userId, CreditsEarned, "DailyLost", CurrentTime)

            const UpdatedUser = DataHandler.getUser(message.guild.id, userId)
            const MessageEmbed = BotModules.embedMessage(
                `You claimed your daily bonus of **${CreditsEarned}** credits! \n\nYou forgot to claim your bonus yesterday and your reset to **${UpdatedUser.dailyStreak}**, Come back in a day for another bonus.`,
                "6283b5",
                "Daily credit bonus",
                Date.now(),
                `Your current balance is: ${UpdatedUser.credits}`
            )

            await message.reply({
                content: "",
                embeds: [MessageEmbed.embeds[0]]
            })


        } else {
            const CreditsEarned = Math.floor(Math.random() * (50 * (1 + (0.1 * parseInt(UserData.dailyStreak))))) + 1
            DataHandler.addWorkCredits(message.guild.id, userId, CreditsEarned, "DailyKept", CurrentTime)

            const UpdatedUser = DataHandler.getUser(message.guild.id, userId)

            const MessageEmbed = BotModules.embedMessage(
                `You claimed your daily bonus of **${CreditsEarned}** credits! \n\nYour current streak is **${UpdatedUser.dailyStreak}**, Come back in a day for another bonus.`,
                "6283b5",
                "Daily credit bonus",
                Date.now(),
                `Your current balance is: ${UpdatedUser.credits}`
            )

            await message.reply({
                content: "",
                embeds: [MessageEmbed.embeds[0]]
            })
        }
    }
}