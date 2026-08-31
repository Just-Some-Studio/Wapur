const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Stats",
    Description: "Gets bot information about the bot and your server",
    Subset: "Utility",
   
    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ManageGuild],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguments, BotClient) {

        const MessageEmbed = BotModules.embedMessage(
            `The bot is currently unsharded, We will show you your shard when you get added to one! \n\nBot Owner: pie_master1`, 
            null, 
            "Your Wapur Stats", 
            null,
            null, 
            [
                {name: "Total Servers", value: `${BotClient.guilds.cache.size}`, inline: true}, 
                {name: "Total Users", value: `${BotClient.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`, inline: true}
            ]
        )

        Interaction.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]]
        })
    }
}