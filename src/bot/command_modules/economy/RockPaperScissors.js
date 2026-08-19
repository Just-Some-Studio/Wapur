const {PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "rps",
    Description: "Gamble some credits in a game to win more",
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



        const RockButton = new ButtonBuilder()
            .setCustomId(`rps-Rock_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Rock")
            .setEmoji("🪨")

        const PaperButton = new ButtonBuilder()
            .setCustomId(`rps-Paper_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Paper")
            .setEmoji("📄")

        const ScissorsButton = new ButtonBuilder()
            .setCustomId(`rps-Scissors_${Amount}`)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Scissors")
            .setEmoji("✂️")

        const GameActionRow = new ActionRowBuilder()
            .addComponents(RockButton)
            .addComponents(PaperButton)
            .addComponents(ScissorsButton)


        const MessageEmbed = BotModules.embedMessage(
            `<@${userId}> gambles ${Amount} in hope to win more \n\nDual the bot in rock paper scissors \nWin the game, win your bet. Lose and those credits are gone.`,
            "8f34eb",
            "Gamble || Rock Paper Scissors",
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
        const BotChoice = `${Math.floor(Math.random() * 3)}`
        
        var PlayerChoice = ""
        var PlayerGambledAmount = 0
        var BotReply = "if you saw this then an error occured"

        if (interaction.customId.includes("rps-Scissors")) {
            PlayerChoice = "Scissors"
        } else if (interaction.customId.includes("rps-Paper")) {
            PlayerChoice = "Paper"
        } else if (interaction.customId.includes("rps-Rock")) {
            PlayerChoice = "Rock"
        }

        if (PlayerChoice === "Rock") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("rps-Rock_", ""))
        } else if (PlayerChoice === "Paper") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("rps-Paper_", ""))
        } else if (PlayerChoice === "Scissors") {
            PlayerGambledAmount = parseInt(interaction.customId.replace("rps-Scissors_", ""))
        }


        if (PlayerGambledAmount === 0 || isNaN(PlayerGambledAmount)) {
           return interaction.update({content: "An issue occured, PlayerGambledAmount is null or unchanged", components: []})
        }


        if (PlayerChoice === "Rock" && BotChoice === "0") {
            BotReply = "The bot picked rock and you both tied, here's your bet back."
        } else if (PlayerChoice === "Rock" && BotChoice === "1") {
            BotReply = "The bot picked paper and you lost your bet, sorry."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())
        } else if (PlayerChoice === "Rock" && (BotChoice === "2" || BotChoice === "3")) {
            BotReply = "The bot picked scissors and you won twice your bet, Nice."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, PlayerGambledAmount, "Gamble", Date.now())
        }

        else if (PlayerChoice === "Paper" && BotChoice === "0") {
            BotReply = "The bot picked rock and you won twice your bet, nice."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, PlayerGambledAmount, "Gamble", Date.now())
        } else if (PlayerChoice === "Paper" && BotChoice === "1") {
            BotReply = "The bot picked paper and you both tied, here's your bet back."
        } else if (PlayerChoice === "Paper" && (BotChoice === "2" || BotChoice === "3")) {
            BotReply = "The bot picked scissors and you lost your bet, sorry."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())
        }

        else if (PlayerChoice === "Scissors" && BotChoice === "0") {
            BotReply = "The bot picked rock and you lost your bet, sorry."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, -PlayerGambledAmount, "Gamble", Date.now())
        } else if (PlayerChoice === "Scissors" && BotChoice === "1") {
            BotReply = "The bot picked paper and you won twice your bet, nice."
            DataHandler.addWorkCredits(interaction.guild.id, interaction.user?.id, PlayerGambledAmount, "Gamble", Date.now())
        } else if (PlayerChoice === "Scissors" && (BotChoice === "2" || BotChoice === "3")) {
            BotReply = "The bot picked scissors and you tied, here's your bet back."
        }

        const MessageEmbed = BotModules.embedMessage(
            BotReply,
            "8f34eb",
            "Gamble || Rock Paper Scissors",
            Date.now(),
            `Your current balance is ${UserData.credits}`
        )

        message.reply({
            content: "", 
            embeds: [MessageEmbed.embeds[0]],
            components: [GameActionRow],
        })
    }
}