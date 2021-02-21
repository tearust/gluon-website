import axios from 'axios';
import _ from 'lodash';
import util from './util';

const SERVER_URL = `http://${location.hostname}:3002`
const BASE_URL = `${SERVER_URL}/api`;
// const BASE_URL = 'http://81.70.96.136:3001/api';

//set request base url
const _axios = axios.create({
  baseURL: BASE_URL,
});

// set request header 
_axios.interceptors.request.use((config)=>{
  const token = util.getCookie('token');
  config.headers['token'] = token;
  return config;
});

// set request response
_axios.interceptors.response.use((res)=>{
  if(res.data){
    if(res.data.code > 0){
      return Promise.resolve(res.data.data);
    }
    else{
      return Promise.reject(res.data);
    }
  }
}, (error)=>{
  return Promise.reject(error);
});


const F = {
  SERVER_URL,
  get_docker_compose(){
    return _axios.get('/tea/get_docker_compose');
  },

  get_doc_list(){
    return _axios.get('/doc/get_list');
  },

  get_doc_content(path){
    return _axios.post('/doc/get_content', {
      path: encodeURIComponent(path)
    });
  },
  get_layer1_info(){
    return _axios.get('/tea/layer1_info');
  }
  
};


export default F;