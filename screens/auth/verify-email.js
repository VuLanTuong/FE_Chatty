import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import { TextInput } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAccessToken } from '../user-profile/getAccessToken';
import { TouchableOpacity, Platform } from 'react-native';

export default function VerifyEmail({ navigation }) {
    const BASE_URL = "http://ec2-13-212-80-57.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

    const [email, setEmail] = useState();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [countdown, setCountdown] = useState(60);

    const [isModalVisible, setModalVisible] = useState(false);

    const [isChangePassword, setIsChangePassword] = useState(false)
    const [otp, setOtp] = useState('');

    const [message, setMessage] = useState('')

    const [errPassword, setErrPassword] = useState('')
    const [errOtp, setErrOtp] = useState('')

    const toggleModal = () => {

        setModalVisible(!isModalVisible);
        setOtp('');
        setCountdown(60)
    };

    const openModalChangePassword = () => {
        setIsChangePassword(!isChangePassword);
    };

    const displayModalWithDelay = () => {
        setTimeout(() => {
            openModalChangePassword();
        }, Platform.OS === 'ios' ? 200 : 0);
    };



    const handleOtpChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setOtp(numericValue)
    };

    const handleVerifyOtp = async () => {

        await fetch(`${BASE_URL}/auth/verifyEmailOtp`, {
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


                if (data.status === 'success') {
                    toggleModal();
                    // setIsChangePassword(!isChangePassword)

                    // setModalVisible(!isModalVisible)

                    navigation.navigate('Register', { email: email })
                }
                else {
                    Toast.show({
                        type: 'error',
                        text1: data.message,
                        position: 'top',
                        visibilityTime: 4000,
                    });
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
        // console.log(email);
        // console.log(typeof (newPassword));
        // console.log(confirmNewPassword);
        if (newPassword === confirmNewPassword) {
            if (newPassword.length >= 6) {
                await fetch(`${BASE_URL}/users/resetPassword`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: newPassword
                    })
                }).then((response) => {
                    // console.log(response);
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
                setErrPassword("Password must be have >= 6 digits")
            }
        }
        else {
            setErrPassword("New password and confirm password not match")
        }
    }



    const handleSendOTP = async (resend) => {
        // console.log(email);
        // setModalVisible(!isModalVisible)
        // console.log(isModalVisible);
        if (email) {
            setShowButton(false);
            await fetch(`${BASE_URL}/auth/sendVerifyEmailOtp`, {
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
                    if (data.status === 'fail' || data.status === 'error') {
                        // console.log(isModalVisible);
                        setMessage(data.message)
                        // toggleModal()
                        Toast.show({
                            type: 'error',
                            text1: data.message,
                            position: 'top',
                            visibilityTime: 4000,
                        });
                    }
                    else {
                        // console.log(data)
                        // console.log(resend);
                        if (!resend) {
                            setModalVisible(!isModalVisible);
                            setMessage(data.message)
                        }
                        else {
                            setCountdown(60)
                            setMessage("Resend OTP success \n" + data.message)
                        }


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

    useEffect(() => {
        let timer;

        if (!showButton) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [showButton]);

    useEffect(() => {
        if (countdown <= 0) {
            setShowButton(true);

        }
    }, [countdown]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    // console.log(isModalVisible);
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={{
                    flexDirection: 'column',
                    gap: 25,
                    flex: 1
                }}>
                    <TextInput
                        style={[styles.input]}
                        label="Please enter your email address"
                        // underlineColorAndroid="transparent"
                        value={email}
                        onChangeText={(text) => setEmail(text.trim())}
                    />


                    <Pressable
                        style={{
                            backgroundColor: '#f558a4',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 50,
                            width: '50%',
                            marginTop: 80,
                            alignSelf: 'center',
                            borderRadius: 30
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

                </View>

                {/* 
                <Modal visible={isModalVisible} onBackdropPress={toggleModal}> */}
                <Modal visible={isModalVisible} onRequestClose={toggleModal}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Enter OTP:</Text>
                        <TextInput
                            style={styles.otpInput}
                            value={otp}
                            onChangeText={handleOtpChange}
                            maxLength={6}
                            keyboardType="numeric"
                        />
                        <Text style={{
                            color: 'red',
                            fontStyle: 'italic',
                            fontWeight: '500',
                            marginTop: 5,
                            marginBottom: 5


                        }}>*{message}</Text>
                        <Text style={{
                            color: 'red',
                            fontStyle: 'italic',
                            fontWeight: '500',
                            marginTop: 5,
                            marginBottom: 5


                        }}>*OTP is a 6-digit number </Text>
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
                                <Text style={{ color: 'white', textAlign: 'center', marginTop: 15 }}>Verify OTP</Text>
                            </Pressable>

                            <Pressable style={
                                showButton ? styles.buttonEnabled : styles.buttonDisabled
                            } onPress={() => handleSendOTP(true)}>
                                <Text style={{ color: 'white', textAlign: 'center', marginTop: 15 }}>{formatTime(countdown)}  :  Resend otp</Text>
                            </Pressable>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            gap: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Pressable style={{
                                width: '100%',
                                height: 40,
                                backgroundColor: '#c9c9c9',
                                borderRadius: 5,
                                marginTop: 20,
                                flexDirection: 'row',
                                gap: 10,
                                justifyContent: 'center',
                                marginLeft: 10,
                            }} onPress={toggleModal}>
                                <Text style={{
                                    color: 'black', textAlign: 'center', marginTop: 15
                                }}>Close</Text>
                            </Pressable>
                        </View>

                    </View>
                </Modal>


                <Modal visible={isChangePassword}>
                    <View style={styles.modalContainer}>
                        <View style={{
                            marginBottom: 5,
                            flexDirection: 'row'
                        }}>
                            <TextInput
                                style={[styles.input]}
                                label="Password"
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
                                style={[styles.input]}
                                label="Confirm Password"
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
                                    name={!showConfirmNewPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    style={styles.eyeIcon}
                                />
                            </Pressable>

                        </View>

                        <Text style={{
                            color: 'red',
                            fontStyle: 'italic',
                            fontWeight: '500',
                            marginTop: 5,
                            marginBottom: 5,
                            marginLeft: 5
                        }}>*{errPassword}</Text>
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
                    <View style={{
                        flexDirection: 'row',
                        gap: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Pressable style={{
                            width: '90%',
                            height: 40,
                            backgroundColor: '#c9c9c9',
                            borderRadius: 5,

                            flexDirection: 'row',
                            gap: 10,
                            justifyContent: 'center',
                        }} onPress={toggleModal}>
                            <Text style={{
                                color: 'black', textAlign: 'center', marginTop: 15
                            }}>Close</Text>
                        </Pressable>
                    </View>

                </Modal>
            </View>


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 70,
        paddingHorizontal: 10
    },

    inputContainer: {
        marginBottom: 15,
        flex: 1,
        maxHeight: 220

    },
    input: {
        backgroundColor: "#f5f5f5",

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
        gap: 5,
        marginTop: 0,
        backgroundColor: '#f5f5f5',
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
        fontSize: 20,
        fontWeight: 500
    },
    inputContainerChangePassword: {
        marginBottom: 15,
        flexDirection: 'row',
    },
    input: {
        backgroundColor: '#f5f5f5',
        flex: 1,

    },
    iconContainer: {
        marginRight: 20,
        position: 'absolute',
        right: 0,

    },
    eyeIcon: {
        color: '#888',
        marginTop: 20,
        marginLeft: 10
    },
    saveButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#f5a4c6',
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',

    },
    saveIcon: {
        marginTop: 10,
    },
    buttonEnabled: {
        backgroundColor: '#f558a4',
        color: 'white', width: "40%",
        height: 50,
        borderRadius: 25,
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: '#f558a4',
        color: 'white', width: "40%",
        height: 50,
        borderRadius: 25,

    },
});
