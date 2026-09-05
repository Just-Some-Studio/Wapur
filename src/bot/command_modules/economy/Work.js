const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Work",
    Description: "Work for an hour to gain credits",
    Subset: "Economy",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const userId = Interaction.author?.id || Interaction.user?.id
        
        const CurrentTime = Date.now()
        const CooldownTime = 60 * 60 * 1000

        const UserData = DataHandler.getUser(Interaction.guild.id, userId)

        if (CurrentTime - UserData.lastWorked < CooldownTime) {
            const CooldownTimeLeft = CooldownTime - (CurrentTime - UserData.lastWorked)
            let MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 1000))
            
            if (MinutesLeft > 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 60 * 1000))
                return Interaction.reply(BotModules.embedMessage(`You cannot work for another **${MinutesLeft}** more hours.`, 'c9c175'))
            } else if (CooldownTimeLeft / (1000) <= 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (1000))
                return Interaction.reply(BotModules.embedMessage(`You cannot work for another **${MinutesLeft}** more seconds.`, 'c9c175'))
            } else {
                return Interaction.reply(BotModules.embedMessage(`You cannot work for another **${MinutesLeft}** more minutes.`, 'c9c175'))
            }
        }

        const CreditsEarned = Math.floor(Math.random() * 300) + 1
        DataHandler.addWorkCredits(Interaction.guild.id, userId, CreditsEarned, "Work", CurrentTime)

        const UpdatedUser = DataHandler.getUser(Interaction.guild.id, userId)

        const MessageEmbed = BotModules.embedMessage(
            `You worked for an hour and gained **${CreditsEarned}** credits! \n\nCome back in an hour to work again for some more credits`,
            "6283b5",
            "Hourly credit paycheck",
            Date.now(),
            `Your current balance is: ${UpdatedUser.credits}`
        )

        await Interaction.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]]
        })
    }
}