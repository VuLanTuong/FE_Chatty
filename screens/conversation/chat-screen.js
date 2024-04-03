import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Animated
} from "react-native";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { getAccessToken } from "../user-profile/getAccessToken";
import { findFriendById } from "../../service/friend.util";
import { useFocusEffect } from '@react-navigation/native';
import HeaderChat from "./header.chat-ui";

const ChatScreen = ({ navigation, route }) => {

  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [friend, setFriend] = useState();
  const data = route.params.data;
  console.log(data);

  const [text, setText] = useState("");
  // const fetchFriendInConversation = async () => {
  //   const friend = await findFriendById(data.member[1]._id);
  //   console.log(friend);

  // }

  const memeber1 = data.members[1];

  useFocusEffect(
    React.useCallback(() => {
      getAllMessage();
    }, [text])
  );




  const getAllMessage = async () => {
    const token = await getAccessToken();
    fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${data._id}/messages?page=1&limit=50`,
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
        reverseData(data.data)
      })

      .catch(() => console.log("fetch error"))


  }

  const reverseData = (data) => {
    setMessages(data.reverse())

  }

  const handleSendTextMessage = async () => {
    console.log("send text");
    console.log(text);
    const token = await getAccessToken();
    fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${data._id}/messages/sendText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          content: text
        }

        )
      }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.status === "fail") {
          console.log("fail");
          return;
        }
      }).then(() => setText(''))
      .catch(() => console.log("fetch error"))

  }
  const getTime = (updateAt) => {

    console.log(typeof (updateAt));
    const date = new Date(updateAt);

    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${hour}:${minute}`;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("MessageScreen")}
            style={{ marginHorizontal: 15, marginLeft: 0 }}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
            }}
          ></TouchableOpacity>
        </View>
      ),
      headerRight: () =>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

          <TouchableOpacity style={{ marginHorizontal: 10 }}>
            <Feather name="phone" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10 }}>
            <Feather name="video" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10 }}>
            <AntDesign name="profile" size={24} color="white" />
          </TouchableOpacity>
        </View>



    });
  }, []);


  return (
    <SafeAreaView>
      {/* Render Messages */}
      <View style={{ justifyContent: 'flex-end' }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={messages}
          // keyExtractor={(message) => item._id.toString()}
          renderItem={({ item }) => (
            <KeyboardAvoidingView>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-end",
                  marginVertical: 5,
                  marginHorizontal: 10,
                  justifyContent:
                    item.isMine == true ? "flex-end" : "flex-start",
                }}
              >
                {item.isMine == false && (
                  <Image
                    source={{ uri: item.avatar }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginRight: 5,
                    }}
                  />
                )}
                <View
                  style={{
                    backgroundColor:
                      item.isMine == true ? "#ffadd5" : "lightgray",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flexDirection: 'column',
                    gap: 5

                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                    }}>{item.content}</Text>

                  <Text
                    style={{
                      fontSize: 12,
                    }}>{getTime(item.updatedAt)}</Text>


                </View>
                {item.isMine == true && (
                  <Image
                    source={{ uri: item.avatar }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginLeft: 5,
                    }}
                  />
                )}
              </View>
            </KeyboardAvoidingView>

          )
          }

        />

        {/* <FlatList
          data={messages}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 5,
                marginHorizontal: 10,
                justifyContent:
                  item.user._id === 1 ? "flex-end" : "flex-start",
              }}
            >
              {item.user._id !== 1 && (
                <Image
                  source={{ uri: item.user.avatar }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    marginRight: 5,
                  }}
                />
              )}
              <View
                style={{
                  backgroundColor:
                    item.user._id === 1 ? "#DCF8C5" : "lightgray",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,

                  }}>{item.text}</Text>
              </View>
              {item.user._id === 1 && (
                <Image
                  source={{ uri: item.user.avatar }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    marginLeft: 5,
                  }}
                />
              )}
            </View>
          )}
          inverted
        /> */}
      </View>

      {/*Render Input */}
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            marginHorizontal: 10,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 15,

          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "space-between",

            }}
          >
            <TouchableOpacity
              style={{
              }}
            >
              <MaterialCommunityIcons
                name="sticker-emoji"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Message..."
              style={{
                fontSize: 20,
              }}
              value={text}
              onChangeText={(text) => { setText(text) }}
            // onFocus={() => setIsFocused(true)}
            // onBlur={() => setIsFocused(false)}
            />

            <Pressable>
              <AntDesign name="ellipsis1" size={24} color="black" />
            </Pressable>
            <Pressable>
              <Octicons name="image" size={24} color="black" />
            </Pressable>
            <Pressable style={{ marginHorizontal: 5 }} onPress={() => handleSendTextMessage()}>
              <Feather name="send" size={24} color="black" />
            </Pressable>



          </View>
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView >
  );
};

export default ChatScreen;
