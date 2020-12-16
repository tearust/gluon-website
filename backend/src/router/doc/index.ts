import Base from '../Base';
import get_list from './get_list';
import get_content from './get_content';

export default Base.setRouter([
  {
    path: '/get_list',
    router: get_list,
    method: 'get'
  },
  {
    path: '/get_content',
    router: get_content,
    method: 'all'
  }
  
])