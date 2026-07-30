const { PermissionsBitField, GuildAuditLogsEntry, AllowedMentionsTypes, User } = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const modules = require("../../modules.js")

const Codes = [
    {"Value": "TESTCode", "Response": "You have redeemed a code for /$", "Reward": "credits_0"}
]

module.exports = {
    Name: "code",
    Description: "redeem a code for rewards (Case sensative)",
    AllowedUsers: [], // This list overrides the public command thing
    PublicCommand: true,
    RequiredPermissions: [],
    RequiresAllPermissions: true,
    SlashCommandOptions: [
        {"Name": "Code", "Description": "Input a code to redeem", "Required": true, "Type": "String", "Choices": []},
    ],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
        const RedeemedCode = arguements.slice(0).join(" ") || "No Reason Provided"

        Codes.forEach(CodeObject => {
            if (CodeObject.Value == RedeemedCode) {
                if (CodeObject.Reward.includes("credits_")) {
                    const CreditAmount = Math.floor(parseInt(CodeObject.Reward.replace("credits_", "")))
                    const NewMessage = CodeObject.Response.replace("/$", `${CreditAmount} credits`)

                    DataHandler.addWorkCredits(message.guild?.id, userId, CreditAmount, "AddCredits")

                    message.reply({content: NewMessage, ephemeral: true})
                }
            }
        })

    }
}