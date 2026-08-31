const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")
const {MessageFlags} = require("discord.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction
    const BotOwner = PassedArguements.BotOwner

    const miscBotData = JSON.parse(DataHandler.getServer(Interaction.guild.id).miscBotData) || [";", "", [], []]
    const levelSettings = JSON.parse(DataHandler.getServer(Interaction.guild.id).levelSettings)
    const loggingSettings = JSON.parse(DataHandler.getServer(Interaction.guild.id).loggingSettings)
    const economySettings = JSON.parse(DataHandler.getServer(Interaction.guild.id).economySettings)
    
    const Prefix = miscBotData[1] || ";"
    const DMMessageChannel = miscBotData[2] || ""
    const CommandDeniedChannels = miscBotData[3] || []
    const RolesWithEditAccess = miscBotData[4] || []
    const UsersBannedFromCommands = miscBotData[5] || []

    const LevelMessageChannel = levelSettings[0] || Interaction.channel.id
    const EXPDeniedChannels = levelSettings[1] || []
    const ExpCooldownTime = levelSettings[2] * 1000 || 25 * 1000
    const MaxEXPGain = levelSettings[3] || 25
    const MinEXPGain = levelSettings[4] || 0
    const LevelingEnabled = levelSettings[5] || false

    const EconomyEnabled = economySettings[0] || false

    const loggingChannels = loggingSettings[0] || []


    const ArguementsToPass = []
    const CommandName = Interaction.commandName.toLowerCase()
    const Command = BotClient.commands.get(CommandName)

    Interaction.options.data.forEach(option => {
        if (option.type === 6) { // 6 is a user type
            ArguementsToPass.push(`<@${option.value}>`);
        } else {
            ArguementsToPass.push(String(option.value));
        }
    })

    if (!Command) return

    if (Command.Subset === "Economy" && EconomyEnabled === false) {
        return Message.reply("Sorry, Economy is disabled in this server.")
    }

    if (Command.Subset === "Leveling" && LevelingEnabled === false) {
        return Message.reply("Sorry, Leveling is disabled in this server.")
    }


    // Configure has to always be available for running
    if (CommandName === "configure" && Interaction.memberPermissions.has(Command.RequiredPermissions)) {
        if (miscBotData[1] === null || miscBotData[1] === undefined || miscBotData[1] === "" || miscBotData[1] === "null") {
             try {
                await Command.execute(Interaction, "Not Setup", BotClient)
            } catch (ThrownError) {
                console.error(ThrownError)
                await Interaction.reply(`An error occured during runtime: ${ThrownError}`)
            }
        } else {
            try {
                await Command.execute(Interaction, ArguementsToPass, BotClient)
            } catch (ThrownError) {
                console.error(ThrownError)
                await Interaction.reply(`An error occured during runtime: ${ThrownError}`)
            }
        }

        return
    }





    // Prevents people who don't have permissions from using commands        
    if (CommandDeniedChannels.includes(Interaction.channel.id)) {
        return
    }

    if (!Interaction.member) {return Interaction.reply("Commands cannot be run in DMs, go to a server to run commands.")}

    if (Command.DevOnly && Interaction.user.id !== BotOwner) {
        return
    }

    if (Command.RequiredPermissions && Command.RequiredPermissions.length > 0) {
        if (!Interaction.memberPermissions.has(Command.RequiredPermissions)) {
            return Interaction.reply({content: "Sorry, you don't have permission for that.", flags: MessageFlags.Ephemeral})
        }
    }

    // Attempts to run a command
    try {
        await Command.execute(Interaction, ArguementsToPass, BotClient)
    } catch (ThrownError) {
        console.error(ThrownError)
        await Interaction.reply(`An error occured during runtime: ${ThrownError}`)
    }
}

module.exports = {RunEvent}