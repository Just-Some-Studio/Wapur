const {PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Roulette",
    Description: "Gamble some credits for a chance to win more",
    Subset: "Economy",

    DevOnly: false,

    RequiredPermissions: [],
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

        const UserData = DataHandler.getUser(message.guild.id, userId)


        if (Amount > UserData.credits) {
            return message.reply("You cannot gamble more credits than you have")
        }

        if (UserData.lastGamble === 0) {
            const MessageEmbed = BotModules.embedMessage(
                `Before you can use this gamble command, please read the following: \n\n   There is 2% chance to land on green\n    There is a 49% chance to land on red\n    There is a 49% chance to land on black\n\nUse the gamble command to begin spinning the wheel.`,
                "8f34eb",
                "Gamble || NOTICE",
                Date.now(),
                `\"Hey, Listen\"`
            )

            await message.reply({
                content: "",
                embeds: [MessageEmbed.embeds[0]]
            })

            DataHandler.customDataQuery(message.guild.id, `UPDATE userdata SET lastGamble = 1 WHERE userId = ${userId}`, "run")
        } else if (CurrentTime - UserData.lastGamble < CooldownTime) {
            const CooldownTimeLeft = CooldownTime - (CurrentTime - UserData.lastGamble)
            let MinutesLeft = Math.ceil(CooldownTimeLeft / (60 * 1000))

            if (CooldownTimeLeft / (1000) <= 60) {
                MinutesLeft = Math.ceil(CooldownTimeLeft / (1000))
                return message.reply(BotModules.embedMessage(`You cannot gamble again for another **${MinutesLeft}** more seconds.`, 'c9c175'))
            } else {
                return message.reply(BotModules.embedMessage(`You cannot gamble again for another **${MinutesLeft}** more minutes.`, 'c9c175'))
            }
        } 


        const RedButton = new ButtonBuilder()
            .setCustomId(`Roul_Red_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Red")

        const BlackButton = new ButtonBuilder()
            .setCustomId(`Roul_Black_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Black")

        const GreenButton = new ButtonBuilder()
            .setCustomId(`Roul_Green_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Green")

        const GameActionRow = new ActionRowBuilder()
            .addComponents(RedButton)
            .addComponents(BlackButton)
            .addComponents(GreenButton)


        const MessageEmbed = BotModules.embedMessage(
            `${userId} gambles ${Amount} in hope to win more \n\nGuess correctly to win more credits \nWinning on a green will win more than normal.`,
            "8f34eb",
            "Gamble || Roulette",
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
        const BotChoice = Math.floor(Math.random() * 100)
        
        var PlayerChoice = ""
        var PlayerGambledAmount = 0
        var BotReply = "if you saw this then an error occured"

        if (interaction.customId.includes("Roul_Red_")) {
            PlayerChoice = "Red"
        } else if (interaction.customId.includes("Roul_Black_")) {
            PlayerChoice = "Black"
        } else if (interaction.customId.includes("Roul_Green_")) {
            PlayerChoice = "Green"
        }

        if (PlayerChoice === "Red") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("Roul_Red_", ""))
        } else if (PlayerChoice === "Black") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("Roul_Black_", ""))
        } else if (PlayerChoice === "Green") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("Roul_Green_", ""))
        }


        if (PlayerGambledAmount === 0 || isNaN(PlayerGambledAmount)) {
           return interaction.update({content: "An issue occured, PlayerGambledAmount is null or unchanged", components: []})
        }


        if (PlayerChoice === "Red" && BotChoice > 2 && BotChoice <= 51) {
            BotReply = "You bet on red and spun the wheel...\n\nAnd it landed on red so you won twice your bet!"
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, PlayerGambledAmount, "Gamble", Date.now())

        } else if (PlayerChoice === "Red" && BotChoice <= 2) {
            BotReply = "You bet on red and spin the wheel...\n\nBut it landed on green and you lost your bet."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())

        } else if (PlayerChoice === "Red" && BotChoice >= 52) {
            BotReply = "You bet on red and spin the wheel...\n\nBut it landed on Black and you lost your bet."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())
        }


        if (PlayerChoice === "Black" && BotChoice > 2 && BotChoice <= 51) {
            BotReply = "You bet on black and spun the wheel...\n\nBut it landed on red and you lost your bet."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())

        } else if (PlayerChoice === "Black" && BotChoice <= 2) {
            BotReply = "You bet on black and spin the wheel...\n\nBut it landed on green and you lost your bet."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())
            
        } else if (PlayerChoice === "Black" && BotChoice >= 52) {
            BotReply = "You bet on black and spin the wheel...\n\nAnd it landed on black so you won twice your bet!"
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, PlayerGambledAmount, "Gamble", Date.now())
        }


        if (PlayerChoice === "Green" && BotChoice > 2 && BotChoice <= 51) {
            BotReply = "You bet on green and spun the wheel...\n\nBut it landed on red and you lost your bet."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())

        } else if (PlayerChoice === "Green" && BotChoice <= 2) {
            BotReply = "You bet on green and spin the wheel...\n\nAnd it landed on green, you just hit the jackpot!"
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, Math.floor(PlayerGambledAmount * 3), "Gamble", Date.now())
            
        } else if (PlayerChoice === "Green" && BotChoice >= 52) {
            BotReply = "You bet on green and spin the wheel...\n\nbut it landed on black and you lost your bet"
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())
        }


        const UserData = DataHandler.getUser(interaction.guild.id, interaction.user.id)

        const MessageEmbed = BotModules.embedMessage(
            BotReply,
            "8f34eb",
            "Gamble || Roulette",
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