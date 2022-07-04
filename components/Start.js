import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

// Colors for chat background choices
const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

export default function Start(props) {
  // Initialize states for name and chat background color
  const [name, setName] = useState('');
  const [chatBackground, setChatBackground] = useState('');

  return (
    <View style={startStyles.startContainer}>
      <ImageBackground
        source={require('../assets/startbackground.png')}
        resizeMode="cover"
        style={startStyles.backgroundImage}
      >
        <Text style={startStyles.title}>Chat App</Text>

        {/* Container with Name & Background Color choices */}
        <View style={startStyles.optionsContainer}>
          {/* Name Input */}
          <TextInput
            style={startStyles.nameInput}
            onChangeText={setName}
            value={name}
            placeholder=" Your Name"
          />

          {/* Chat Background Color choice selection */}
          <View style={startStyles.backgroundColorChoiceContainer}>
            <Text style={startStyles.backgroundColorTitle}>
              Choose Background Color:
            </Text>
            <View style={startStyles.backgroundColorContainer}>
              <Pressable
                style={[startStyles.backgroundColorCircles, startStyles.color1]}
                onPress={() => setChatBackground(colors[0])}
              >
                <Text style={startStyles.colorChoice}>
                  {chatBackground === colors[0] ? 'X' : ''}
                </Text>
              </Pressable>
              <Pressable
                style={[startStyles.backgroundColorCircles, startStyles.color2]}
                onPress={() => setChatBackground(colors[1])}
              >
                <Text style={startStyles.colorChoice}>
                  {chatBackground === colors[1] ? 'X' : ''}
                </Text>
              </Pressable>
              <Pressable
                style={[startStyles.backgroundColorCircles, startStyles.color3]}
                onPress={() => setChatBackground(colors[2])}
              >
                <Text style={startStyles.colorChoice}>
                  {chatBackground === colors[2] ? 'X' : ''}
                </Text>
              </Pressable>
              <Pressable
                style={[startStyles.backgroundColorCircles, startStyles.color4]}
                onPress={() => setChatBackground(colors[3])}
              >
                <Text style={startStyles.colorChoice}>
                  {chatBackground === colors[3] ? 'X' : ''}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Enter Chat Button */}
          <Pressable
            style={startStyles.startChatting}
            onPress={() => {
              // Pass through name input and background color choice as props
              props.navigation.navigate('Chat', {
                name: name,
                chatBackground: chatBackground,
              });
            }}
          >
            <Text style={startStyles.startChattingText}>Start Chatting</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const startStyles = StyleSheet.create({
  startContainer: {
    flex: 1,
    // backgroundColor: 'gray'
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionsContainer: {
    flex: 0.44,
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#FFFFFF',
  },
  nameInput: {
    fontWeight: '300',
    opacity: 0.5,
    width: '88%',
    height: 60,
    borderColor: '#757083',
    borderWidth: 2,
    borderRadius: 5,
  },
  backgroundColorChoiceContainer: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'space-between',
  },
  backgroundColorTitle: {
    fontWeight: '300',
    color: '#757083',
  },
  backgroundColorContainer: {
    flexDirection: 'row',
    width: '88%',
    justifyContent: 'space-evenly',
  },
  backgroundColorCircles: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorChoice: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  startChatting: {
    backgroundColor: '#757083',
    borderRadius: 5,
    width: '88%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startChattingText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
