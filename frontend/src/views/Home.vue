<template>
<div class="c-page">

 
  

  <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 24px 0 40px; margin: 0 auto; max-width: 800px;">
    <h1 style="font-size: 52px; color: #444;font-weight: bold; text-align:center; line-height:60px;">
      Gluon 
    </h1>
    <p style="font-size: 23px; color: #111; text-align:center; line-height: 28px; margin-top: 15px;">
      Decentralized Hardware Crypto Wallet Services. <br/>
      Never lost or leak your private keys again!
      
    </p>

    <!-- <p class="m-11">
      <el-button  size="large" round style="width: 200px; font-weight: bold; font-size: 21px;" type="success" @click="$router.push('/doc_list')" >Documents</el-button>
      <el-button  size="large" round style="width: 200px; margin-left: 80px; font-weight: bold; font-size: 21px;" type="success" @click="$router.push('/doc_list/Try_the_demo%2FREADME.md')">Demo</el-button>
    </p> -->
    
  </div>

  <div class="c-md">
    <h1>
      Leaking or losing private keys are the primary concerns of most blockchain users. Gluon uses a new approach to prevent such issues.
    </h1>
    <img src="http://teaproject.org:3001/res/blog/0_0bAHj5-yVwAyoZTJ.png"/>
    <p>
      More than US$11 billion has been stolen from supposedly secure crypto exchanges, wallets and mining platforms, mostly due to hacking incidents, between 2011-2020. A cryptocurrency analyst, Timothy Peterson claims that 1,500 bitcoins are lost each day.
    </p>
    <p>This means only a small group of people have the experience to comfortably manage their private keys, and key management stands as a barrier for average users to interact with blockchains. 
      A popular solution is hardware wallets. It is more secure than any online software wallets but you still take responsibility to backup and store your mnemoninc phrases which is used to restore your private key in case of lost the hardware wallets. This cause another issue, whoever steal the mnemonic phrase can actually steal your cryptocurrency. Well, this is your responsibility too.
    </p>
    <h1>
      Gluon is NOT a hardware wallet, it is a blockchain powered TaaS(Trust as a Service) so that you do not need to own one 
    </h1>
    <img src="/img/home/1.png" />
    <p>
      Gluon is a TaaS (Trust-as-a-Service) application that provides hardware crypto wallet services to crypto users. Our main goal is to create an all-in-one private key manager for MultiSig-enabled blockchains.
    </p>
<h1>
Features:
</h1>
<ul>
<li>Passwordless; users won't have to take responsibility for backup mnemonic phrases.</li>
<li>
Social disaster recovery is available for users who have lost all their authentication devices.
</li>
<li>
Private keys managed by Gluon over the TEA network are randomly distributed and encrypted by TEA Nodes, which are hardware secure modules (HSM); it is a no-fail process.
</li>
<li>
Tolerance of up to 1/3 compromised or failure nodes.
</li>
<li>

Users only need to submit a transaction to Gluon and it will take over signing and committing blockchain.
</li>
<li>
Leverages popular biometric technologies in mobile devices to attain better user experiences without compromising security.
</li>
</ul>
<p>
    <h1>
How private keys are protected by Gluon
    </h1>
<p>By default, Gluon generates 2/3 MultiSig addresses for users. The three private keys (secret) are called P1, P2, and P3. P1 is stored in the users' mobile phone, while P2 and P3 are controlled by Gluon consensuses. They are immediately split into pieces using Shamir Secure Sharing Schema right after generation. The split pieces are distributed to replicas of many TEA Nodes. TEA nodes are HSM (Hardware Secure Module). One can consider commonly used hardware wallets as special-purpose HSM, but TEA nodes are a general-purpose HSM that can do much more. The secret will never be exposed outside of hardware-protected TEA node's RAM, nor saved to any storage medias persistently. When the secret is used to sign a transaction from authorized users, it will be reconstructed and signs transactions inside a VRF selected TEA node under both hardware protection and remote attestations from a consensus called Proof of Trust (PoT). Due to the randomness, no one will ever know which TEA node stores which Shamir pieces of which secret. No one can predict which TEA node will be selected or is working on generating or rebuilding the secret. The randomness can be verified by other TEA nodes or substrate-runtime logic at both runtime and future audits.
</p>


<p>
P2 and P3 are all controlled by Layer1 (a Substrate blockchain) runtime logic. Among them, P2 is associated with the users' 2FA. We are using the Polkadot web extension at the moment. P3 is associated with a users' social recovery account but is only used to recover assets when users lose P1. (Users can only store P1 on their phones, so P1 is the only key that could be lost). This means users can assign friends as "social recovery accounts." If K of N accounts sign the "recovery transaction," P3 will be used along with P2 to transfer user assets to their new account.
</p>

<p>
P1 is stored in the users' Gluon mobile app. P1 will never be exposed beyond the phone even when upgrading devices. However, Gluon doesn't require users to take responsibility to backup mnemonic phrases. When upgrading to a new phone, the Gluon app can transfer P1 securely to the new device without exposing it to the network. If users lose their phones, there is no way to restore P1 because there are no backup mnemonic phrases. Losing or the leak of P1 does not lead to a loss of assets, as one can use P2+P3 for recovery and bad actors would need two keys to access assets in the case of a leak. As mentioned above, Gluon can transfer all assets to one's new account by running a social recovery process.
</p>
    <img src="https://camo.githubusercontent.com/3e0b9872b934e7a5045d4b0b329c32f9042e214f26ad2133ff0bc0608fabd293/68747470733a2f2f6d69726f2e6d656469756d2e636f6d2f6d61782f3737302f312a5a69796265496c73645a736d5a56367a3078315341512e706e67" />
<h1>
  Sidetrack: What is Gluon in physics.
</h1>
<p>From Wikipedia

A gluon (/ˈɡluːɒn/) is an elementary particle that acts as the exchange particle (or gauge boson) for the strong force between quarks. It is analogous to the exchange of photons in the electromagnetic force between two charged particles.[6] In layman’s terms, they “glue” quarks together, forming hadrons such as protons and neutrons. In technical terms, gluons are vector gauge bosons that mediate strong interactions of quarks in quantum chromodynamics (QCD). Gluons themselves carry the color charge of the strong interaction. This is unlike the photon, which mediates the electromagnetic interaction but lacks an electric charge. Gluons therefore participate in the strong interaction in addition to mediating it, making QCD significantly harder to analyze than quantum electrodynamics (QED).

</p>
<p>I am not a physician, you probably are not either. We do not have to understand all of the concepts, we only need to believe one thing the “Strong interactions” is the most strong force in the universe.
</p>
<p>
From Wikipedia</p>
<p>

In nuclear physics and particle physics, the strong interaction is the mechanism responsible for the strong nuclear force, and is one of the four known fundamental interactions, with the others being electromagnetism, the weak interaction, and gravitation. At the range of 10−15 m (1 femtometer), the strong force is approximately 137 times as strong as electromagnetism, a million times as strong as the weak interaction, and 1038 times as strong as gravitation.[1] The strong nuclear force holds most ordinary matter together because it confines quarks into hadron particles such as the proton and neutron. In addition, the strong force binds these neutrons and protons to create atomic nuclei. Most of the mass of a common proton or neutron is the result of the strong force field energy; the individual quarks provide only about 1% of the mass of a proton.

We want to build the wallet as strong as atomic nuclei that bound by Gluon.
</p>
<h1>The balance between security and ease of use</h1>
<p>There is always a trade-off between security and ease of use.</p>
<img src="http://teaproject.org:3001/res/blog/1_J9LMh0dB-h6P_e7-C1ntLQ.png"/>
<p>
  Gluon Wallet sits on the sweet spot that can bring strong security yet ease of use as if it was a centralized service.
</p>
<p>
  Because it is decentralized, you do not have to trust anyone. The only two things you need to trust is math (blockchain) and physics(semiconductor technology). No one, including the builder of Gluon Wallet, the framework developer, the owners of those TEA nodes, or even the government, has the superpower to control over the peer to peer network. None of them has your secret either.

</p>
<p>
  Because T-rust is a layer-2 solution, many traditional ease-of-use solutions from the internet era also apply here, such as 2FA, Bio-ID, social recovery, etc. However, they are handled in a decentralized manner, not as centralized as they were in the Internet era. Again, no one has control but yourself over your assets.
</p>
<h1>The Single-Sign-On entrance to the decentralized world
</h1>
<p>Many internet users like me can hardly remember all the different passwords from all websites, we use some utility like OnePassword to help us to manage passwords. As far as I know, there is no such tool in the blockchain world yet. Gluon Wallet probably is the first one to let you “single-sign-on” (SSO) to other blockchain portal using one universe master password. You can create and store all your private keys to other blockchains inside Gluon Wallet. You only need one Gluon Wallet private key as mater key, then Gluon Wallet can sign transactions for you as if it is your personal hardware wallet, just never loss, never broken.

</p>
<p>
Since the single master key becomes important than ever, we can use additional authentications such as traditional 2FA, 3FA, Bio ID, Social Recovery, etc to protect you. You can configure based on your risk tolerance level and convenience. You are the boss, you make the call.
</p><p>
So Gluon Wallet could become the single entrance or portal of the upcoming blockchain era, like Google to the internet era.
</p>
<h1> Workflow</h1>
<img src="https://github.com/tearust/gluon-docs/raw/master/res/typical-workflow.png?raw=true"/>
<p>The diagram above shows a typical UI workflow, which is signing a BTC transaction.
</p><p>
Users start a task from the web browser. It could be the Gluon web portal or any dApps' website embedded with our js API. A hash of the transaction detail is sent to Gluon TeaLeaf. A QR code is shown on the web page for the paired Gluon mobile app to scan.

</p><p>
After scanning the QR code, the Gluon mobile app shows the transaction's detail for users to confirm visually. Users approve this transaction by fingerprinting. If there is an additional 2FA (MFA) applied, the passcode should then be entered.
</p><p>

Gluon mobile app partially signs the transaction using P1. Both the signature and transaction details are sent to Gluon TeaLeaf to continue.
</p><p>

Gluon TeaLeaf takes over the rest of the task by reconstructing P2 and signing. Finally, Gluon TeaLeaf sends the signature by P1 and P2 to Bitcoin light node to complete the transaction.
</p><p>

Both the web UI and the mobile app will receive the event of a completed task.
</p><p>

All other tasks are pretty much the same workflow.
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