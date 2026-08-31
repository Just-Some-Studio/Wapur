const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Interaction = PassedArguements.Interaction

    if (Interaction.customId === "LevelMessageChannelSelector") {
        const SelectedChannel = Interaction.values[0]
        const OldlevelSettings = JSON.parse(DataHandler.getServer(Interaction.guild.id).levelSettings)

        const NewlevelSettings = [...OldlevelSettings]
        NewlevelSettings[0] = SelectedChannel

        DataHandler.setServerSettings(Interaction.guild.id, "levelSettings", JSON.stringify(NewlevelSettings))
        
    } else if (Interaction.customId === "EXPDeniedChannelsSelector") {
        const SelectedChannels = Interaction.values
        const OldlevelSettings = JSON.parse(DataHandler.getServer(Interaction.guild.id).levelSettings)

        const NewlevelSettings = [...OldlevelSettings]
        NewlevelSettings[1] = SelectedChannels

        DataHandler.setServerSettings(Interaction.guild.id, "levelSettings", JSON.stringify(NewlevelSettings))
    }
    
    
    
    else if (Interaction.customId === "DMMessageChannelSelector") {
        const SelectedChannel = Interaction.values[0]
        const OldmiscBotData = JSON.parse(DataHandler.getServer(Interaction.guild.id).miscBotData)

        const NewmiscBotData = [...OldmiscBotData]
        NewmiscBotData[2] = SelectedChannel

        DataHandler.setServerSettings(Interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
    }


    else if (Interaction.customId === "CommandDeniedChannelSelector") {
        const SelectedChannels = Interaction.values
        const OldmiscBotData = JSON.parse(DataHandler.getServer(Interaction.guild.id).miscBotData)

        const NewmiscBotData = [...OldmiscBotData]
        NewmiscBotData[3] = SelectedChannels

        DataHandler.setServerSettings(Interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
    }


    else if (Interaction.customId.includes("CategorySelection_")) {
        const SelectedChannel = Interaction.values[0]

        const TicketId = `${Interaction.guild.id}_Ticket_${Interaction.customId.replace("CategorySelection_", "")}`
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(Interaction.guild.id).ticketData)

        let TicketDataIndex
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketId) {
                TicketDataIndex = index
            }
        })

        AllSavedTicketData[TicketDataIndex].TicketCategory = SelectedChannel
        DataHandler.setServerSettings(Interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))

    } else if (Interaction.customId.includes("TranscribeChannelSelection_")) {
        const SelectedChannel = Interaction.values[0]

        const TicketId = `${Interaction.guild.id}_Ticket_${Interaction.customId.replace("TranscribeChannelSelection_", "")}`
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(Interaction.guild.id).ticketData)

        let TicketDataIndex
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketId) {
                TicketDataIndex = index
            }
        })

        AllSavedTicketData[TicketDataIndex].TranscribeChannel = SelectedChannel

        DataHandler.setServerSettings(Interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))
    }

    await Interaction.deferUpdate()
}

module.exports = {RunEvent}