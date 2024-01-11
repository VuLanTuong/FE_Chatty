import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Title, Paragraph } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

const register = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpError, setIsSignUpError] = useState(false);

  const validate = () => {
    if (
      phoneNumber.length === 0 ||
      phoneNumber.length > 10 ||
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

  const checkPhoneNumber = async (phoneNumber) => {
    try {
       const response = await fetch(`http://localhost:3000/users?phoneNumber=${phoneNumber}`);
       const result = await response.json();
       if (response.ok) {
         return result.length;        
       } else {
         throw new Error(result.error);
       }
    } catch (error) {
       console.error(error);
       return false;
    }
   };

   const handleSignUp = async () => {
    try {
      const isPhoneNumberExists = await checkPhoneNumber(phoneNumber);
       if (isPhoneNumberExists || !validate()) {
        setIsSignUpError(true);
         return;
       }
   
       const response = await fetch('http://localhost:3000/users', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ phoneNumber, password }),
       });
   
       if (response.ok) {
         navigation.navigate('Login');
       } else {
         const error = await response.json();
         alert(error.error);
       }
    } catch (error) {
       console.error(error);
       alert('Something went wrong. Please try again.');
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
          label="Phone"
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
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
