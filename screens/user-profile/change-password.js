import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import {
    TextInput,
    Button,
    Title,
    Caption,
    Paragraph,
    TouchableRipple,
    Checkbox,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePassword({ navigation }) {
    const BASE_URL = "http://ec2-13-212-80-57.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


    const getData = async () => {
        try {
            const access_token = await AsyncStorage.getItem('access-token');
            if (access_token !== null) {
                return access_token;
            }
        } catch (e) {
            console.log(e);
        }
    };



    const toggleOldPasswordVisibility = () => {
        setShowOldPassword((prevState) => !prevState);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prevState) => !prevState);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword((prevState) => !prevState);
    };
    const removeToken = async () => {
        console.log("log out");
        try {
            await AsyncStorage.removeItem("access-token");
            console.log("removed");
            console.log(AsyncStorage.getItem("access-token"));
            navigation.navigate("Login");
        } catch (e) {
            console.error(e);
        }
    };

    const changePassword = async (oldPassword, newPassword) => {
        const accessToken = await getData();
        console.log("Bearer" + accessToken);
        if (confirmNewPassword === newPassword && newPassword.length >= 6) {
            const response = await fetch(`${BASE_URL}/auth/changePassword`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });
            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Change password successfully!',
                    position: "top",
                    visibilityTime: 4000,
                });

                removeToken();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Password incorrect',
                    position: "top",
                    visibilityTime: 4000,
                });
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'New password and confirm password not match',
                text2: 'Password must be >= 6 digits',
                position: "top",
                visibilityTime: 4000,
            });
        }
    };

    return (
        <View>
            {/* <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.navigate('ProfileScreen')}
                >
                    <MaterialCommunityIcons name="arrow-left" color="white" size={20} />
                    <Text style={styles.headerText}>Change Password</Text>
                </Pressable>
            </View> */}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    label="Old password"
                    underlineColorAndroid="transparent"
                    keyboardType="default"
                    value={oldPassword}
                    onChangeText={(text) => setOldPassword(text)}
                    secureTextEntry={!showOldPassword}
                />
                <Pressable
                    onPress={toggleOldPasswordVisibility}
                    style={styles.iconContainer}
                >
                    <MaterialCommunityIcons
                        name={showOldPassword ? 'eye-off' : 'eye'}
                        size={20}
                        style={styles.eyeIcon}
                    />
                </Pressable>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    label="New password"
                    underlineColorAndroid="transparent"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                />
                <Pressable
                    onPress={toggleNewPasswordVisibility}
                    style={styles.iconContainer}
                >
                    <MaterialCommunityIcons
                        name={showNewPassword ? 'eye-off' : 'eye'}
                        size={20}
                        style={styles.eyeIcon}
                    />
                </Pressable>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    label="Confirm new password"
                    underlineColorAndroid="transparent"
                    secureTextEntry={!showConfirmNewPassword}
                    value={confirmNewPassword}
                    onChangeText={(text) => setConfirmNewPassword(text)}
                />
                <Pressable
                    onPress={toggleConfirmNewPasswordVisibility}
                    style={styles.iconContainer}
                >
                    <MaterialCommunityIcons
                        name={showConfirmNewPassword ? 'eye-off' : 'eye'}
                        size={20}
                        style={styles.eyeIcon}
                    />
                </Pressable>
            </View>

            <Pressable style={styles.saveButton} onPress={() => {
                changePassword(oldPassword, newPassword)

            }}>
                <MaterialCommunityIcons
                    name="content-save"
                    size={20}
                    style={styles.saveIcon}
                />
                <Text style={styles.saveButtonText}>Change password</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#f558a4',
        paddingHorizontal: 10,
    },
    backButton: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 10,
        height: 30,
        marginTop: 15,
        gap: 10,
    },
    headerText: {
        height: 20,
        fontSize: 15,
        color: 'white',
        fontWeight: '700',
        marginLeft: 5,
    },
    inputContainer: {
        marginBottom: 15,
        flexDirection: 'row',
    },
    input: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        marginLeft: 15
    },
    iconContainer: {
        marginRight: 20

    },
    eyeIcon: {
        color: '#888',
        marginTop: 20,
    },
    saveButton: {
        width: 340,
        height: 40,
        backgroundColor: '#f5a4c6',
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginLeft: 10,
        alignItems: 'center',
        alignSelf: 'center',
    },
    saveIcon: {
        marginTop: 0,
    },
    saveButtonText: {
        color: 'black',
        textAlign: 'center',
        marginTop: 0,
        fontWeight: '500',
    },
});