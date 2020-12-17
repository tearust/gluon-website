<template>
<div class="c-page">

 
  

  <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 24px 0 40px; margin: 0 auto; max-width: 800px;">
    <h1 style="font-size: 52px; color: #444;font-weight: bold; text-align:center; line-height:60px;">
      Gluon (Distributed hardware wallet)— Yet another crypto wallet? Why? What’s new?
    </h1>
    <p style="font-size: 23px; color: #111; text-align:center; line-height: 28px; margin-top: 15px;">
      
      Gluno is NOT a wallet (although it is called Gluon Wallet), it is actually a <b>Trust-as-a-Service (TaaS)</b> application focus on crypto keys.
    </p>

    <!-- <p class="m-11">
      <el-button  size="large" round style="width: 200px; font-weight: bold; font-size: 21px;" type="success" @click="$router.push('/doc_list')" >Documents</el-button>
      <el-button  size="large" round style="width: 200px; margin-left: 80px; font-weight: bold; font-size: 21px;" type="success" @click="$router.push('/doc_list/Try_the_demo%2FREADME.md')">Demo</el-button>
    </p> -->
    
  </div>

  <div class="c-md">
    <img src="/img/home/1.png" />
    <h1>
      You say “I need a hardware wallet”, I heard “I need some way to protect my private key”
    </h1>
    <p>
      That’s true, you do not need whatever kind of wallet as long as you have a better way to protect your private key.
    </p>
    <p>
      As I mentioned in my previous blog, (I bet you have read already) even a hardware wallet has caveats that put your digital assets at risk. What Gluon provides you is actually a Trust-as-a-Service. The trust comes from thousands of hardware wallets although you do not own them. You do not need to trust the owners of those hardware wallets, because they have no access to your secret, even you do not?
    </p>

    <h1>
      What? I do not even have access to the private key as an owner?
    </h1>
    <p>
      Sorry but you do not. If you really want, you can have a partial key as additional protection (although we do not think it is necessary). Having a full private key in your pocket is actually a bad idea. If you think you have stronger protection than those thousands of hardware wallets, then you probably do not realize what protection means. In my mind, as long as there is a decrypted secret ever expose to any computing device which potentially is able to connect to a network, the secret is no longer secure, unless the device is particularly designed and hardware protected. So I think it would be more secure to generate and store your private key in Gluon all its lifetime. It should never leave the protected environment even when it is used to sign your transaction.
    </p>

    <h1>
      Gluon password is your only master password to the Blockchain World
    </h1>
    <p>
      Since all your private keys to other blockchains are generated and stored inside Gluon, the only thing you need to remember is the Gluon password. It is actually a standard Substrate blockchain private key. You can use a browser extension or whatever software or hardware wallet.
    </p>

    <h1>
      Do not get panic just yet!
    </h1>
    <img src="/img/home/2.jpg" />
    <p>
      I bet you could have a feeling that being cheated because you still have to manage a key to use all your other keys. Sounds like you get a higher risk than before.
    </p>
    <p>
      Do not worry, let me explain.
    </p>
    <p>
      The Gluon password is not the single way of authentication. You can (and you should) config your security settings to add 2FA or 3FA to your Gluon account.
    </p>
    <p>
      Because Gluon is built on top of the TEA project, a so-called “layer-2” solution framework. It can easily be integrated with other modern authentication solutions like OTP, Hardware Authenticator, Bio-ID, etc.
    </p>
    <p>
      When you use Gluon to sign a transaction, based on your reconfiguration, you will be asked to punch your additional authenticator’s one-time passkey, face recognization, fingerprint, voice recognization, etc.
    </p>
    <p>
      Those methods are also used for your Gluon master key recovery along with social recovery. Social recovery means you can preset a few family or friends' accounts. When you lost your Gluon key, you can physically ask them to group sign a transaction to recover your account key.
    </p>
    <p>
      All these authentication or recovery are not done in a traditional centralized way. They are handled in blockchain in a decentralized manner. No one can control or force recover your account, even government enforcement.
    </p>

    <h1>
      Are there actually hardware wallets running in Gluon?
    </h1>
    <p>
      Internally, we do not call them hardware wallets, we call them TEA nodes. We use hardware wallets because it is a common marketing term that everyone understands. Technically TEA node becomes a hardware wallet when the Gluon actor(program) is loaded into it. It is a hardware protected security module (HSM) which the same as hardware wallets.
    </p>

    <h1>
      TEA nodes do not work alone, they work together
    </h1>
    <p>
      The major difference is that TEA nodes cannot work alone, they can only work together with many other TEA nodes to get consensuses on almost everything. Because there are a lot of TEA nodes running 24X7 on the Peer-to-peer network, you can always get your services as you need. Any single TEA node may hold a small portion of your secret that cannot be recovered without consensus with other TEA nodes, so even they are offline, stolen, burned, or hacked, you won’t lose your secret. This is the methodology of blockchain.
    </p>

    <h1>
      In what situation, Gluon can get hacked?
    </h1>
    <p>
      There is no 100% security when you still need a little usability and performance. Just like any Blockchain project, Gluon and other TEA projects can be hacked too. But only under the following condition: (assuming Shamir (k,n) algorithm k = 70, n=100)
    </p>

    <ul>
      <li>Among thousands of TEA nodes (there might be more, let’s assume we have thousands), there are 100 undetermined nodes each holds 1/100 of your private key.</li>
      <li>Hacker happens to hack into 70 TEA nodes of those 100 at the same time and not detected by TEA’s hardware remote attestation consensus</li>
    </ul>

    <p>
      Because the TEA node is a black-box to everyone. No one knows which 100 block boxes among the thousands hold your secret. Hacking into any single hardware protected TEA node is not an easy job, let along there are many different technical stacks used by each TEA nodes. Hackers have to use different tools in every case. It has to be completed successfully in a rather short period of time as the key rotation over time while constant remote attestation may detect the intrusion after a few seconds. I cannot say it is impossible, but I can tell it is very hard and very expensive. As long as it is harder than hacking into your own computer or smartphone, or your hardware wallet, the Gluon is a better choice. right?
    </p>

    <h1>
      Where to get more information about Gluon?
    </h1>
    <p>
      I am working on a separate Gluon Wallet project from the main TEA project website. In the meantime, you can get the basic information from TEA project website: teaproject.org, or the Framework T-rust from t-rust.com. They are actually what Gluon will be running on. Gluon is an application of the T-rust framework by the TEA project team to demonstrate what TEA can do. So if you understand TEA, you would understand Gluon.
    </p>
    <p>
      The future Gluon Wallet website will be gluonwallet.com. I hope to get it to work in a few weeks. Please stay tuned.
    </p>
  </div>


  <!-- <p style="margin-top: 120px;">
    <img src="/img/Trust-construction.png" width="100%"/>
  </p> -->
</div>
</template>
<style lang="scss" scoped>
.c-page{
  .c-text-image{
    margin-top: 90px;
    h2{
      font-size: 32px;
      color: #222222;
      font-weight: bold;
      position: relative;
      margin-bottom: 24px;
    }
    p{
      font-size: 17px;
      color: #333;
    }
    .el-button--primary{
      background: #35a696;
      border-color: #35a696;
    }
    // a{
    //   color: #35a696;
    // }
  }
  .p-t1{
    h2{
      font-size: 30px;
      color: #222222;
      display: inline-block;
      font-weight: 700;
      position: relative;
    }
    p{
      // font-size: 16px;
      // color: #333;
      margin: 10px 0;
    }

    hr{
      margin: 12px 0 20px;
    }
  }

  .c-case{
    margin-top: 120px;
    h4{
      color: #333;
      font-size: 20px;
    }
    h1{
      color: #000;
      font-size: 36px;
      font-weight: bold;
      margin: 15px 0 5px;
    }
    b{
      font-size: 18px;
      color: #444;
    }

    .x-col{
      position: relative;
      min-height: 100px;
      padding-left: 120px;

      .x-1{
        width: 100px;
        height: 100px;
        border-radius: 50px;
        background: rgb(242, 242, 252);
        position: absolute;
        left: 0;
        top: 0;

        i{
          color: #35a696;
          font-size: 42px;
        }
      }

      .x-2{
        padding: 12px 0;
        h4{
          color: #000;
          font-size: 18px;
          font-weight: bold;
        }
        p{
          color: #333;
          font-size: 14px;
          margin: 10px 0 0 0;
        }
      }
    }
  }

  .c-block{
    margin-top: 32px;
    .el-col{
      a{
        border-radius: 12px;
        border: 1px solid #f0f0f5;
        padding: 50px 20px 24px 20px;
        display: block;
        text-align: center;
        cursor: pointer;

        &:hover{
          transform: scale(.96);
        }
        
        h4{
          font-size: 24px;
          font-weight: bold;
          margin-top: 20px;
          color: #333;
        }
        p{
          font-size: 18px;
          margin: 15px 0 0 0;
          color: #444;
        }
      }
      
    }
  }
}

@media screen and (max-width : 600px) {
  .c-page{
    h1{
      font-size: 36px !important;
      line-height: 32px !important;
    }

    p{
      font-size: 24px !important;
    }

    .m-11{
      .el-button{
        width: 100% !important;
        margin: 10px 0 !important;
      }
    }

    .el-row{
      img{
        width: 100% !important;
      }
    }
  }
}
</style>