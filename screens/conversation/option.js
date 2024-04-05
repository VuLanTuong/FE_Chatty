import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Avatar, Button, Divider } from "react-native-paper";

export default function option({ navigation }) {
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
          <Pressable>
            <Avatar.Image
              source={{
                uri: "https://www.mobafire.com/images/champion/skins/landscape/ahri-kda-prestige-762x.jpg",
              }}
              size={100}
            />
          </Pressable>
        </View>
        <Text style={styles.userName}>Name</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button mode="text">
          <View style={{ flexDirection: "column" }}>
            <MaterialCommunityIcons
              name="file-find-outline"
              size={24}
              color="black"
            />
            <Text style={{color: 'black'}}>Search</Text>
            <Text style={{color: 'black'}}>messages</Text>
          </View>
        </Button>
        <Button mode="text">
          <View style={{ flexDirection: "column" }}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="black"
            />
            <Text style={{color: 'black'}}>View</Text>
            <Text style={{color: 'black'}}>profile</Text>
          </View>
        </Button>
        <Button mode="text">
          <View style={{ flexDirection: "column" }}>
            <MaterialCommunityIcons
              name="format-paint"
              size={24}
              color="black"
            />
            <Text style={{color: 'black'}}>Change</Text>
            <Text style={{color: 'black'}}>background</Text>
          </View>
        </Button>
        <Button mode="text">
          <View style={{ flexDirection: "column" }}>
            <MaterialCommunityIcons
              name="volume-mute"
              size={24}
              color="black"
            />
            <Text style={{color: 'black'}}>Mute</Text>
          </View>
        </Button>
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
        <Button>
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={24}
            color="black"
          />
          <Text style={styles.textFunc}>Add Name to group</Text>
        </Button>
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
          <Text style={{ color: "red" , marginLeft: 20}}>Delete chat history</Text>
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
    gap: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  userName: {
    marginTop: 5,
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
    alignItems: 'flex-start'
  }, 
  textFunc: {
    color: 'black',
    marginLeft: 20
  }
});
