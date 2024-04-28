import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import {
  TextInput,
  Button,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  Checkbox,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import { getConservations, login, setFriend } from "../../rtk/user-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeToken, getAccessToken } from "../user-profile/getAccessToken";
import { findFriendById } from "../../service/friend.util";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchAllGroup } from "../../service/conversation.util";

const Login = ({ navigation }) => {
  const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555/api/v1"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };
  const dispatch = useDispatch();
  const onPressCheckbox = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const token = getAccessToken().then((token) => {
      if (token) {
        console.log(token);
        const user = fetch(
          `${BASE_URL}/users/getMe`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "fail") {
              console.log("fail");
              return;
            }
            console.log("response", data);
            return data.data;
          })
          .catch((error) => {
            console.log("Error:", error);
          });
        const temp = user.then((user) => {
          console.log(user);

          dispatch(
            login({
              user: user,
            })
          );
          fetchAllGroup()
          console.log(user);
          fetchAllFriend();

          // const friendList = findFriendById(user._id).then((friend) => {
          //   console.log(friend);
          //   const list = friend.friend;
          //   dispatch(setFriend({
          //     friends: list
          //   }))
          //   log
          // })
          navigation.navigate("Home");
        });
      }
    });
  }, []);

  // const handleemail = (text) => {
  //   const numericValue = text.replace(/[^0-9]/g, "");
  //   setEmail(numericValue);
  // };

  async function fetchAllFriend() {
    console.log("fetch all friend");
    // use redux to get current user
    const accessToken = await getAccessToken();
    await fetch(
      `${BASE_URL}/friends`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch(
          setFriend({
            friends: data.data,
          })
        );
        console.log("ok");
      });
  }

  const validateEmail = (email) => {
    let re = /^[a-zA-Z0-9](?!.*[&=_'\-+<>])[\w.]{4,28}(?<![.])@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/;
    return re.test(email);
  }

  const onLogin = () => {
    if (email && password) {

      if (validateEmail(email)) {
        fetch(
          `${BASE_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.status === "success") {
              console.log(data.data.token.access_token);
              storeToken(data.data.token.access_token);
              Toast.show({
                type: "success",
                text1: "Login successful",
                position: "top",
                visibilityTime: 4000,
              });
              dispatch(
                login({
                  user: data.data.user,
                })
              );
              setPassword("");
              setLoginError(false);
              navigation.navigate("Home");
            } else {
              Toast.show({
                type: "error",
                text1: "Email or password incorrect",
                position: "top",
                visibilityTime: 4000,
              });
              setLoginError(true);
            }
          });

      }
      else {
        Toast.show({
          type: "error",
          text1: "Please enter your valid email",
          position: "top",
          visibilityTime: 4000,
        });

      }
    }
    else {
      Toast.show({
        type: "error",
        text1: "Please enter your email and password",
        position: "top",
        visibilityTime: 4000,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.text}>
        <Title style={styles.title}>Login</Title>
      </View>
      <View style={styles.signupContainer}>
        <Paragraph style={styles.signupText}>
          Do not have an account yet?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("Register")}
          >
            Sign up
          </Text>
        </Paragraph>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, loginError && styles.errorInput]}
          label="Email"
          underlineColorAndroid="transparent"
          value={email}
          maxLength={40}
          onChangeText={(text) => setEmail(text.trim())}
        />
      </View>
      <View
        style={{
          marginBottom: 5,
          flexDirection: "row",
        }}
      >
        <TextInput
          style={[styles.input, loginError && styles.errorInput]}
          label="Password"
          underlineColorAndroid="transparent"
          secureTextEntry={!showNewPassword}
          value={password}
          onChangeText={(text) => setPassword(text.trim())}
        />
        <Pressable
          onPress={toggleNewPasswordVisibility}
          style={styles.iconContainer}
        >
          <MaterialCommunityIcons
            name={!showNewPassword ? "eye-off" : "eye"}
            size={20}
            style={styles.eyeIcon}
          />
        </Pressable>
      </View>

      <View style={styles.btnContainer}>
        <Button mode="contained" style={styles.btn} onPress={() => onLogin()}>
          Login
        </Button>
      </View>
      <View style={styles.forgetContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("ForgotPassword");
          }}
        >
          <Text style={styles.forgetText}>Forgot password?</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 70,
  },
  text: {
    alignItems: "left",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  signupContainer: {
    marginTop: 10,
    alignItems: "left",
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    color: "#f558a4",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingLeft: 10,
    width: "100%",
  },
  errorInput: {
    backgroundColor: "#ffcccc",
    paddingLeft: 10,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkText: {
    fontSize: 14,
    marginLeft: 5,
  },
  btnContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f558a4",
    justifyContent: "center",
  },
  forgetContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  forgetText: {
    color: "#f558a4",
    fontWeight: 500,
    fontSize: 15,
  },
  iconContainer: {
    marginRight: 20,
    position: "absolute",
    right: 0,
    top: "40%",
  },
});

export default Login;
