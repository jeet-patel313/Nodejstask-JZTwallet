import Transfer from '../models/Transfer.js';

export const fetchAllData = async (req, res) => {
    try {
        const transfer = await Transfer.find();
        const testtransfer = transfer.map(({ details }) => details);
        return testtransfer;
      }
      catch (err) {
        return err;
      }
}