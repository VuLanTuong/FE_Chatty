import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const MessageScreen = ({ navigation }) => {
  const data = [{
    id: 1,
    name: 'jenifer',
    message: 'hello',
    time: '4:00 PM',
    image: 'https://img.lazcdn.com/g/shop/bcdcd66a784bdd39a5063f150a128122.png_960x960q80.png_.webp',
    notification: 1,
  },
  {
    id: 1,
    name: 'tom',
    message: '<3',
    time: '1:00 PM',
    image: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg',
    notification: 1,
  },
  ]

  const showStoriCircle = () => { };

  const dispatch = useDispatch()

  // get current user
  const user = useSelector((state) => state.user.data);
  console.log(user);


  return (
    <ScrollView style={styles.container}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={data}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <TouchableOpacity style={styles.conversation}
              onPress={() => navigation.navigate('Chat')}
            >
              <TouchableOpacity style={[styles.imageContainer, showStoriCircle()]}>
                <Image style={styles.image} source={{ uri: item.image }} />
              </TouchableOpacity>
              <View style={{
                flex: 1,
                justifyContent: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text numberOfLines={1} style={styles.username}>{item.name}</Text>
                  <View style={styles.time}>{item.time}</View>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={styles.message}>{item.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

      />


    </ScrollView>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  conversation: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 10
  },
  imageContainer: {
    marginRight: 15,
    borderRadius: 25,
    height: 50,
    width: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

  },
  image: {
    height: 55,
    width: 55,
  },
  username: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    width: 210,
  },
  message: {
    fontSize: 15,
    color: '#555',
    width: 240,
  },
  time: {
    fontSize: 13,
    color: '#555',
    fontWeight: '300',
  },
  notification: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default MessageScreen;
