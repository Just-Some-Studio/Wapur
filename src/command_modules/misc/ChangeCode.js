const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "ChangeCode",
    Description: "Add a new code to your server",

    DevOnly: true,

    RequiredPermissions: [PermissionsBitField.Flags.ManageGuild],
    SlashCommandOptions: [
        {"Name": "Type", "Description": "Whether you are adding, removing, or changing a code", "Type": "String", "Required": true, "Choices": [
            {"Name": "Add", "Value": "add"},
            {"Name": "Remove", "Value": "remove"},
            {"Name": "Change", "Value": "change"}
        ]},
        {"Name": "Code", "Description": "The code you want to add, remove, or change", "Type": "String", "Required": true, "Choices": []},
        {"Name": "Reward", "Description": "The reward for the code you are adding or changing", "Type": "String", "Required": true, "Choices": [
            {"Name": "None", "Value": "none"},
            {"Name": "Credits (Currency)", "Value": "credits"},
            {"Name": "XP (Leveling)", "Value": "xp"},
            {"Name": "Role (Giveaway)", "Value": "role"}
        ]},
        {"Name": "RewardAmount", "Description": "The amount of the reward for the code you are adding or changing", "Type": "Integer", "Required": false, "Choices": []},
        {"Name": "RewardRole", "Description": "The role to give for the code you are adding or changing", "Type": "Role", "Required": false, "Choices": []}
    ],

    async execute(Interaction, PassedArguements, BotClient) {
    }
}