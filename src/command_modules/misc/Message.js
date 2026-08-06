const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Message",
    Description: "Messages a player in DMs",
   
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to message", "Required": true, "Type": "User", "Choices": []},
        {"Name": "Message", "Description": "The message to send", "Required": false, "Type": "String", "Choices": []}
    ],

    async execute(message, arguements, botClient) {
        const SelectedUser = message.mentions.members?.first() || await botClient.users?.fetch(arguements[0])
        const SentMessage = arguements.slice(1).join(" ") || " "

        if (!SelectedUser || !SentMessage) {
            return message.reply({
                content: "Invalid command arguements provided",
                allowedMentions: {repliedUser: false}
            })
        }

        try {
            const AttachmentsToSend = []
            if (message.attachments.size > 0) {
                message.attachments.forEach(attachment => {
                    AttachmentsToSend.push(attachment.url)
                })
            }

            await SelectedUser.send({
                content: SentMessage || null,
                file: AttachmentsToSend || null
            })

            console.log(`Message sent from ${message.author.tag}(${message.author.id}): ${SentMessage}  --> Sent to user ${SelectedUser.tag}(${SelectedUser.id}) in server ${message.guild.name}(${message.guild.id})`)


        } catch (ThrownError) {
            console.log(ThrownError)
        }
    }
}