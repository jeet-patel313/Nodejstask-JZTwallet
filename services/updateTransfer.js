import { sendTransferEmail } from "./sendTransferEmail.js";
import Transfer from '../models/Transfer.js';
import User from '../models/User.js';

export const updateTransfer = async (amt, transferFrom, transferTo, success) => {
    if (success === false) {
        const messagebody = `Transaction of ${amt} from ${transferFrom.email} to ${transferTo.email} has been failed`;
        const message = `
          Transaction Failed !!!
          Transfer amount ${amt} exceeds the current balance of ${transferFrom.balance}.
          `;
        const transfer = new Transfer({
            senderEmail: transferFrom.email,
            receiverEmail: transferTo.email,
            details: messagebody,
          });
        
        try {
            //update DB
            const savetransfer = await transfer.save();
    
            const email = await sendTransferEmail(transferFrom.email, transferTo.email, messagebody);
    
           
          return messagebody;
        } 
        catch (err) {
            return err;
        }
        
    }


    else {
        const messagebody = `Transaction of ${amt} from ${transferFrom.email} to ${transferTo.email} has been successful`;
        const message = `
        Transaction completed successfullly!! 
        Transfer amount ${amt} is transfered from ${transferFrom.email} to ${transferTo.email} successfully.
        New balance in ${transferTo.email} wallet is ${transferTo.balance}
        New balance in ${transferFrom.email} wallet is ${transferFrom.balance}
        `;
      
        //update balance of sender
    transferFrom.balance -= amt;
    //update balance of receiver
    transferTo.balance += parseFloat(amt);



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
      return err;
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
      return err;
    }

    const transfer = new Transfer({
      senderEmail: transferFrom.email,
      receiverEmail: transferTo.email,
      details: messagebody,
    });
    try {
      const savetransfer = await transfer.save();

      //send email
      const email = await sendTransferEmail(transferFrom.email, transferTo.email, messagebody);

      return messagebody;
     
    } catch (err) {
      return err;
    }

    } 
}