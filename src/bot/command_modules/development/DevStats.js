const {PermissionsBitField, inlineCode} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "DevStats",
    Description: "Gets detailed bot information about the bot and the server",
    Subset: "Development",
   
    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.Administrator],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {

        const MessageEmbed = BotModules.embedMessage(
            `The bot is currently unsharded, We will show you your shard when you get added to one! \n\nBot Owner: pie_master1`, 
            null, 
            "All Wapur Stats", 
            null, 
            null, 
            [
                {name: "Total Servers", value: `${BotClient.guilds.cache.size}`, inline: true}, 
                {name: "Total Users", value: `${BotClient.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, inline: true},
                {name: "Cached Users", value: `${BotClient.users.cache.size}`, inline: true},
                {name: "Total Shards", value: "1", inline: true}
            ]
        )

        Interaction.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]]
        })
    }
}