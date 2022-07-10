import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
} from 'react-native-gifted-chat';
import {
  onSnapshot,
  query,
  orderBy,
  addDoc,
  collection,
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';
import { db, auth } from './firebase/firebase-config';

export default function Chat(props) {
  // Initialize props passed in from navigator
  let { name, chatBackground } = props.route.params;
  const { navigation } = props;

  // Initialize states
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState('');
  const [isConnected, setIsConnected] = useState();

  // Reference to Firestore messages collection
  const referenceChatMessages = collection(db, 'messages');

  // Save messages to AsyncStorage
  const saveMessagesToStorage = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Get messages from AsyncStorage
  const getStoredMessages = async () => {
    let messagesarray = '';
    try {
      messagesarray = (await AsyncStorage.getItem('messages')) || [];
      setMessages(JSON.parse(messagesarray));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Make page title the name passed in
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  // Initial Online Check, Authentication, Getting messages from Database
  useEffect(() => {
    // Check if online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    if (isConnected) {
      // Authenticate anonymous user
      const authUnsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          signInAnonymously(auth);
        }
        setUid(user.uid);
        setMessages([]);
      });
      // get all messages in time order
      const messagesQuery = query(
        referenceChatMessages,
        orderBy('createdAt', 'desc')
      );

      //Creates event listener for messages updates
      const unsubscribe = onSnapshot(messagesQuery, onCollectionUpdate);

      // Stop listening to messages and authentication
      return () => {
        unsubscribe();
        authUnsubscribe();
      };
    } else {
      getStoredMessages();
    }
  }, [isConnected]); // Use effect listening for change in online status

  // Update state of messages when database is updated
  const onCollectionUpdate = (querySnapshot) => {
    const messagesarray = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messagesarray.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image,
        location: data.location,
      });
    });
    setMessages(messagesarray);
    saveMessagesToStorage(messagesarray);
  };

  // Add new message to firestore collection
  const addMessages = (message) => {
    addDoc(referenceChatMessages, {
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  // Append new message to messages state and call function to add to Firestore collection
  const onSend = useCallback((messages = []) => {
    console.log(messages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    addMessages(messages[0]);
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

  // Control input toolbar
  const renderInputToolbar = (props) => {
    if (isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  // Configure custom actions
  const renderActions = (props) => {
    return <CustomActions {...props} />;
  };

  // Render custom view for location messages
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    // send custom map view if location is sent through
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    // Main container (styles are inline to pass through chatBackground option)
    <View
      style={{
        flex: 1,
        backgroundColor: chatBackground,
      }}
    >
      {/* Connection indicator */}
      {isConnected ? (
        <Text style={[chatStyles.onlineIndication, chatStyles.online]}>
          You are online and ready to chat.
        </Text>
      ) : (
        <Text style={[chatStyles.onlineIndication, chatStyles.offline]}>
          You are offline. You can see stored messages but cannot send new ones.
        </Text>
      )}
      
      {/* Gifted chat UI */}
      <GiftedChat
        renderBubble={renderBubble.bind()}
        renderInputToolbar={renderInputToolbar.bind()}
        renderActions={renderActions}
        renderCustomView={renderCustomView}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />

      {/* If platform is android, make sure to move the UI with the keyboard */}
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}

const chatStyles = StyleSheet.create({
  onlineIndication: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  offline: {
    color: 'red',
  },
  online: {
    color: 'white',
  },
});
