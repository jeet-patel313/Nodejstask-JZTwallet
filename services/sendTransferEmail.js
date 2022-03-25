import { createTransport, getTestMessageUrl } from 'nodemailer';

export const sendTransferEmail = async (fromEmail, toEmail, messagebody) => {
  
     //send email
     try {
        // create reusable transporter object using the default SMTP transport
        let transporter = createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER, // generated ethereal user
            pass: process.env.GMAIL_PASS, // generated ethereal password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"JZTwallet" <idjot911@gmail.com>', // sender address
          to: `${toEmail}, ${fromEmail}`, // list of receivers
          subject: 'Transaction Failed', // Subject line
          text: '', // plain text body
          html: `
                    <h3>${messagebody}</h3>
                    <h3>Reason: Insufficient funds to process the transaction.</h3>
                    <h3>Thanks for using JZTwallet!!</h3>
                    Use JZTwallet for more rewards!!
                    `, // html body
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', getTestMessageUrl(info));
      } catch (e) {
        console.log(e);
      }
}