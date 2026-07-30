const { PermissionsBitField, User } = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const modules = require("../../modules.js")

module.exports = {
    Name: "gamble",
    Description: "Gamble some credits for a chance to win more",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: true,
    RequiredPermissions: [],
    RequiresAllPermissions: false,
    SlashCommandOptions: [
        {"Name": "amount", "Description": "The amount of credits to gamble", "Required": true, "Type": "Integer", "Choices": []},
    ],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
        const Amount = parseInt(arguements[0])

        if (!Amount || isNaN(Amount)) {
            return message.reply("Invalid amount provided")
        }

        if (Amount > 5000 || Amount < 5) {
            return message.reply("You can only gamble up to 5000 credits and a minimum of 5")
        }
        
        const CurrentTime = Date.now()
        const CooldownTime = 5 * 60 * 1000
        const WinChance = Math.floor(Math.random() * 100)

        const UserData = DataHandler.getUser(message.guild.id, userId)


        if (Amount > UserData.credits) {
            return message.reply("You cannot gamble more credits than you have")
        }

        if (UserData.lastGamble === 0) {
            message.reply(`Before you can gamble please read the following: 
                There is a 2% chance to lose all credits
                There is a 50% chance to win half of what you gambled
                There is a 48% chance to lose your gambled amount
                
            Use the command again to being spinning the wheel.`)
            DataHandler.customDataQuery(message.guild.id, `UPDATE userdata SET lastGamble = 1 WHERE userId = ${userId}`, "run")
        } else if (CurrentTime - UserData.lastGamble < CooldownTime) {
            const CooldownTimeLeft = CooldownTime - (CurrentTime - UserData.lastGamble)
            let MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 1000))

            if (CooldownTimeLeft / (1000) <= 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (1000))
                return message.reply(modules.embedMessage(`You cannot gamble again for another **${MinutesLeft}** more seconds.`, 'c9c175'))
            } else {
                return message.reply(modules.embedMessage(`You cannot gamble again for another **${MinutesLeft}** more minutes.`, 'c9c175'))
            }

        } else if (WinChance > 50 && !WinChance < 50) {
            const CreditsEarned = Math.floor(Amount * 0.5)
            DataHandler.addWorkCredits(message.guild.id, userId, CreditsEarned, "Gamble", CurrentTime)

            const UpdatedUser = DataHandler.getUser(message.guild.id, userId)
            await message.reply(modules.embedMessage(`You gambled ${Amount} and won ${CreditsEarned} for a total of ${UpdatedUser.credits}.`, '009915'))


        } else if (WinChance <= 2) {
            DataHandler.addWorkCredits(message.guild.id, userId, 0, "Lost", CurrentTime)

            const UpdatedUser = DataHandler.getUser(message.guild.id, userId)
            await message.reply(modules.embedMessage(`You hit the 2% chance to lose everything, sorry!`, 'a31a1a'))
        } else {
            const CreditsEarned = Math.floor(-Amount)
            DataHandler.addWorkCredits(message.guild.id, userId, CreditsEarned, "Gamble", CurrentTime)

            const UpdatedUser = DataHandler.getUser(message.guild.id, userId)
            await message.reply(modules.embedMessage(`You gambled ${Amount} and lost ${Amount} for a total of ${UpdatedUser.credits}.`, 'ed7009'))
        }
    }
}