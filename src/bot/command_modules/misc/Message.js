const {PermissionsBitField, ModalBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder,
    TextInputBuilder, TextInputStyle
} = require("discord.js")
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

    async execute(message, arguements, botClient) {
        const SelectedUser = message.options?.getUser('user') || message.mentions?.members?.first() || await botClient.users?.fetch(arguements[0])
        const Message = arguements.slice(1).join(" ") || " "

        if (!SelectedUser || !Message) {
            return message.reply({
                content: "Invalid command arguements provided",
                allowedMentions: {repliedUser: false}
            })
        }

        try {
            const SentMessage = BotModules.embedMessage(Message, null, "Moderator sent you a message", Date.now(), `This was sent to you from: ${message.guild}`)

            const ReplyButton = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`DMReplyButton_${message.guild.id}`)
                .setLabel("Reply to user")

            const ReplyActionRow = new ActionRowBuilder()
                .addComponents(ReplyButton)

            await SelectedUser.send({
                content: "",
                embeds: [SentMessage.embeds[0]],
                components: [ReplyActionRow]
            })

            console.log(`Message sent from ${message.user.username}(${message.user.id}): ${SentMessage.embeds[0].data.description}
                --> Sent to user ${SelectedUser.username}(${SelectedUser.id}), in server ${message.guild.name}(${message.guild.id})`)

            message.reply({
                content: "Message was sent to user successfully",
                ephemeral: true
            })
            
        } catch (ThrownError) {
            console.log(ThrownError)
        }
    },

    async generateResponseModal(interaction, botClient) {
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