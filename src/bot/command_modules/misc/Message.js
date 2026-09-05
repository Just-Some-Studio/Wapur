const {PermissionsBitField, ModalBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder,
    TextInputBuilder, TextInputStyle, MessageFlags} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Message",
    Description: "Messages a player in DMs",
    Subset: "Misc",
   
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to message", "Required": true, "Type": "User", "Choices": []},
        {"Name": "Message", "Description": "The message to send", "Required": false, "Type": "String", "Choices": []}
    ],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const SelectedUser = Interaction.options?.getUser('user') || Interaction.mentions?.members?.first() || await BotClient.users?.fetch(PassedArguments[0])
        const Message = PassedArguments.slice(1).join(" ") || " "

        if (!SelectedUser || !Message) {
            return Interaction.reply({
                content: "Invalid command PassedArguments provided",
                allowedMentions: {repliedUser: false}
            })
        }

        try {
            const SentMessage = BotModules.embedMessage(Message, null, "Moderator sent you a Interaction", Date.now(), `This was sent to you from: ${Interaction.guild}`)

            const ReplyButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`DMReplyButton_${Interaction.guild.id}`)
                .setLabel("Reply to user")

            const ReplyActionRow = new ActionRowBuilder()
                .addComponents(ReplyButton)

            await SelectedUser.send({
                content: "",
                embeds: [SentMessage.embeds[0]],
                components: [ReplyActionRow]
            })

            console.log(`Message sent from ${Interaction.user.username}(${Interaction.user.id}): ${SentMessage.embeds[0].data.description}
                --> Sent to user ${SelectedUser.username}(${SelectedUser.id}), in server ${Interaction.guild.name}(${Interaction.guild.id})`)

            Interaction.reply({
                content: "Message was sent to user successfully",
                flags: MessageFlags.Ephemeral
            })
            
        } catch (ThrownError) {
            console.log(ThrownError)
        }
    },

    async generateResponseModal(interaction, BotClient) {
        const ResponseModal = new ModalBuilder()
            .setCustomId(`DMResponseSubmit_${interaction.customId.replace("DMReplyButton_", "")}`)
            .setTitle("DM Reponse Submit")

        const ResponseInput = new TextInputBuilder()
            .setCustomId("ResponseInput")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("eg. Alright, Okay, Hello, Goodbye")
            .setMaxLength(250)
            .setRequired(false)
            .setLabel("Input response to DM")

        const ResponseActionRow = new ActionRowBuilder()
            .addComponents(ResponseInput)

        ResponseModal.addActionRowComponents(ResponseActionRow)

        await interaction.showModal(ResponseModal)
    }
}