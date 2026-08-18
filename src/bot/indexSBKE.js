require('dotenv').config()

// New object and imports
const fs = require("fs")
const path = require("path")
const nodeCron = require("node-cron")
const chalk = require("chalk")

const DataHandler = require("./dataHandler.js")
const BotModules = require("./modules.js")

const {Client, GatewayIntentBits, Collection, PermissionsBitField, ChannelType, 
    Partials, SlashCommandBuilder, REST, Routes, EmbedBuilder, Events, ShardingManager
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
const BotOwner = process.env.BOT_OWNER_ID
const BotToken = process.env.DISCORD_BOT_TOKEN_SBKE
const ClientID = process.env.CLIENT_ID_SBKE




// Starting the command structure
BotClient.commands = new Collection()
const CommandFilePath = path.join(__dirname, CommandFolderName)
const CommandFiles = fs.readdirSync(CommandFilePath, {withFileTypes: true})
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




// Event Action
BotClient.on(Events.InteractionCreate, async (Interaction) => {
    try {
        if (Interaction.isStringSelectMenu()) {
            require("./event_modules/interactions/StringSelectMenu.js").RunEvent({BotClient, Interaction})

        } else if (Interaction.isButton()) {
            require("./event_modules/interactions/Buttons.js").RunEvent({BotClient, Interaction})

        } else if (Interaction.isModalSubmit()) {
            require("./event_modules/interactions/ModalSubmit.js").RunEvent({BotClient, Interaction})

        } else if (Interaction.isChannelSelectMenu()) {
            require("./event_modules/interactions/ChannelSelectMenu.js").RunEvent({BotClient, Interaction})

        } else if (Interaction.isRoleSelectMenu()) {
            require("./event_modules/interactions/RoleSelectMenu.js").RunEvent({BotClient, Interaction})

        } else if (Interaction.isChatInputCommand()) {
            require("./event_modules/interactions/ChatInputCommand.js").RunEvent({BotClient, Interaction, BotOwner})
        }
    } catch (ThrownError) {
        console.log(ThrownError)
    }
})


BotClient.on(Events.MessageCreate, async (Message) => {
    try {
        require("./event_modules/messages/MessageAdd.js").RunEvent({BotClient, Message, BotOwner})
    } catch (ThrownError) {
        console.log(ThrownError)
    }
})

BotClient.on(Events.MessageDelete, async (Message) => {
    require("./event_modules/messages/MessageRemove.js").RunEvent({BotClient, Message})
})

BotClient.on(Events.MessageUpdate, async (Message) => {
})





BotClient.on(Events.GuildMemberAdd, async (Member) => {
})

BotClient.on(Events.GuildMemberRemove, async (Member) => {
})

BotClient.on(Events.GuildMemberUpdate, async (Member) => {
})





BotClient.on(Events.GuildRoleCreate, async (Role) => {
})

BotClient.on(Events.GuildRoleDelete, async (Role) => {
})

BotClient.on(Events.GuildRoleUpdate, async (Role) => {
})




BotClient.on(Events.ChannelCreate, async (Channel) => {
})

BotClient.on(Events.ChannelDelete, async (Channel) => {
})

BotClient.on(Events.ChannelUpdate, async (Channel) => {
})



BotClient.on(Events.GuildDelete, async (Guild) => {
    require("./event_modules/guilds/GuildRemove.js").RunEvent(Guild)
})

BotClient.on(Events.GuildCreate, async (Guild) => {
    require("./event_modules/guilds/GuildAdd.js").RunEvent(Guild)
})















BotClient.on(Events.Error, async (Error) => {
    require("./event_modules/Error.js").RunEvent(Error)
})


BotClient.on(Events.ShardDisconnect, async (ShardId) => {
})

BotClient.on(Events.ShardReconnecting, async (ShardId) => {
})

BotClient.on(Events.ShardReady, async (ShardId) => {
})

BotClient.on(Events.ShardResume, async (ShardId) => {
})


// Log the bot into the account
BotClient.login(BotToken)