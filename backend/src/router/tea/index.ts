import Base from '../Base';
import create_ed25519_keypari from './create_ed25519_keypair';
import get_docker_compose from './get_docker_compose';
import layer1_info from './layer1_info';

export default Base.setRouter([
  {
    path : '/create_ed25519_keypari',
    router : create_ed25519_keypari,
    method : 'get'
  },
  {
    path: '/get_docker_compose',
    router: get_docker_compose,
    method: 'all'
  },
  {
    path: '/layer1_info',
    router: layer1_info,
    method: 'get'
  },
  
])