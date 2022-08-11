import crypto from 'crypto';
import CryptoJS from 'crypto-js';

// Difining algorithm
// const algorithm = 'aes-256-cbc';

// // Defining key
// const key = crypto.randomBytes(32);

// // Defining iv
// const iv = crypto.randomBytes(16);

// An encrypt function
export function encrypt(text) {

    var ciphertext = CryptoJS.AES.encrypt(text, 'my-secret-key@123').toString();
    console.log(ciphertext)
    //var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return ciphertext
    //return ciphertext
}

// A decrypt function
export function decrypt(text) {

    var bytes = CryptoJS.AES.decrypt(text.toString(), 'my-secret-key@123').toString(CryptoJS.enc.Utf8);
    // console.log('bytes', bytes)
    // console.log('text', text)
    // console.log(typeof (text))

    return bytes

}
