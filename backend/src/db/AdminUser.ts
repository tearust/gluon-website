import Base from './Base';

export default class extends Base {
    protected getSchema(){
        return {
            username : {
                type : String,
                required: true,
                unique : true,
            },
            password : {
                type : String,
                required : true,
            },
            token: String,
        };
    }
    protected getName(){
      return 'admin_users'
    }
    protected rejectFields(){
        return {
            password : false,

        };
    }
}