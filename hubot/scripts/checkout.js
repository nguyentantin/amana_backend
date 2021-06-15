// Description:
//    An example script, tells you the time. See below on how documentation works.
//    https://github.com/hubotio/hubot/blob/master/docs/scripting.md#documenting-scripts
//
// Commands:
//    bot what time is it? - Tells you the time
//    bot what's the time? - Tells you the time
//
var axios = require('axios')

var apiUrl = process.env.API_URL

module.exports = (robot) => {
  robot.respond(/checkout/gi, (res) => {
    var username = res.message.user.name.toLowerCase()
    console.log('username => ', username)
    var url = `${apiUrl}/time-tracking`
    var body = {
      username,
      type: 2
    }
    axios.post(url, body)
      .then(function (data) {
        console.log('call api checkout success')
        res.reply(data.data.msg)
      })
      .catch(function(err) {
        console.log(err)
      })
  })
}
