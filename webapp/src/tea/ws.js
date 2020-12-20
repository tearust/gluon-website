
export default class {
  constructor(url){
    this.url = url;
    this.ws = null;

    this.callback = ()=>{};
  }

  do_action(action){
    this.ws = new WebSocket(this.url);

    this.ws.onopen = (e)=>{
      console.log('websocket connect success');
      // this.ws.send('hello');
      action();
    };

    this.ws.onerror = (e)=>{
      console.log('[error]', e);
    };
    this.ws.onmessage = (e)=>{
      console.log('[message]', e);
      const d = JSON.parse(e.data);
      this.onMessage(d, e);
    };
    this.ws.onclose = (e)=>{
      console.log('[close]', e);
    };

  }

  onMessage(d, e){
    console.log(d);
    if(d.data){
      d = JSON.parse(d.data);
      if(d.result){
        this.callback(true, d.result);
      }
      else{
        this.callback(false, d.error);
      }
      
    }
    else {
      this.callback(false, d.error);
    }
    

    this.close();
    this.ws = null;
  }

  async sendTask(payload){
    
    return new Promise((resolve, reject)=>{
      this.do_action(()=>{
        this.callback = (flag, result)=>{
          if(flag){
            return resolve(result);
          }
          return reject(result);
        };
        this.ws.send(JSON.stringify(payload));
      });

    });
  }

  
  close(){
    this.ws.onclose = ()=>{};
    this.ws.close();
  }
}