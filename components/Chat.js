import React, { useEffect, useState } from 'react';
import { View, Text, ProgressViewIOSComponent } from 'react-native';

export default function Chat(props) {
  // Initialize props passed in from navigator
  let { name, chatBackground } = props.route.params;
  const { navigation } = props;

  // Make page title the name passed in
  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  // Basic chat screen code, to be replaced with Chat UI in later exercises
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: chatBackground,
      }}
    >
      <Text>Hello Chat Screen!</Text>
    </View>
  );
}
