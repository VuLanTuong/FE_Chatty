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
import { useDispatch } from "react-redux";
import { login } from "../../rtk/user-slice";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [loginError, setLoginError] = useState(false);


  const dispatch = useDispatch();
  const onPressCheckbox = () => {
    setChecked(!checked);
  };
  const onLogin = () => {
    fetch("http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phoneNumber,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(login({
          status: data.status,
          message: data.message,
          data: data.data
        }));
        if (data.status === "success") {
          navigation.navigate("Home");
        } else {
          // Đăng nhập thất bại
          setLoginError(true);
        }
      });
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
          label="Phone"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, loginError && styles.errorInput]}
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
        <Button mode="contained" style={styles.btn} onPress={() => onLogin()}>
          Login
        </Button>
      </View>
      <View style={styles.forgetContainer}>
        <TouchableRipple onPress={() => { }}>
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
