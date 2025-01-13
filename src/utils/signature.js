const CryptoJS = require('crypto-js');
const generateNonce = () => 
{
    return CryptoJS.lib.WordArray.random(16).toString();
};
    
const generateSignature = (nonce, timestamp, queryParams, body = '' , API_KEY, API_SECRET) => 
{
    const sortedQueryParams = Object.keys(queryParams)
        .sort()
        .map(key => `${ key }${ queryParams[key] }`)
        .join('');
    
    const compressedBody = body ? JSON.stringify(body).replace(/\s+/g, '') : '';
    
    const digest = CryptoJS.SHA256(
        nonce + timestamp + API_KEY + sortedQueryParams + compressedBody
    ).toString(CryptoJS.enc.Hex);
    
    return CryptoJS.SHA256(digest + API_SECRET).toString(CryptoJS.enc.Hex);
};

module.exports = { generateNonce, generateSignature };