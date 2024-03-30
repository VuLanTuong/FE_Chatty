import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { TextInput, Button, Title, Paragraph, RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../../rtk/user-slice";
import DatePicker from 'react-datepicker'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-toast-message';

import "react-datepicker/dist/react-datepicker.css";

const register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [open, setOpen] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpError, setIsSignUpError] = useState(false);
  const [gender, setGender] = useState("female");
  const [noti, setNoti] = useState('')

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
    if (phoneExist(phone)) {
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
        dateOfBirth: date,
        gender,
      })
    }).then((response) => {
      console.log(response);
      return response.json()

    }).then((data) => {
      if (data.status === 'fail') {
        return Toast.show({
          type: 'error',
          text1: data.message,
          position: 'top',
          visibilityTime: 2000,

        });
      }
      console.log(data);


      storeData(data.data.token.access_token)
      dispatch(login({
        user: data.data.user
      }))
      Toast.show({
        type: 'success',
        text1: 'Register successfull',
        position: 'top',
        visibilityTime: 2000,

      });

      navigation.navigate("Home");
    }).catch((error) => {
      console.log(error.message);

    })

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
      <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      dateFormat="dd/MM/yyyy"
      placeholderText="Select a date"
    />
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
        <View style={styles.genderCheck}>
          <RadioButton
            status={gender === 'Male' || gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('male')}
            color="#f558a4"
            value='Male'
          />
          <Text style={styles.checkboxLabel}>Male</Text>
          <RadioButton
            status={gender === 'Female' || gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
            olor="#f558a4"
            value='Female'
          />
          <Text style={styles.checkboxLabel}>Female</Text>
        </View>

        <TextInput style={[styles.input, isSignUpError && styles.errorInput]}
          label="Date of birth"
          underlineColorAndroid="transparent"
          value={date}
          onChangeText={(text) => setDate(text)} />


      </View>
      <View style={styles.inputContainer}>

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
  checkboxLabel: {
    marginTop: 7
  },
  genderCheck: {
    flexDirection: 'row',
    gap: "10px"
  }
});

export default register;
