const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    // Has a chance to break stuff so I made it dev only
    Name: "Calculate",
    Description: "Evaluates any calculation (Can parse javascript Math API)",
    Subset: "Development",

    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.Administrator],
    SlashCommandOptions: [
        {"Name": "Expression", "Description": "The mathematical expression to evaluate", "Required": true, "Type": "String", "Choices": []}
    ],
    Subcommands: [],

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