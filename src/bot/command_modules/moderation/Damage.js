const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "Damage",
    Description: "Damage a user, 25 damage will result in a ban",
    Subset: "Moderation",

    DevOnly: false,

    RequiredPermissions: [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.ManageMessages],
    SlashCommandOptions: [
        {"Name": "User", "Description": "The user to damage", "Required": true, "Type": "User", "Choices": []},
        {"Name": "Damage", "Description": "The amount of damage to give", "Required": true, "Type": "Integer", "Choices": []},
        {"Name": "Reason", "Description": "The reason for the damage", "Required": false, "Type": "String", "Choices": []}
    ],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const DamagedUser = Interaction.options?.getUser('user') || Interaction.mentions?.users?.first() || PassedArguments[0]
        const Damage = parseInt(PassedArguments[1])
        const Reason = PassedArguments.slice(2).join(" ") || "No Reason Provided"

        const OldData = JSON.parse(DataHandler.getUser(Interaction.guild.id, DamagedUser.id).damage)
        OldData.push({"damage": Damage, "reason": Reason, "admin": Interaction.author?.id || Interaction.user?.id, "time": Date.now()})

        const NewJson = JSON.stringify(OldData)
        const UserDamageJsonReturned = JSON.parse(DataHandler.addDamage(Interaction.guild.id, DamagedUser.id, NewJson).damage)

        const TotalDamageCalculated = UserDamageJsonReturned.reduce((totalDamage, currentDamageDictionary) => {
            return totalDamage + (currentDamageDictionary.damage || 0);
        }, 0);

        if (TotalDamageCalculated >= 25) {
            const KickedMember = Interaction.guild.members.cache.get(DamagedUser.id)   

            await Interaction.channel.send(`User <@${DamagedUser.id}> has been banned for reaching taking more than 25 damage, total: ${TotalDamageCalculated}`)
            await KickedMember.kick(Reason)
            await KickedMember.send(`<@${DamagedUser.id}>, You have been banned for reaching taking more than 25 damage, total: ${TotalDamageCalculated}`)
        } else {
            await Interaction.channel.send(`User <@${DamagedUser.id}> has taken ${Damage} damage for ${Reason} and now has a total of ${TotalDamageCalculated}`)
        }
    }
}