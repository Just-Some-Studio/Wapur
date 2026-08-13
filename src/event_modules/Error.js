const chalk = require("chalk")
const DataHandler = require("../dataHandler.js")
const BotModules = require("../modules.js")

async function RunEvent(PassedArguements) {
    const Error = PassedArguements

    DataHandler.logError(Error)
}

module.exports = {RunEvent}