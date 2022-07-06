import React, { useCallback, useEffect, useState } from 'react';
import {
  View, 
  Text,
  Platform,
  KeyboardAvoidingView,
  Button,
  Alert,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  onSnapshot,
  query,
  orderBy,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInAnonymously,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { async } from '@firebase/util';

export default function Chat(props) {
  // Initialize props passed in from navigator
  let { name, chatBackground } = props.route.params;
  const { navigation } = props;

  // Initialize messages and user uid states
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState('');
  const [isConnected, setIsConnected] = useState();

  // Config information
  const firebaseConfig = {
    apiKey: 'AIzaSyBXYcGsXU-n-QTqNDBOFB3J2FdgzthK5Bo',
    authDomain: 'chatapp-53949.firebaseapp.com',
    projectId: 'chatapp-53949',
    storageBucket: 'chatapp-53949.appspot.com',
    messagingSenderId: '399680179484',
    appId: '1:399680179484:web:cfd5870a173f6ffeb87ed9',
  };

  // Initialize firebase app
  let app;
  let auth;

  // Check if app has been initialized already & initialize if not
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    app = getApp();
    auth = getAuth(app);
  }
  const db = getFirestore(app);

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

  // Delete messages in storage (for testing)
  const deleteStoredMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      // setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Make page title the name passed in
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

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
      // alertOffline();
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
      });
    });
    setMessages(messagesarray);
    saveMessagesToStorage(messagesarray);
  };

  // Add new message to firestore collection
  const addMessages = (message) => {
    addDoc(referenceChatMessages, {
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  // Append new message to messages state and call function to add to Firestore collection
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    addMessages(messages[0]);
  }, []);

  

  // Display alert if offline
  const alertOffline = () => {
    Alert.alert(
      'Offline',
      "You are offline. You can see previously saved messages, but can't send any new ones until you are back online.",
      [
        {
          text: 'OK',
        },
      ]
    );
  };

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: chatBackground,
      }}
    >
      {isConnected ? null : (
        <Text style={{color: "red"}}>You are offline.</Text>
      )}
      <Button
        onPress={() => deleteStoredMessages()}
        title="Clear Saved Messages"
        color="#848884"
        accessibilityLabel="Clicking this button clears messages from local storage."
      />
      <GiftedChat
        renderBubble={renderBubble.bind()}
        renderInputToolbar={renderInputToolbar.bind()}
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
