import Transfer from '../models/Transfer.js';

export const fetchData = async (id, req, res) => {
    
    try {
        const transfersent = await Transfer.find({
        $or: [
            {
            senderEmail: id,
            },
            {
            receiverEmail: id,
            },
        ],
        });
        const transactionOne = transfersent.map(({ details }) => details);
        
        return transactionOne;
    }
    catch (err) {
        return err;
    }
}