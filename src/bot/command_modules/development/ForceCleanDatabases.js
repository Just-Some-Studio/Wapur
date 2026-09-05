const {PermissionsBitField} = require("discord.js")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

module.exports = {
    Name: "forcecleandatabases",
    Description: "Forces the cleanup of pending databases that are scheduled for deletion.",
    Subset: "Development",

    DevOnly: true,
    
    RequiredPermissions: [PermissionsBitField.Flags.Administrator],
    SlashCommandOptions: [],
    Subcommands: [],

    async execute(Interaction, PassedArguments, BotClient) {
        console.log("[CRON] Running forced cleanup task...")
    
        const today = new Date().toISOString().split('T')[0]
        let DeletedDatabasesCount = 0
        
        try {
            const RowsToDelete = await DataHandler.BotDataBase.prepare(`SELECT serverId FROM serversPendingDeletion WHERE deletionTimestamp <= ?`).all(today)
            
            for (const ServerToDelete of RowsToDelete) {
                const ServerID = ServerToDelete.serverId
                DataHandler.deleteDatabase(ServerID)
                
                DeletedDatabasesCount++
            }
        } catch (ThrownError) {
            console.log(ThrownError)
        }
    
        DataHandler.CleanErrorLog()
    
        console.log(`[CRON] Forced cleanup task completed. Deleted ${DeletedDatabasesCount} server databases.`)

        Interaction.reply({
            content: `[CRON] Forced cleanup task completed. Deleted ${DeletedDatabasesCount} server databases.`,
            emphemeral: true
        })
    }
}