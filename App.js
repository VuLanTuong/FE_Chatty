import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuContext, Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import React, { useState } from 'react';
import ContactScreen from './screens/contact/contact-screen';
import LoginScreen from './screens/auth/login';
import RegisterScreen from './screens/auth/register';

// import FriendsScreen from './screens/friends-screen';

import MessageScreen from './screens/message-screen';
import ProfileScreen from './screens/user-profile/profile-screen';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FriendRequest } from './screens/contact/friend-request';
import DetailProfile from './screens/user-profile/detail-profile';
import ContextMenu from './screens/context-menu/context-menu';
import AddFriend from './screens/contact/add-friend';
import AddGroup from './screens/contact/add-group';
import FindFriend from './screens/contact/find-friend';

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
      }} name="Message" component={MessageScreen} />
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
        {/* <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Home" component={MyTab} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
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


const ContextMenuScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='AddFriend' component={AddFriend} options={{
        headerShown: false
      }} />
      <Stack.Screen name='AddGroup' component={AddGroup} options={{
        headerShown: false
      }} />
      <Stack.Screen name='FindFriend' component={FindFriend} options={{
        headerShown: false
      }} />
    </Stack.Navigator>
  )

}

ContextMenuScreen

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{
        headerShown: false
      }}></Stack.Screen>
      <Stack.Screen name='DetailProfile' component={DetailProfile} options={{
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

export default function App() {
  return (
    <AppNavigator />

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
