import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
<<<<<<< HEAD
import ContactScreen from './screens/contact-screen';
=======

import LoginScreen from './screens/auth/login';
import RegisterScreen from './screens/auth/register';

import FriendsScreen from './screens/friends-screen';
>>>>>>> trong
import MessageScreen from './screens/message-screen';
import ProfileScreen from './screens/profile-screen';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


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
            marginRight: 15
          }}>
            <MaterialCommunityIcons name="plus" color="white" size={20} style={{
              marginLeft: 20
            }} />
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
      }} name="Contact" component={ContactScreen} />
      <Tab.Screen options={{
        headerTitle: '',
        tabBarLabel: 'Profile',
        tabBarActiveTintColor: '#f558a4',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='account' color={'#f558a4'} size={size} />
        ),
      }} name="Profile" component={ProfileScreen} />
    </Tab.Navigator >
  )
}

function AppNavigator() {
  return (
     <NavigationContainer>
       <Stack.Navigator>
         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
         <Stack.Screen name="Home" component={MyTab} options={{ headerShown: false }}/>
       </Stack.Navigator>
     </NavigationContainer>
  );
 }


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
