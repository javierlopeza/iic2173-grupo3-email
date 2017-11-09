const nodemailer = require('nodemailer')
const sender = process.env.GMAIL_ACCOUNT
const password = process.env.GMAIL_PASSWORD

var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: sender,
    pass: password
  }
})

// send mail with defined transport object
exports.sendEmail = function (receiver, name, subject, data) {
  console.log(`[BUILDING EMAIL] Starting email composition`)
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: sender,
    to: receiver,
    subject: subject,
    text: "text",
    html: buildHTML({
      products: data.products,
      purchases: data.purchases,
      email: receiver,
      name
    })
  }

  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        console.log('Message sent: ' + info.response)
        resolve(info.response)
      }
    })
  })
}

function buildHTML(data) {
  if (!data) {
    return "<h1>Data Not Found</h1>"
  }
  let mainTitle = `<h1> Estimado ${data.name}, gracias por preferir a Arquitrán SPA</h1>`
  let productsTable = data.products.length > 0 ? createProductsTable(data.products) : ""
  console.log(`[PARTIAL OUTPUT] Products Table: \n ${productsTable}`)
  let acceptedPurchasesTable = ""
  let rejectedPurchasesTable = ""
  if (data.purchases && data.purchases.success) {    
    acceptedPurchasesTable = data.purchases.accepted.length > 0 ? createAcceptedPurchasesTable(data.purchases.accepted) : ""      
    rejectedPurchasesTable = data.purchases.rejected.length > 0 ? createRejectedPurchasesTable(data.purchases.rejected) : ""  
  }
  console.log(`[PARTIAL OUTPUT] Rejected Purchases Table: \n ${rejectedPurchasesTable}`)
  console.log(`[PARTIAL OUTPUT] Accepted Purchases Table: \n ${acceptedPurchasesTable}`)
  return mainTitle + productsTable + acceptedPurchasesTable + rejectedPurchasesTable
}

function createProductsTable(products) {
  let productsTitle = '<h3>Estos son los productos que usted consultó:</h3>'
  let productsHeaders = `
  <tr>
    <th>ID</th>
    <th>Nombre</th> 
    <th>Precio</th>
    <th>Contexto</th>
    <th>Área</th>
    <th>Grupo</th>
  </tr>`
  let productsInfo = products.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.category.context}</td>
      <td>${p.category.area}</td>
      <td>${p.category.group}</td>
    </tr>`)
  let productsTableBody = productsInfo.reduce((prev, current) => {
    return prev + current
  })
  let productsTable = `<table>${productsHeaders}${productsTableBody}</table>`
  return productsTitle + productsTable
}

function createAcceptedPurchasesTable(purchases) {
  let purchasesTitle = `<h3>Estas son sus compras aceptadas:</h3>`
  let purchasesHeaders = `
  <tr>
    <th>ID</th>
    <th>Nombre</th> 
    <th>Precio</th>
    <th>Cantidad</th>
    <th>Contexto</th>
    <th>Área</th>
    <th>Grupo</th>
    <th>Detalle</th>
  </tr>`
  let purchasesInfo = purchases.map((p) => `
    <tr>
      <td>${p.product_id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.quantity}</td>      
      <td>${p.category.context}</td>
      <td>${p.category.area}</td>
      <td>${p.category.group}</td>
      <td>Aprobado</td>
    </tr>`)
  let purchasesTableBody = purchasesInfo.reduce((prev, current) => {
    return prev + current
  })
  let purchasesTable = `<table>${purchasesHeaders}${purchasesTableBody}</table>`
  return purchasesTitle + purchasesTable
}

function createRejectedPurchasesTable(purchases) {
  let purchasesTitle = `<h3>Estas son sus compras rechazadas:</h3>`
  let purchasesHeaders = `
  <tr>
    <th>ID</th>
    <th>Nombre</th> 
    <th>Precio</th>
    <th>Cantidad</th>
    <th>Contexto</th>
    <th>Área</th>
    <th>Grupo</th>
    <th>Motivo de Rechazo</th>
  </tr>`
  let purchasesInfo = purchases.map((p) => `
    <tr>
      <td>${p.product_id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.quantity}</td>
      <td>${p.category.context}</td>
      <td>${p.category.area}</td>
      <td>${p.category.group}</td>
      <td>${p.rejected_reason}</td>      
    </tr>`)
  let purchasesTableBody = purchasesInfo.reduce((prev, current) => {
    return prev + current
  })
  let purchasesTable = `<table>${purchasesHeaders}${purchasesTableBody}</table>`
  return purchasesTitle + purchasesTable
}