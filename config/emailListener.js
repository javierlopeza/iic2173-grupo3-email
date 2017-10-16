const MailListener = require("mail-listener2")
const controller = require('../controllers/controller')
const path = require('path')
const fs = require('fs')
const rsender = require('./requestSender') 
const msender = require('./emailSender')
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
    let route,
        fileName
    if(mail.hasOwnProperty("attachments")) {        
        [route, fileName] = generateName(mail.attachments[0].contentId, mail.attachments[0].generatedFileName)
    } else {
        route = ""
    }
    
    let mailUid = attributes.uid,
        toMailbox = '[Gmail]/All Mail',
        filteredData = {
            seqno: seqno,
            attributes: attributes,
            from: mail.from,
            receivedDate: mail.receivedDate,
            date: mail.date,
            text: mail.text,
            subject: mail.subject,
            filePath: route
        }
    controller.addToRedisQueue(filteredData)
})

mailListener.on("attachment", function (attachment, mail) {
    let route,
        fileName
    [route, fileName] = generateName(attachment.contentId, attachment.generatedFileName)
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