const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    const ConfigureCommand = BotClient.commands.get("configure")

    const LeaderboardCommand = BotClient.commands.get("leaderboard")
    const MessageCommand = BotClient.commands.get("message")

    const RockPaperScissorsCommand = BotClient.commands.get("rps")
    const CoinFlipCommand = BotClient.commands.get("coinflip")
    const RouletteCommand = BotClient.commands.get("roulette")

    const TicketSettingsCommand = BotClient.commands.get("ticketsettings")
    const OpenTicketCommand = BotClient.commands.get("openticket")
    const CloseTicketCommand = BotClient.commands.get("closeticket")

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
    } else if (Interaction.customId.includes("Coin_Heads_") || Interaction.customId.includes("Coin_Tails_")) {
        CoinFlipCommand.endGame(Interaction, BotClient)
    } else if (Interaction.customId.includes("Roul_Red") || Interaction.customId.includes("Roul_Black") || Interaction.customId.includes("Roul_Green")) {
        RouletteCommand.endGame(Interaction, BotClient)
    }



    else if (Interaction.customId.includes("BeginTicketBuildButton_")) {
        TicketSettingsCommand.newTicketSettings(Interaction, BotClient)
    } else if (Interaction.customId.includes("TicketModalBuild_")) {
        TicketSettingsCommand.newTicketModalEditor(Interaction, BotClient)
    } else if (Interaction.customId.includes("TicketMessageModalBuild_")) {
        TicketSettingsCommand.newTicketMessageModalEditor(Interaction, BotClient)
    } else if (Interaction.customId.includes("SaveNewTicket_")) {
        TicketSettingsCommand.saveNewTicket(Interaction, BotClient)
    } else if (Interaction.customId.includes("SubmitNewTicket_")) {
        TicketSettingsCommand.createTicketInteraction(Interaction, BotClient)
    } else if (Interaction.customId.includes("OpenTicket_")) {
        OpenTicketCommand.createTicketViaButton(Interaction, BotClient)
    } else if (Interaction.customId.includes("CloseTicket_")) {
        CloseTicketCommand.closeTicketViaButton(Interaction, BotClient)
    } else if (Interaction.customId.includes("ReopenTicket_")) {
        CloseTicketCommand.reopenTicket(Interaction, BotClient)
    } else if (Interaction.customId.includes("DeleteTicket_")) {
        CloseTicketCommand.deleteTicket(Interaction, BotClient)
    } else if (Interaction.customId.includes("TranscribeTicket_")) {
        CloseTicketCommand.transcribeTicket(Interaction, BotClient)
    } else if (Interaction.customId.includes("EditTicketsButton")) {
        TicketSettingsCommand.ticketsEditorMainMenu(Interaction, BotClient)
    } else if (Interaction.customId === "TicketMenuReturn") {
        TicketSettingsCommand.execute(Interaction, null, BotClient)
    } else if (Interaction.customId.includes("EditTicketData_")) {
        TicketSettingsCommand.newTicketSettings(Interaction, BotClient)
    }



    else if (Interaction.customId === "LevelLeaderboard" || Interaction.customId === "EconomyLeaderboard" || Interaction.customId === "DailyLeaderboard") {
        LeaderboardCommand.manageButtonInteraction(Interaction, BotClient)
    }



    else if (Interaction.customId.includes("DMReplyButton")) {
        MessageCommand.generateResponseModal(Interaction, BotClient)
    }
}

module.exports = {RunEvent}