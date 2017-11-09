const MailListener = require("mail-listener2")
const controller = require('../controllers/controller')
const path = require('path')
const fs = require('fs')
const rsender = require('./requestSender')
const msender = require('./emailSender')
const parseMessage = require('../controllers/helpers').parseMessage
const directory = path.join(__dirname, '../attachments')

const mailListener = new MailListener({
  username: process.env.GMAIL_ACCOUNT,
  password: process.env.GMAIL_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  searchFilter: ["UNSEEN"],
  markSeen: true,
  fetchUnreadOnStart: true,
  attachments: false,
  attachmentOptions: {
    directory: directory
  }
})

// stop listening mailListener.stop();

mailListener.on("server:connected", function () {
  console.log("imapConnected")
})

mailListener.on("server:disconnected", function () {
  console.log("imapDisconnected")
})

mailListener.on("error", function (err) {
  console.log(err)
})

mailListener.on("mail", function (mail, seqno, attributes) {
  let route = ""

  let mailUid = attributes.uid
  let toMailbox = '[Gmail]/All Mail'
  let filteredData = Object.assign({seqno}, {attributes}, {route}, extractData(mail))
  if(!filteredData.items) {
    console.log("NO RELEVANT DATA FOUND")
    return 
  }
  if(filteredData.from[0].address != "mailer-daemon@googlemail.com") {
    console.log(`[RECEIVED MAIL] received mail from: ${filteredData.from[0].address}`)
    controller.addToRedisQueue(filteredData)
  }
})


function extractData(email) {
  return {
    from: email.from,
    receivedDate: email.receivedDate,
    date: email.date,
    items: parseMessage(email.text),
    subject: email.subject,
  }
}

function markAsSeen(mailUid) {
  console.log('attempting to mark msg read/seen');
  mailListener
    .imap
    .addFlags(mailUid, '\\Seen', function (err) {
      if (err) {
        console.log('error marking message read/SEEN');
        return;
      }
    })
};

function generateName(id, fileName) {
  let newFileName = path.join(id + fileName)
  let absoluteRoute = path.join(directory, newFileName)
  return [absoluteRoute, newFileName]
}

module.exports = mailListener