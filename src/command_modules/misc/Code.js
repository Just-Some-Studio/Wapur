const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Code",
    Description: "redeem a code for rewards (Case sensative)",
   
    DevOnly: false,

    RequiredPermissions: [],
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