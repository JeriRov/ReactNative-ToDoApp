import React from 'react'
import {
  ScrollView,
  Box,
  Text,
  VStack,
  Icon,
  Image,
  useColorModeValue
} from 'native-base'
import { Feather } from '@expo/vector-icons'
import AnimatedColorBox from '../../components/AnimatedColorBox/AnimatedColorBox'
import Navbar from '../../components/Navbar/Navbar'
import Masthead from '../../components/Masthead/Masthead'
import LinkButton from '../../components/LinkButton/LinkButton'

const AboutScreen = () => {
  return (
    <AnimatedColorBox
      flex={1}
      bg={useColorModeValue('warmGray.50', 'warmGray.900')}
      w="full"
    >
      <Masthead
        title="About this app"
        image={require('../../assets/background.png')}
      >
        <Navbar />
      </Masthead>
      <ScrollView
        borderTopLeftRadius="20px"
        borderTopRightRadius="20px"
        bg={useColorModeValue('warmGray.50', 'primary.900')}
        mt="-20px"
        pt="30px"
        p={4}
      >
        <VStack flex={1} space={4}>
          <Box alignItems="center">
            <Image
              source={require('../../assets/profile-image.png')}
              borderRadius="full"
              resizeMode="cover"
              w={150}
              h={150}
              alt="author"
            />
          </Box>
          <Text fontSize="lg" w="full">
            This is React Native project for my practice in coding.
          </Text>
          <LinkButton
            colorScheme={'blueGray'}
            size="lg"
            borderRadius="full"
            href="https://github.com/JeriRov/ReactNative-ToDoApp"
            leftIcon={
              <Icon as={Feather} name="github" size="sm" opacity={0.5} />
            }
          >
            Go to GitHub repo
          </LinkButton>
          <Text fontSize="lg" w="full">
            Thank you for looking at this incomplete program, and I hope you
            appreciated it.
          </Text>
          <LinkButton
            colorScheme={useColorModeValue('darkBlue', 'blue')}
            size="lg"
            borderRadius="full"
            href="https://www.facebook.com/artemjeri"
            leftIcon={
              <Icon as={Feather} name="facebook" size="sm" opacity={0.5} />
            }
          >
            My Facebook account
          </LinkButton>
          <LinkButton
            colorScheme={'darkBlue'}
            size="lg"
            borderRadius="full"
            href="https://www.linkedin.com/in/artem-mahey-470bb2242/"
            leftIcon={
              <Icon as={Feather} name="linkedin" size="sm" opacity={0.5} />
            }
          >
            My Linkedin account
          </LinkButton>
        </VStack>
      </ScrollView>
    </AnimatedColorBox>
  )
}

export default AboutScreen
