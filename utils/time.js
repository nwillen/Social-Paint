const moment = require('moment')

function getTime() {
    return moment().format('MMM Do, h:mm a')
}

module.exports = getTime