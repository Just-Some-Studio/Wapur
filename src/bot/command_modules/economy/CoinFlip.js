const {PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "coinflip",
    Description: "Gamble some credits and flip a coin for more",
    Subset: "Economy",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [
        {"Name": "amount", "Description": "The amount of credits to gamble", "Required": true, "Type": "Integer", "Choices": []},
    ],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
        const Amount = Math.floor(parseInt(arguements[0]))

        if (!Amount || isNaN(Amount)) {
            return message.reply("Invalid amount provided")
        }

        if (Amount > 5000 || Amount < 5) {
            return message.reply("You can only gamble up to 5000 credits and a minimum of 5")
        }
        
        const CurrentTime = Date.now()
        const CooldownTime = 5 * 60 * 1000

        const UserData = DataHandler.getUser(message.guild.id, userId)


        if (Amount > UserData.credits) {
            return message.reply("You cannot gamble more credits than you have")
        }

        if (CurrentTime - UserData.lastGamble < CooldownTime) {
            const CooldownTimeLeft = CooldownTime - (CurrentTime - UserData.lastGamble)
            let MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 1000))

            if (CooldownTimeLeft / (1000) <= 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (1000))
                return message.reply(BotModules.embedMessage(`You cannot gamble again for another **${MinutesLeft}** more seconds.`, 'c9c175'))
            } else {
                return message.reply(BotModules.embedMessage(`You cannot gamble again for another **${MinutesLeft}** more minutes.`, 'c9c175'))
            }
        }



        const HeadsButton = new ButtonBuilder()
            .setCustomId(`Coin_Heads_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Heads")

        const TailsButton = new ButtonBuilder()
            .setCustomId(`Coin_Tails_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Tails")

        const GameActionRow = new ActionRowBuilder()
            .addComponents(HeadsButton)
            .addComponents(TailsButton)


        const MessageEmbed = BotModules.embedMessage(
            `<@${userId}> gambles ${Amount} in hope to win more \n\nTake a guess on the coin's land \nGuess correctly and win twice your bet, guess wrong and lose twice your bet.`,
            "8f34eb",
            "Gamble || Coin Flip",
            Date.now(),
            `Your current balance is ${UserData.credits}`
        )

        message.reply({
            content: "", 
            embeds: [MessageEmbed.embeds[0]],
            components: [GameActionRow],
        })
    },


    async endGame(interaction, botClient) {
        const BotChoice = `${Math.floor(Math.random() * 2)}`
        
        var PlayerChoice = ""
        var PlayerGambledAmount = 0
        var BotReply = "if you saw this then an error occured"

        if (interaction.customId.includes("Coin_Heads_")) {
            PlayerChoice = "Heads"
        } else if (interaction.customId.includes("Coin_Tails_")) {
            PlayerChoice = "Tails"
        }

        if (PlayerChoice === "Heads") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("Coin_Heads_", ""))
        } else if (PlayerChoice === "Tails") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("Coin_Tails_", ""))
        }


        if (PlayerGambledAmount === 0 || isNaN(PlayerGambledAmount)) {
           return interaction.update({content: "An issue occured, PlayerGambledAmount is null or unchanged", components: []})
        }


        if (PlayerChoice === "Heads" && BotChoice === "0") {
            BotReply = "You bet on heads and flipped the coin...\n\nAnd it landed on heads so you won your bet back and a little extra!"
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, Math.floor(PlayerGambledAmount / 2), "Gamble", Date.now())

        } else if (PlayerChoice === "Heads" && (BotChoice === "1" || BotChoice === "2")) {
            BotReply = "You bet on heads and flipped the coin...\n\nBut it landed on tails and you lost your bet."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())
        }

        if (PlayerChoice === "Tails" && BotChoice === "0") {
            BotReply = "You bet on tails and flipped the coin...\n\nBut it landed on heads and you lost your bet."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())

        } else if (PlayerChoice === "Tails" && (BotChoice === "1" || BotChoice === "2")) {
            BotReply = "You bet on tails and flipped the coin...\n\nAnd it landed on tails so you won your bet back and a little extra!"
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, Math.floor(PlayerGambledAmount / 2), "Gamble", Date.now())
        }


        const UserData = DataHandler.getUser(interaction.guild.id, interaction.user.id)

        const MessageEmbed = BotModules.embedMessage(
            BotReply,
            "8f34eb",
            "Gamble || Coin Flip",
            Date.now(),
            `Your current balance is ${UserData.credits}`
        )

        interaction.update({
            content: "", 
            embeds: [MessageEmbed.embeds[0]],
            components: [],
        })
    }
}