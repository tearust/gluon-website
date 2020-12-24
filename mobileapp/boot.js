import {init, _} from 'helper';
import Colors from './constants/Colors';
import { Dimensions } from 'react-native';

const window = Dimensions.get('window');
init({
  themeStyle: {
    $tintColor: Colors.tintColor,
    $screenWidth: window.width,
    $screenHeight: window.height,

    $lightBorderColor: Colors.lightBorderColor,
    $darkBorderColor: Colors.darkBorderColor
  }
});


