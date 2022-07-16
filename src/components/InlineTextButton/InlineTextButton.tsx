import { Text, Pressable } from 'react-native';
import Styles from './inlineTextButton.styles';
import {Props} from './inlineTextButton.types'

export default function InlineTextButton(props: Props) {
  let style  = {color: ''};
  if (props.color) {
    style.color = props.color
  };
  return (
    <Pressable onPress={props.onPress}>
      {({ pressed }) => (
        <Text 
          style={[pressed ? Styles.pressedInlineTextButton : Styles.inlineTextButtonColor, style]}>
            {props.text}
        </Text>
      )}
    </Pressable>
  )
}