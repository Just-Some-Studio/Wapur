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

        await Interaction.deferUpdate()
    } 
    
    
    
    else if (Interaction.customId.includes("DMResponseSubmit")) {
        const Message = Interaction.fields.getTextInputValue("ResponseInput")

        const miscBotData = JSON.parse(DataHandler.getServer(Interaction.customId.replace("DMResponseSubmit_", "")).miscBotData)
        const DMMessageChannel = BotClient.channels.cache.get(miscBotData[2]) || "None"

        const SentMessage = BotModules.embedMessage(Message, null, "User DM Response", Date.now(), `This message was sent from: ${Interaction.user.id}`)

        if (DMMessageChannel !== "None") {
            console.log(`Message sent from ${Interaction.user.username}(${Interaction.user.id}): ${Message}  
                --> Sent to channel ${DMMessageChannel.name}(${DMMessageChannel.id}), in server ${DMMessageChannel.guild.name}(${DMMessageChannel.guild.id})`)

            DMMessageChannel.send({
                content: "",
                embeds: [SentMessage.embeds[0]]
            })

            Interaction.reply({
                content: "Your message was sent! Moderators may take time to respond, please stand by.",
                emphemeral: true
            })
        } else {
            Interaction.reply({
                content: "DM response messages are not enabled for that server. \nTalk to a server manager about getting that enabled if they are okay with it."
            })
        }
    }



    else if (Interaction.customId === "LevelingModalSubmit") {
        const MinimumExpGain = Interaction.fields.getTextInputValue("EXPPerMessageMin")
        const MaximumExpGain = Interaction.fields.getTextInputValue("EXPPerMessageMax")
        const ExpGainCooldown = Interaction.fields.getTextInputValue("EXPGainCooldown")

        const OldlevelBotData = JSON.parse(DataHandler.getServer(Interaction.guild.id).levelSettings)

        const NewlevelBotData = [...OldlevelBotData]

        if (MinimumExpGain !== "" && MinimumExpGain !== null) {
            NewlevelBotData[4] = MinimumExpGain
        }

        if (MaximumExpGain !== "" && MaximumExpGain !== null) {
            NewlevelBotData[3] = MaximumExpGain
        }

        if (ExpGainCooldown !== "" && ExpGainCooldown !== null) {
            NewlevelBotData[2] = ExpGainCooldown
        }

        DataHandler.setServerSettings(Interaction.guild.id, "levelSettings", JSON.stringify(NewlevelBotData))

        await Interaction.deferUpdate()
    }






    else if (Interaction.customId.includes("TicketChannelModal_")) {
        const TicketId = `${Interaction.guild.id}_Ticket_${Interaction.customId.replace("TicketChannelModal_", "")}`
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(Interaction.guild.id).ticketData)

        const ChannelMessage = Interaction.fields.getTextInputValue("ChannelMessage") || "Thank you for opening a new ticket \n\nThe moderation team will be with you shortly \nPlease state your issue so we can help you quicker"

        let TicketDataIndex
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketId) {
                TicketDataIndex = index
            }
        })

        AllSavedTicketData[TicketDataIndex].ChannelMessage = ChannelMessage

        DataHandler.setServerSettings(Interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))

        await Interaction.deferUpdate()

    } else if (Interaction.customId.includes("NewTicketModal_")) {
        const TicketId = `${Interaction.guild.id}_Ticket_${Interaction.customId.replace("NewTicketModal_", "")}`
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(Interaction.guild.id).ticketData)

        const TicketName = Interaction.fields.getTextInputValue("TicketName") || "Ticket"
        const TicketMessage = Interaction.fields.getTextInputValue("TicketMessage") || "Click below to open a ticket"
        const TicketFooter = Interaction.fields.getTextInputValue("TicketFooter") || "Tickets may take time to be reviewed"
        const ButtonName = Interaction.fields.getTextInputValue("ButtonName") || "Open Ticket"


        let TicketDataIndex
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketId) {
                TicketDataIndex = index
            }
        })

        AllSavedTicketData[TicketDataIndex].TicketName = TicketName
        AllSavedTicketData[TicketDataIndex].TicketMessage = TicketMessage
        AllSavedTicketData[TicketDataIndex].TicketFooter = TicketFooter
        AllSavedTicketData[TicketDataIndex].ButtonName = ButtonName
        

        DataHandler.setServerSettings(Interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))

        await Interaction.deferUpdate()
    }
}

module.exports = {RunEvent}