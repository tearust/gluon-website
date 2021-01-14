const set = (val)=>{
  return 'app/user/'+val;
}


export default {
  'set_layer1_account': set('set_layer1_account'),
  'set_pair_info': set('set_pair_info'),

  'set_qrcode': set('set_qrcode'),

  'set_encrypted_password': set('set_encrypted_password'),
};