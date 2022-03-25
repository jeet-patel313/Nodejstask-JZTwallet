import jwt_decode from 'jwt-decode';

export const tokenDecode = async (req, res) => {
    const token = req.header('auth-token');
    const decoded = jwt_decode(token);

    // console.log(decoded.isAdmin);
    return decoded;
}