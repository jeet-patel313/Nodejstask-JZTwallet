import { transferValidation } from '../validation.js';
import { tokenDecode } from '../services/jwtDecode.js';
import { fetchData } from '../services/fetchData.js';
import { fetchAllData } from '../services/fetchAllData.js';
import { checkUser } from '../services/checkUser.js';
import { checkBalance } from '../services/checkBalance.js';
import { updateTransfer } from '../services/updateTransfer.js';


//new fetches all the transactions
export const getAllTransaction = async (req, res) => {
  //fetch the decoded the token: will give us if the user is admin or not
  const decoded = await tokenDecode(req);

  // console.log(isAdmin);
  if (decoded.isAdmin === true) {
    const test = await fetchAllData();
    return res.status(200).send(test);
  }

  //if the user logged in is not Admin
  return res.status(403).send('Access Denied. You are not an Admin user'); 
}

//fetches user specific transactions
export const getTransaction = async (req, res) => {

  //provides decoded jwt token
  const decoded = await tokenDecode(req);

  //user is not Admin
  if (decoded.isAdmin === false) {
  
    //if user is requesting his own email transaction details
    if (decoded.email === req.params.postId) {

      //fetch data
      const transactionOne = await fetchData(req.params.postId);
    
      return res.status(200).send(transactionOne);
    } 
    else {
      return res
        .status(403)
        .send(
          "Access Denied.. You cannot access someone else's transaction details"
        );
    }
  }

  //if user is admin provide the response
  else {
    const transactionOne = await fetchData(req.params.postId);

    return res.status(200).send(transactionOne);
  }
}

//transfer functionality
export const transferAmount = async (req, res) => {

  const { error } = transferValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check whose _id is present in the token and find the email from DB
  const transferFrom = await checkUser(req.user.email);  
  if (transferFrom === null)
    return res.status(404)
      .send(
        'No wallet is associated with the email address you want to transfer funds from.'
      );

  //check if the recepient email address is present in the DB  
  const transferTo = await checkUser(req.body.transferTo);
  if (transferTo === null)
    return res.status(404)
      .send(`
        No JZTwallet is associated with the entered email address!
        Hence, the transaction failed.
        `);

  //fetching the amount from the body
  const transferAmt = req.body.transferAmt;
  
  //check if the recepient email address isn't same as the sender's email address
  if (transferFrom.email === transferTo.email)
    return res.send(
      'TransferFrom address cannot be same as TransferTo address'
    );

  //check if sufficient balance is present for the transfer or not
  const balanceSufficient = await checkBalance(req.body.transferAmt, transferFrom.balance);

  //if balance not sufficient to process the transaction
  if (balanceSufficient === false) {
    //update transfer DB
    const updateTransaction = await updateTransfer(transferAmt, transferFrom, transferTo, balanceSufficient);

    return res.status(505).send(`
      Transaction Failed !!!
      Transfer amount ${req.body.transferAmt} exceeds the current balance of ${transferFrom.balance}.
    `);
  }


  //if balance is sufficient to process the transaction
  if (balanceSufficient === true) {
    //update transfer DB
    const updateTransaction = await updateTransfer(transferAmt, transferFrom, transferTo, balanceSufficient);
   
      //response
    return res.status(200).send(`
          Transaction completed successfullly!! 
          Transfer amount ${transferAmt} is transfered from ${transferFrom.email} to ${transferTo.email} successfully.
          New balance in ${transferTo.email} wallet is ${transferTo.balance}
          New balance in ${transferFrom.email} wallet is ${transferFrom.balance}
          `);
    } 
}