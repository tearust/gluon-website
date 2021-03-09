import * as mongoose from 'mongoose';
import AdminUser from './AdminUser';

import {crypto} from '../utility';

export default class {
    protected db: any;
    public connection;

    constructor(){
        this.db = {};
    }

    public isConnected(): boolean{
        return this.connection && this.connection.readyState === 1;
    }

    public async start(){
        const url = process.env.MONGO_URL;

        mongoose.set('useCreateIndex', true)
        const db = await mongoose.createConnection(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.connection = db;

        // Setup callback
        this.connection.on('error', this.handleDBError);

        this.connection.on('disconnected', this.handleUnexpectedDisconnect);

        this.connection.on('reconnected', function () {
            console.log('MongoDB reconnected!');
        });

        this.initDB(db);
    

        await this.prepareRecord();

        return db;
    }

    private handleDBError() {

        return (error: any) => {

            console.log('Error is happenning', error);
        };
    }

    private handleUnexpectedDisconnect() {

        console.log('handleUnexpectedDisconnect')

        return (error: any) => {

            console.error('mongodb is disconnect', error);
            setTimeout(() => {
                this.start();
            }, 5000);
        };
    }

    public disconnect() {
        mongoose.connection.close()
    }


    private initDB(db){
        this.db.AdminUser = new AdminUser(db);
        
    }

    public getModel(name: string){
        const rs = this.db[name];
        if(!rs){
            throw new Error('invalid model name : '+name);
        }
        return rs;
    }

    async prepareRecord(){
        const doc: any = {
            username: process.env.ADMIN_USERNAME,
            password: crypto.sha(process.env.ADMIN_PASSWORD),
        }
        console.log('admin user', doc);

        const one = await this.db.AdminUser.findOne({username: doc.username});

        doc.token = crypto.sha(doc.username+doc.password);
        if(one){
            await this.db.AdminUser.update({username: doc.username}, doc);
        }
        else{
            await this.db.AdminUser.save(doc);
        }
    }

    
}