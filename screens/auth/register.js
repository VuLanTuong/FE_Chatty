import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { TextInput, Button, Title, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../../rtk/user-slice";
import DatePicker from 'react-native-date-picker'
import DateTimePickerModal from "react-native-modal-datetime-picker";
const register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [open, setOpen] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpError, setIsSignUpError] = useState(false);

  const dispatch = useDispatch();

  const showDatePicker = () => {
    setDatePickerVisibility(true);

  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    console.log(isDatePickerVisible);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };



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
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('access-token', value);

      console.log("saved" + await AsyncStorage.getItem('access-token'));;
    } catch (e) {
      console.error(e);
    }
  };
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
        storeData(data.data.token.access_token)
        dispatch(login({
          user: data.data.user
        }))

        navigation.navigate("Home");
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
        {/* <Pressable onPress={showDatePicker}>
          <TextInput
            style={[styles.input, isSignUpError && styles.errorInput]}
            label="Date of birth"
            underlineColorAndroid="transparent"
            keyboardType="default"
            value={dateOfBirth}
            onFocus={showDatePicker}
            editable={false}
          />
        </Pressable>
        {isDatePickerVisible && (
          <DatePicker
            modal
            open={open}
            date={dateOfBirth}
            onConfirm={(dateOfBirthte) => {
              setDatePickerVisibility(false)
              setDateOfBirth(date)
            }}
            onCancel={() => {
              setDatePickerVisibility(false)
            }}
          />
        )} */}

        {/* <Pressable onPress={showDatePicker}>
          <Text>Date of birth</Text>
        </Pressable>
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={(date) => {
            setDatePickerVisibility(false)
            setDate(date)
          }}
          onCancel={() => {
            setDatePickerVisibility(false)
          }}
        /> */}

        {/* 
        <Button title="Show Date Picker" onPress={showDatePicker} />
        <DateTimePickerModal
          date={date}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        /> */}
        <TextInput style={[styles.input, isSignUpError && styles.errorInput]}
          label="Date of birth"
          underlineColorAndroid="transparent"
          value={date}
          onChangeText={(text) => setDate(text)} />


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
