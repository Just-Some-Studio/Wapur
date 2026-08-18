const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Level",
    Description: "Gets a user's level",

    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const UserData = DataHandler.getUser(message.guild.id, message.author?.id || message.user?.id)

        const CurrentLevel = BotModules.getLevelFromXp(UserData.exp)
        const NextLevel = CurrentLevel + 1

        const ExpForCurrent = BotModules.getExpRequiredForLevel(CurrentLevel)
        const ExpForNext = BotModules.getExpRequiredForLevel(NextLevel)

        const ExpForNextLevelCalculated = ExpForNext - UserData.exp

        message.reply(`Your current level is ${CurrentLevel}, you need ${ExpForNextLevelCalculated} more exp to level up!`)
    }
}