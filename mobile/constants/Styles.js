import Colors from './Colors';

export default {
  flex_center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  gap: {
    paddingLeft: 20,
    paddingRight: 20
  },

  header_title: {
    fontSize: 20,
    color: '#fff',
    // fontFamily: 'IKEA',
  },

  ikea: {
    // fontFamily: 'IKEA',
  },


  // antd
  confirm_button: {
    style: {
      backgroundColor: '#35a696',
      height: 40,
    },
    styles: {
      defaultRawText: {
        fontSize: 15,
        color: '#fff',
      }
    }
  },

  cancel_button: {
    style: {
      height: 40,
    },
    styles: {
      defaultRawText: {
        fontSize: 15,
      }
    }
  }
};