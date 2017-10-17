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

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: sender,
    to: receiver,
    subject: subject,
    text: "text",
    html: buildHTML({products: data, email: receiver, name})
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
  if(!data) {return "<h1>Data Not Found</h1>"}
  let title = `<h1> Estimado ${data.name}, gracias por preferir a Alquitrán SPA</h1>`
  let intro = '<p>Sus pedidos son los siguientes:</p>'
  let items = data.products.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.category.context}</td>
      <td>${p.category.area}</td>
      <td>${p.category.group}</td>
    </tr>`)
  let tableBody = items.reduce((prev, current) => {
    return prev + current
  })
  let headers = `
    <tr>
      <th>ID</th>
      <th>Nombre</th> 
      <th>Precio</th>
      <th>Contexto</th>
      <th>Área</th>
      <th>Grupo</th>
    </tr>`
  return title + intro + `<table>${headers}${tableBody}</table>`
}