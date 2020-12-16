import Base from '../Base';
import login from './login';
import checkLogin from './checkLogin';
import logout from './logout';
/**
 * configure the path of interface in order to be invoked by front-end
 */
export default Base.setRouter([
  {
    path : '/login',
    router : login,
    method : 'all'
  },
  {
    path : '/checkLogin',
    router : checkLogin,
    method : 'get'
  },
  {
    path : '/logout',
    router : logout,
    method : 'all'
  }
])