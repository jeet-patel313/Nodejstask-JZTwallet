export const checkBalance = async (amt, balance) => {
    if (amt > balance) {
        return false;
    }
    else {
        return true;
    }
}