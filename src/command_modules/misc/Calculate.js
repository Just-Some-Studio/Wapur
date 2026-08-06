const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Calculate",
    Description: "Evaluates any calculation (Can parse javascript Math API)",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [
        {"Name": "Expression", "Description": "The mathematical expression to evaluate", "Required": true, "Type": "String", "Choices": []}
    ],

    async execute(Interaction, PassedArguements, BotClient) {
        const Expression = PassedArguements.slice(0).join(" ") || "No Expression Provided"

        try {
            const Result = eval(Expression)
            Interaction.reply(`${Result}`)
        } catch (ThrownError) {
            return Interaction.reply(ThrownError)
        }
    }
}