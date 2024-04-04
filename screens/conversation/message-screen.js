import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, FlatList, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../user-profile/getAccessToken";
import { SafeAreaView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { setAllConversation } from "../../rtk/user-slice";
import { findFriendById } from "../../service/friend.util";
import ContextMenu from "../context-menu/context-menu";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';

import { Badge } from '@rneui/themed';
const MessageScreen = ({ navigation }) => {


  const options = ['Add Friend', 'Add Group', 'Cancel'];
  const actionSheetRef = useRef();
  const handleAddFriend = () => {
    navigation.navigate('FindFriend')
  }

  const handleAddGroup = () => {
    navigation.navigate('AddGroup')
  }


  const showStoriCircle = () => { };
  const [conversations, setConversations] = useState([]);

  const dispatch = useDispatch()

  // get current user
  const user = useSelector((state) => state.user.user);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToTop()
  }, []);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false })
    }
  }

  const handleContentSizeChange = () => {
    scrollToTop();
  }

  const handleSetConversation = (data) => {
    setConversations(data)
    console.log("set");
  }

  async function getAllConversation() {
    const accessToken = await getAccessToken();
    await fetch('http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations', {
      method: 'get',
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      const temp = data.data;
      const updatedConversations = temp.filter(cv => cv.lastMessage !== null);
      console.log(updatedConversations);
      setConversations(updatedConversations);
      dispatch(setAllConversation(updatedConversations))



    })
      .catch((err) => {
        console.log(err)
        return;
      })

  }

  // useEffect(() => {
  //   removeConservationNotContent()
  // }, [conversations])
  const handleChangeState = (data) => {
    setConversations(data, () => {
      removeConservationNotContent()
    });
  };


  useFocusEffect(
    React.useCallback(() => {
      getAllConversation();

    }, [])
  );

  const removeConservationNotContent = () => {

    console.log(conversations);
    const updatedConversations = conversations.filter(cv => cv.lastMessage !== null);
    console.log(updatedConversations);
    setConversations(updatedConversations);
    dispatch(setAllConversation(updatedConversations))

  };

  const handleSendMessage = async (members) => {
    const filteredItems = members.filter(member => member._id !== user._id);
    console.log(filteredItems[0]._id);
    const token = await getAccessToken();

    fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/open/${filteredItems[0]._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.status === "fail") {
          console.log("fail");
          return;
        }
        else {
          console.log(data.data._id);
          navigation.navigate('Chat', { data: data.data })
        }


      })

      .catch(() => console.log("fetch error"))


  }

  // const handleSendMessage = async (id) => {
  //   // console.log(user._id);

  //   // const filteredItems = members.filter(member => member._id !== user._id);
  //   // console.log(filteredItems[0]._id);
  //   const token = await getAccessToken();

  //   fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${id}/messages?page=1&limit=50`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token
  //       }
  //     }).then((response) => response.json())
  //     .then((data) => {
  //       console.log(data)
  //       if (data.status === "fail") {
  //         console.log("fail");
  //         return;
  //       }
  //       else {
  //         console.log(data.data._id);
  //         navigation.navigate('Chat', { data: data.data })
  //       }


  //     })

  //     .catch(() => console.log("fetch error"))


  // }

  console.log(conversations);

  const getTime = (updateAt) => {

    console.log(typeof (updateAt));
    const date = new Date(updateAt);

    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${hour}:${minute}`;
  }

  const getLastMessage = (item) => {
    console.log(item);

    if (item.lastMessage.sender !== user._id) {
      return item.name + ": " + item.lastMessage.content;
    }

    if (item.lastMessage != null) {
      if (item.lastMessage.isDelete) {
        return "This message was deleted";
      }

      console.log(item.lastMessage);
      if (item.lastMessage.content.length > 20) {
        console.log(item.lastMessage.content.substring(0, 10) + "...");
        return item.lastMessage.content.substring(0, 10) + "...";
      }

      return item.lastMessage.content;
    }

    return "";
  }
  const handlePress = () => {
    actionSheetRef.current.show();
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: '#f558a4',
        height: 60,
      },
      headerLeft: () => (
        <View style={{ height: 50, marginTop: -5, paddingHorizontal: 10, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MaterialCommunityIcons name="magnify" color="white" size={20} />
            <TextInput
              placeholder="Search"
              placeholderTextColor="white"
              style={{ height: 20, fontSize: 17, color: 'white' }}
            />
          </View>
        </View>
      ),
      headerRight: () =>
        <View style={{ position: 'relative' }}>
          <View style={{ marginRight: 20 }}>
            {/* <ContextMenu /> */}
            <Pressable onPress={handlePress}>
              <MaterialCommunityIcons name="plus" color="white" size={25} />
            </Pressable>
            <ActionSheet
              ref={actionSheetRef}
              options={options}
              cancelButtonIndex={2}
              onPress={(index) => {
                // Handle the selected option based on the index
                switch (index) {
                  case 0:
                    handleAddFriend();
                    break;
                  case 1:
                    handleAddGroup();
                    break;
                  default:
                    break;
                }
              }}
            />
          </View>
        </View>
    })
  }, [])

  console.log(conversations);
  return (

    <ScrollView style={styles.container} ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={conversations}
        renderItem={({ item }) => (
          <View style={styles.container} key={item.id}>
            <TouchableOpacity style={styles.conversation}
              onPress={() => handleSendMessage(item.members)}
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
                  <Text style={styles.time}>{getTime(item.updatedAt)}</Text>

                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  {item.isReadMessage && item.lastMessage.sender === user._id ? (

                    <Text style={styles.message}>{getLastMessage(item)}</Text>



                  ) : (
                    <View style={{
                      flexDirection: 'row',
                      gap: 70
                    }}>
                      <Text style={{
                        fontSize: 15,
                        color: '#555',
                        width: 240,
                        fontWeight: 'bold',
                      }}>{getLastMessage(item)}</Text>

                      <Badge
                        value="1" // Convert the unreadCount to string for display
                        status="error"
                      />
                    </View>

                  )}

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
  badgeContainer: {
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
export default MessageScreen;
