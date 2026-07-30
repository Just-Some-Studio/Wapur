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

const path = require("path")
const fs = require("fs")

module.exports = {
    getLevelFromXp(exp) {
        if (!exp || exp <= 0) return 1
        
        return Math.floor(0.1 * Math.sqrt(exp)) + 1
    },

    
    getExpRequiredForLevel(level) {
        if (level <= 1) return 0
        
        return Math.pow((level - 1) / 0.1, 2)
    },


    embedMessage(message, color, title, timestamp, footerText, fields) {
        const NewEmbed = new EmbedBuilder()

        if (color) {
            NewEmbed.setColor(color)
        }
        if (title) {
            NewEmbed.setTitle(title)
        }
        if (message) {
            NewEmbed.setDescription(message)
        }
        if (timestamp) {
            NewEmbed.setTimestamp(timestamp)
        }
        if (footerText) {
            NewEmbed.setFooter(footerText)
        }
        if (fields) {
            for (const field of fields) {
                NewEmbed.addFields(field)
            }
        }

        return {embeds: [NewEmbed]}
    },


    toJSONString(stringObject) {
        const FormattedResult = JSON.stringify(stringObject, null, 2) || "Null"

        if (FormattedResult.length > 1900) {
            return "The data is too large to display in chat. Check the console."
        }

        return `\`\`\`json\n${FormattedResult}\n\`\`\``
    },


    checkIfUserOwnsItem(message, ItemName, UserId) {
    },


    loadCommandsFromDirectory(CommandFiles, CommandFilePath, BotClient, CommandList = []) {
        for (const File of CommandFiles) {
            const FilePath = path.join(CommandFilePath, File.name)

            if (File.isDirectory()) {
                const SubCommandFiles = fs.readdirSync(FilePath, {withFileTypes: true})
                this.loadCommandsFromDirectory(SubCommandFiles, FilePath, BotClient, CommandList)
                continue
            }

            const Command = require(FilePath)
            BotClient.commands.set(Command.Name, Command)
            
            const SlashCommand = new SlashCommandBuilder()
                .setName(`${Command.Name}`)
                .setDescription(`${Command.Description}`)
                
                if (Command.RequiredPermissions && Command.RequiredPermissions.length > 0) {
                    const Permissions = PermissionsBitField.resolve(Command.RequiredPermissions)
                    SlashCommand.setDefaultMemberPermissions(Permissions)
                } else if (!Command.PublicCommand && Command.AllowedUsers.length > 0 && Command.AllowedUsers.length < 2) {
                    SlashCommand.setDefaultMemberPermissions(0n)
                }

            for (let Iteration = 0; Iteration < Command.SlashCommandOptions.length; Iteration++) {
                const Option = Command.SlashCommandOptions[Iteration]
                
                if (Option.Type === "String") {
                    SlashCommand.addStringOption(option => 
                        option.setName(Option.Name.toLowerCase())
                            .setDescription(Option.Description)
                            .setRequired(Option.Required)
                            .addChoices(...Option.Choices.map(choice => ({ name: choice.Name, value: choice.Value })))
                    )
                } else if (Option.Type === "Integer") {
                    SlashCommand.addIntegerOption(option => 
                        option.setName(Option.Name.toLowerCase())
                            .setDescription(Option.Description)
                            .setRequired(Option.Required)
                            .addChoices(...Option.Choices.map(choice => ({ name: choice.Name, value: choice.Value })))
                    )
                } else if (Option.Type === "User") {
                    SlashCommand.addUserOption(option => 
                        option.setName(Option.Name.toLowerCase())
                            .setDescription(Option.Description)
                            .setRequired(Option.Required)
                    )
                } else if (Option.Type === "Boolean") {
                    SlashCommand.addBooleanOption(option => 
                        option.setName(Option.Name.toLowerCase())
                            .setDescription(Option.Description)
                            .setRequired(Option.Required)
                    )
                } else if (Option.Type === "Channel") {
                    SlashCommand.addChannelOption(option => 
                        option.setName(Option.Name.toLowerCase())
                            .setDescription(Option.Description)
                            .setRequired(Option.Required)
                    )
                } else if (Option.Type === "Role") {
                    SlashCommand.addRoleOption(option => 
                        option.setName(Option.Name.toLowerCase())
                            .setDescription(Option.Description)
                            .setRequired(Option.Required)
                    )
                }
            }

            CommandList.push(SlashCommand)
        }

        return CommandList
    }
}