import Base from '../Base';

import adminLogin from './adminLogin';
import checkLogin from './checkLogin';

export default Base.setRouter([
  {
    path : '/login',
    router : adminLogin,
    method : 'all'
  },
  {
    path: '/check_login',
    router: checkLogin,
    method: 'get',
  }
])