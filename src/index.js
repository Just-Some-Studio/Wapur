require('dotenv').config()
const DataHandler = require("./dataHandler.js")
const modules = require("./modules.js")

// Constants for the bot
const {
    Client, 
    GatewayIntentBits, 
    Collection, 
    PermissionsBitField, 
    ChannelType, 
    Partials, 
    SlashCommandBuilder, 
    REST, 
    Routes,
    EmbedBuilder
} = require("discord.js")

const fs = require('fs')
const path = require('path')
const BotToken = process.env.DISCORD_BOT_TOKEN_SBKE
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


var Prefix = ";"
var DMMessageChannel = "1525560369018306721"
var CommandChannel = "1060004999490445452"

var LevelMessageChannel = "1110780243939164180"
var AllowedEXPChannels = ["1054842428848361494", "1059573473200054372", "1059924337957802065", "1067435281596301362", "1131309969577361540"]
var ExpCooldownTime = 25 * 1000
var UsersToGainExtra = ["969022741053341716"]

var LoggingChannel = ""

var ShopEnabled = true








// Starting the command structure
BotClient.commands = new Collection()
const CommandFilePath = path.join(__dirname, CommandFolderName)
const CommandFiles = fs.readdirSync(CommandFilePath, {withFileTypes: true}) //.filter(file => file.isFile() && file.endsWith(".js"))
const CommandList = modules.loadCommandsFromDirectory(CommandFiles, CommandFilePath, BotClient)

// Created and registers slash commands
CommandList.map(command => command.toJSON())
const Rest = new REST({ version: '10' }).setToken(BotToken)

try {
    console.log(`Started refreshing ${CommandList.length} application (/) commands.`)
    
    Rest.put(Routes.applicationCommands("1423753511426064434"), {body: CommandList})
} catch (ThrownError) {
    console.error(ThrownError)
}









// Message Replies
BotClient.on('messageCreate', async (message) => {
    if (message.author.bot) return

    if (message.content.includes("Good boy") || message.content.includes("Good Boy") || message.content.includes("Goodboy") || message.content.includes("GoodBoy")) {
        message.react("🖕")
    }

    if (message.content === ";disable shop" && message.author.id === "969022741053341716") {
        shopEnabled = false
        return message.reply("Shop has been disabled.")
    }

    if (message.content.includes("<@1423753511426064434>") && message.guild) {
        try {
            await message.member.timeout(3000, "Pinging a bot? For shame.")
        } catch (ThrownError) {
            console.error(ThrownError)
            await message.reply(`An error occured during runtime: ${ThrownError}`)
        }
    }

    if (AllowedEXPChannels.includes(message.channel.id)) {
        let GivenEXP = Math.floor(Math.random() * 25)

        if (UsersToGainExtra.includes(message.author.id)) {
            GivenEXP = Math.floor(GivenEXP * 1.25)
        }

        const CurrentTime = Date.now()
        const OldUserData = DataHandler.getUser(message.guild.id, message.author.id)

        if (CurrentTime - OldUserData.lastExpGain < ExpCooldownTime) {
        } else {
            DataHandler.addEXP(message.guild.id, message.author.id, GivenEXP, CurrentTime)

            const NewUserData = DataHandler.getUser(message.guild.id, message.author.id)

            if (modules.getLevelFromXp(NewUserData.exp) > modules.getLevelFromXp(OldUserData.exp)) {
                const Channel = BotClient.channels.cache.get(LevelMessageChannel)

                Channel.send(`<@${message.author.id}> has leveled up to level ${modules.getLevelFromXp(NewUserData.exp)}!`)
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

        if (!Command || (!ShopEnabled && CommandName === "shop")) return

        // Prevents people who don't have permissions from using commands        
        if (message.channel.id !== CommandChannel && !message.member.permissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
            return message.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
        }

        if (!message.member) {return message.reply("Commands cannot be run in DMs, go to a server to run commands.")}

        if (Command.DevOnly && message.author.id !== BotOwner) {
            return message.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
        }

        if (Command.RequiredPermissions && Command.RequiredPermissions.length > 0) {
            if (!message.memberPermissions.has(Command.RequiredPermissions, Command.RequiresAllPermissions) && !Command.AllowedUsers.includes(message.author.id)) {
                return message.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
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
BotClient.on('interactionCreate', async (interaction) => {
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

    if (!Command || (!ShopEnabled && CommandName === "shop")) return

    // Prevents people who don't have permissions from using commands
    if (Command.AllowedUsers && Command.AllowedUsers.length > 0) {
        if (!Command.AllowedUsers.includes(interaction.user.id)) {
            return message.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
        }
    } 
    
    if (interaction.channelId !== CommandChannel && !interaction.memberPermissions.has(PermissionsBitField.Flags.UseApplicationCommands)) {
        return message.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
    }

    if (!Command.PublicCommand) {
        if (!interaction.guild) return interaction.reply("Commands cannot be run in DMs, go to a server.")
        if (Command.RequiredPermissions && Command.RequiredPermissions.length > 0) {
            if (!interaction.memberPermissions.has(Command.RequiredPermissions, Command.RequiresAllPermissions) && !Command.AllowedUsers.includes(interaction.user.id)) {
                return message.reply({content: "Sorry, you don't have permission for that.", ephemeral: true})
            }
        }
    }

    // Attempts to run a command
    try {
        await Command.execute(interaction, PassedArguements, BotClient);
    } catch (ThrownError) {
        console.error(ThrownError)
        await interaction.reply(`An error occured during runtime: ${ThrownError}`)
    }
})

// Log the bot into the account
BotClient.login(BotToken)