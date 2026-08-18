const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    if (Interaction.customId === "SetupModal") {
        const NewPrefix = Interaction.fields.getTextInputValue("PrefixInput")
        const OldmiscBotData = JSON.parse(DataHandler.getServer(Interaction.guild.id).miscBotData)

        const NewmiscBotData = [...OldmiscBotData]
        NewmiscBotData[1] = NewPrefix

        DataHandler.setServerSettings(Interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
    }

    await Interaction.deferUpdate()
}

module.exports = {RunEvent}