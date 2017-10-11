const MailListener = require("mail-listener2")
const controller = require('../controllers/controller')

const mailListener = new MailListener({
    username: process.env.GMAIL_ACCOUNT,
    password: process.env.GMAIL_PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    searchFilter: ["UNSEEN"],
    markSeen: true,
    fetchUnreadOnStart: true,
    mailParserOptions: {
        streamAttachments: true
    },
    attachments: true,
    attachmentOptions: {
        directory: "../attachments/"
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
    // console.log("emailParsed", mail)
    let mailUid = attributes.uid,
        toMailbox = '[Gmail]/All Mail',
        filteredData = {
            seqno: seqno,
            attributes: attributes,
            from: mail.from,
            receivedDate: mail.receivedDate,
            date: mail.date,
            text: mail.text,
            subject: mail.subject
        }
    // console.log(filteredData)
    controller.addToRedisQueue(filteredData)
    // markAsSeen(mailUid);
})

mailListener.on("attachment", function (attachment) {
    console.log("Attachment handler")
    // console.log(attachment)
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

module.exports = mailListener