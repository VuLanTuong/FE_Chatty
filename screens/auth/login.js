import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  Checkbox,
} from "react-native-paper";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const onPressCheckbox = () => {
    setChecked(!checked);
  };

  // const onLogin = () => {
  //   const usersJson = require("../../data/db.json");
  //   const users = usersJson.users;
  //   users.find((user) => {
  //     console.log(phoneNumber, password)
  //     console.log(user.phoneNumber, user.password)
  //     if (user.phoneNumber === phoneNumber && user.password === password) {
  //       Alert.alert("Login success");
  //       console.log("Login success");
  //     } else {
  //       Alert.alert("Login failed");
  //     }

  //   });
  // };
  const onLogin = () => {
    const usersJson = require("../../data/db.json");
    const users = usersJson.users;
    let userFound = false;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(phoneNumber, password);
      console.log(user.phoneNumber, user.password);
      if (user.phoneNumber === phoneNumber && user.password === password) {
        navigation.navigate("Home");
        Alert.alert("Login success");
        console.log("Login success");
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      Alert.alert("Login failed");
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
          style={styles.input}
          label="Phone"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Password"
          underlineColorAndroid="transparent"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.checkContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={onPressCheckbox}
        />
        <Paragraph style={styles.checkText}>Remember me</Paragraph>
      </View>
      <View style={styles.btnContainer}>
        <Button mode="contained" style={styles.btn} onPress={onLogin}>
          Login
        </Button>
      </View>
      <View style={styles.forgetContainer}>
        <TouchableRipple onPress={() => {}}>
          <Caption style={styles.forgetText}>Forgot password?</Caption>
        </TouchableRipple>
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
    color: "#3f51b5",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f5f5f5",
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
  },
  forgetContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  forgetText: {
    color: "#3f51b5",
  },
});

export default Login;
