const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")
const {MessageFlags} = require("discord.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    const ShopCommand = BotClient.commands.get("shop")

    if (ShopCommand && typeof ShopCommand.handleSelectMenu === "function") {
        try {
            await ShopCommand.handleSelectMenu(Interaction, BotClient)
        } catch (ThrownError) {
            console.error(ThrownError)
            await Interaction.reply({ content: `An error occured during runtime: ${ThrownError}`, flags: MessageFlags.Ephemeral })
        }
    }

    return
}

module.exports = {RunEvent}