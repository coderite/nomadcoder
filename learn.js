"use strict";

const uri = 'https://mozilla.org/?x=шеллы';
const eUri = encodeURI(uri);

console.log('raw: ' + uri);
console.log('encoded: ' + eUri);
console.log('decoded: ' + decodeURI(eUri));