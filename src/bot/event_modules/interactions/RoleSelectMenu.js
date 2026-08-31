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



    else if (Interaction.customId.includes("ModeratorRoleSelection_")) {
        const SelectedRoles = Interaction.values

        const TicketId = `${Interaction.guild.id}_Ticket_${Interaction.customId.replace("ModeratorRoleSelection_", "")}`
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(Interaction.guild.id).ticketData)

        let TicketDataIndex
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketId) {
                TicketDataIndex = index
            }
        })

        AllSavedTicketData[TicketDataIndex].ModeratorRoles = SelectedRoles

        DataHandler.setServerSettings(Interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))
    }

    await Interaction.deferUpdate()
}

module.exports = {RunEvent}