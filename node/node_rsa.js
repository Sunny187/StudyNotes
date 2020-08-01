const RSA = require ("node-rsa") ;

function getPublicKey () {
    return new RSA ({b:512}) ;
}

function encrypt (key , text) {
    return key.encrypt (text , "base64") ;
}

function decrypt (key , decryptText) {
    return key.decrypt (decryptText , "utf-8") ;
}

function test () {
    let key = getPublicKey () ;
    let text = "HelloRSA" ;
    let encryptText = encrypt (key , text ) ;
    console.log ("密文为: " , encryptText ) ;
    let decryptText = decrypt (key , encryptText ) ;
    console.log ("明文为: " , decryptText ) ;

}
test();