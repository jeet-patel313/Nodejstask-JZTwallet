import User from '../models/User.js';
import Transfer from '../models/Transfer.js';
import { transferValidation } from '../validation.js';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import jwt_decode from 'jwt-decode';

//fetches all the transactions
export async function getAllTransaction(req, res) {
  const token = req.header('auth-token');
  const decoded = jwt_decode(token);

  //if the user logged in is Admin
  if (decoded.isAdmin === true) {
    try {
      const transfer = await Transfer.find();
      const testtransfer = transfer.map(({ details }) => details);
      return res.json(testtransfer);
    } catch (err) {
      return res.json({ message: err });
    }
  }

  //if the user logged in is not Admin
  return res.status(403).send('Access Denied. You are not an Admin user');
}

//fetches user specific transactions
export async function getTransaction(req, res) {
  const token = req.header('auth-token');
  const decoded = jwt_decode(token);

  //user is not Admin
  if (decoded.isAdmin === false) {
    //requesting his own email details
    if (decoded.email === req.params.postId) {
      try {
        const transfersent = await Transfer.find({
          $or: [
            {
              senderEmail: req.params.postId,
            },
            {
              receiverEmail: req.params.postId,
            },
          ],
        });
        const transactionOne = transfersent.map(({ details }) => details);
        return res.json(transactionOne);
      } catch (err) {
        return res.json({ message: err });
      }
    } else {
      return res
        .status(403)
        .send(
          "Access Denied.. You cannot access someone else's transaction details"
        );
    }
  }

  //if user is admin provide the response
  else {
    try {
      const transfersent = await Transfer.find({
        $or: [
          {
            senderEmail: req.params.postId,
          },
          {
            receiverEmail: req.params.postId,
          },
        ],
      });
      const transactionOne = transfersent.map(({ details }) => details);
      return res.json(transactionOne);
    } catch (err) {
      return res.json({ message: err });
    }
  }
}

//transfer functionality
export async function transferAmount(req, res) {
  //check whose _id is present in the token and find the email from DB
  const transferFrom = await User.findOne({ _id: req.user });
  console.log(transferFrom);
  if (transferFrom === null)
    return res
      .status(404)
      .send(
        'No wallet is associated with the email address you want to transfer funds from.'
      );

  //check if the recepient email address is present in the DB
  const { error } = transferValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const transferTo = await User.findOne({ email: req.body.transferTo });
  if (transferTo === null)
    return res.send(`
        No JZTwallet is associated with the entered email address!
        Hence, the transaction failed.
        `);

  //check if the recepient email address isn't same as the sender's email address
  if (transferFrom.email === transferTo.email)
    return res.send(
      'Transfer from address cannot be same as Transfer to address'
    );

  //check if sufficient balance is present for the transfer or not
  const transferAmt = req.body.transferAmt;

  //if balance not sufficient to process the transaction
  if (transferAmt > transferFrom.balance) {
    const messagebody = `Transaction of ${transferAmt} from ${transferFrom.email} to ${transferTo.email} has been failed`;

    const transfer = new Transfer({
      senderEmail: transferFrom.email,
      receiverEmail: transferTo.email,
      details: messagebody,
    });

    try {
      const savetransfer = await transfer.save();

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
          to: `${transferFrom.email}`, // list of receivers
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
      return res.send(`
            Transaction Failed !!!
            Transfer amount ${transferAmt} exceeds the current balance of ${transferFrom.balance}
            `);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //if balance is sufficient to process the transaction
  if (transferAmt <= transferFrom.balance) {
    //update balance of sender
    transferFrom.balance -= transferAmt;
    //update balance of receiver
    transferTo.balance += parseFloat(transferAmt);

    //save the balance in the DB
    try {
      const updateDb = await User.updateOne(
        { _id: transferFrom._id },
        {
          $set: {
            balance: transferFrom.balance,
          },
        }
      );
    } catch (err) {
      res.json({ message: err });
    }

    try {
      const updateDb2 = await User.updateOne(
        { _id: transferTo._id },
        {
          $set: {
            balance: transferTo.balance,
          },
        }
      );
    } catch (err) {
      res.json({ message: err });
    }

    const messagebody = `Transaction of ${transferAmt} from ${transferFrom.email} to ${transferTo.email} has been successful`;

    const transfer = new Transfer({
      senderEmail: transferFrom.email,
      receiverEmail: transferTo.email,
      details: messagebody,
    });

    try {
      const savetransfer = await transfer.save();

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
          to: `${transferFrom.email}, ${transferTo.email}`, // list of receivers
          subject: 'Transaction Successful', // Subject line
          text: '', // plain text body
          html: `
                    <h3>${messagebody}</h3>
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

      //response
      return res.send(`
            Transaction completed successfullly!! 
            Transfer amount ${transferAmt} is transfered from ${transferFrom.email} to ${transferTo.email} successfully.
            New balance in ${transferTo.email} wallet is ${transferTo.balance}
            New balance in ${transferFrom.email} wallet is ${transferFrom.balance}
            `);
    } catch (err) {
      res.status(400).send(err);
    }
  }
}