import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mb: {
    marginBottom: 8
  },
  backgroundCover: {
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 15
  },
  lightText: {
    color: '#fff'
  },
  header: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: 'bold'
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 8,
    borderBottomWidth: 2,
    marginVertical: 0
  },
  lightTextInput: {
    borderBottomColor: '#ccc'
  },
  validationError: {
    color: '#ff0000'
  }
})
