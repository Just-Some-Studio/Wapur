const {PermissionsBitField, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "OpenTicket",
    Description: "Opens a new ticket",
    Subset: "Ticket",
   
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
    },

    async createTicketViaButton(interaction, BotClient) {
        const InteractionId = interaction.customId.replace("OpenTicket_", "")
        const TicketDataId = `${interaction.guild.id}_Ticket_${InteractionId}`

        const AllSavedTicketData = JSON.parse(DataHandler.getServer(interaction.guild.id).ticketData)

        let TicketData
        let TicketIndex
        AllSavedTicketData.forEach((ticketObject, index) => {
            if (ticketObject.TicketId === TicketDataId) {
                TicketData = ticketObject
                TicketIndex = index
            }
        })

        const TicketNumberStored = parseInt(TicketData.Number) || 1
        let TicketNumberUsed

        if (TicketNumberStored < 10) {
            TicketNumberUsed = `000${TicketNumberStored}`
        } else if (TicketNumberStored < 100) {
            TicketNumberUsed = `00${TicketNumberStored}`
        } else if (TicketNumberStored < 1000) {
            TicketNumberUsed = `0${TicketNumberStored}`
        } else {
            TicketNumberUsed = `${TicketNumberStored}`
        }

        const TicketMessage = TicketData.ChannelMessage || "Thank you for opening a new ticket \n\nThe moderation team will be with you shortly \nPlease state your issue so we can help you quicker"
        const TicketName = `${TicketData.TicketName || "Ticket"}-${TicketNumberUsed}`
        const CategoryToPlace = TicketData.TicketCategory || "None"
        const ModeratorRoles = TicketData.ModeratorRoles || []

        AllSavedTicketData[TicketIndex].Number = TicketNumberStored + 1

        DataHandler.setServerSettings(interaction.guild.id, "ticketData", JSON.stringify(AllSavedTicketData))

        const CloseTicketButton = new ButtonBuilder()
            .setCustomId(`CloseTicket_${InteractionId}`)
            .setLabel("Close")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Secondary)

        const TicketActionRow = new ActionRowBuilder()
            .addComponents(CloseTicketButton)

        if (CategoryToPlace === "None") {
            const NewTicket = await interaction.guild.channels.create({
                name: TicketName,
                type: ChannelType.GuildText,
                topic: `Ticket Data: [${interaction.user.id}]`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id, 
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id, 
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            })

            ModeratorRoles.forEach((role, index) => {
                NewTicket.permissionOverwrites.edit(role, {
                    ViewChannel: true,
                    SendMessages: true
                })
            })

            const MessageEmbed = BotModules.embedMessage(
                TicketMessage,
                "23691a",
                TicketData.TicketName || "Ticket",
                Date.now()
            )

            NewTicket.send({
                content: `<@${interaction.user.id}>`,
                embeds: [MessageEmbed.embeds[0]],
                components: [TicketActionRow]
            })

        } else if (CategoryToPlace !== "none") {
            const NewTicket = await interaction.guild.channels.create({
                name: TicketName,
                type: ChannelType.GuildText,
                topic: `Ticket Data: [${interaction.user.id}]`,
                parent: CategoryToPlace,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id, 
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id, 
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                    },
                ],
            })

            ModeratorRoles.forEach((role, index) => {
                NewTicket.permissionOverwrites.edit(role, {
                    ViewChannel: true,
                    SendMessages: true
                })
            })

            const MessageEmbed = BotModules.embedMessage(
                TicketMessage,
                "23691a",
                TicketData.TicketName || "Ticket",
                Date.now()
            )

            NewTicket.send({
                content: `<@${interaction.user.id}>`,
                embeds: [MessageEmbed.embeds[0]],
                components: [TicketActionRow]
            })
        }

        interaction.deferUpdate()
    }
}