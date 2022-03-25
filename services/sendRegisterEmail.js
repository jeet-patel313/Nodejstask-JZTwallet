import { createTransport, getTestMessageUrl } from 'nodemailer';

export const sendRegisterEmail = async body => {
  
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
          to: `${body.email}`, // list of receivers
          subject: 'JZTwallet signup confirmation', // Subject line
          text: '', // plain text body
          html: `
            <h2>Hello ${body.name}, 
            <h3>You have successfully signed up for JZTwallet from ${body.email}</h3>
            <h3>You have a signup bonus of $100 in your current JZTwallet.</h3>
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