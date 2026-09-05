const {PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, 
    ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "TicketSettings",
    Description: "Set up a new ticket button in the current channel or edit your current tickets",
    Subset: "Ticket",
   
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(Interaction.guild.id).ticketData)
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.Saved !== true) {
                AllSavedTicketData.splice(index, 1)
            }
        })
        DataHandler.setServerSettings(Interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))

        const BeginButton = new ButtonBuilder()
            .setCustomId(`BeginTicketBuildButton_${Interaction.id}`)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Begin new")

        const EditButton = new ButtonBuilder()
            .setCustomId("EditTicketsButton")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Edit existing")

        const ButtonActionRow = new ActionRowBuilder()
            .addComponents(BeginButton)
            .addComponents(EditButton)

        const MessageEmbed = BotModules.embedMessage("Welcome to ticket builder! \n\nFully customizable, and free, tickets for you server management.", null, "Ticket Builder", Date.now(), "Tickets are not saved until builder is saved")

        await Interaction.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            components: [ButtonActionRow],
            flags: MessageFlags.Ephemeral
        })
    },

    async newTicketSettings(interaction, BotClient) {
        let InteractionId
        if (interaction.customId.includes("EditTicketData_")) {
            InteractionId = interaction.customId.replace("EditTicketData_", "")
        } else if (interaction.customId.includes("BeginTicketBuildButton_")) {
            InteractionId = interaction.customId.replace("BeginTicketBuildButton_", "")
        }
        const TicketId = `${interaction.guild.id}_Ticket_${InteractionId}`

        const OldTicketData = JSON.parse(DataHandler.getServer(interaction.guild.id).ticketData)
        const NewTicketData = [...OldTicketData]

        // Clean up old unused ticket data
        NewTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId !== TicketId && ticketObject.Saved !== true) {
                NewTicketData.splice(index, 1)
            }
        })

        NewTicketData.push({TicketId: TicketId, Saved: false})

        DataHandler.setServerSettings(interaction.guild.id, "ticketData", JSON.stringify(NewTicketData))

        const ReturnButton = new ButtonBuilder()
            .setCustomId(`TicketMenuReturn`)
            .setLabel("Return")
            .setStyle(ButtonStyle.Danger)

        const NewTicketMessageModalButton = new ButtonBuilder()
            .setCustomId(`TicketMessageModalBuild_${InteractionId}`)
            .setLabel("Ticket Message settings")
            .setStyle(ButtonStyle.Secondary)

        const NewTicketModalButton = new ButtonBuilder()
            .setCustomId(`TicketModalBuild_${InteractionId}`)
            .setLabel("Ticket Channel settings")
            .setStyle(ButtonStyle.Secondary)

        const SaveTicketButton = new ButtonBuilder()
            .setCustomId(`SaveNewTicket_${InteractionId}`)
            .setLabel("Save")
            .setStyle(ButtonStyle.Success)

        const SubmitTicketButton = new ButtonBuilder()
            .setCustomId(`SubmitNewTicket_${InteractionId}`)
            .setLabel("Submit")
            .setStyle(ButtonStyle.Primary)

        const CategorySelectMenu = new ChannelSelectMenuBuilder()
            .setChannelTypes(ChannelType.GuildCategory)
            .setMaxValues(1)
            .setCustomId(`CategorySelection_${InteractionId}`)
            .setRequired(false)
            .setPlaceholder("Channel creation category")

        const ModeratorRoleMenu = new RoleSelectMenuBuilder()
            .setCustomId(`ModeratorRoleSelection_${InteractionId}`)
            .setRequired(false)
            .setPlaceholder("Moderator roles")
            .setMaxValues(25)

        const TranscribeChannelSelectMenu = new ChannelSelectMenuBuilder()
            .setChannelTypes(ChannelType.GuildText)
            .setMaxValues(1)
            .setCustomId(`TranscribeChannelSelection_${InteractionId}`)
            .setRequired(false)
            .setPlaceholder("Transcribe Channel")

        const ButtonActionRow = new ActionRowBuilder()
            .addComponents(ReturnButton)
            .addComponents(NewTicketModalButton)
            .addComponents(NewTicketMessageModalButton)
            .addComponents(SaveTicketButton)
            .addComponents(SubmitTicketButton)

        const CategorySelectActionRow = new ActionRowBuilder()
            .addComponents(CategorySelectMenu)

        const TranscribeActionRow = new ActionRowBuilder()
            .addComponents(TranscribeChannelSelectMenu)

        const ModeratorRoleActionRow = new ActionRowBuilder()
            .addComponents(ModeratorRoleMenu)

        if (interaction.customId.includes("EditTicketData_")) {
            const MessageEmbed = BotModules.embedMessage(
                "Welcome to the ticket editor! \n\nYou can edit your ticket data here.", 
                null, 
                "Edit Existing Ticket", 
                Date.now(), 
                "Pressing return without saving will lose progress")

            await interaction.update({
                content: "",
                embeds: [MessageEmbed.embeds[0]],
                components: [ButtonActionRow, CategorySelectActionRow, TranscribeActionRow, ModeratorRoleActionRow],
                flags: MessageFlags.Ephemeral
            })
        } else {
            const MessageEmbed = BotModules.embedMessage(
                "Welcome to ticket builder! \n\nYou can create your new ticket here.", 
                null, 
                "New Ticket Editor", 
                Date.now(), 
                "Pressing return without saving will lose progress")

            await interaction.update({
                content: "",
                embeds: [MessageEmbed.embeds[0]],
                components: [ButtonActionRow, CategorySelectActionRow, TranscribeActionRow, ModeratorRoleActionRow],
                flags: MessageFlags.Ephemeral
            })
        }
    },

    async newTicketModalEditor(interaction, BotClient) {
        const InteractionId = interaction.customId.replace("TicketModalBuild_", "")

        const ChannelModal = new ModalBuilder()
            .setTitle("Ticket Channel Settings")
            .setCustomId(`TicketChannelModal_${InteractionId}`)

        const ChannelMessageEditor = new TextInputBuilder()
            .setCustomId("ChannelMessage")
            .setLabel("Channel Message")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(250)
            .setPlaceholder("eg. Thank you for making this ticket, add your information below so our moderators can deal with it")
            .setRequired(false)

        const ChannelMessageActionRow = new ActionRowBuilder()
            .addComponents(ChannelMessageEditor)

        ChannelModal
            .addActionRowComponents(ChannelMessageActionRow)

        await interaction.showModal(ChannelModal)
    },

    async newTicketMessageModalEditor(interaction, BotClient) {
        const InteractionId = interaction.customId.replace("TicketMessageModalBuild_", "")

        const NewTicketModal = new ModalBuilder()
            .setTitle("New Ticket Message Settings")
            .setCustomId(`NewTicketModal_${InteractionId}`)
        
        const TicketButtonNameEditor = new TextInputBuilder()
            .setCustomId("TicketName")
            .setLabel("Ticket Name")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(15)
            .setPlaceholder("eg. Reports")
            .setRequired(true)

        const TicketButtonMessageEditor = new TextInputBuilder()
            .setCustomId("TicketMessage")
            .setLabel("Ticket Message")
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(250)
            .setPlaceholder("eg. Click below to open a new ticket")
            .setRequired(false)

        const TicketButtonFooterEditor = new TextInputBuilder()
            .setCustomId("TicketFooter")
            .setLabel("Ticket Footer")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(35)
            .setPlaceholder("eg. tickets will be done in due time")
            .setRequired(false)

        const TicketButtonButtonNameEditor = new TextInputBuilder()
            .setCustomId("ButtonName")
            .setLabel("Button Label")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(15)
            .setPlaceholder("eg. Create ticket")
            .setRequired(false)

        const TicketButtonNameActionRow = new ActionRowBuilder()
            .addComponents(TicketButtonNameEditor)

        const TicketButtonButtonNameActionRow = new ActionRowBuilder()
            .addComponents(TicketButtonButtonNameEditor)

        const TicketButtonTextEditorActionRow = new ActionRowBuilder()
            .addComponents(TicketButtonMessageEditor)

        const TicketButtonFooterActionRow = new ActionRowBuilder()
            .addComponents(TicketButtonFooterEditor)

        NewTicketModal
            .addActionRowComponents(TicketButtonTextEditorActionRow)
            .addActionRowComponents(TicketButtonNameActionRow)
            .addActionRowComponents(TicketButtonButtonNameActionRow)
            .addActionRowComponents(TicketButtonFooterActionRow)

        await interaction.showModal(NewTicketModal)
    },

    async saveNewTicket(interaction, BotClient) {
        const TicketId = `${interaction.guild.id}_Ticket_${interaction.customId.replace("SaveNewTicket_", "")}`

        const OldTicketData = JSON.parse(DataHandler.getServer(interaction.guild.id).ticketData)
        const NewTicketData = [...OldTicketData]

        // Clean up old unused ticket data
        NewTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketId) {
                ticketObject.Saved = true
            }
        })

        DataHandler.setServerSettings(interaction.guild.id, "ticketData", JSON.stringify(NewTicketData))

        const MessageEmbed = BotModules.embedMessage(
            "Welcome to ticket builder! \n\nYou can create your new ticket here.", 
            null, 
            "New Ticket Editor", 
            Date.now(), 
            "Your ticket has been saved!"
        )

        await interaction.update({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            flags: MessageFlags.Ephemeral
        })
    },


    async createTicketInteraction(interaction, BotClient) {
        const InteractionId = interaction.customId.replace("SubmitNewTicket_", "")
        const TicketDataId = `${interaction.guild.id}_Ticket_${InteractionId}`

        const AllSavedTicketData = JSON.parse(DataHandler.getServer(interaction.guild.id).ticketData)

        let TicketData
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketDataId) {
                TicketData = ticketObject
                ticketObject.Saved = true
            }
        })

        DataHandler.setServerSettings(interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))

        const ButtonMessage = TicketData.ButtonName || "Open Ticket"
        const Message = TicketData.TicketMessage || "Click below to open a ticket"
        const Title = TicketData.TicketName || "Ticket"
        const FooterText = TicketData.TicketFooter || "Tickets may take time to be reviewed"

        const CreateTicketButton = new ButtonBuilder()
            .setCustomId(`OpenTicket_${InteractionId}`)
            .setLabel(ButtonMessage)
            .setStyle(ButtonStyle.Secondary)

        const ButtonActionRow = new ActionRowBuilder()
            .addComponents(CreateTicketButton)
        
        const MessageEmbed = BotModules.embedMessage(Message, "23691a", Title, Date.now(), FooterText)

        const CurrentChannel = BotClient.channels.cache.get(interaction.channel.id)

        CurrentChannel.send({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            components: [ButtonActionRow]
        })

        await interaction.update({
            content: "Ticket was created",
            components: [],
            embeds: [],
            flags: MessageFlags.Ephemeral
        })
    },






    async ticketsEditorMainMenu(interaction, BotClient) {
        const AllSavedTicketData = JSON.parse(DataHandler.getServer(interaction.guild.id).ticketData)

        if (AllSavedTicketData[0] === null) {
            const ReturnButton = new ButtonBuilder()
                .setCustomId("EditTicketMenuReturn")
                .setLabel("Return")
                .setStyle(ButtonStyle.Danger)
                
            const ButtonActionRow = new ActionRowBuilder()
                .addComponents(ReturnButton)

            const MessageEmbed = BotModules.embedMessage(
                "There are no tickets to edit, you can create new tickets and edit them in the \"Create New\" menu.", 
                null, 
                "Existing ticket editor error", 
                Date.now(), 
                `Ticket ID: Null`
            )

            return await interaction.update({
                content: "",
                embeds: [MessageEmbed.embeds[0]],
                components: [ButtonActionRow],
            })
        }




        
        let InteractionId
        if (interaction.customId === "EditTicketsButton") {
            InteractionId = AllSavedTicketData[0].TicketId.replace(`${interaction.guild.id}_Ticket_`, "")
        } else (
            InteractionId = interaction.customId.replace("EditTicketsButton_", "")
        )

        const TicketDataId = `${interaction.guild.id}_Ticket_${InteractionId}`
        let TicketData
        let TicketIndex
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketDataId) {
                TicketData = ticketObject
                TicketIndex = index
            }
        })

        const ReturnButton = new ButtonBuilder()
            .setCustomId("TicketMenuReturn")
            .setLabel("Return")
            .setStyle(ButtonStyle.Danger)

        const NextButton = new ButtonBuilder()
            .setLabel("Next")
            .setStyle(ButtonStyle.Secondary)

        const LastButton = new ButtonBuilder()
            .setLabel("Last")
            .setStyle(ButtonStyle.Secondary)

        const EditButton = new ButtonBuilder()
            .setLabel("Edit")
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`EditTicketData_${InteractionId}`)

        const DeleteButton = new ButtonBuilder()
            .setLabel("Delete Ticket")
            .setStyle(ButtonStyle.Danger)
            .setCustomId(`DeleteTicketData_${InteractionId}`)

        if (TicketIndex === 0) {
            LastButton.setDisabled(true)
            LastButton.setCustomId("Null")
        } else {
            const LastInteractionId = AllSavedTicketData[TicketIndex].TicketId.replace(`${interaction.guild.id}_Ticket_`, "")
            LastButton.setCustomId(`EditTicketsButton_${LastInteractionId}`)
        }

        if (AllSavedTicketData[TicketIndex] === null) {
            NextButton.setDisabled(true)
            NextButton.setCustomId("Null")
        } else {
            console.log(TicketIndex)
            const NextInteractionId = AllSavedTicketData[TicketIndex].TicketId.replace(`${interaction.guild.id}_Ticket_`, "")
            NextButton.setCustomId(`EditTicketsButton_${NextInteractionId}`)
        }

        const ActionButtonActionRow = new ActionRowBuilder()
            .addComponents(ReturnButton)
            .addComponents(DeleteButton)
            .addComponents(EditButton)

        const SelectorButtonActionRow = new ActionRowBuilder()
            .addComponents(LastButton)
            .addComponents(NextButton)

        const MessageEmbed = BotModules.embedMessage(
            `Switch tickets with the buttons at the bottom! \nPress \"Edit Ticket\" on the ticket you want to edit or \"Delete Ticket\" to remove it.
            
            Ticket Name: ${TicketData.TicketName || "Tickets"}
            Tickets created: ${TicketData.Number - 1 || "0000"}
            Ticket saved: ${TicketData.Saved || false}
            `, 
            null, 
            "Existing ticket editor", 
            Date.now(), 
            `Ticket ID: ${TicketDataId}`
        )

        await interaction.update({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            components: [ActionButtonActionRow, SelectorButtonActionRow],
        })
    }
}