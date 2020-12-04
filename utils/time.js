const moment = require('moment')

function getTime() {
    return moment().format('h:mm a')
}

module.exports = getTime