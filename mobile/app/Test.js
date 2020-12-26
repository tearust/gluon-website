import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default class Test extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={{color:'#141823'}}>Polkadot</Text>
                <View style={{marginTop:100,width:100,height:100,backgroundColor:'red'}}></View>
            </View>
        )
    }
    componentDidMount() {

        this.getAddress();

        this.getConnect();

        // this.testTransfer();

    }
    //根据助记词生成地址
    getAddress(){
        const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });
        const mnemonic = mnemonicGenerate();
        // create & add the pair to the keyring with the type and some additional
        // metadata specified
        const pair = keyring.addFromUri(mnemonic, { name: 'first pair' }, 'ed25519');
        // the pair has been added to our keyring
        console.log('polkadot:',keyring.pairs.length, 'pairs available');
        // log the name & address (the latter encoded with the ss58Format)
        console.log('polkadot:',pair.meta.name, 'has address', pair.address);
    }
    //连接
    async getConnect(){
        // Initialise the provider to connect to the local node
        const provider = new WsProvider('ws://81.70.96.136:9944');

        // Create the API and wait until ready
        const api = await ApiPromise.create({ provider });

        // Retrieve the chain & node information information via rpc calls
        const [chain, nodeName, nodeVersion] = await Promise.all([
            api.rpc.system.chain(),
            api.rpc.system.name(),
            api.rpc.system.version()
        ]);

        console.log(`polkadot:You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
    }
    //交易
    async testTransfer(){
        const ALICE = '5Egz9gfXcziPsmtNenPRjpYoXEbLUHLrUuu3MVXYtZYsiuBn';
        const TO = '5FeHTJuGfRCFjaUCAhaSSXUwxRnhEKTwAT7daVb8PTvz4cdU';
        const menmeonic = 'park catalog vague woman extra swear ginger fat truth seed rare novel';

        const AMOUNT = 10000000000;
        // Create the API and wait until ready
        // const api = await ApiPromise.create();
        const provider = new WsProvider('ws://10.200.79.72:10032');

        // Create the API and wait until ready
        const api = await ApiPromise.create({ provider });

        // Create an instance of our testing keyring
        // If you're using ES6 module imports instead of require, just change this line to:
        // const keyring = testKeyring();
        // const keyring = testKeyring.default();
        const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

        // Get the nonce for the admin key
        const { nonce } = await api.query.system.account(ALICE);

        // Find the actual keypair in the keyring
        // const alicePair = keyring.getPair(ALICE);
        const alicePair = keyring.addFromUri(menmeonic, { name: 'first pair' }, 'sr25519');

        // Create a new random recipient
        // const recipient = keyring.addFromSeed(randomAsU8a(32)).address;

        console.log('Sending', AMOUNT, 'from', alicePair.address, 'to', 'recipient', 'with nonce', nonce.toString());

        // Do the transfer and track the actual status
        api.tx.balances
            .transfer(TO, AMOUNT)
            .signAndSend(alicePair, { nonce }, ({ events = [], status }) => {
                console.log('Transaction status:', status.type);

                if (status.isInBlock) {
                    console.log('Included at block hash', status.asInBlock.toHex());
                    console.log('Events:');

                    events.forEach(({ event: { data, method, section }, phase }) => {
                        console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                    });
                } else if (status.isFinalized) {
                    console.log('Finalized block hash', status.asFinalized.toHex());

                    // process.exit(0);
                }
            });
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        height: 400,

    },
});
