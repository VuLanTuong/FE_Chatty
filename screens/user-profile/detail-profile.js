import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import {
  Divider,
  Checkbox,
  RadioButton,
  Avatar,
  TextInput,
  Button,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { launchImageLibrary } from "react-native-image-picker";
import { getAccessToken } from "./getAccessToken";
// import ImagePicker from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from "react-redux";
import { login, changeAvatar } from "../../rtk/user-slice";
import Toast from "react-native-toast-message";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import Modal from "react-native-modal";

export default function DetailProfile({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [gender, setGender] = useState(user.gender);
  const [dateOfBirth, setDateOfBirth] = useState(dayjs(user.dateOfBirth));
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState(user.email);

  console.log(name);

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = async () => {
    setIsEditing(false);
    console.log(name);
    console.log(dateOfBirth);
    console.log(gender);

    const dateString = dateOfBirth;

    const dateObject = new Date(dateString);

    // Use the Date object methods to format the date as required
    const formattedDate = dateObject.toDateString();

    console.log(formattedDate);
    const accessToken = await getAccessToken();
    console.log("access token", accessToken);
    fetch(
      "http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/updateMe",
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          dateOfBirth: dateOfBirth,
          gender: gender,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch(
          login({
            user: data.data,
          })
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const formatDateOfBirth = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${day}/${month}/${year}`;
  };

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      handleUploadPhoto(result.assets[0].uri);
    }
  };


  const handleUploadPhoto = async (imageUri) => {
    const accessToken = await getAccessToken();
    console.log("photo", imageUri);

    fetch(
      "http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/updateAvatarV2",
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + accessToken,

          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: imageUri }),
      }
    )
      .then((response) => {
        console.log("response", response);
        return response.json();
      })
      .then((data) => {
        dispatch(changeAvatar({ avatar: imageUri }));
        Toast.show({
          type: "success",
          text1: "Change avatar successful",
          position: "top",
          visibilityTime: 2000,
        });

        console.log(data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <View>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <MaterialCommunityIcons name="arrow-left" color="white" size={20} />
          <Text style={styles.headerText}>User Information</Text>
        </Pressable>
      </View>

      {/* Form to change information */}
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {/* <Image source = {{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }}/> */}

          {isEditing ? (
            <View
              style={{
                // flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable onPress={() => handleChoosePhoto()}>
                <Avatar.Image source={{ uri: user.avatar }} size={100} />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => handleChoosePhoto()}>
              <Avatar.Image source={{ uri: user.avatar }} size={100} />
            </Pressable>
          )}

          {isEditing ? (
            <TextInput
              label={"Name"}
              mode="outlined"
              style={styles.userName}
              value={name}
              onChangeText={(newName) => setName(newName)}
            />
          ) : (
            <Text style={styles.userName}>{user.name}</Text>
          )}
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            {isEditing ? (
              <View
                style={{
                  flexDirection: "row",
                  height: 40,
                }}
              >
                <RadioButton
                  status={
                    gender === "Male" || gender === "male"
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => setGender("male")}
                  color="#f558a4"
                  value="Male"
                />
                <Text style={styles.radioLabel}>Male</Text>
                <RadioButton
                  status={
                    gender === "Female" || gender === "female"
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => setGender("female")}
                  color="#f558a4"
                  value="Female"
                />
                <Text style={styles.radioLabel}>Female</Text>
              </View>
            ) : (
              <Text style={{}}>{gender}</Text>
            )}
          </View>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            {isEditing ? (
              // <TextInput
              //     style={{
              //         marginLeft: 7
              //     }}
              //     value={user.dateOfBirth}
              //     onChangeText={text => setDateOfBirth(text)}
              // />
              <View>
                <Pressable onPress={toggleModal} style={styles.modalButton}>
                  <Text>{dateOfBirth.format("YYYY-MM-DD")}</Text>
                </Pressable>
                <Modal isVisible={showModal} onBackdropPress={toggleModal}>
                  <View style={styles.modalContent}>
                    <DateTimePicker
                      selectedItemColor="#f558a4"
                      mode="single"
                      date={dateOfBirth}
                      onChange={(params) => setDateOfBirth(params.date)}
                    />
                  </View>
                </Modal>
              </View>
            ) : (
              <Text>{dateOfBirth.format("YYYY-MM-DD")}</Text>
            )}
          </View>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={{ color: "grey" }}>{user.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>

            <Text style={{ color: "grey" }}>{user.email}</Text>
          </View>
        </View>
        {isEditing ? (
          <Pressable style={styles.saveButton} onPress={handleSavePress}>
            <MaterialCommunityIcons
              name="content-save"
              size={20}
              style={styles.saveIcon}
            />
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.editButton} onPress={handleEditPress}>
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              style={styles.editIcon}
            />
            <Text style={styles.editButtonText}>Edit Information</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "#f558a4",
    paddingHorizontal: 10,
  },
  backButton: {
    flexDirection: "row",
    width: "100%",
    marginLeft: 10,
    height: 30,
    marginTop: 15,
    gap: 10,
  },
  headerText: {
    height: 20,
    fontSize: 15,
    color: "white",
    fontWeight: "700",
    marginLeft: 5,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
  },
  userName: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    height: 40,
  },
  divider: {
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: "column",
    marginTop: 10,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    gap: 30,
    height: 30,
    alignItems: "center",
  },
  infoLabel: {
    color: "grey",
    width: 100,
    marginLeft: 60,
  },
  infoValue: {
    fontWeight: "450",
    marginLeft: 15,
  },
  editButton: {
    width: "50%",
    height: 40,
    backgroundColor: "#f5a4c6",
    borderRadius: 5,
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  editIcon: {
    marginTop: 10,
  },
  editButtonText: {
    color: "black",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  saveButton: {
    width: "50%",
    height: 40,
    backgroundColor: "#f5a4c6",
    borderRadius: 5,
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  saveIcon: {
    marginTop: 10,
  },
  saveButtonText: {
    color: "black",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  radioLabel: {
    marginTop: 7,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
