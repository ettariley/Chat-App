# Chat App
Purpose: to build a chat app for mobile devices using React Native. Users will be able to participate in a group chat where they can send text, images, and location messages.

# Technologies
- React Native (including Async Storage, Navigation, and NetInfo)
- Javascript
- Expo (Including ImagePicker & Location APIs)
- React Native Gifted Chat
- Google Firebase (Firestore Database & Cloud Storage)

# Development Environment setup
## The Basics
- Download code base
- Make sure the expo cli is installed globally: `npm install expo-cli --global`
- Initialize project by running the following in the project's root folder: `expo init Chat-App`
- Launch project in the project's root folder: `expo start` or `npm start`

## Necessary Libraries
- React navigation `npm install --save react-navigation`
- Gifted Chat library `npm install --save react-native-gifted-chat`
- React Native Async Storage `expo install @react-native-async-storage/async-storage`
- NetInfo package `npm install --save @react-native-community/netinfo`
- Expo's ImagePicker API `expo install expo-image-picker`
- Expo's Location API and react-native-maps `expo install expo-location expo install react-native-maps`

## Database
The app uses Google Firebase Firestore database and cloud storage. `npm install --save firebase`

## Troubleshooting Setup
See the Expo docs on [development mode](https://docs.expo.dev/workflow/development-mode/), using the [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) for more resources on using Expo.
