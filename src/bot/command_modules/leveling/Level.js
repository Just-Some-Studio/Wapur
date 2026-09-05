const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Level",
    Description: "Gets a user's level",
    Subset: "Leveling",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const UserData = DataHandler.getUser(Interaction.guild.id, Interaction.author?.id || Interaction.user?.id)

        const CurrentLevel = BotModules.getLevelFromXp(UserData.exp)
        const NextLevel = CurrentLevel + 1

        const ExpForCurrent = BotModules.getExpRequiredForLevel(CurrentLevel)
        const ExpForNext = BotModules.getExpRequiredForLevel(NextLevel)

        const ExpForNextLevelCalculated = ExpForNext - UserData.exp

        Interaction.reply(`Your current level is ${CurrentLevel}, you need ${ExpForNextLevelCalculated} more exp to level up!`)
    }
}