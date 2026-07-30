const {PermissionsBitField, ButtonBuilder, ButtonInteraction} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Profile",
    Description: "View your profile information",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
        const User = await botClient.users?.fetch(userId)

        const UserData = DataHandler.getUser(message.guild.id, userId)

        return message.reply(BotModules.embedMessage(`You currently have **${UserData.credits}** credits \n\nInventory coming soon!`, "03c2fc", `${User.globalName}'s profile`))
    }
}