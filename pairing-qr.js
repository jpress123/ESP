/* QR images are generated locally. Never send a private pairing URL to a QR service. */
(function(root){
const encoder=typeof module!=='undefined'&&module.exports?require('./vendor/qrcode-generator-1.4.4.js'):root.qrcode;
function link(secret){if(!/^[A-Za-z0-9_-]{43}$/.test(secret))throw Error('Invalid pairing key');return 'https://www.josephpress.com/ESP/geometry-exam.html#sync='+secret}
function matrix(secret){const qr=encoder(0,'M');qr.addData(link(secret),'Byte');qr.make();return qr}
function svg(secret){return matrix(secret).createSvgTag({cellSize:4,margin:16,scalable:true})}
root.PairingQR={link,matrix,svg};if(typeof module!=='undefined'&&module.exports)module.exports=root.PairingQR;
})(typeof globalThis!=='undefined'?globalThis:this);
