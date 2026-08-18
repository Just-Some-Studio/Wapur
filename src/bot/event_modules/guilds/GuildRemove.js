const chalk = require("chalk")
const DataHandler = require("../../dataHandler.js")
const BotModules = require("../../modules.js")

async function RunEvent(PassedArguements) {
    const ServerID = PassedArguements.id
    DataHandler.unloadDatabase(ServerID)
}

module.exports = {RunEvent}