const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "query",
    Description: "Runs a custom SQL query for the current server",

    DevOnly: true,
    
    RequiredPermissions: [],
    SlashCommandOptions: [
        {"Name": "Query_Type", "Description": "The type of query to run", "Required": true, "Type": "String", "Choices": [
            {"Name": "RUN", "Value": "run"},
            {"Name": "GET", "Value": "get"},
            {"Name": "ALL", "Value": "all"},
        ]},
        {"Name": "Query_Data", "Description": "The data to use in the query", "Required": true, "Type": "String", "Choices": []}
    ],

    async execute(message, arguements, botClient) {
        const QueryType = arguements[0].toLowerCase()
        const ServerId = message.guild.id
        const RunData = arguements.slice(1).join(" ")

        try {
            const QueryResult = DataHandler.customDataQuery(ServerId, RunData, QueryType)

            if (!QueryResult || (Array.isArray(QueryResult) && QueryResult.length === 0)) {
                return message.reply("Query executed successfully, but returned no data.")
            }   

            await message.reply(BotModules.toJSONString(QueryResult))

        } catch (ThrownError) {
            console.log(ThrownError)
            await message.channel.send(ThrownError)
        }
    }
}