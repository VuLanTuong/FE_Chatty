import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../user-profile/getAccessToken";
import { getAllConversation } from "../../service/conversation.util";

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
  const [conversations, setConversations] = useState([]);

  const dispatch = useDispatch()

  // get current user
  const user = useSelector((state) => state.user);
  console.log(user);

  const getConversations = async () => {
    const temp = await getAllConversation();
    console.log(temp);
    setConversations(temp)
  }


  useEffect(() => {
    console.log("effect");
    getConversations().then(() => {
      console.log("is get");

    })

  }, [])

  console.log(conversations);
  return (
    <ScrollView style={styles.container}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={conversations}
        renderItem={({ item }) => (
          <View style={styles.container} key={item.id}>
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
    borderBottomColor: '#f558a4',
    borderBottomWidth: 1,
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
