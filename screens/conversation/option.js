import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, Divider } from "react-native-paper";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { findFriendById } from "../../service/friend.util";
export default function option({ navigation, route }) {
  const conservationParam = route.params.data;

  console.log(conservationParam);
  const user = useSelector((state) => state.user.user);

  //  navigation.navigate('FriendProfile', { friend: data.data });

  const handleGetMember = async () => {
    conservationParam.members.map(async (member) => {
      if (member._id !== user._id) {
        const friend = await findFriendById(member._id);
        return friend;
      }
      else {
        return null;

      }
    })

  }

  const handleProfileScreen = async () => {
    conservationParam.members.map(async (member) => {
      if (member._id !== user._id) {
        const friend = await findFriendById(member._id);
        console.log(friend);
        navigation.navigate('FriendProfile', { friend: friend });

      }
      else {
        return;

      }
    })
  }
  useLayoutEffect(() => {

    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10
        }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { data: conservationParam })}
            style={{ marginHorizontal: 15, marginLeft: 0 }}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>

        </View>
      ),
    })
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={() => handleProfileScreen()} >
            <Avatar.Image
              source={{
                uri: conservationParam.image,
              }}
              size={100}
            />
          </Pressable>
        </View>
        <Text style={styles.userName}>{conservationParam.name}</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flex: 1,
            alignItems: "flex-start"
          }}
        >
          <Button mode="text">
            <View style={{ flexDirection: "column" }}>
              <MaterialCommunityIcons
                name="file-find-outline"
                size={24}
                color="black"
              />
              <Text style={{ color: 'black' }}>Search</Text>
              <Text style={{ color: 'black' }}>messages</Text>
            </View>
          </Button>
          <Button mode="text" onPress={() => handleProfileScreen()}>
            <View style={{ flexDirection: "column" }}>
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color="black"
              />
              <Text style={{ color: 'black' }}>View</Text>
              <Text style={{ color: 'black' }}>profile</Text>
            </View>
          </Button>
          <Button mode="text">
            <View style={{ flexDirection: "column" }}>
              <MaterialCommunityIcons
                name="format-paint"
                size={24}
                color="black"
              />
              <Text style={{ color: 'black' }}>Change</Text>
              <Text style={{ color: 'black' }}>background</Text>
            </View>
          </Button>
          <Button mode="text">
            <View style={{ flexDirection: "column" }}>
              <MaterialCommunityIcons
                name="volume-mute"
                size={24}
                color="black"
              />
              <Text style={{ color: 'black' }}>Mute</Text>
            </View>
          </Button>
        </View>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.function}>
        <Button>
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={24}
            color="black"
          />
          <Text style={styles.textFunc}>Change alias name</Text>
        </Button>
        <Divider style={styles.divider} />
        <Button>
          <MaterialCommunityIcons name="file" size={24} color="black" />
          <Text style={styles.textFunc}>Sent media, files, links</Text>
        </Button>
        <Divider style={styles.divider} />
        <Button>
          <MaterialCommunityIcons
            name="account-multiple-plus-outline"
            size={24}
            color="black"
          />
          <Text style={styles.textFunc}>Create group with Name</Text>
        </Button>
        <Divider style={styles.divider} />
        <Button>
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={24}
            color="black"
          />
          <Text style={styles.textFunc}>Add Name to group</Text>
        </Button>
        <Divider style={styles.divider} />
        <Button>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={24}
            color="black"
          />
          <Text style={styles.textFunc}>View group in common</Text>
        </Button>
        <Divider style={styles.divider} />
        <Button>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="red"
          />
          <Text style={{ color: "red", marginLeft: 20 }}>Delete chat history</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    gap: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  userName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    height: 40,
  },
  divider: {
    marginTop: 5,
  },
  function: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 50
  },
  textFunc: {

    color: 'black',
    marginLeft: 20
  }
});
