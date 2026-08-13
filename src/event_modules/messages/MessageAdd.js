const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

import {PermissionsBitField} from "discord.js"

async function RunEvent(PassedArguements) {
    const BotClient = PassedArguements.BotClient
    const Message = PassedArguements.Message

    if (Message.author.bot) return

    if (Message.content.toLowerCase().includes(";configure")) {
        return Message.reply("Please use configure as a slash command.")
    }

    const miscBotData = JSON.parse(DataHandler.getServer(Message.guild.id).miscBotData)
    const levelSettings = JSON.parse(DataHandler.getServer(Message.guild.id).levelSettings)
    const loggingSettings = JSON.parse(DataHandler.getServer(Message.guild.id).loggingSettings)
    
    const Prefix = miscBotData[1] || ";"
    const DMMessageChannel = miscBotData[2] || ""
    const CommandDeniedChannels = miscBotData[3] || []
    const RolesWithEditAccess = miscBotData[4] || []

    const LevelMessageChannel = levelSettings[0] || Message.channel
    const EXPDeniedChannels = levelSettings[1] || []
    const ExpCooldownTime = levelSettings[2] || 25 * 1000

    const loggingChannels = loggingSettings[0] || []




    if (!EXPDeniedChannels.includes(Message.channel.id)) {
        let GivenEXP = Math.floor(Math.random() * 25)

        const CurrentTime = Date.now()
        const OldUserData = DataHandler.getUser(Message.guild.id, Message.author.id)

        if (CurrentTime - OldUserData.lastExpGain < ExpCooldownTime) {
        } else {
            DataHandler.addEXP(Message.guild.id, Message.author.id, GivenEXP, CurrentTime)

            const NewUserData = DataHandler.getUser(Message.guild.id, Message.author.id)

            if (BotModules.getLevelFromXp(NewUserData.exp) > BotModules.getLevelFromXp(OldUserData.exp)) {
                const Channel = BotClient.channels.cache.get(LevelMessageChannel)

                Channel.send(`<@${Message.author.id}> has leveled up to level ${BotModules.getLevelFromXp(NewUserData.exp)}!`)
            }
        }
    }



    // DM Handler
    if (!Message.guild) {
        const Channel = BotClient.channels.cache.get(DMMessageChannel)

        if (Message.attachments.size > 0) {
            Message.attachments.forEach(attachment => {
                console.log(`Name: ${attachment.name}  Type: ${attachment.contentType}  URL: ${attachment.url}`)

                Channel.send(`Attachment sent from ${Message.author.tag}(${Message.author.id}): \n${attachment.url}`)
            });
        }

        if (Message.content.length > 0) {
            console.log(`Message sent from ${Message.author.tag}(${Message.author.id}): ${Message.content}
                --> Sent to channel ${Channel.name}(${Channel.id}), in server ${Channel.guild.name}(${Channel.guild.id})`)
            await Channel.send(`Message sent from ${Message.author.tag}(${Message.author.id}): ${Message.content}`)
        }



    // Threading bug reports
    } else if (!Message.content.startsWith(Prefix) && Message.channelId === "1059575733778923560") {
        try {
            const NewThread = Message.startThread({
                name: `Bug report ${Message.id}`,
                autoArchiveDuration: 4320,
                type: ChannelType.PublicThread, 
                reason: "Bug report thread for discussing reports"
            })

            await NewThread.send(`Thank you ${Message.author} for reporting a bug!
                \nDue to the lack of recent updates, bugs are no longer handled by the development team`)
        } catch (ThrownError) {
            console.log(ThrownError)
        }





    // Handling commands
    } else if (Message.content.startsWith(Prefix)) {
        const PassedArguements = Message.content.slice(Prefix.length).trim().split(/ +/)
        const CommandName = PassedArguements.shift().toLowerCase()
        const Command = BotClient.commands.get(CommandName)

        if (!Command) return

        // Prevents people who don't have permissions from using commands        
        if (CommandDeniedChannels.includes(Message.channel.id) || !Message.member.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
            return
        }

        if (!Message.member) {return Message.reply("Commands cannot be run in DMs, go to a server to run commands.")}

        if (Command.DevOnly && Message.author.id !== BotOwner) {
            return
        }

        if (Command.RequiredPermissions && Command.RequiredPermissions.length > 0) {
            if (!Message.member.permissions.has(Command.RequiredPermissions)) {
                return
            }
        }

        


        // Attempts to run a command
        try {
            await Command.execute(Message, PassedArguements, BotClient);
        } catch (ThrownError) {
            console.error(ThrownError)
            await Message.reply(`An error occured during runtime: ${ThrownError}`)
        }
    }
}

module.exports = {RunEvent}