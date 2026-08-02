require('dotenv').config()
const DataHandler = require("./dataHandler.js")
const BotModules = require("./modules.js")

// Constants for the bot
const fs = require('fs')
const path = require('path')
const nodeCron = require('node-cron')

const {Client, GatewayIntentBits, Collection, PermissionsBitField, ChannelType, 
    Partials, SlashCommandBuilder, REST, Routes, EmbedBuilder, Events
} = require("discord.js")

const BotClient = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ],

    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Poll
    ]
})



// Bot Constants
const CommandFolderName = "command_modules"
const BotOwner = "969022741053341716"
const BotToken = process.env.DISCORD_BOT_TOKEN
const ClientID = process.env.CLIENT_ID




// Starting the command structure
BotClient.commands = new Collection()
const CommandFilePath = path.join(__dirname, CommandFolderName)
const CommandFiles = fs.readdirSync(CommandFilePath, {withFileTypes: true}) //.filter(file => file.isFile() && file.endsWith(".js"))
const CommandList = BotModules.loadCommandsFromDirectory(CommandFiles, CommandFilePath, BotClient)

// Created and registers slash commands
CommandList.map(command => command.toJSON())
const Rest = new REST({ version: '10' }).setToken(BotToken)

try {
    console.log(`Started refreshing ${CommandList.length} application (/) commands.`)
    
    Rest.put(Routes.applicationCommands(ClientID), {body: CommandList})
} catch (ThrownError) {
    console.error(ThrownError)
}













// Message Replies
BotClient.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return

    if (message.content.toLowerCase().includes(";configure")) {
        return message.reply("Please use configure as a slash command.")
    }

    const miscBotData = JSON.parse(DataHandler.getServer(message.guild.id).miscBotData)
    const levelSettings = JSON.parse(DataHandler.getServer(message.guild.id).levelSettings)
    const loggingSettings = JSON.parse(DataHandler.getServer(message.guild.id).loggingSettings)
    
    const Prefix = miscBotData[1] || ";"
    const DMMessageChannel = miscBotData[2] || ""
    const CommandDeniedChannels = miscBotData[3] || []
    const RolesWithEditAccess = miscBotData[4] || []

    const LevelMessageChannel = levelSettings[0] || message.channel
    const EXPDeniedChannels = levelSettings[1] || []
    const ExpCooldownTime = levelSettings[2] || 25 * 1000
    const UsersToGainExtraEXP = levelSettings[3] || []
    const EXPRewards = levelSettings[4] || []

    const loggingChannels = loggingSettings[0] || []




    if (!EXPDeniedChannels.includes(message.channel.id)) {
        let GivenEXP = Math.floor(Math.random() * 25)

        const CurrentTime = Date.now()
        const OldUserData = DataHandler.getUser(message.guild.id, message.author.id)

        if (CurrentTime - OldUserData.lastExpGain < ExpCooldownTime) {
        } else {
            DataHandler.addEXP(message.guild.id, message.author.id, GivenEXP, CurrentTime)

            const NewUserData = DataHandler.getUser(message.guild.id, message.author.id)

            if (BotModules.getLevelFromXp(NewUserData.exp) > BotModules.getLevelFromXp(OldUserData.exp)) {
                const Channel = BotClient.channels.cache.get(LevelMessageChannel)

                Channel.send(`<@${message.author.id}> has leveled up to level ${BotModules.getLevelFromXp(NewUserData.exp)}!`)
            }
        }
    }



    // DM Handler
    if (!message.guild) {
        const Channel = BotClient.channels.cache.get(DMMessageChannel)

        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                console.log(`Name: ${attachment.name}  Type: ${attachment.contentType}  URL: ${attachment.url}`)

                Channel.send(`Attachment sent from ${message.author.tag}(${message.author.id}): \n${attachment.url}`)
            });
        }

        if (message.content.length > 0) {
            console.log(`Message sent from ${message.author.tag}(${message.author.id}): ${message.content}`)
            await Channel.send(`Message sent from ${message.author.tag}(${message.author.id}): ${message.content}`)
        }



    // Threading bug reports
    } else if (!message.content.startsWith(Prefix) && message.channelId === "1059575733778923560") {
        try {
            const NewThread = message.startThread({
                name: `Bug report ${message.id}`,
                autoArchiveDuration: 4320,
                type: ChannelType.PublicThread, 
                reason: "Bug report thread for discussing reports"
            })

            await NewThread.send(`Thank you ${message.author} for reporting a bug!
                \nDue to the lack of recent updates, bugs are no longer handled by the development team`)
        } catch (ThrownError) {
            console.log(ThrownError)
        }





    // Handling commands
    } else if (message.content.startsWith(Prefix)) {
        const PassedArguements = message.content.slice(Prefix.length).trim().split(/ +/)
        const CommandName = PassedArguements.shift().toLowerCase()
        const Command = BotClient.commands.get(CommandName)

        if (!Command) return

        // Prevents people who don't have permissions from using commands        
        if (CommandDeniedChannels.includes(message.channel.id) || !message.member.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
            return
        }

        if (!message.member) {return message.reply("Commands cannot be run in DMs, go to a server to run commands.")}

        if (Command.DevOnly && message.author.id !== BotOwner) {
            return
        }

        if (Command.RequiredPermissions && Command.RequiredPermissions.length > 0) {
            if (!message.member.permissions.has(Command.RequiredPermissions)) {
                return
            }
        }

        


        // Attempts to run a command
        try {
            await Command.execute(message, PassedArguements, BotClient);
        } catch (ThrownError) {
            console.error(ThrownError)
            await message.reply(`An error occured during runtime: ${ThrownError}`)
        }
    }
})

















// Slash command handler
BotClient.on(Events.InteractionCreate, async (interaction) => {

    const miscBotData = JSON.parse(DataHandler.getServer(interaction.guild.id).miscBotData) || [";", "", [], []]
    const levelSettings = JSON.parse(DataHandler.getServer(interaction.guild.id).levelSettings)
    const loggingSettings = JSON.parse(DataHandler.getServer(interaction.guild.id).loggingSettings)
    
    const Prefix = miscBotData[1] || ";"
    const DMMessageChannel = miscBotData[2] || ""
    const CommandDeniedChannels = miscBotData[3] || []
    const RolesWithEditAccess = miscBotData[4] || []

    const LevelMessageChannel = levelSettings[0] || interaction.channel
    const EXPDeniedChannels = levelSettings[1] || []
    const ExpCooldownTime = levelSettings[2] || 25 * 1000
    const UsersToGainExtraEXP = levelSettings[3] || []
    const EXPRewards = levelSettings[4] || []

    const loggingChannels = loggingSettings[0] || []








    if (interaction.isStringSelectMenu()) {
        const ShopCommand = BotClient.commands.get("shop")

        if (ShopCommand && typeof ShopCommand.handleSelectMenu === "function") {
            try {
                await ShopCommand.handleSelectMenu(interaction, BotClient)
            } catch (ThrownError) {
                console.error(ThrownError)
                await interaction.reply({ content: `An error occured during runtime: ${ThrownError}`, ephemeral: true })
            }
        }

        return
    } else if (interaction.isButton()) {
        const ConfigureCommand = BotClient.commands.get("configure")

        if (interaction.customId ===  "Reset" || interaction.customId ===  "PrefixModalBuild") {
            ConfigureCommand.handleConfigure(interaction, BotClient)
        } else if (interaction.customId === "Setup") {
            ConfigureCommand.createSetupMessage(interaction, BotClient)
        } else if (interaction.customId === "Configure") {
            ConfigureCommand.createConfigureMessage(interaction, BotClient)
        } else if (interaction.customId === "ReturnButton") {
            ConfigureCommand.execute(interaction, "Return", BotClient)
        }


    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "SetupModal") {
            const NewPrefix = interaction.fields.getTextInputValue("PrefixInput")
            const OldmiscBotData = JSON.parse(DataHandler.getServer(interaction.guild.id).miscBotData)

            const NewmiscBotData = [...OldmiscBotData]
            NewmiscBotData[1] = NewPrefix

            DataHandler.setServerSettings(interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
        }

        await interaction.deferUpdate()

    } else if (interaction.isChannelSelectMenu()) {
        if (interaction.customId === "LevelMessageChannelSelector") {
            const SelectedChannel = interaction.values[0]
            const OldlevelSettings = JSON.parse(DataHandler.getServer(interaction.guild.id).levelSettings)

            const NewlevelSettings = [...OldlevelSettings]
            NewlevelSettings[0] = SelectedChannel

            DataHandler.setServerSettings(interaction.guild.id, "levelSettings", JSON.stringify(NewlevelSettings))
            
        } else if (interaction.customId === "DMMessageChannelSelector") {
            const SelectedChannel = interaction.values[1]
            const OldmiscBotData = JSON.parse(DataHandler.getServer(interaction.guild.id).miscBotData)

            const NewmiscBotData = [...OldmiscBotData]
            NewmiscBotData[2] = SelectedChannel

            DataHandler.setServerSettings(interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
        }

        await interaction.deferUpdate()

    } else if (interaction.isRoleSelectMenu()) {
        if (interaction.customId === "EditAccessSelector") {
            const SelectedRoles = interaction.values
            const OldmiscBotData = JSON.parse(DataHandler.getServer(interaction.guild.id).miscBotData)

            const NewmiscBotData = [...OldmiscBotData]
            NewmiscBotData[4] = SelectedRoles

            DataHandler.setServerSettings(interaction.guild.id, "miscBotData", JSON.stringify(NewmiscBotData))
        }

        await interaction.deferUpdate()
    }

    if (!interaction.isChatInputCommand()) return















    const PassedArguements = []
    const CommandName = interaction.commandName.toLowerCase()
    const Command = BotClient.commands.get(CommandName)

    interaction.options.data.forEach(option => {
        if (option.type === 6) { // 6 is a user type
            PassedArguements.push(`<@${option.value}>`);
        } else {
            PassedArguements.push(String(option.value));
        }
    })

    if (!Command) return


    // Configure has to always be available for running
    if (CommandName === "configure" && interaction.memberPermissions.has(Command.RequiredPermissions)) {
        console.log(miscBotData[1])
        if (miscBotData[1] === null || miscBotData[1] === undefined || miscBotData[1] === "" || miscBotData[1] === "null") {
             try {
                await Command.execute(interaction, "Not Setup", BotClient)
            } catch (ThrownError) {
                console.error(ThrownError)
                await interaction.reply(`An error occured during runtime: ${ThrownError}`)
            }
        } else {
            try {
                await Command.execute(interaction, PassedArguements, BotClient)
            } catch (ThrownError) {
                console.error(ThrownError)
                await interaction.reply(`An error occured during runtime: ${ThrownError}`)
            }
        }

        return
    }





    // Prevents people who don't have permissions from using commands
    if (interaction.channel.id !== CommandChannel && !interaction.member.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
        return interaction.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
    }

    if (!interaction.member) {return interaction.reply("Commands cannot be run in DMs, go to a server to run commands.")}

    if (Command.DevOnly && interaction.author.id !== BotOwner) {
        return interaction.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
    }

    if (Command.RequiredPermissions && Command.RequiredPermissions.length > 0) {
        if (!interaction.memberPermissions.has(Command.RequiredPermissions)) {
            return interaction.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
        }
    }

    // Attempts to run a command
    try {
        await Command.execute(interaction, PassedArguements, BotClient)
    } catch (ThrownError) {
        console.error(ThrownError)
        await interaction.reply(`An error occured during runtime: ${ThrownError}`)
    }
})

BotClient.on(Events.GuildDelete, async (guild) => {
    const ServerID = guild.id
    DataHandler.unloadDatabase(ServerID)
})

BotClient.on(Events.GuildCreate, async (guild) => {
    const ServerID = guild.id
    DataHandler.reloadDatabase(ServerID)
})


nodeCron.schedule('0 0 * * *', async () => {
    console.log("[CRON] Running daily cleanup task...")

    const today = new Date().toISOString().split('T')[0]
    let DeletedDatabasesCount = 0
    
    try {
        const [RowsToDelete] = await DataHandler.BotDataBase.exec(`SELECT serverId FROM servers_pending_deletion WHERE deletionTimestamp <= ?`, [today])
        
        for (const ServerToDelete of RowsToDelete) {
            const ServerID = ServerToDelete.serverId
            DataHandler.deleteDatabase(ServerID)
            
            DeletedDatabasesCount++
        }
    } catch (ThrownError) {
        console.log(ThrownError)
    }

    console.log(`[CRON] Daily cleanup task completed. Deleted ${DeletedDatabasesCount} server databases.`)
})

// Log the bot into the account
BotClient.login(BotToken)