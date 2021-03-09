import * as hmac from 'crypto-js/hmac-sha1'
import * as aes from 'crypto-js/aes';
import * as utf8 from 'crypto-js/enc-utf8'
import * as forge from 'node-forge';

const secret = process.env.APP_SECRET || 'gluon';

export default {
  sha(str: string){
    return hmac(str, secret).toString()
  },
  encrypt(str: string){
    return aes.encrypt(aes.encrypt(str, secret).toString(), secret).toString()
  },
  decrypt(str: string){
    return aes.decrypt(aes.decrypt(str, secret).toString(utf8), secret).toString(utf8)
  },

  create_ed25519_keypair(){
    const ed25519 = forge.pki.ed25519;
    const seed = forge.random.getBytesSync(32);
    const keypair = ed25519.generateKeyPair({seed: seed});

    return {
      pub: forge.util.bytesToHex(keypair.publicKey),
      pri: forge.util.bytesToHex(keypair.privateKey),
    }
  }
}