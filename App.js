import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuContext, Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import React, { useState } from 'react';
import ContactScreen from './screens/contact/contact-screen';
import LoginScreen from './screens/auth/testapi.login';
// import LoginScreen from './screens/auth/login';
import RegisterScreen from './screens/auth/register';
import { Provider } from 'react-redux';
// import FriendsScreen from './screens/friends-screen';
import store from './rtk/store';
import MessageScreen from './screens/conversation/message-screen';
import ChatScreen from './screens/conversation/chat-screen';
import ProfileScreen from './screens/user-profile/profile-screen';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FriendRequest } from './screens/contact/friend-request';
import DetailProfile from './screens/user-profile/detail-profile';
import ContextMenu from './screens/context-menu/context-menu';
import AddFriend from './screens/context-menu/add-friend';
import AddGroup from './screens/context-menu/add-group';
import FindFriend from './screens/context-menu/find-friend';
import ChangePassword from './screens/user-profile/change-password';
import FriendProfile from './screens/friend-profile/friendProfile';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import getAccessToken from './screens/user-profile/getAccessToken';
import { useDispatch } from "react-redux";
import { login } from "./rtk/user-slice";
import ForgotPassword from './screens/auth/forgot-password';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function MyTab() {
  return (
    <Tab.Navigator
      initialRouteName="Messgae"
      screenOptions={{
        headerStyle: {
          flexDirection: 'row',
          backgroundColor: '#f558a4',
          height: 50,
        },
        headerLeft: () => (
          <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
            <View style={{
              flexDirection: 'row',
              gap: 5,
            }}>
              <MaterialCommunityIcons name="magnify" color="white" size={20} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="white"
                // value={searchKeyword}
                // onSubmitEditing={() => navigation.navigate('SearchEngine', { keyword: searchKeyword })}
                // onChangeText={text => setSearchKeyword(text)}
                style={{ height: 20, fontSize: 17, color: 'white' }}
              />
            </View>
          </View>
        ),
        headerRight: () => (
          <View style={{
            marginRight: 20,
            marginTop: 280,
            height: 320,
            width: 120
          }}>
            <ContextMenu />
          </View>


        )
      }}>
      <Tab.Screen options={{
        headerTitle: '',
        tabBarLabel: 'Message',
        tabBarActiveTintColor: '#f558a4',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='message-text' color={'#f558a4'} size={size} />
        ),
      }} name="Message" component={MessageStack} />
      <Tab.Screen options={{
        headerTitle: '',
        tabBarLabel: 'Contact',
        tabBarActiveTintColor: '#f558a4',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='notebook' color={'#f558a4'} size={size} />
        ),
      }} name="Contact" component={ContactStack} />
      <Tab.Screen options={{
        headerTitle: '',
        tabBarLabel: 'Profile',
        tabBarActiveTintColor: '#f558a4',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='account' color={'#f558a4'} size={size} />
        ),
        headerShown: false
      }} name="Profile" component={ProfileStack} />
    </Tab.Navigator >
  )
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{
          headerTitle: 'Forgot password',
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'normal',
            fontSize: 17,
          },
          headerStyle: {
            backgroundColor: '#f558a4',
            height: 50,

          }

        }} />
        <Stack.Screen name="Home" component={MyTab} options={{ headerShown: false }} />
        <Stack.Screen name='AddFriend' component={AddFriend} options={{

        }} />
        <Stack.Screen name='AddGroup' component={AddGroup} options={{
          headerTitle: 'Add Group',
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'normal',
            fontSize: 17,
          },
          headerStyle: {
            backgroundColor: '#f558a4',
            height: 50,

          }
        }} />
        <Stack.Screen name='FindFriend' component={FindFriend} options={{
          headerTitle: 'Find New Friend',
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'normal',
            fontSize: 17,
          },
          headerStyle: {
            backgroundColor: '#f558a4',
            height: 50,

          }
        }} />
        <Stack.Screen name='FriendProfile' component={FriendProfile} options={{
          headerTitle: 'Profile',
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'normal',
            fontSize: 17,
          },
          headerStyle: {
            backgroundColor: '#f558a4',
            height: 50,

          }

        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const MessageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='MessageScreen' component={MessageScreen} options={{
        headerShown: false
      }} />
      <Stack.Screen name='Chat' component={ChatScreen} options={{
        headerShown: false
      }} />
    </Stack.Navigator>
  )
}

const ContactStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='contact' component={ContactScreen} options={{
        headerShown: false
      }} />
      <Stack.Screen name='FriendRequest' component={FriendRequest} options={{
        headerShown: false
      }} />

    </Stack.Navigator>
  )
}




const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{
        headerShown: false
      }}></Stack.Screen>
      <Stack.Screen name='DetailProfile' component={DetailProfile} options={{
        headerShown: false
      }} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} options={{
        headerShown: false
      }} />
    </Stack.Navigator>
  )
}



// const ContextMenuStack = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name='Context' component={ContextMenu} options={{
//         headerShown: false
//       }} />
//     </Stack.Navigator>
//   )
// }

const getMe = async (token) => {
  fetch('http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/getMe', {
    method: "GET",
    headers: {
      // "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'fail') {
        console.log("fail");
        return;
      }
      console.log('response', data);
      return data.data;
    })
    .catch((error) => {
      console.log('Error:', error);
    });
};


export default function App() {
  // // const dispatch = useDispatch();
  // useEffect(() => {
  //   getAccessToken().then((token) => {
  //     if (token) {
  //       console.log(token);
  //       const user = getMe(token).then((user) => {
  //         console.log(user);
  //         // dispatch(login({
  //         //   user: user.data
  //         // }))
  //       })
  //     }
  //   })
  // }, [])


  return (
    <Provider store={store}>
      {/* <ChatScreen /> */}
      <AppNavigator />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Provider>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


