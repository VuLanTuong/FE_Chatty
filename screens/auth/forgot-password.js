import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import { TextInput } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAccessToken } from '../user-profile/getAccessToken';


export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [isModalVisible, setModalVisible] = useState(false);

    const [isChangePassword, setIsChangePassword] = useState(false)
    const [otp, setOtp] = useState('');

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleOtpChange = (text) => {
        setOtp(text);
    };

    const handleVerifyOtp = async () => {
        await fetch("http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/verifyForgetPasswordOTP", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                otp: otp
            }),
        })
            .then((response) => { return response.json() })
            .then((data) => {
                console.log(data)
                Toast.show({
                    type: 'success',
                    text1: data.message,
                    position: 'top',
                    visibilityTime: 4000,

                });

                if (data.status === 'success') {
                    toggleModal();
                    setIsChangePassword(!isChangePassword);
                }
            })
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prevState) => !prevState);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword((prevState) => !prevState);
    };

    const changePassword = async () => {
        console.log(email);
        console.log(newPassword);
        console.log(confirmNewPassword);
        if (newPassword === confirmNewPassword) {


            await fetch("http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/resetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: newPassword
                })
            }).then((response) => {
                console.log(response);
                return response.json()
            }).then((data) => {
                if (data.status === 'success') {
                    Toast.show({
                        type: 'success',
                        text1: 'Change password successfully!',
                    });
                    setIsChangePassword(!isChangePassword)
                    navigation.navigate("Login");
                }

            }).catch((error) => {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: 'Change password failed!',
                });

            })
        }
        else {
            Toast.show({
                type: 'error',
                text1: 'New password and confirm password not match',
            });
        }
    }



    const handleSendOTP = async (resend) => {
        console.log(email);
        if (email) {
            await fetch("http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/forgetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email
                }),
            })
                .then((response) => { return response.json() })
                .then((data) => {
                    console.log(data)
                    console.log(resend);
                    if (!resend) {
                        setModalVisible(!isModalVisible);
                        Toast.show({
                            type: 'success',
                            text1: data.message,
                            position: 'top',
                            visibilityTime: 4000,

                        });
                    }
                    else {
                        Toast.show({
                            type: 'success',
                            text1: data.message,
                            position: 'top',
                            visibilityTime: 4000,

                        });
                    }

                })
        }
        else {
            Toast.show({
                type: 'error',
                text1: "Please enter your email",
                position: 'top',
                visibilityTime: 4000,

            });

        }
    }


    console.log(isModalVisible);
    return (
        <View style={styles.container}>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input]}
                    label="Please enter your email address"
                    underlineColorAndroid="transparent"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Pressable
                    style={{
                        backgroundColor: '#f558a4',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        width: '50%',
                        marginTop: 20,
                        alignSelf: 'center'
                    }}
                    onPress={() => handleSendOTP(false)}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 17,
                            fontWeight: 500,
                        }}
                    >
                        Confirm
                    </Text>
                </Pressable>

                <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Enter OTP:</Text>
                        <TextInput
                            style={styles.otpInput}
                            value={otp}
                            onChangeText={handleOtpChange}
                            maxLength={6}
                            keyboardType="numeric"
                        />
                        <View style={{
                            flexDirection: 'row',
                            gap: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Pressable style={{
                                backgroundColor: '#f558a4', color: 'white', width: "40%",
                                height: 50,
                                borderRadius: 25,
                            }} onPress={() => handleVerifyOtp()}>
                                <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>Verify OTP</Text>
                            </Pressable>

                            <Pressable style={{
                                backgroundColor: '#f558a4', color: 'white', width: "40%",
                                height: 50,
                                borderRadius: 25,
                            }} onPress={() => handleSendOTP(true)}>
                                <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>Resend otp</Text>
                            </Pressable>
                        </View>

                    </View>
                </Modal>


                <Modal isVisible={isChangePassword}>
                    <View style={styles.modalContainer}>
                        <View style={styles.inputContainerChangePassword}>
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

                        <View style={styles.inputContainerChangePassword}>
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
                            changePassword()

                        }}>
                            <MaterialCommunityIcons
                                name="content-save"
                                size={20}
                                style={styles.saveIcon}
                            />
                            <Text style={{
                                textAlign: 'center',
                                marginTop: 10,

                            }}>Change password</Text>
                        </Pressable>
                    </View>
                </Modal>
            </View>
            ``

        </View>
    )
}
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
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    inputContainerChangePassword: {
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
        marginLeft: 10
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
    },
    saveIcon: {
        marginTop: 10,
    },
});
