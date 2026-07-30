const { PermissionsBitField, GuildAuditLogsEntry, AllowedMentionsTypes, User } = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const modules = require("../../modules.js")

module.exports = {
    Name: "level",
    Description: "Gets a user's level",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: true,
    RequiredPermissions: [],
    RequiresAllPermissions: true,
    SlashCommandOptions: [
    ],

    async execute(message, arguements, botClient) {
        const UserData = DataHandler.getUser(message.guild.id, message.author?.id || message.user?.id)

        const CurrentLevel = modules.getLevelFromXp(UserData.exp)
        const NextLevel = CurrentLevel + 1

        const ExpForCurrent = modules.getExpRequiredForLevel(CurrentLevel)
        const ExpForNext = modules.getExpRequiredForLevel(NextLevel)

        const ExpForNextLevelCalculated = ExpForNext - UserData.exp

        message.reply(`Your current level is ${CurrentLevel}, you need ${ExpForNextLevelCalculated} more exp to level up!`)
    }
}