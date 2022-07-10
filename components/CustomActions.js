import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Actions } from 'react-native-gifted-chat';
import { storage } from './firebase/firebase-config';
import { useChatContext } from 'react-native-gifted-chat/lib/GiftedChatContext';

export default function CustomActions(props) {
  const { wrapperStyle, iconTextStyle, onSend } = props;

  // Select an image
  const pickImage = async () => {
    // Ask user for permission (if already granted alert will not show)
    const libraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    //Show error message if permission refused
    if (libraryPermission.granted === false) {
      alert('You have refused the app access. Please update in your settings.');
      return;
    }

    // Allow user to select image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    // If not cancelled, store image and display in messages
    if (!result.cancelled) {
      const imageURL = await uploadImageFetch(result.uri);
      onSend({ image: imageURL });
    }
  };

  // Take a photo
  const takePhoto = async () => {
    // Ask user for camera permission (if already granted will not show)
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    //Show error message if permission refused
    if (cameraPermission.granted === false) {
      alert('You have refused the app access. Please update in your settings.');
      return;
    }

    // Allow user to take image
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    // If not cancelled, store image and display in messages
    if (!result.cancelled) {
      const imageURL = await uploadImageFetch(result.uri);
      onSend({ image: imageURL });
    }
  };

  // Get location
  const getLocation = async () => {
    // Request permission while using the app (if already requested will not show)
    const { status } = await Location.requestForegroundPermissionsAsync();

    try {
      //Show error message if permission refused
      if (status !== 'granted') {
        alert(
          'You have refused the app access. Please update in your settings.'
        );
        return;
      } else {
        // Get current location
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) => {
            console.error(error);
          }
        );
        // Send location if found
        if (result) {
          onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Upload new image to Firebase storage & return download URL
  const uploadImageFetch = async (uri) => {
    // Get uri and turn into blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Update file path name
    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    // Define reference to storage path
    const newImageRef = ref(storage, `images/${imageName}`);

    // Upload to Firebase
    await uploadBytes(newImageRef, blob).then((snapshot) => {
      console.log('image blob uploaded');
    });

    // Get download URL and return
    return await getDownloadURL(newImageRef);
  };

  // Use context hook for gifted chat action sheet
  const { actionSheet } = useChatContext();

  // Handles the menu and options when pressing the actions button
  const onActionPress = () => {
    const options = [
      'Choose from Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    // Initialize options menu
    actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      // What to do when each option is clicked (cancel is default)
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            break;
          case 1:
            takePhoto();
            break;
          case 2:
            getLocation();
            break;
          default:
            break;
        }
      }
    );
  };

  // Action sheet button UI
  return (
    <TouchableOpacity style={[caStyles.container]} onPress={onActionPress}>
      <View style={[caStyles.wrapper, wrapperStyle]}>
        <Text style={[caStyles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

// Prop types for Actions and action sheet for gifted chat
Actions.contextTypes = {
  actionSheet: PropTypes.func,
};

const caStyles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});
