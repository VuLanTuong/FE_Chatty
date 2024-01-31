import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import ContactScreen from './screens/contact-screen';
import MessageScreen from './screens/message-screen';
import ProfileScreen from './screens/profile-screen';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
<<<<<<< Updated upstream
=======
import { FriendRequest } from './screens/contact/friend-request';
import DetailProfile from './screens/user-profile/detail-profile';
import ContextMenu from './screens/context-menu/context-menu';
import AddFriend from './screens/context-menu/add-friend';
import AddGroup from './screens/context-menu/add-group';
import FindFriend from './screens/context-menu/find-friend';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Home" component={MyTab} options={{ headerShown: false }} />
        <Stack.Screen name='AddFriend' component={AddFriend} options={{

        }} />
        <Stack.Screen name='AddGroup' component={AddGroup} options={{

        }} />
        <Stack.Screen name='FindFriend' component={FindFriend} options={{

        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const MessageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Message' component={MessageScreen} options={{
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
>>>>>>> Stashed changes

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
