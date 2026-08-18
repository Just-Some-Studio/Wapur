const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    const ConfigureCommand = BotClient.commands.get("configure")
    const RockPaperScissorsCommand = BotClient.commands.get("rps")

    if (Interaction.customId ===  "Reset" || Interaction.customId ===  "PrefixModalBuild") {
        ConfigureCommand.handleConfigure(Interaction, BotClient)
    } else if (Interaction.customId === "Setup") {
        ConfigureCommand.createSetupMessage(Interaction, BotClient)
    } else if (Interaction.customId === "Configure") {
        ConfigureCommand.createConfigureMessage(Interaction, BotClient)
    } else if (Interaction.customId === "ReturnButton") {
        ConfigureCommand.execute(Interaction, "Return", BotClient)
    } else if (Interaction.customId === "SemiReturnButton") {
        ConfigureCommand.createConfigureMessage(Interaction, BotClient)
    }
    
    
    
    else if (Interaction.customId === "LevelingButton") {
        ConfigureCommand.createLevelingMessage(Interaction, BotClient)
    } else if (Interaction.customId === "EconomyButton") {
        ConfigureCommand.createEconomyMessage(Interaction, BotClient)
    } else if (Interaction.customId === "TicketButton") {
        ConfigureCommand.createTicketMessage(Interaction, BotClient)
    } else if (Interaction.customId === "ModerationButton") {
        ConfigureCommand.createModerationMessage(Interaction, BotClient)
    } else if (Interaction.customId === "MiscButton") {
        ConfigureCommand.createMiscMessage(Interaction, BotClient)
    }

    else if (Interaction.customId === "ToggleLeveling") {
        ConfigureCommand.handleConfigure(Interaction, BotClient)
    }

    else if (Interaction.customId.includes("rps-Rock") || Interaction.customId.includes("rps-Scissors") || Interaction.customId.includes("rps-Paper")) {
        RockPaperScissorsCommand.endGame(Interaction, botClient)
    }
}

module.exports = {RunEvent}