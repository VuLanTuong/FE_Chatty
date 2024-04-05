import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Divider, Avatar, Button } from "react-native-paper";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native";
export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user.user);
  console.log(user);

  const removeToken = async () => {
    console.log("log out");
    try {
      await AsyncStorage.removeItem("access-token");
      console.log("removed");
      console.log(AsyncStorage.getItem("access-token"));
      navigation.navigate("Login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView>
      <View style={{}}>
        <View
          style={{
            backgroundColor: "#f558a4",
            flexDirection: "row",
            width: "100%",
            gap: 15,
            height: 70,
            marginBottom: 10,
          }}
        >
          {/* // onPress to view detail of the user */}
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("DetailProfile");
            }}
          >
            <Avatar.Image
              source={{ uri: user.avatar }}
              style={{
                margin: 5,
              }}
            />
            {/* <Image source={{ uri: user.avatar }} style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        marginTop: 5,
                        border: '1px solid white',
                        marginLeft: 5
                    }} /> */}

            {/* get current user in redux */}
            <View
              style={{
                marginLeft: 10,
                flexDirection: "column",
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {user.name}
              </Text>
              <Text
                style={{
                  color: "white",
                }}
              >
                View profile
              </Text>
            </View>
          </Pressable>
        </View>
        {/* <Divider style={styles.divider} /> */}
        <View>
          <Button
            mode="elevated"
            icon={({ color, size }) => (
              <Icon name="form-textbox-password" color={color} size={size} />
            )}
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              height: 50,
              width: "100%",
              borderRadius: 0,
            }}
            onPress={() => {
              navigation.navigate("ChangePassword");
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Change password
            </Text>
          </Button>
          <Divider style={styles.dividerForMenu} />
          <Button
            mode="elevated"
            icon={({ color, size }) => (
              <Icon name="security" color={color} size={size} />
            )}
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              height: 50,
              width: "100%",
              marginBottom: 5,
              borderRadius: 0,
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                color: "black",
              }}
            >
              Account and security
            </Text>
          </Button>
          {/* <Button
            mode="elevated"
            icon={({ color, size }) => (
              <Icon name="lock" color={color} size={size} />
            )}
            style={{
              marginLeft: 10,
              marginTop: 10,
              color: "black",
            }}
          >

            Change password

          </Button> */}
          <Divider style={styles.dividerForMenu} />

          <Button
            mode="elevated"
            icon={({ color, size }) => (
              <Icon name="security" color={color} size={size} />
            )}
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              height: 50,
              width: "100%",
              marginBottom: 5,
              borderRadius: 0,
            }}
          >
            <Text
              style={{
                marginLeft: 10,
                color: "black",
              }}
            >
              Account and security
            </Text>
          </Button>
          <Button
            mode="elevated"
            icon={({ color, size }) => (
              <Icon name="lock" color={color} size={size} />
            )}
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              height: 50,
              width: "100%",
              borderRadius: 0,
            }}>
            <Text
              style={{
                marginLeft: 10,
                color: "black",
              }}
            >
              Privacy
            </Text>
          </Button>
          <Divider style={styles.dividerForMenu} />
          <Button
            onPress={() => removeToken()}
            mode="contained"
            icon={({ color, size }) => (
              <Icon name="logout" color={color} size={size} />
            )}
            style={{
              height: 50,
              width: "100%",
              backgroundColor: "#f558a4",
              alignContent: "center",
              justifyContent: "center",
              borderRadius: 0,
            }}
          >
            <Text
              style={{
                height: 50,
                width: "100%",
                backgroundColor: "#f558a4",
                alignContent: "center",
                justifyContent: "center",
                borderRadius: 0,
              }}
            >  </Text>
            <Text
              style={{
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              Log out
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  divider: {
    height: 2,
    backgroundColor: "#bebec2",
    marginTop: 5,
    marginBottom: 10,
  },
  dividerForMenu: {
    height: 2,
    backgroundColor: "#bebec2",
    marginTop: 10,
    marginBottom: 10,
  },
});
