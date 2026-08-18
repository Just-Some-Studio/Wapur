const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    const ConfigureCommand = BotClient.commands.get("configure")
    const RockPaperScissorsCommand = BotClient.commands.get("rps")
    const LeaderboardCommand = BotClient.commands.get("leaderboard")
    const MessageCommand = BotClient.commands.get("message")

    if (Interaction.customId ===  "Reset" || Interaction.customId ===  "PrefixModalBuild") {
        ConfigureCommand.handleConfigure(Interaction, BotClient)
    } else if (Interaction.customId === "Setup") {
        ConfigureCommand.createSetupMessage(Interaction, BotClient)
    } else if (Interaction.customId === "Configure") {
        ConfigureCommand.createConfigureMessage(Interaction, BotClient)
    } else if (Interaction.customId === "ConfigReturnButton") {
        ConfigureCommand.execute(Interaction, "Return", BotClient)
    } else if (Interaction.customId === "ConfigSemiReturnButton") {
        ConfigureCommand.createConfigureMessage(Interaction, BotClient)
    }
    
    
    
    else if (Interaction.customId === "ConfigLevelingButton") {
        ConfigureCommand.createLevelingMessage(Interaction, BotClient)
    } else if (Interaction.customId === "ConfigEconomyButton") {
        ConfigureCommand.createEconomyMessage(Interaction, BotClient)
    } else if (Interaction.customId === "ConfigLoggingButton") {
        ConfigureCommand.createTicketMessage(Interaction, BotClient)
    } else if (Interaction.customId === "ConfigModerationButton") {
        ConfigureCommand.createModerationMessage(Interaction, BotClient)
    } else if (Interaction.customId === "ConfigMiscButton") {
        ConfigureCommand.createMiscMessage(Interaction, BotClient)
    }

    else if (Interaction.customId === "ToggleLeveling") {
        ConfigureCommand.handleConfigure(Interaction, BotClient)
    } else if (Interaction.customId === "LevelingModalCreate") {
        ConfigureCommand.handleConfigure(Interaction, BotClient)
    }

    else if (Interaction.customId.includes("rps-Rock") || Interaction.customId.includes("rps-Scissors") || Interaction.customId.includes("rps-Paper")) {
        RockPaperScissorsCommand.endGame(Interaction, BotClient)
    } else if (Interaction.customId === "ToggleEconomy") {
        ConfigureCommand.handleConfigure(Interaction, BotClient)
    }

    else if (Interaction.customId === "LevelLeaderboard" || Interaction.customId === "EconomyLeaderboard" || Interaction.customId === "DailyLeaderboard") {
        LeaderboardCommand.manageButtonInteraction(Interaction, BotClient)
    }

    else if (Interaction.customId.includes("DMReplyButton")) {
        MessageCommand.generateResponseModal(Interaction, BotClient)
    }
}

module.exports = {RunEvent}