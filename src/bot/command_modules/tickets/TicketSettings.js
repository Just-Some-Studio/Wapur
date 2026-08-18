const {PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "TicketSettings",
    Description: "Set up a new ticket button in the current channel or edit your current tickets",
   
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const BeginButton = new ButtonBuilder()
            .setCustomId(`BeginTicketBuildButton_${message.id}`)
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

        message.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            components: [ButtonActionRow]
        })
    },

    async newTicketSettings(interaction, botClient) {




        interaction.update({
            content: "",
            embeds: [],
            components: []
        })
    },

    async ticketsEditorMainMenu(interaction, botClient) {

    },

    async editTicket(interaction, botClient) {

    },

    async createTicketInteraction(interaction, botClient) {
        const InteractionId = interaction.customId.replace("", "")

        const ButtonMessage = ""
        const Message = ""
        const Title = ""
        const FooterText = ""
        const TicketDataID = `${interaction.guild.id}_Ticket_${InteractionId}`

        const CreateTicketButton = new ButtonBuilder()
            .setCustomId(`Ticket_${TicketDataID}`)
            .setLabel(ButtonMessage)
            .setStyle(ButtonStyle.Secondary)

        const ButtonActionRow = new ActionRowBuilder()
            .addComponents(CreateTicketButton)
        
        const MessageEmbed = BotModules.embedMessage(Message, "23691a", Title, null, FooterText)

        interaction.update({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            components: [ButtonActionRow]
        })
    }
}