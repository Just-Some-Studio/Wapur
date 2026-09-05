const {PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")
const HtmlTranscriber = require("discord-html-transcripts")

module.exports = {
    Name: "CloseTicket",
    Description: "Closes a ticket",
    Subset: "Ticket",
   
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
    },

    async closeTicketViaButton(interaction, BotClient) {
        const InteractionId = interaction.customId.replace("CloseTicket_", "")
        const TicketDataId = `${interaction.guild.id}_Ticket_${InteractionId}`
        const TicketMetadata = interaction.channel.topic.match(/Ticket Data: \[(\d+)\]/)

        const UserOpenedTicketId = TicketMetadata[1]
        const UserOpenedTicket = await interaction.guild.members.fetch(UserOpenedTicketId)

        const AllSavedTicketData = JSON.parse(DataHandler.getServer(interaction.guild.id).ticketData)
        let TicketData
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketDataId) {
                TicketData = ticketObject
            }
        })
        const ModeratorRoles = TicketData.ModeratorRoles || []
        const TranscribeChannel = TicketData.TranscribeChannel || "None"

        if (!ModeratorRoles.some(roleId => UserOpenedTicket.roles.cache.has(roleId))) {
            await interaction.channel.permissionOverwrites.edit(UserOpenedTicketId, {
                ViewChannel: false,
                SendMessages: false
            })
        }

        const DeleteButton = new ButtonBuilder()
            .setCustomId(`DeleteTicket_${InteractionId}`)
            .setLabel("Delete Ticket")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary)

        const OpenButton = new ButtonBuilder()
            .setCustomId(`ReopenTicket_${InteractionId}`)
            .setLabel("Open Ticket")
            .setEmoji("🔓")
            .setStyle(ButtonStyle.Secondary)

        const TranscribeButton = new ButtonBuilder()
            .setCustomId(`TranscribeTicket_${InteractionId}`)
            .setLabel("Transcribe")
            .setEmoji("📜")
            .setStyle(ButtonStyle.Secondary)


        if (TranscribeChannel === "None" || TranscribeChannel === null) {
            TranscribeButton.setDisabled(true)
        }

        const TicketActionRow = new ActionRowBuilder()
            .addComponents(DeleteButton)
            .addComponents(OpenButton)
            .addComponents(TranscribeButton)

        const MessageEmbed = BotModules.embedMessage(
            "Ticket Moderator Actions",
            "fcba03",
        )

        const CurrentChannel = BotClient.channels.cache.get(interaction.channel.id)
        CurrentChannel.send({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            components: [TicketActionRow]
        })

        interaction.deferUpdate()
    },

    async reopenTicket(interaction, BotClient) {
        const InteractionId = interaction.customId.replace("ReopenTicket_", "")
        const TicketDataId = `${interaction.guild.id}_Ticket_${InteractionId}`
        const TicketMetadata = interaction.channel.topic.match(/Ticket Data: \[(\d+)\]/)

        const UserOpenedTicket = TicketMetadata[1]

        await interaction.channel.permissionOverwrites.edit(UserOpenedTicket, {
            ViewChannel: true,
            SendMessages: true
        })

        const MessageEmbed = BotModules.embedMessage(
            "The ticket was reopened",
            "fcba03",
        )

        interaction.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
        })
    },

    async deleteTicket(interaction, BotClient) {
        await interaction.channel.delete(`Ticket channel closed by: ${interaction.user.id} at ${Date.now()}`)
    },

    async transcribeTicket(interaction, BotClient) {
        const InteractionId = interaction.customId.replace("TranscribeTicket_", "")
        const TicketDataId = `${interaction.guild.id}_Ticket_${InteractionId}`
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(interaction.guild.id).ticketData)

        const TicketMetadata = interaction.channel.topic.match(/Ticket Data: \[(\d+)\]/)
        const UserOpenedTicketId = TicketMetadata[1]
        const UserOpenedTicket = await interaction.guild.members.fetch(UserOpenedTicketId)

        let TicketData
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketDataId) {
                TicketData = ticketObject
            }
        })

        const TranscribeChannel = BotClient.channels.cache.get(TicketData.TranscribeChannel) || "None"
        const TicketType = TicketData.TicketName || "General Ticket"

        const Transcription = await HtmlTranscriber.createTranscript(interaction.channel, {
            limit: -1,
            returnType: "attachment",
            filename: `Transcription--${interaction.channel.name}.html`,
            saveImages: true,
            poweredBy: true
        })

        if (TranscribeChannel === "None" || TranscribeChannel === null) {
            await interaction.deferUpdate()
        } else {
            const MessageEmbed = BotModules.embedMessage(
                "",
                "8f34eb",
                "Ticket Transcription",
                Date.now(),
                `Channel transcribed by: ${interaction.user.username}`,
                [
                    {name: "Ticket Creator", value: `${UserOpenedTicket}`, inline: true},
                    {name: "Ticket Name", value: `${interaction.channel.name}`, inline: true},
                    {name: "Ticket Type", value: `${TicketType}`, inline: true}
                ]
            )

            TranscribeChannel.send({
                content: "",
                embeds: [MessageEmbed.embeds[0]],
                files: [Transcription]
            })

            await interaction.reply({
                content: "Ticket transcriped to channel"
            })
        }
    }
}