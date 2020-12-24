const set = (val)=>{
  return 'app/user/'+val;
}


export default {
  'LOGIN': set('login'),
  'LOGOUT': set('logout')
};