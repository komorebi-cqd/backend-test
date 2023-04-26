import crypto from 'crypto';

const SECRET = 'KOMOREBI'

// https://nodejs.cn/api/crypto.html#cryptorandombytessize-callback
export const random = () => crypto.randomBytes(128).toString('base64');

//https://nodejs.cn/api/crypto.html#crypto
export const authentication = (salt: string, passowrd: string) => {
    return crypto.createHmac('sha256',[salt,passowrd].join('/')).update(SECRET).digest('hex');  
}