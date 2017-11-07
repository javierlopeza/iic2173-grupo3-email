// const regexFindBuyList = /((compra(r|s)?){1}\s*:?\s*(\-{1}\s*(producto){1}\s*:?\s*[0-9]{1,7}\s*:\s*[0-9]{1,7}\s*(unidad(|es)?)?\s*)+){1}/ig
// const regexFindQueryList = /((consulta(r|s)?){1}\s*:?\s*(\-{1}\s*(producto){1}\s*:?\s*[0-9]{1,7}\s*)+){1}/ig
const regexFindBuyList = /((compra(r|s)?){1}\s*:?\s*(\-{1}.*\n+)+){1}/im
const regexFindProductsToBuy = /(producto(|s)?){1}\s*:?\s*[0-9]{1,7}\s*:{1}\s+[0-9]{1,7}(\s*(unidad(|es)?))?\n{1}/gmi
const regexFindQueryList = /((consulta(r|s)?){1}\s*:?\s*(\-{1}.*\n+)+){1}/img
const regexFindProductsToQuery = /(producto){1}\s*:?\s*[0-9]{1,7}\n{1}/gi
const regexFindAddress = /(direcci[oó]{1}n){1}\s*\:{1}[^\n]*[^\s]+/im

function getProductsToQuery(text) {
  let products = text.match(regexFindProductsToQuery)
  return products.map(product => {
    let id = product.replace(/:/g, "").split(/\s+/)[1]
    return parseInt(id)
  })
}

function getProductsToBuy(text) {
  let products = text.match(regexFindProductsToBuy)
  return products.map(product => {
    let parts = product.replace(/:/g, "").replace(/\s+(unidad(|es)?){1}/g, "").split(/\s+/)
    try {
      let product_id = parseInt(parts[1])
      let quantity = parseInt(parts[2])
      return {product_id, quantity} 
    } catch (err) {
      console.log(err)
      return
    }
  })
}

exports.parseMessage = function (text) {
  let buyLines = text.match(regexFindBuyList) || false
  let queryLines = text.match(regexFindQueryList) || false
  let addressMatches = text.match(regexFindAddress) || false
  let address = addressMatches ? addressMatches[0] : ""
  let productsToBuy = buyLines ? getProductsToBuy(buyLines[0]) : []
  let productsToQuery = queryLines ? getProductsToQuery(queryLines[0]) : []
  let parsedMessage = { productsToBuy, productsToQuery, address }
  return parsedMessage
}