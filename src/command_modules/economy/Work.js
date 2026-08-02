const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Work",
    Description: "Work for an hour to gain credits",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        if (arguements.length > 0) {
            return message.reply({content: "This command requires no arguements", ephemeral: true, allowedMentions: {repliedUser: false}})
        }

        const userId = message.author?.id || message.user?.id
        
        const CurrentTime = Date.now()
        const CooldownTime = 60 * 60 * 1000

        const UserData = DataHandler.getUser(message.guild.id, userId)

        if (CurrentTime - UserData.lastWorked < CooldownTime) {
            const CooldownTimeLeft = CooldownTime - (CurrentTime - UserData.lastWorked)
            let MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 1000))
            
            if (MinutesLeft > 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 60 * 1000))
                return message.reply(BotModules.embedMessage(`You cannot work for another **${MinutesLeft}** more hours.`, 'c9c175'))
            } else if (CooldownTimeLeft / (1000) <= 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (1000))
                return message.reply(BotModules.embedMessage(`You cannot work for another **${MinutesLeft}** more seconds.`, 'c9c175'))
            } else {
                return message.reply(BotModules.embedMessage(`You cannot work for another **${MinutesLeft}** more minutes.`, 'c9c175'))
            }
        }

        const CreditsEarned = Math.floor(Math.random() * 300) + 1
        DataHandler.addWorkCredits(message.guild.id, userId, CreditsEarned, "Work", CurrentTime)

        const UpdatedUser = DataHandler.getUser(message.guild.id, userId)

        await message.reply(BotModules.embedMessage(`You worked for an hour and earned **${CreditsEarned}** credits! \nYour new balance is **${UpdatedUser.credits}** credits. Return in an hour for more credits.`, '6283b5'))
    }
}