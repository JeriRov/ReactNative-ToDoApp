import { StyleSheet} from 'react-native';
export default StyleSheet.create({
  imageContainer: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center'
    },
    container:{
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16
    },
    fillSpace:{
      flex: 1
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mt:{
      marginTop: 8
    },
    mb:{
      marginBottom: 8
    },
    mr:{
      marginRight: 16
    },
    ml:{
      marginLeft: 16
    },
    mh:{
      marginHorizontal: 16
    },
    strech:{
      alignSelf: 'stretch'
    },
    backgroundCover: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      padding: 16
    },
    lightText:{
      color: "#fff",
    },
    header:{
      fontSize: 24
    },
    textInput:{
      alignSelf: 'stretch',
      padding: 8,
      borderBottomWidth: 2,
      marginVertical: 8
    },
    lightTextInput:{
      borderBottomColor: '#EEE'
    },
    inlineTextButtonColor:{
      color: '#B2D8D8'
    },
    pressedInlineTextButton:{
      color: '#B2D8D8',
      opacity: 0.75
    },
    validationError:{
      color: '#ff0000'
    },
    contentRight:{
      alignSelf: 'stretch',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    },
    darkTextInput: {
      borderBottomColor: '#000'
    }
  });