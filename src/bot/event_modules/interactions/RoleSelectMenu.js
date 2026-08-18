const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    if (Interaction.customId === "EditAccessSelector") {
        const SelectedRoles = Interaction.values
        const OldmiscBotData = JSON.parse(DataHandler.getServer(Interaction.guild.id).miscBotData)

        const NewmiscBotData = [...OldmiscBotData]
        NewmiscBotData[4] = SelectedRoles

        DataHandler.setServerSettings(Interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
    }

    await Interaction.deferUpdate()
}

module.exports = {RunEvent}