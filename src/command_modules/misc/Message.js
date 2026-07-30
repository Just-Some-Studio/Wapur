const { PermissionsBitField } = require("discord.js")

module.exports = {
    Name: "message",
    Description: "Messages a player in DMs",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: false,
    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers],
    RequiresAllPermissions: false,
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


        } catch (ThrownError) {
            console.log(ThrownError)
        }
    }
}