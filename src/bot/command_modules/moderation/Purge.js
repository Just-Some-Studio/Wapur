const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Purge",
    Description: "Deletes a large amount of messages",
    Subset: "Moderation",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ManageMessages],
    SlashCommandOptions: [
        {"Name": "Amount", "Description": "The amount of messages to delete", "Required": true, "Type": "Integer", "Choices": []}
    ],

    async execute(message, arguements, botClient) {
        const AmountToDelete = parseInt(arguements[0])

        if (AmountToDelete < 1 || AmountToDelete > 99) {
            return message.reply({
                content: "You can only delete between 1 - 100 messages at a time.",
                allowedMentions: {repliedUser: false}
            })
        }

        try {
            const DeletedMessage = await message.channel.bulkDelete(AmountToDelete + 1, true)

            const Reply = await message.channel.send(`Successfully deleted ${AmountToDelete} messages.`)
            setTimeout(()=> Reply.delete().catch(()=> null), 5000)

        } catch (ThrownError) {
            console.log(ThrownError)

            if (ThrownError.code === 50034) {
                return message.reply({
                    content: "Messages older than 14 days cannot be deleted using this command.",
                    allowedMentions: {repliedUser: false}
                })
            }
        }
    }
}