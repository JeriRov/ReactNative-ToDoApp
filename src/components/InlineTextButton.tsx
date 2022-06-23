import { Text, Pressable } from 'react-native';
import AppStyles from '../styles/AppStyles';

interface Props{
  color: string
  text: string
  onPress: () => void
}

export default function InlineTextButton(props: Props) {
  let style  = {color: ''};
  if (props.color) {
    style.color = props.color
  };
  return (
    <Pressable onPress={props.onPress}>
      {({ pressed }) => (
        <Text 
          style={[pressed ? AppStyles.pressedInlineTextButton : AppStyles.inlineTextButtonColor, style]}>
            {props.text}
        </Text>
      )}
    </Pressable>
  )
}