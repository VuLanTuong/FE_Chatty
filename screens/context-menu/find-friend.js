import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { getAccessToken } from '../user-profile/getAccessToken';
import { ErrorToast, SuccessToast } from 'react-native-toast-message';
import Toast from 'react-native-toast-message';
const FindFriend = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555/api/v1"


    const findFriend = async () => {
        const token = await getAccessToken();




        fetch(`${BASE_URL}/users/findByEmail/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'fail' || data.status === 'error' || !data.data) {
                    console.log("fail");
                    Toast.show({
                        type: 'error',
                        text1: 'User Not found',
                        position: 'top',
                        visibilityTime: 2000,

                    });
                    return;
                }
                console.log('response', data.data);
                navigation.navigate('FriendProfile', { friend: data.data });
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };
    return (
        <View style={styles.container}>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input]}
                    label="Enter email address"
                    underlineColorAndroid="transparent"
                    keyboardType="default"
                    value={email}
                    onChangeText={(text) => setEmail(text.trim())}
                />
            </View>
            <Pressable onPress={() => findFriend()} style={styles.searchButton}>
                <Text>Search</Text>
                <MaterialCommunityIcons name='magnify' color='black' size={25} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
        // marginLeft: 20
    },
    inputContainer: {
        flexDirection: 'row',
        // borderColor: 'grey',
        // borderWidth: 1,
        // borderRadius: 10,
        height: 50,
        width: '80%',
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

    },
    searchButton: {
        height: 40,
        width: '80%',
        borderWidth: 1,
        borderColor: '#c2c0bc',
        borderRadius: 10,
        backgroundColor: '#f5a4c6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginLeft: 10,
        flexDirection: 'row',
        gap: 10
    },
});

export default FindFriend;