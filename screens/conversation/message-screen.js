import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../user-profile/getAccessToken";
import { SafeAreaView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { getConservations, setAllConversation, setCurrentConversation } from "../../rtk/user-slice";
import { findFriendById } from "../../service/friend.util";
import ContextMenu from "../context-menu/context-menu";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';
import { TextInput } from "react-native-paper";

import { Badge } from '@rneui/themed';
import { useSocket } from "../socket.io/socket-context";
import { fetchAllGroup } from "../../service/conversation.util";
import Toast from "react-native-toast-message";
const MessageScreen = ({ navigation }) => {
  const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555/api/v1"
  const allConversationAtRedux = useSelector((state) => state.user.conversation);

  const [search, setSearch] = useState("");
  const options = ['Add Friend', 'Create Group', 'Friend Conversation Filtering', 'Group Conversation Filtering', 'Cancel'];
  const [isFriend, setIsFriend] = useState(false);
  const actionSheetRef = useRef();
  const [onChange, setOnChange] = useState('all');
  const handleAddFriend = () => {
    navigation.navigate('FindFriend')
  }

  const friends = useSelector((state) => state.user.friends);
  const handleAddGroup = () => {
    navigation.navigate('AddGroup')
  }

  const { socket } = useSocket();


  const showStoriCircle = () => { };



  const dispatch = useDispatch()
  const allConversation = useSelector((state) => state.user.conversation);
  console.log(allConversation);


  // get current user
  const user = useSelector((state) => state.user.user);
  console.log(user);

  const scrollViewRef = useRef(null);
  // selector run after use effect
  console.log(allConversationAtRedux);
  const [allConversationAtRedux1, setAllConversationAtRedux] = useState(useSelector((state) => state.user.conversation));
  console.log(allConversationAtRedux);

  const [conversations, setConversations] = useState(allConversationAtRedux);

  const checkIsMember = (data, members) => {

    // if (data.conversation.type !== "group") {
    const existingConversation = allConversationAtRedux.find((conversation) => {
      return conversation._id.toString() === data.conversation._id.toString();
    });

    if (!existingConversation && members.some(member => member._id === user._id)) {
      return {
        ...data.conversation,
        lastMessage: data.conversation,
        isReadMessage: false,
      };
      // }
    }

    return null;
  };



  const handleConversationUpdate = (data) => {
    console.log(data.conversation);
    const members = data.conversation.members;
    console.log("MEMBERSS:::::::", members);
    if (data.conversation.type === "group") {
      let isUserInGroup = false;
      members.forEach(member => {
        if (member._id.toString() === user._id.toString()) isUserInGroup = true;
      })

      // if (data.conversation.members.any(member => member._id === user._id)) {
      if (isUserInGroup) {

        console.log("running gooooo");
        let updatedConversationArray = allConversationAtRedux;
        const newConversation = checkIsMember(data, members);
        if (newConversation !== null) {
          updatedConversationArray = [...allConversation, newConversation];
        }

        const updatedConversation = updatedConversationArray.map((item) => {
          if (item._id.toString() === data.conversation._id.toString()) {
            return {
              ...item,
              lastMessage: data,
              updatedAt: new Date(Date.now()).toISOString(),
              isReadMessage: false,
              name: data.conversation.name,
              image: data.conversation.image,
            };
          }
          return item;
        });


        setAllConversationAtRedux(updatedConversation);
        dispatch(setAllConversation(updatedConversation, { position: 'message-updateConvo' }));
        return;

      }

    }
    else {
      let updatedConversationArray = allConversationAtRedux;
      const newConversation = checkIsMember(data, members);
      if (newConversation !== null) {
        updatedConversationArray = [...allConversation, newConversation];
      }

      const updatedConversation = updatedConversationArray.map((item) => {
        // const friendConversation = chatData.members.find(member => member.id);

        // // Get the avatar URL of the user
        // const avatarUrl = friendConversation ? friendConversation.avatar : null;
        if (item._id.toString() === data.conversation._id.toString()) {
          return {
            ...item,
            lastMessage: data,
            updatedAt: new Date(Date.now()).toISOString(),
            isReadMessage: false,
            name: data.conversation.name,
            image: data.conversation.image,
          };
        }
        return item;
      });


      setAllConversationAtRedux(updatedConversation);
      dispatch(setAllConversation(updatedConversation));
      return;



    }

  };

  useEffect(() => {
    setConversations(allConversationAtRedux);
    // dispatch(getConservations());
    socket.on('conversation:removeMembers', (data) => {
      console.log(data);
      console.log(user);

      data.members.map((member) => {
        if (member === user._id) {
          console.log("oke");
          const updatedConversation = allConversationAtRedux.filter(conversation => conversation._id.toString() !== data.conservationId.toString());
          dispatch(setAllConversation(updatedConversation, { position: 'message-removeMember' }));
        }
      })
    });
    socket.on('message:receive', (data) => {
      // allConversationAtRedux.map((conversation) => {
      //   if (data.conversation.type === "group") {
      //     if (conversation._id.toString() === data.conversation._id.toString()) {
      //       console.log("all in");
      //       handleConversationUpdate(data);
      //       return;
      //     }
      //   }




      // })
      handleConversationUpdate(data);

    });
    socket.on('message:deleted', (data) => {
      console.log(data);
      const updateConservation = allConversationAtRedux.map(conversation => {
        if (conversation._id.toString() === data.conversation._id.toString()) {
          console.log("update conversation delete");
          let deleteMessage = { ...conversation.lastMessage, isDelete: true };
          return { ...conversation, lastMessage: deleteMessage }
        }
        return conversation;
      })
      console.log(updateConservation);

      dispatch(setAllConversation(updateConservation, { position: 'message-delete' }))
    }),
      socket.on("conversation:new", (data) => {
        console.log(data);
        data.conversation.members.map((member) => {
          if (member._id.toString() === user._id.toString()) {
            console.log("notification");
            handleConversationUpdate(data);
          }
        }
        )
      }),
      socket.on("conversation:disband", (data) => {
        console.log(data);
        const updatedConversation = allConversationAtRedux.filter(conversation => conversation._id.toString() !== data.conservationId.toString());
        dispatch(setAllConversation(updatedConversation, { position: 'message-disband' }));

      }),
      socket.on("message:notification", (data) => {
        console.log(data);
        // if (data.conversation.members.some(member => member._id === user._id)) {

        data.conversation.members.map((member) => {
          if (member._id === user._id) {
            handleConversationUpdate(data);
            return;

          }
        })
        // console.log("notification");
        // handleConversationUpdate(data);
        // return;

        // }
        // const updatedConversation = allConversationAtRedux.filter(conversation => conversation._id.toString() !== data.conservationId.toString());
        // console.log(updatedConversation);
        // dispatch(setAllConversation(updatedConversation));

        return;

      })

  }, [allConversationAtRedux]);




  // useFocusEffect(
  //   React.useCallback(() => {
  //     // scrollToTop();
  //     getAllConversation();
  //   }, [])
  // );

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false })
    }
  }

  const handleContentSizeChange = () => {
    scrollToTop();
  }

  const handleSetConversation = (data) => {
    console.log(data);
    setConversations(data)
    console.log("set");
  }

  // const getAllConversations = dispatch(getConservations());



  // async function getAllConversation() {
  //   const accessToken = await getAccessToken();
  //   await fetch('http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations', {
  //     method: 'get',
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + accessToken
  //     }
  //   }).then((response) => {
  //     return response.json()
  //   }).then((data) => {
  //     const temp = Object.values(data.data);

  //     const updatedConversations = temp.filter(cv => cv.lastMessage !== null);
  //     setConversations(updatedConversations);
  //     dispatch(setAllConversation(updatedConversations))
  //   })
  //     .catch((err) => {
  //       console.log(err)
  //       return;
  //     })

  // }

  // useEffect(() => {
  //   console.log("run");
  //   setConversations(dispatch(getConservations()))
  // }, [])

  const handleChangeState = (data) => {
    setConversations(data, () => {
      removeConservationNotContent()
    });
  };


  useFocusEffect(
    React.useCallback(() => {
      fetchAllGroup();

    }, [])
  );



  const removeConservationNotContent = () => {
    console.log(conversations);
    const updatedConversations = conversations.filter(cv => cv.lastMessage !== null);
    console.log(updatedConversations);
    setConversations(updatedConversations);
    dispatch(setAllConversation(updatedConversations, { position: 'message-remove-conversation-not-content' }))

  };

  const checkIsFriend = (idTemp) => {
    let isFriendTemp = false;
    console.log("friends", friends);
    idTemp.map((id) => {
      if (id) {
        const friend = friends.find(friend => friend.userId === id);
        if (friend) {
          console.log("friend", friend);
          isFriendTemp = true;
          return isFriendTemp;
        }
        console.log("friend", friend);
      }
    })

    return isFriendTemp;
  }

  const handleOpenConversation = async (members, id) => {
    // const filteredItems = members.filter(member => member._id !== user._id);
    const token = await getAccessToken();

    fetch(`${BASE_URL}/conservations/${id}`,
      {
        method: "GET",
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
          console.log(data.data);
          dispatch(setCurrentConversation(data.data))

          const updatedConversation = allConversationAtRedux.map((conversation) => {
            if (conversation._id.toString() === data.data._id.toString()) {
              return { ...conversation, isReadMessage: true }

            }
            return conversation;
          })
          console.log(updatedConversation);
          dispatch(setAllConversation(updatedConversation, { position: 'message-open-conversation' }));
          if (data.data.type === "private") {
            console.log("private");
            console.log(data.data.members);

            let idTemp = data.data.members.map((member) => {
              if (member._id !== user._id) {
                console.log("member", member._id);
                return member._id;
              }
            });
            console.log("idTemp", idTemp);
            let isFriendTemp = checkIsFriend(idTemp);
            console.log("***8", isFriendTemp);
            navigation.navigate('Chat', { data: data.data, friends: friends, isFriend: isFriendTemp })
            return;
          }
          // let isFriendTemp = checkIsFriend(id);

          // console.log("***8", isFriendTemp);

          // // console.log("***8", isFriend);

          // console.log("friends", friends);
          navigation.navigate('Chat', { data: data.data, friends: friends, isFriend: true })
        }
      })

      .catch((error) => console.log("fetch error", error))

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
    if (item?.lastMessage?.content === undefined) return "";
    else {
      if (item?.lastMessage != null) {
        if (item?.lastMessage?.isDelete) {
          return "This message was deleted";
        }

        if (item.lastMessage?.content.length > 20) {
          console.log(item.lastMessage.content.substring(0, 20) + "...");
          return item.lastMessage.content.substring(0, 20) + "...";
        }

        if (item?.lastMessage?.type === "file" && item?.lastMessage.content !== "This message has been deleted") {
          return "Attachment file";
        }

        return item.lastMessage.content;
      }

      return "";

    }

  }
  const handlePress = () => {
    actionSheetRef.current.show();
  };


  const handleFilterFriendConversation = () => {
    setOnChange('friend')
    const updatedConversations = allConversationAtRedux.
      filter(conversation => conversation.type === "private");
    console.log(updatedConversations);
    setConversations(updatedConversations);

  }

  const handleFilterGroupConversation = () => {
    setOnChange('group')
    const updatedConversations = allConversationAtRedux.
      filter(conversation => conversation.type === "group");
    setConversations(updatedConversations);

  }

  useEffect(() => {
    if (onChange === 'friend') {
      handleFilterFriendConversation();
      return;
    }
    if (onChange === 'group') {
      handleFilterGroupConversation();
      return;
    }
    if (onChange === 'all') {
      setConversations(allConversationAtRedux);

    }

  }, [onChange])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: '#f558a4',
        height: 60,

      },
      headerLeft: () => (
        <View style={{
          height: 60,
          marginTop: -5,
          paddingHorizontal: 10,
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          flex: 1
        }}>
          {/* <View style={{ flexDirection: 'row', gap: 10 }}> */}
          <MaterialCommunityIcons name="magnify" color="white" size={20} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={'#fff'}
            textColor="white"
            style={{
              height: 40,
              color: 'white',
              marginLeft: 10,
              backgroundColor: '#f558a4',
              width: '70%',
            }}
            onChangeText={(text) => setSearch(text)}
          />
          {/* </View> */}
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
              cancelButtonIndex={4}
              onPress={(index) => {

                // Handle the selected option based on the index
                switch (index) {
                  case 0:
                    handleAddFriend();
                    break;
                  case 1:
                    handleAddGroup();
                    break;
                  case 2:
                    handleFilterFriendConversation();
                    break;
                  case 3:
                    handleFilterGroupConversation();
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

  const findConversation = (text) => {

    const updatedConversations = allConversationAtRedux.
      filter(conversation => conversation.name.toLowerCase().includes(text.toLowerCase()));


    // allConversationAtRedux.map((conversation) => { 
    //   if (conversation.members.length === 2 && conversation.name === user.name) {
    //     return conversation;
    //   }
    //   return conversation;
    // })
    setConversations(updatedConversations);
    return updatedConversations;

  }

  const getName = (conversation) => {
    if (conversation.members.length === 2 && conversation.name === user.name) {
      return conversation.members.find((member) => member._id !== user._id).name;
    }
    return conversation.name;
  };
  const getAvatar = (conversation) => {
    if (conversation.members.length === 2 && conversation.image === user.avatar) {
      return conversation.members.find((member) => member._id !== user._id).avatar;
    }
    return conversation.image;
  };


  useEffect(() => {
    findConversation(search);
  }, [search]);


  return (
    <View>
      {onChange === 'friend' ?
        <View style={{
          // backgroundColor: '#f558a4',
          height: 30,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: '50%',
          alignSelf: 'flex-end',
          flexDirection: 'row',
          gap: 10,
          marginRight: 10,
          borderRadius: 10,
          backgroundColor: '#a6a4a4',

        }}
        >
          <MaterialCommunityIcons name="filter-check" color="black" size={20} />

          <Text style={styles.textFilter}>Friend Conversation</Text>
          <Pressable onPress={() => setOnChange("all")}>
            <MaterialCommunityIcons style={{
              marginRight: 10,
              marginBottom: 5,
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 10
            }} name="close" color="black" size={20} onPress={() => setOnChange('all')} />

          </Pressable>

        </View> :

        onChange === 'group' ?
          <View style={{
            // backgroundColor: '#f558a4',
            height: 30,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: '50%',
            alignSelf: 'flex-end',
            flexDirection: 'row',
            gap: 10,
            marginRight: 10,
            borderRadius: 10,
            backgroundColor: '#a6a4a4',


          }}>

            <MaterialCommunityIcons name="filter-check" color="black" size={20} />
            <Text style={styles.textFilter}>Group Conversation</Text>

            <MaterialCommunityIcons style={{
              marginRight: 10,
              marginBottom: 5,
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 10
            }} name="close" color="black" size={20} onPress={() => setOnChange('all')} />



          </View> :

          <View style={{
            height: 30,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 10,
            width: '40%',
            alignSelf: 'flex-end',
            borderRadius: 10,
            backgroundColor: '#a6a4a4',
            flexDirection: 'row',

          }}>
            <Pressable style={{
              height: 30,
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginRight: 20,
              alignSelf: 'flex-end',
              borderRadius: 10,
              backgroundColor: '#a6a4a4',
              flexDirection: 'row',
              gap: 10

            }} onPress={handlePress}>


              <MaterialCommunityIcons name="filter-off" color="black" size={20} />

              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                textAlign: 'center',
                // flex: 1,
              }}>All Conversation</Text>

            </Pressable>
          </View>
      }
      {/* <ScrollView style={styles.container} ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}> */}
      <FlatList
        numColumns={1}
        horizontal={false}
        data={conversations}
        renderItem={({ item }) => (
          <View style={styles.container} key={item._id}>
            <TouchableOpacity style={styles.conversation}
              onPress={() => handleOpenConversation(item.members, item._id)}
            >
              <TouchableOpacity style={[styles.imageContainer, showStoriCircle()]}>
                <Image style={styles.image} source={{ uri: getAvatar(item) }} />
              </TouchableOpacity>
              <View style={{
                flex: 1,
                justifyContent: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text numberOfLines={1} style={styles.username}>{getName(item)}</Text>
                  <Text style={styles.time}>{getTime(item.updatedAt)}</Text>

                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  {item.isReadMessage ? (

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
                        value=" " // Convert the unreadCount to string for display
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


      {/* </ScrollView> */}

    </View>


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
  textFilter: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,


  }
});
export default MessageScreen;