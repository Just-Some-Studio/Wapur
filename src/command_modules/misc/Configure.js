const {PermissionsBitField, ButtonBuilder, ButtonInteraction, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder,
    RoleSelectMenuBuilder, ChannelSelectMenuBuilder, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Configure",
    Description: "Change the settings and set up the bot for your server.",

    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ManageGuild],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguements, BotClient) {
        let ReplyContent = ""

        const SetupButton = new ButtonBuilder()
            .setCustomId("Setup")
            .setLabel("Setup")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("📂")

        const ConfigureButton = new ButtonBuilder()
            .setCustomId("Configure")
            .setEmoji("⚙️")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Configure")

        const ResetButton = new ButtonBuilder()
            .setCustomId("Reset")
            .setEmoji("❗")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Reset Bot")



        const DiscordButton = new ButtonBuilder()
            .setEmoji("🫂")
            .setStyle(ButtonStyle.Link)
            .setLabel("Discord Community")
            .setURL("https://discord.com/invite/pNPJFkqWBW")

        const GithubButton = new ButtonBuilder()
            .setEmoji("💻")
            .setStyle(ButtonStyle.Link)
            .setLabel("Github repository")
            .setURL("https://github.com/Just-Some-Studio/Wapur")


        if (PassedArguements === "Not Setup") {
            ReplyContent = `It looks like you haven't set up the bot yet, press "Setup" to begin!`
            ConfigureButton.setLabel("Configure (Must setup first)")
            ConfigureButton.setDisabled(true)
            ConfigureButton.setStyle(ButtonStyle.Secondary)

            SetupButton.setStyle(ButtonStyle.Primary)

            ResetButton.setDisabled(true)
        }

        const ConfigurationActionRow = new ActionRowBuilder()
            .addComponents(SetupButton)
            .addComponents(ConfigureButton)
            .addComponents(ResetButton)

        const HelpActionRow = new ActionRowBuilder()
            .addComponents(GithubButton)
            .addComponents(DiscordButton)

        if (PassedArguements === "Return") {
            await Interaction.update({
                content: ReplyContent,
                embeds: [],
                components: [ConfigurationActionRow, HelpActionRow],
                ephemeral: true
            })
        } else {
            await Interaction.reply({
                content: ReplyContent,
                components: [ConfigurationActionRow, HelpActionRow],
                ephemeral: true
            })
        }
    },


    async handleConfigure(interaction, botClient) {
        if (interaction.customId === "PrefixModalBuild") {
            const SetupModal = new ModalBuilder()
                .setCustomId("SetupModal")
                .setTitle("Setup Wapur command prefix")

            const PrefixInput = new TextInputBuilder()
                .setCustomId("PrefixInput")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("eg. ?, !, ;, :, Wapur")
                .setMaxLength(5)
                .setRequired(true)
                .setLabel("Set Bot Command Prefix")

            const PrefixActionRow = new ActionRowBuilder()
                .addComponents(PrefixInput)

            SetupModal.addActionRowComponents(PrefixActionRow)

            await interaction.showModal(SetupModal)
        }
    },



    async createSetupMessage(interaction, botClient) {
        const EditAccessRoles = interaction.guild.roles.cache.filter(Role => 
            (Role.permissions.has(PermissionsBitField.Flags.Administrator) || 
            Role.permissions.has(PermissionsBitField.Flags.ManageGuild)) &&
            !Role.managed
        )

        const DefaultRoles = EditAccessRoles.map(AdminRole => AdminRole.id)

        const PrefixEditButton = new ButtonBuilder()
            .setCustomId("PrefixModalBuild")
            .setLabel("Edit prefix")
            .setStyle(ButtonStyle.Success)

        const ReturnButton = new ButtonBuilder()
            .setCustomId("ReturnButton")
            .setLabel("Return")
            .setStyle(ButtonStyle.Primary)

        const EditAccessSelector = new RoleSelectMenuBuilder()
            .setCustomId("EditAccessSelector")
            .setPlaceholder("Select roles to gain access to configure this bot")
            .setRequired(false)
            .setMaxValues(25)
            .setMinValues(0)
            .setDefaultRoles(...DefaultRoles)

        const PrefixActionRow = new ActionRowBuilder()
            .addComponents(ReturnButton)
            .addComponents(PrefixEditButton)

        const EditAccessActionRow = new ActionRowBuilder()
            .addComponents(EditAccessSelector)

        const Embed = BotModules.embedMessage(
            "Welcome to Wapur's setup! \n\nThis page is only for prefix and configure command access \nYou can change all the other settings after this basic setup! \n\nSelect roles to give access to bot configure command",
            "fff07a",
            "Wapur initial setup",
        )

        const OldmiscBotData = JSON.parse(DataHandler.getServer(interaction.guild.id).miscBotData)
        if (OldmiscBotData[1] === null || OldmiscBotData[1] === undefined || OldmiscBotData[1] === "" || OldmiscBotData[1] === "null") {
            const NewmiscBotData = [...OldmiscBotData]
            NewmiscBotData[1] = OldmiscBotData[1] || ";"
            DataHandler.setServerSettings(interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
        }


        await interaction.update({
            embeds: [Embed.embeds[0]],
            components: [EditAccessActionRow, PrefixActionRow],
            ephemeral: true
        })
    },

    async createConfigureMessage(interaction, botClient) {
        const Embed = BotModules.embedMessage(
            'You can configure the bot\'s settings here! \n\nBelow are the categories of settings you can change \nClick on the buttons to view and change the settings for each category \n\nClick "Return" to go back to the main configuration page',
            "fff07a",
            "Wapur Setting Configuration",
        )

        const ReturnButton = new ButtonBuilder()
            .setCustomId("ReturnButton")
            .setLabel("Return")
            .setStyle(ButtonStyle.Primary)


        const MiscButton = new ButtonBuilder()
            .setCustomId("MiscButton")
            .setLabel("Miscellaneous Settings")
            .setStyle(ButtonStyle.Secondary)

        const ModerationButton = new ButtonBuilder()
            .setCustomId("ModerationButton")
            .setLabel("Moderation Settings")
            .setStyle(ButtonStyle.Secondary)




        const ReturnButtonActionRow = new ActionRowBuilder()
            .addComponents(ReturnButton)

        const SettingButtonActionRow = new ActionRowBuilder()
            .addComponents(MiscButton)
            .addComponents(ModerationButton)

        await interaction.update({
            embeds: [Embed.embeds[0]],
            components: [ReturnButtonActionRow, SettingButtonActionRow],
            ephemeral: true
        })
    }
}