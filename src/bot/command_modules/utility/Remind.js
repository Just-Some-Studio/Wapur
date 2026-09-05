const {PermissionsBitField, ButtonBuilder, ActionRowBuilder, User} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Remind",
    Description: "Sets a reminder to ping you with a Interaction",
    Subset: "Utility",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [
        {"Name": "Reminder", "Description": "Message to remind you with", "Required": true, "Type": "String", "Choices": []},
        {"Name": "Time", "Description": "eg. 3h 2s or 5h 24m 4s", "Required": true, "Type": "String", "Choices": []}
    ],
    Subcommands: [],

    async execute(Interaction, PassedArguements, BotClient) {
        let Arguments = PassedArguements
        if (PassedArguements[2] !== null) {
            Arguments = PassedArguements.slice(0).join(" ")
        }
        
        const Hours = parseInt(PassedArguements[1]?.match(/\d+(?=h)/mi) || Arguments.match(/\d+(?=h)/mi) || 0)
        const Minutes = parseInt(PassedArguements[1]?.match(/\d+(?=m)/mi) || Arguments.match(/\d+(?=m)/mi) || 0)
        const Seconds = parseInt(PassedArguements[1]?.match(/\d+(?=s)/mi) || Arguments.match(/\d+(?=s)/mi) || 0)

        const Reason = PassedArguements[0] || Arguments || "Unknown"

        if (Hours === 0 && Minutes === 0 && Seconds === 0) {
           return await Interaction.reply("Could not set a reminder with no provided time")
        }

        const TotalTime = Hours * 1000 * 60 * 60 + Minutes * 1000 * 60 + Seconds * 1000

        await Interaction.reply({
            content: `You will be reminded in ${Hours} hours, ${Minutes} minutes, ${Seconds} seconds`
        })
        
        const User = Interaction.user?.id || Interaction.author?.id
        const Channel = BotClient.channels.cache.get(Interaction.channel.id)
        setTimeout(() => {
            Channel.send({
                content: `<@${User}>: ${Reason}`
            })
        }, TotalTime)
    }
}