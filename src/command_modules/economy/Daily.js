const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Daily",
    Description: "Work for a day to gain credtis",

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
            await message.reply(BotModules.embedMessage(`Here is your daily reward: **${CreditsEarned}** credits! \nYou have lost your daily streak and restart from **${UpdatedUser.dailyStreak}**.`, '6283b5'))


        } else {
            const CreditsEarned = Math.floor(Math.random() * (50 * (1 + (0.1 * parseInt(UserData.dailyStreak))))) + 1
            DataHandler.addWorkCredits(message.guild.id, userId, CreditsEarned, "DailyKept", CurrentTime)

            const UpdatedUser = DataHandler.getUser(message.guild.id, userId)
            await message.reply(BotModules.embedMessage(`Here is your daily reward: **${CreditsEarned}** credits! \nYou have used daily **${UpdatedUser.dailyStreak}** days in a row.`, '6283b5'))
        }
    }
}