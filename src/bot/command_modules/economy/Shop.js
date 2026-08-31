const {PermissionsBitField, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, MessageFlags} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

const ShopItems = [
    // Roles
    {"Name": "Gold Role", "Description": "Gain the gold role", "Price": 10000, "Emoji": "🟡", "Value": "gold"},
    {"Name": "Diamond Role", "Description": "Gain the diamond role", "Price": 25000, "Emoji": "💎", "Value": "diamond"},
    {"Name": "Saphire Role", "Description": "Gain the sapphire role", "Price": 50000, "Emoji": "🔷", "Value": "sapphire"},
    {"Name": "Emerald Role", "Description": "Gain the emerald role", "Price": 75000, "Emoji": "💚", "Value": "emerald"},
    {"Name": "Ruby Role", "Description": "Gain the ruby role", "Price": 100000, "Emoji": "🔴", "Value": "ruby"},
    {"Name": "Unobtainium Role", "Description": "Gain the unobtainium role, requires ruby", "Price": 250000, "Emoji": "🟣", "Value": "unobtainium"},

    // Items
    {"Name": "Gambling Boost", "Description": "Win 50% more when gambling but increases chance to lose everything by 3%", "Price": 20000, "Emoji": "🎰", "Value": "gamblingboost"},
    {"Name": "Credit boost", "Description": "Earn 15% more credits (Doesn't work on gambling)", "Price": 500000, "Emoji": "💰", "Value": "credits"},
    {"Name": "Custom Role", "Description": "Get and create a custom role, requires unobtainium", "Price": 1000000, "Emoji": "🎨", "Value": "customrole"}
]

module.exports = {
    Name: "Shop",
    Description: "View the shop",
    Subset: "Economy",

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(Interaction, PassedArguments, BotClient) {
        const UserId = Interaction.author?.id || Interaction.user?.id
        const UserData = DataHandler.getUser(Interaction.guild.id, UserId)

        if (!Interaction.guild) {
            return Interaction.reply(BotModules.embedMessage("This command cannot be used in direct messages", "ef4444"))
        }

        let PurchasableItems = 0

        const SelectMenu = new StringSelectMenuBuilder()
            .setCustomId(`ShopSelectionMenu_${UserId}`)
            .setPlaceholder("Choose an item to purchase")

        ShopItems.forEach(item => {
            SelectMenu.addOptions({
                label: `${item.Emoji} ${item.Name}`,
                description: `${item.Description} • ${item.Price} credits`,
                value: item.Value
            })

            if (item.Price <= UserData.credits) {
                PurchasableItems++
            }
        })

        const ShopActionRow = new ActionRowBuilder()
            .addComponents(SelectMenu)
            
        const MessageEmbed = BotModules.embedMessage(
            "Use the dropdown below to select an item to purchase! \nYou can purchase the same item more than once.", 
            "2f6fed", 
            "Item Shop",
            Date.now(), 
            "The shop expired 5 minutes after it is created", 
            [
                {name: "Your balance", value: `${UserData.credits} credits`, inline: true}, 
                {name: "Available items", value: `${PurchasableItems} purchasable options`, inline: true}
            ]
        )

        return Interaction.reply({
            content: "",
            embeds: [MessageEmbed.embeds[0]],
            components: [ShopActionRow]
        })
    },


    async handleSelectMenu(Interaction, BotClient) {
        const UserId = Interaction.customId.replace("ShopSelectionMenu_", "")
        const OldUserData = DataHandler.getUser(Interaction.guild.id, UserId)

        const selectedValue = Interaction.values[0]
        const selectedItem = ShopItems.find(item => item.Value === selectedValue)

        if (Date.now() - Interaction.createdTimestamp > 1000 * 60 * 5) {
            return await Interaction.reply({
                content: "This interaction is too old and can no longer be used", 
                flags: MessageFlags.Ephemeral
            })
        }
        
        if (Interaction.user.id !== UserId) {
            return await Interaction.reply({
                content: "This isn't your shop command, use the command to purchase an item", 
                flags: MessageFlags.Ephemeral
            })
        }

        if (!selectedItem) {
            return await Interaction.reply({
                content: "That item is no longer available.",
                flags: MessageFlags.Ephemeral
            })
        }

        if (OldUserData.credits < selectedItem.Price) {
            const MissingCredits = selectedItem.Price - OldUserData.credits

            const MessageEmbed = BotModules.embedMessage(
                `You need **${MissingCredits}** more credits to buy **${selectedItem.Name}**.`,
                "ef4444",
                "Insufficient funds",
                Date.now()
            )

            return await Interaction.reply({
                content: "",
                embeds: [MessageEmbed.embeds[0]], 
                flags: MessageFlags.Ephemeral
            })
        }



        // // Purchasing the item and updating data
        // let OldData = JSON.parse(DataHandler.getUser(Interaction.guild.id, UserId).purchasedItems || "[]")
        
        // if (OldData === "[]") {
        //     OldData = `[{ItemName: ${selectedItem.Name}, ItemValue: ${selectedItem.Value}, Amount: 1, PurchaseDate: ${Date.now()}}]`
        // } else if (OldData.some(item => item.ItemValue === selectedItem.Value)) {
        //     OldData[OldData.findIndex(item => item.ItemValue === selectedItem.Value)].Amount += 1
        // } else {
        //     OldData.push({"ItemName": selectedItem.Name, "ItemValue": selectedItem.Value, "Amount": 1, "PurchaseDate": Date.now()})
        // }

        // const PurchaseSuccessful = DataHandler.purchaseItem(GuildId, UserId, selectedItem.Price, JSON.stringify(OldData))

        // if (!PurchaseSuccessful) {
        //     const embed = new EmbedBuilder()
        //         .setColor("ef4444")
        //         .setTitle("Purchase failed")
        //         .setDescription("Your purchase could not be completed right now.")

        //     return Interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        // }

        // // Sending a reply
        // const UpdatedUser = DataHandler.getUser(GuildId, UserId)
        // const embed = new EmbedBuilder()
        //     .setColor("22c55e")
        //     .setTitle("Purchase complete")
        //     .setDescription(`You bought **${selectedItem.Name}** for **${selectedItem.Price}** credits.`)
        //     .addFields({ name: "Remaining balance", value: `${UpdatedUser.credits} credits`, inline: true })

        // return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
    }
}