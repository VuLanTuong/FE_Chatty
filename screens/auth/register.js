import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Title, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");


  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpError, setIsSignUpError] = useState(false);

  const validate = () => {
    if (
      phone.length === 0 ||
      phone.length > 10 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      setIsSignUpError(true);
      return false;
    }
    if (password !== confirmPassword) {
      setIsSignUpError(true);
      return false;
    }
    return true;
  };

  // CHECK PHONE NUMBER EXIST

  // const checkPhoneNumber = async (phone) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/users?phoneNumber=${phoneNumber}`
  //     );
  //     const result = await response.json();
  //     if (response.ok) {
  //       return result.length;
  //     } else {
  //       throw new Error(result.error);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return false;
  //   }
  // };

  const handleSignUp = async () => {
    try {
      // const isPhoneNumberExists = await checkPhoneNumber(phoneNumber);
      // if (isPhoneNumberExists || !validate()) {
      //   setIsSignUpError(true);
      //   return;
      // }
      const response = await fetch("http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          dateOfBirth
        }),
      });

      if (response.ok) {
        console.log("ok");
        navigation.navigate("Login");
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

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
          style={[styles.input, isSignUpError && styles.errorInput]}
          label="Name"
          underlineColorAndroid="transparent"
          keyboardType="default"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.inputContainer}>

        <TextInput
          style={[styles.input, isSignUpError && styles.errorInput]}
          label="Email"
          underlineColorAndroid="transparent"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isSignUpError && styles.errorInput]}
          label="Phone"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isSignUpError && styles.errorInput]}
          label="Date of birth"
          underlineColorAndroid="transparent"
          keyboardType="default"
          value={dateOfBirth}
          onChangeText={(text) => setDateOfBirth(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isSignUpError && styles.errorInput]}
          label="Password"
          underlineColorAndroid="transparent"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isSignUpError && styles.errorInput]}
          label="Confirm Password"
          underlineColorAndroid="transparent"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>

      <View style={styles.btnContainer}>
        <Button mode="contained" style={styles.btn} onPress={handleSignUp}>
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
  errorInput: {
    backgroundColor: "#ffcccc",
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
  },
});

export default register;
