const {PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "TicketSettings",
    Description: "Set up a new ticket button in the current channel or edit your current tickets",
   
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const BeginButton = new ButtonBuilder()
            .setCustomId("BeginTicketBuildButton")
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

    }
}