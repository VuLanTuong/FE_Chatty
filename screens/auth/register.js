import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  RadioButton,
} from "react-native-paper";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../../rtk/user-slice";
import Toast from "react-native-toast-message";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
// import "react-datepicker/dist/react-datepicker.css";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(dayjs());
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUpError, setIsSignUpError] = useState(false);
  const [gender, setGender] = useState("female");

  const [showModal, setShowModal] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prevState) => !prevState);
  };
  const dispatch = useDispatch();

  const handlePhoneNumber = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  };


  const validate = () => {
    const phoneRegex = /^(03|05|07|08|09|01[2689])([0-9]{8})\b/;

    if (!phone.match(phoneRegex)) {
      console.log("phone invalid");
      return false
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
      await AsyncStorage.setItem("access-token", value);

      console.log("saved" + (await AsyncStorage.getItem("access-token")));
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

    if (phone.match(/^(03|05|07|08|09|01[2689])([0-9]{8})\b/)) {
      if (confirmPassword === password) {


        const response = await fetch(
          "http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              phone,
              password,
              dateOfBirth: date.format("YYYY-MM-DD"),
              gender,
            }),
          }
        )
          .then((response) => {
            console.log(response);
            return response.json();
          })
          .then((data) => {
            if (data.status === "fail") {
              return Toast.show({
                type: "error",
                text1: data.message,
                position: "top",
                visibilityTime: 2000,
              });
            }
            console.log(data);

            storeData(data.data.token.access_token);
            dispatch(
              login({
                user: data.data.user,
              })
            );
            Toast.show({
              type: "success",
              text1: "Register successfull",
              position: "top",
              visibilityTime: 2000,
            });

            navigation.navigate("Home");
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
      else {
        Toast.show({
          type: "error",
          text1: "Password and confirm password not match",
          position: "top",
          visibilityTime: 4000,
        });
      }
    }
    else {
      Toast.show({
        type: "error",
        text1: "Phone must be valid in Viet Nam",
        position: "top",
        visibilityTime: 4000,
      });
    }
  }




  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps='handled'
    >
      <View style={styles.container}>
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
        <View style={styles.genderCheck}>
          <Text style={{
            marginTop: 8,
            marginLeft: 5
          }}>Gender</Text>
          <RadioButton
            status={
              gender === "Male" || gender === "male" ? "checked" : "unchecked"
            }
            onPress={() => setGender("male")}
            color="#f558a4"
            value="Male"
          />
          <Text style={styles.checkboxLabel}>Male</Text>
          <RadioButton
            status={
              gender === "Female" || gender === "female" ? "checked" : "unchecked"
            }
            onPress={() => setGender("female")}
            color="#f558a4"
            value="Female"
          />
          <Text style={styles.checkboxLabel}>Female</Text>
        </View>
        <View style={styles.inputContainer}>
          <Pressable onPress={toggleModal} style={styles.modalButton}>
            <TextInput
              label={"Date of birth"}
              value={date.format("YYYY-MM-DD")}
            />
          </Pressable>
          <Modal isVisible={showModal} onBackdropPress={toggleModal}>
            <View style={styles.modalContent}>
              <DateTimePicker
                mode="single"
                date={date}
                onChange={(params) => setDate(params.date)}
              />
              <Button style={{ backgroundColor: '#f558a4' }} onPress={toggleModal}>OK</Button>
            </View>
          </Modal>
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
            maxLength={10}
            onChangeText={handlePhoneNumber}
          />
        </View>
        <View style={{
          marginBottom: 5,
          flexDirection: 'row'
        }}>
          <TextInput
            style={[styles.input, isSignUpError && styles.errorInput]}
            label="Password"
            underlineColorAndroid="transparent"
            secureTextEntry={!showNewPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Pressable
            onPress={toggleNewPasswordVisibility}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name={!showNewPassword ? 'eye-off' : 'eye'}
              size={20}
              style={styles.eyeIcon}
            />
          </Pressable>

        </View>
        <View style={{
          marginBottom: 5,
          flexDirection: 'row'
        }}>
          <TextInput
            style={[styles.input, isSignUpError && styles.errorInput]}
            label="Confirm Password"
            underlineColorAndroid="transparent"
            secureTextEntry={!showConfirmNewPassword}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <Pressable
            onPress={toggleConfirmNewPasswordVisibility}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name={!showConfirmNewPassword ? 'eye-off' : 'eye'}
              size={20}
              style={styles.eyeIcon}
            />
          </Pressable>

        </View>

        <View style={styles.btnContainer}>
          <Button mode="contained" style={styles.btn} onPress={handleSignUp}>
            Register
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 40,
    gap: 10,
  },
  text: {
    alignItems: "left",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 10,
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
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingLeft: 10,
    width: '100%'
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
    backgroundColor: "#f558a4",
  },
  checkboxLabel: {
    marginTop: 7,
  },
  genderCheck: {
    flexDirection: "row",
    gap: "10px",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    marginRight: 20,
    position: 'absolute',
    right: 0,
    top: '40%'

  },
});

export default register;
