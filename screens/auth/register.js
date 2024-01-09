import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
} from "react-native-paper";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.text}>
        <Title style={styles.title}>Register</Title>
      </View>
      <View style={styles.signupContainer}>
        <Paragraph style={styles.signupText}>
          Do not have an account yet?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("Login")}
          >
            Log in
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Confirm Password"
          underlineColorAndroid="transparent"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>

      <View style={styles.btnContainer}>
        <Button mode="contained" style={styles.btn}>
          Register
        </Button>
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
  btnContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 25,
  }
});

export default Login;
