const regexFindProducts = /(producto){1}\s*:?\s*[0-9]{1,7}/gi
const regexFindBuyList = /((compra(r|s)?){1}:?\s*(\-{1}\s*(producto){1}\s*[0-9]{1,7}\s*)+){1}/ig
const regexFindQueryList = /((consulta(r|s)?){1}:?\s*(\-{1}\s*(producto){1}\s*[0-9]{1,7}\s*)+){1}/ig


function getProductsFromText(text) {
  let products = text.match(regexFindProducts)
  return products.map(product => {
    return product.split(" ")[1]
  })
}

exports.parseMessage = function (text) {
  let buyLines = text.match(regexFindBuyList) || false
  let queryLines = text.match(regexFindQueryList) || false
  let productsToBuy = buyLines ? getProductsFromText(buyLines[0]) : []
  let productsToQuery = queryLines ? getProductsFromText(queryLines[0]) : []
  let parsedMessage = { productsToBuy, productsToQuery }
  return parsedMessage
}