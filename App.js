import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();

import LoginScreen from './screens/auth/login';
import RegisterScreen from './screens/auth/register';

import FriendsScreen from './screens/friends-screen';
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
          justifyContent: 'center',
          backgroundColor: '#f558a4',
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 15 }}>
              <MaterialCommunityIcons name="magnify" color="white" size={30} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="white"
                // value={searchKeyword}
                // onSubmitEditing={() => navigation.navigate('SearchEngine', { keyword: searchKeyword })}
                // onChangeText={text => setSearchKeyword(text)}
                style={{ height: 25, fontSize: 20, color: 'white' }}
              />
              <MaterialCommunityIcons name="plus" color="white" size={30} style={{
                marginLeft: 50
              }} />
            </View>
          </View>
        ),
      }}>
      <Tab.Screen options={{
        headerTitle: '',
        tabBarLabel: 'Message',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='message-text' color={'#f558a4'} size={size} />
        ),
      }} name="Message" component={MessageScreen} />
      <Tab.Screen options={{
        headerTitle: '',
        tabBarLabel: 'Contact',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name='notebook' color={'#f558a4'} size={size} />
        ),
      }} name="Contact" component={FriendsScreen} />
      <Tab.Screen options={{
        headerTitle: '',
        tabBarLabel: 'Profile',
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
