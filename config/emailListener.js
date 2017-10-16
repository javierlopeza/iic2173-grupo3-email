const MailListener = require("mail-listener2")
const controller = require('../controllers/controller')
const path = require('path')
const fs = require('fs')
const rsender = require('../lib/requestSender')
const msender = require('../lib/emailSender')
const directory = path.join(__dirname, '../attachments')

const mailListener = new MailListener({
  username: process.env.GMAIL_ACCOUNT,
  password: process.env.GMAIL_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  searchFilter: ["UNSEEN"],
  markSeen: false,
  fetchUnreadOnStart: true,
  mailParserOptions: {
    streamAttachments: true
  },
  attachments: true,
  attachmentOptions: {
    directory: directory
  }
})

// start listening
mailListener.start()

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
  let route, fileName
  if (mail.hasOwnProperty("attachments")) {
    let attachment = mail.attachments[0]
      [route, fileName] = generateName(attachment.contentId, attachment.generatedFileName)
  } else {
    route = ""
  }

  let mailUid = attributes.uid
  let toMailbox = '[Gmail]/All Mail'
  let filteredData = Object.assign(seqno, attributes, route, extractData(mail))

  controller.addToRedisQueue(filteredData)
})

mailListener.on("attachment", function (attachment, mail) {
  let [route, fileName] = generateName(attachment.contentId, attachment.generatedFileName)
  let output = fs.createWriteStream(route)
  attachment
    .stream
    .pipe(output)
  let logger = () => {
    console.log('File ' + attachment.fileName + " saved at: " + route)
  }
  attachment
    .stream
    .on('end', logger);
})

function extractData(email) {
  return {
    from: email.from,
    receivedDate: email.receivedDate,
    date: email.date,
    text: email.text,
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