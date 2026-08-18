const Database = require("better-sqlite3")
const SQLite = require("better-sqlite3")
const { error, time, table } = require("console")
const { timingSafeEqual } = require("crypto")
const { BaseGuildTextChannel } = require("discord.js")
const path = require("path")
const fs = require("fs")

class DataHandler {
    constructor() {
        this.Directory = path.join(__dirname, `data_files/ServerDataFiles`)
        this.BotDataDirectory = path.join(__dirname, `data_files/BotDataFiles`)

        if (!fs.existsSync(this.Directory)) {
            fs.mkdirSync(this.Directory, { recursive: true })
        }
        if (!fs.existsSync(this.BotDataDirectory)) {
            fs.mkdirSync(this.BotDataDirectory, { recursive: true })
        }  

        const BotDataPath = path.join(this.BotDataDirectory, `BotData.sqlite`)
        this.BotDataBase = new Database(BotDataPath)
        this.BotDataBase.pragma('journal_mode = WAL');
        this.BotDataBase.pragma('synchronous = NORMAL');

        this.BotDataBase.prepare(`CREATE TABLE IF NOT EXISTS serversPendingDeletion (
            serverId TEXT PRIMARY KEY,
            deletionTimestamp INTEGER
            )
        `).run()

        this.BotDataBase.prepare(`CREATE TABLE IF NOT EXISTS errorLogs (
            errorMessage TEXT,
            timestamp INTEGER
            )
        `).run()

        this.Connections = new Map()
    }

    getDatabaseConnection(ServerID) {
        if (!ServerID || !/^\d+$/.test(ServerID)) {
            throw new Error(`Invalid Server ID format provided: ${ServerID}`)
        }

        if (this.Connections.has(ServerID)) {
            return this.Connections.get(ServerID)
        }

        if (this.BotDataBase.prepare(`SELECT * FROM serversPendingDeletion WHERE serverId = ?`).get(ServerID)) {
            this.BotDataBase.prepare(`DELETE FROM serversPendingDeletion WHERE serverId = ?`).run(ServerID)
        }

        const DataPath = path.join(this.Directory, `${ServerID}.sqlite`)
        const DataBase = new Database(DataPath)

        DataBase.pragma('journal_mode = WAL');
        DataBase.pragma('synchronous = NORMAL');

        this.initilizeServerScheme(DataBase)

        this.Connections.set(ServerID, DataBase)
        return DataBase
    }

    initilizeServerScheme(DataBase) {
        DataBase.prepare(`CREATE TABLE IF NOT EXISTS userdata (
            userId TEXT PRIMARY KEY,
            credits INTEGER DEFAULT 0,
            lastWorked INTEGER DEFAULT 0,
            lastDaily INTEGER DEFAULT 0,
            dailyStreak INTEGER DEFAULT 0,
            exp INTEGER DEFAULT 0,
            lastExpGain INTEGER DEFAULT 0,
            damage STRING DEFAULT '[]',
            warnings STRING DEFAULT '[]',
            lastGamble INTEGER DEFAULT 0,
            purchasedItems STRING DEFAULT '[]'
            )
        `).run()

        DataBase.prepare(`CREATE TABLE IF NOT EXISTS serverdata (
            miscBotData STRING DEFAULT '[]',

            itemData STRING DEFAULT '[]',
            codeData STRING DEFAULT '[]',
            ticketData STRING DEFAULT '[]',

            commandSettings STRING DEFAULT '[]',
            economySettings STRING DEFAULT '[]',
            levelSettings STRING DEFAULT '[]',
            autoThreadSettings STRING DEFAULT '[]',
            loggingSettings STRING DEFAULT '[]',
            autoReplySettings STRING DEFAULT '[]'
            )
        `).run()
    }

    unloadDatabase(ServerID) {
        if (this.Connections.has(ServerID)) {
            this.Connections.get(ServerID).close()
            this.Connections.delete(ServerID)

            const DateToDelete = new Date()
            DateToDelete.setDate(DateToDelete.getDate() + 30)
            const DatabaseDateString = DateToDelete.toISOString().split('T')[0]

            this.BotDataBase.prepare(`INSERT INTO serversPendingDeletion (serverId, deletionTimestamp) VALUES (?, ?)`).run(ServerID, DatabaseDateString)
        }
    }

    deleteDatabase(ServerID) {
        const DataBasePath = path.join(this.Directory, `${ServerID}.sqlite`)
        fs.unlinkSync(DataBasePath)
        this.BotDataBase.prepare(`DELETE FROM serversPendingDeletion WHERE serverId = ?`).run(ServerID)
    }

    reloadDatabase(ServerID) {
        if (!ServerID || !/^\d+$/.test(ServerID)) {
            throw new Error(`Invalid Server ID format provided: ${ServerID}`)
        }

        if (this.Connections.has(ServerID)) {
            return this.Connections.get(ServerID)
        }

        if (this.BotDataBase.prepare(`SELECT * FROM serversPendingDeletion WHERE serverId = ?`).get(ServerID)) {
            this.BotDataBase.prepare(`DELETE FROM serversPendingDeletion WHERE serverId = ?`).run(ServerID)

            const DataPath = path.join(this.Directory, `${ServerID}.sqlite`)
            const DataBase = new Database(DataPath)

            DataBase.pragma('journal_mode = WAL');
            DataBase.pragma('synchronous = NORMAL');

            this.initilizeServerScheme(DataBase)

            this.Connections.set(ServerID, DataBase)
        }
    }







    //--------------------------------- SERVER DATA FUNCTIONS ---------------------------------
    getServer(ServerID) {
        const DataBase = this.getDatabaseConnection(ServerID)
        let Server = DataBase.prepare(`SELECT * FROM serverdata`).get()
        
        if (!Server) {
            DataBase.prepare(`INSERT INTO serverdata (miscBotData, itemData, codeData, ticketData, commandSettings, economySettings, levelSettings, autoThreadSettings, loggingSettings, autoReplySettings) VALUES ('[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]')`).run()
            Server = {miscBotData: '[]', itemData: '[]', codeData: '[]', ticketData: '[]', commandSettings: '[]', economySettings: '[]', levelSettings: '[]', autoThreadSettings: '[]', loggingSettings: '[]', autoReplySettings: '[]'}

            const botServerData = JSON.stringify([
                {"JoinDate": Date.now(), "InServer": true, "ServerID": ServerID},
                null,
                null,
                null,
                null,
                null
            ])

            DataBase.prepare(`UPDATE serverdata SET miscBotData = ?`).run(botServerData)
        }

        return Server
    }

    setServerSettings(ServerID, SettingType, NewSettings) {
        const DataBase = this.getDatabaseConnection(ServerID)
        const ValidSettingTypes = ["miscBotData", "itemData", "codeData", "ticketData", "commandSettings", "economySettings", "levelSettings", "autoThreadSettings", "loggingSettings", "autoReplySettings"]

        if (!ValidSettingTypes.includes(SettingType)) {
            console.error(`Invalid SettingType provided: ${SettingType}`)
        }
        
        DataBase.prepare(`UPDATE serverdata SET ${SettingType} = ?`).run(NewSettings)
    }









    //--------------------------------- USER DATA FUNCTIONS ---------------------------------


    getUser(ServerID, userId) {
        const DataBase = this.getDatabaseConnection(ServerID)
        let User = DataBase.prepare(`SELECT * FROM userdata WHERE userId = ?`).get(userId)
        
        if (!User) {
            DataBase.prepare(`INSERT INTO userdata (userId, credits, lastWorked, lastDaily, dailyStreak, exp, lastExpGain, damage, warnings, lastGamble, purchasedItems) VALUES (?, 0, 0, 0, 0, 0, 0, '[]', '[]', 0, '[]')`).run(userId)
            User = {userId, credits: 0, lastworked: 0, lastDaily: 0, dailyStreak: 0, lastExpGain: 0, damage: '[]', warnings: '[]', lastGamble: 0, purchasedItems: '[]'}
        }

        return User
    }

    addWorkCredits(ServerID, userId, creditAmount, workType, timestamp) {
        const DataBase = this.getDatabaseConnection(ServerID)
        if (workType === "Work") {
            DataBase.prepare(`UPDATE userdata SET credits = credits + ?, lastWorked = ? WHERE userId = ?`).run(creditAmount, timestamp, userId)
        } else if (workType === "DailyKept") {
            DataBase.prepare(`UPDATE userdata SET credits = credits + ?, lastDaily = ?, dailyStreak = dailyStreak + 1 WHERE userId = ?`).run(creditAmount, timestamp, userId)
        } else if (workType === "DailyLost") {
            DataBase.prepare(`UPDATE userdata SET credits = credits + ?, lastDaily = ?, dailyStreak = 1 WHERE userId = ?`).run(creditAmount, timestamp, userId)
        } else if (workType === "Gamble") {
            DataBase.prepare(`UPDATE userdata SET credits = credits + ?, lastGamble = ? WHERE userId = ?`).run(creditAmount, timestamp, userId)
        } else if (workType === "Lost") {
            DataBase.prepare(`UPDATE userdata SET credits = 0, lastGamble = ? WHERE userId = ?`).run(timestamp, userId)
        } else if (workType === "AddCredits") {
            DataBase.prepare(`UPDATE userdata SET credits = credits + ? WHERE userId = ?`).run(creditAmount, userId)
        }
    }

    purchaseItem(ServerID, userId, itemCost, updatedPurchasedItems) {
        const DataBase = this.getDatabaseConnection(ServerID)
        DataBase.prepare(`UPDATE userdata SET credits = credits - ?, purchasedItems = ? WHERE userId = ?`).run(itemCost, updatedPurchasedItems, userId)

        return "Success"
    }

    addEXP(ServerID, userId, EXP, lastExpGain) {
        const DataBase = this.getDatabaseConnection(ServerID)
        DataBase.prepare(`UPDATE userdata SET exp = exp + ?, lastExpGain = ? WHERE userId = ?`).run(EXP, lastExpGain, userId)
    }

    addDamage(ServerID, userId, newJson) {
        const DataBase = this.getDatabaseConnection(ServerID)
        DataBase.prepare(`UPDATE userdata SET damage = ? WHERE userId = ?`).run(newJson, userId)
        return DataBase.prepare(`SELECT damage FROM userdata WHERE userId = ?`).get(userId)
    }

    addWarning(ServerID, userId, newJson) {
        const DataBase = this.getDatabaseConnection(ServerID)
        DataBase.prepare(`UPDATE userdata SET warnings = ? WHERE userId = ?`).run(newJson, userId)
    }




    //--------------------------------- ERROR LOGGING FUNCTIONS ---------------------------------

    logError(Error) {
        this.BotDataBase.prepare(`INSERT INTO errorLogs (errorMessage, timestamp) VALUES (?, ?)`).run(Error.message, Date.now())
    }

    CleanErrorLog() {
        this.BotDataBase.prepare(`DELETE FROM errorLogs`).run()
    }





    //--------------------------------- DEVELOPMENT DATA FUNCTIONS ---------------------------------

    customDataQuery(ServerID, PrepareInfo, Type) {
        const DataBase = this.getDatabaseConnection(ServerID)
        const PreparedDataBase = DataBase.prepare(PrepareInfo)

        if (Type === "get") {
            return PreparedDataBase.get()
        } else if (Type === "all") {
            return PreparedDataBase.all()
        } else if (Type === "run") {
            return PreparedDataBase.run()
        } else {
            throw new Error("Invalid query type passed")
        }
    }
}

module.exports = new DataHandler();