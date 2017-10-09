from flask import Flask, render_template
from flask_mail import Mail, Message

app = Flask(__name__)

app.config.update(
    DEBUG=True,
    # EMAIL SETTINGS
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME='grupo3mailer@gmail.com',
    MAIL_PASSWORD='arquisoftware'
    )

mail = Mail(app)


@app.route('/')
def index():
    return "Welcome"


@app.route('/send_mail')
def send_mail():
    msg = Message(
        'Hello',
        sender='grupo3mailer@gmail.com',
        recipients=['grupo3mailer@gmail.com'])
    msg.body = "This is the email body"
    # msg.html = render_template()
    mail.send(msg)
    return "Sent"


if __name__ == '__main__':
    app.run(debug=True)
