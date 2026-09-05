const {PermissionsBitField, MessageFlags} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Code",
    Description: "redeem a code for rewards (Case sensative)",
    Subset: "Fun",
   
    DevOnly: true,

    RequiredPermissions: [],
    SlashCommandOptions: [
        {"Name": "Code", "Description": "Input a code to redeem", "Required": true, "Type": "String", "Choices": []},
    ],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const userId = Interaction.author?.id || Interaction.user?.id
        const RedeemedCode = PassedArguments.slice(0).join(" ") || "No Reason Provided"

        Codes.forEach(CodeObject => {
            if (CodeObject.Value == RedeemedCode) {
                if (CodeObject.Reward.includes("credits_")) {
                    const CreditAmount = Math.floor(parseInt(CodeObject.Reward.replace("credits_", "")))
                    const NewMessage = CodeObject.Response.replace("/$", `${CreditAmount} credits`)

                    DataHandler.addWorkCredits(Interaction.guild?.id, userId, CreditAmount, "AddCredits")

                    Interaction.reply({content: NewMessage, flags: MessageFlags.Ephemeral})
                }
            }
        })

    }
}