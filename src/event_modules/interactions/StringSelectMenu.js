const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    const ShopCommand = BotClient.commands.get("shop")

    if (ShopCommand && typeof ShopCommand.handleSelectMenu === "function") {
        try {
            await ShopCommand.handleSelectMenu(Interaction, BotClient)
        } catch (ThrownError) {
            console.error(ThrownError)
            await Interaction.reply({ content: `An error occured during runtime: ${ThrownError}`, ephemeral: true })
        }
    }

    return
}

module.exports = {RunEvent}