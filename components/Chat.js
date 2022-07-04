import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ProgressViewIOSComponent,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default function Chat(props) {
  // Initialize props passed in from navigator
  let { name, chatBackground } = props.route.params;
  const { navigation } = props;
  // Initialize message state
  const [messages, setMessages] = useState([]);

  useEffect(() => {
      // Make page title the name passed in
    navigation.setOptions({
      title: name,
    });
    // Initialize mock messages
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: name + ' has entered the chat',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [navigation, name]);

  // Stores messages
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // Change color of the message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#D3D3D3',
          },
          right: {
            backgroundColor: '#848884',
          },
        }}
      />
    );
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: chatBackground,
      }}>
      <GiftedChat
        renderBubble={renderBubble}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {/* If platform if android, make sure to move the UI with the keyboard */}
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}
