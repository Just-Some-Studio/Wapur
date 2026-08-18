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

    await Interaction.deferUpdate()
}

module.exports = {RunEvent}