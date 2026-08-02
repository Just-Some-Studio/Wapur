const {PermissionsBitField, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder} = require("discord.js")
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

    DevOnly: false,

    RequiredPermissions: [],
    SlashCommandOptions: [],

    async execute(message, arguements, botClient) {
        const userId = message.author?.id || message.user?.id
        const guildId = message.guild?.id

        function buildShopResponse(userCredits, userId) {
            const SelectMenu = new StringSelectMenuBuilder()
                .setCustomId(`shop_select_${userId}`)
                .setPlaceholder("Choose an item to buy")

            ShopItems.forEach(item => {
                SelectMenu.addOptions({
                    label: `${item.Emoji} ${item.Name}`,
                    description: `${item.Description} • ${item.Price} credits`,
                    value: item.Value
                })
            })

            const Row = new ActionRowBuilder().addComponents(SelectMenu)
            const Embed = BotModules.embedMessage("Use the dropdown below to select an item to purchase! \nYou can purchase the same item multiple times but they do not stack. \n\nNOTE: You can buy more than one item at a time.", "2f6fed", "Item Shop", null, null, [{ name: "Your balance", value: `${userCredits} credits`, inline: true }, { name: "Available items", value: `${ShopItems.length} purchasable options`, inline: true }])

            return {
                embeds: [Embed.embeds[0]],
                components: [Row]
            }
        }

        if (!message.guild) {
            return message.reply(BotModules.embedMessage("Please use this shop in a server", "ef4444"))
        }

        const userData = DataHandler.getUser(guildId, userId)

        return message.reply(buildShopResponse(userData.credits, userId))
    },

    async handleSelectMenu(interaction, botClient) {
        console.log(interaction)
        if (!interaction.isStringSelectMenu() || !interaction.customId.startsWith("shop_select_")) {
            return
        }

        if (Date.now() - interaction.createdTimestamp < 1000 * 60 * 5) {
            return interaction.reply({content: "This interaction is too old and can no longer be used", ephemeral: true})
        }

        // Extract the original user ID from the custom ID
        const originalUserId = interaction.customId.replace("shop_select_", "")
        
        // Check if the person clicking is the original user
        if (interaction.user.id !== originalUserId) {
            return interaction.reply({content: "This isn't your shop command, use the command to purchase an item", ephemeral: true})
        }

        const selectedValue = interaction.values[0]
        const selectedItem = ShopItems.find(item => item.Value === selectedValue)

        if (!selectedItem) {
            return interaction.reply({ content: "That item is no longer available.", ephemeral: true })
        }

        const UserId = interaction.user.id
        const GuildId = interaction.guild?.id

        if (!GuildId) {
            return interaction.reply({ content: "This shop only works in a server.", ephemeral: true })
        }

        const userData = DataHandler.getUser(GuildId, UserId)

        if (userData.credits < selectedItem.Price) {
            const MissingCredits = selectedItem.Price - userData.credits
            const embed = new EmbedBuilder()
                .setColor("ef4444")
                .setTitle("Not enough credits")
                .setDescription(`You need **${MissingCredits}** more credits to buy **${selectedItem.Name}**.`)

            return interaction.reply({ embeds: [embed], ephemeral: true })
        }



        // Purchasing the item and updating data
        let OldData = JSON.parse(DataHandler.getUser(interaction.guild.id, UserId).purchasedItems || "[]")

        console.log(OldData)

        if (OldData === "[]") {
            OldData = `[{ItemName: ${selectedItem.Name}, ItemValue: ${selectedItem.Value}, Amount: 1, PurchaseDate: ${Date.now()}}]`
        } else if (OldData.some(item => item.ItemValue === selectedItem.Value)) {
            OldData[OldData.findIndex(item => item.ItemValue === selectedItem.Value)].Amount += 1
        } else {
            OldData.push({"ItemName": selectedItem.Name, "ItemValue": selectedItem.Value, "Amount": 1, "PurchaseDate": Date.now()})
        }

        const PurchaseSuccessful = DataHandler.purchaseItem(GuildId, UserId, selectedItem.Price, JSON.stringify(OldData))

        if (!PurchaseSuccessful) {
            const embed = new EmbedBuilder()
                .setColor("ef4444")
                .setTitle("Purchase failed")
                .setDescription("Your purchase could not be completed right now.")

            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        // Sending a reply
        const UpdatedUser = DataHandler.getUser(GuildId, UserId)
        const embed = new EmbedBuilder()
            .setColor("22c55e")
            .setTitle("Purchase complete")
            .setDescription(`You bought **${selectedItem.Name}** for **${selectedItem.Price}** credits.`)
            .addFields({ name: "Remaining balance", value: `${UpdatedUser.credits} credits`, inline: true })

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
}