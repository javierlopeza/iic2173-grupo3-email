const regexIdentifyQueries = /(producto|categor[i,í]a){1}\s*\:{1}\s*[0-9]{1,3}/gim
const regexSplitValues = /(?:\s*\:{1}\s*)/i

exports.parseMessage = function (text) {
  let lines = text.match(regexIdentifyQueries)  
  if (lines) {
    let commands = lines.map(function (line) {
      return line.split(regexSplitValues).map((part) => part.toLowerCase().replace("í", "i"))
    })
    return queryGrouper(commands)
  }
  return null
}

function queryGrouper(array) {
  let hash = array.reduce(function (p, c) {
    if (p.hasOwnProperty(c[0])) {
      p[c[0]].push(parseInt(c[1]))
    } else {
      p[c[0]] = [parseInt(c[1])]
    }
    return p
  }, {})
  return hash
}