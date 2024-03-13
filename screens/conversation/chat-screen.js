import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
const ChatScreen = ({ navigation }) => {

  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Fetch messages from server
    setMessages([
      {
        _id: 1,
        text: "Hello",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Jenifer",
          avatar:
            "https://img.lazcdn.com/g/shop/bcdcd66a784bdd39a5063f150a128122.png_960x960q80.png_.webp",
        },
      },
      {
        _id: 2,
        text: "Hi",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "John",
          avatar:
            "https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg",
        },
      },
    ]);
  }, []);
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      {/*Render Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 5,
          backgroundColor: "#f558a4",
          borderBottomColor: "gray",
          borderBottomWidth: 0.2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginHorizontal: 15, marginLeft: 0 }}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
            }}
          >
            <View>
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 4,
                  height: 10,
                  width: 10,
                  backgroundColor: "green",
                  borderRadius: 5,
                  zIndex: 1,
                  borderWidth: 999,
                  borderWidth: 2,
                  borderColor: "white",
                }}
              />
              <Image
                source={{
                  uri: "https://img.lazcdn.com/g/shop/bcdcd66a784bdd39a5063f150a128122.png_960x960q80.png_.webp",
                }}
                resizeMode="contain"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Jenifer
              </Text>
              <Text style={{ color: "white" }}>Active now</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
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
      </View>
      {/* Render Messages */}
      <View style={{ flex: 1 }}>
        <FlatList
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
        />
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
              onChangeText={() => { }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <TouchableOpacity
              style={{
              }}
            >
              <AntDesign name="ellipsis1" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
              }}
            >
              <Octicons name="image" size={24} color="black" />
            </TouchableOpacity>

            {isFocused ? (
              <TouchableOpacity style={{ marginHorizontal: 5 }}>
                <Feather name="send" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  marginHorizontal: 5,
                }}
              >
                <Feather name="mic" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
