import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import FriendsScreen from './screens/friends-screen';
import MessageScreen from './screens/message-screen';
import ProfileScreen from './screens/profile-screen';
import { NavigationContainer } from '@react-navigation/native';

function MyTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Message" component={FriendsScreen} />
      <Tab.Screen name="Contact" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
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
