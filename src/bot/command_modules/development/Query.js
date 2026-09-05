const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "query",
    Description: "Runs a custom SQL query for the current server",
    Subset: "Development",

    DevOnly: true,
    
    RequiredPermissions: [PermissionsBitField.Flags.Administrator],
    SlashCommandOptions: [
        {"Name": "Query_Type", "Description": "The type of query to run", "Required": true, "Type": "String", "Choices": [
            {"Name": "RUN", "Value": "run"},
            {"Name": "GET", "Value": "get"},
            {"Name": "ALL", "Value": "all"},
        ]},
        {"Name": "Query_Data", "Description": "The data to use in the query", "Required": true, "Type": "String", "Choices": []}
    ],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const QueryType = PassedArguments[0].toLowerCase()
        const ServerId = Interaction.guild.id
        const RunData = PassedArguments.slice(1).join(" ")

        try {
            const QueryResult = DataHandler.customDataQuery(ServerId, RunData, QueryType)

            if (!QueryResult || (Array.isArray(QueryResult) && QueryResult.length === 0)) {
                return Interaction.reply("Query executed successfully, but returned no data.")
            }   

            await Interaction.reply(BotModules.toJSONString(QueryResult))

        } catch (ThrownError) {
            console.log(ThrownError)
            await Interaction.channel.send(ThrownError)
        }
    }
}