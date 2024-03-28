import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { getAccessToken } from '../user-profile/getAccessToken';
import { ErrorToast, SuccessToast } from 'react-native-toast-message';
import Toast from 'react-native-toast-message';
const FindFriend = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const findFriend = async () => {
        const token = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/users/findByPhone/${phoneNumber}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'fail') {
                    console.log("fail");
                    Toast.show({
                        type: 'error',
                        text1: 'User Not found',
                        position: 'top',
                        visibilityTime: 2000,

                    });
                    return;
                }
                console.log('response', data);
                navigation.navigate('FriendProfile', { friend: data.data });
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.prefixContainer}>
                    <Text style={styles.prefixText}>+84</Text>
                </View>
                <TextInput
                    mode='outlined'
                    placeholder='Enter phone number'
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
            </View>
            <Pressable onPress={() => findFriend()} style={styles.searchButton}>
                <MaterialCommunityIcons name='magnify' color='black' size={25} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 20
    },
    inputContainer: {
        flexDirection: 'row',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        height: 40,
        width: '70%',
        marginLeft: 10,
        marginTop: 40,
    },
    prefixContainer: {
        backgroundColor: '#c2c0bc',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    prefixText: {
        color: 'black',
    },
    input: {
        flex: 1,
        fontSize: 13,
        border: '0px'
    },
    searchButton: {
        height: 40,
        width: 40,
        borderWidth: 1,
        borderColor: '#c2c0bc',
        borderRadius: 20,
        backgroundColor: '#f5a4c6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginLeft: 10,
    },
});

export default FindFriend;