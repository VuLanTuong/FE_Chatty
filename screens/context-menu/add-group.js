import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';

import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { getAccessToken } from '../user-profile/getAccessToken';
import Toast from 'react-native-toast-message';
import { getAllConversation } from '../../service/conversation.util';
import { getConservations } from '../../rtk/user-slice';



const AddGroup = ({ navigation }) => {
    const dispatch = useDispatch()
    const BASE_URL = "http://ec2-13-212-80-57.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

    const [nameGroup, setNameGroup] = useState("");
    const [selectedFriends, setSelectedFriends] = useState([]);
    const friendInRedux = useSelector((state) => state.user.friends);

    const [friends, setFriends] = useState([]);
    const [searchFriend, setSearchFriend] = useState();
    const [avatar, setAvatar] = useState("");

    const handleCheckboxToggle = (userId) => {
        if (selectedFriends.includes(userId)) {
            setSelectedFriends(selectedFriends.filter((id) => id !== userId));
        } else {
            setSelectedFriends([...selectedFriends, userId]);
        }
    };


    function groupFriendsByLetter(friendsParams) {

        console.log(friendsParams);
        const friendGroupByName = friendsParams.reduce((result, friend) => {
            const letter = friend.name.charAt(0).toUpperCase();
            if (!result[letter]) {
                result[letter] = [];
            }
            result[letter].push(friend);
            return result;
        }, {});

        // Sort the friend groups alphabetically
        const sortedFriendGroups = {};
        Object.keys(friendGroupByName).sort().forEach((letter) => {
            sortedFriendGroups[letter] = friendGroupByName[letter];
            setFriends(sortedFriendGroups);

        });

        return sortedFriendGroups;
    };


    useEffect(() => {
        if (searchFriend) {
            const filteredFriends = friendInRedux.filter((friend) =>
                friend.name.toLowerCase().includes(searchFriend.toLowerCase())
            );
            groupFriendsByLetter(filteredFriends);

        }
        else {
            groupFriendsByLetter(friendInRedux);
        }
    }, [searchFriend, friendInRedux])


    const handleChooseAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
            allowsMultipleSelection: true,

        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }

    }

    const handleAddGroup = async () => {
        const accessToken = await getAccessToken();
        let members = selectedFriends.map((friend) => {
            console.log(friend);
            return friend
        })
        if (nameGroup !== "") {
            if (members.length >= 2) {
                await fetch(`${BASE_URL}/conservations/createGroup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`

                    },
                    body: JSON.stringify({
                        name: nameGroup,
                        members: members,
                        image: avatar
                    })
                }).then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        if (data.status === 'fail') {
                            Toast.show({
                                type: 'error',
                                position: 'top',
                                text1: 'Cannot create group',
                                visibilityTime: 3000

                            })
                        }
                        dispatch(getConservations())

                        Toast.show({
                            type: 'success',
                            position: 'top',
                            text1: 'Create group successfully',
                            visibilityTime: 3000

                        })


                        setSelectedFriends([]);
                        navigation.navigate('Home');

                    }

                    ).catch((error) => {
                        console.log(error);
                    })
            }
            else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Group must have at least 2 members',
                    visibilityTime: 2000
                })
                return;

            }
        }
        else {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Group name cannot be empty',
                visibilityTime: 2000
            })
            return;
        }
        setSelectedFriends([]);

    }

    return (
        <View style={{
            flexDirection: 'column',
            flex: 1,

        }}>
            <View style={{
                flexDirection: 'row',
                height: 50,
                marginTop: 20,
                gap: 20,


            }}>
                <Pressable style={{
                    height: 40,
                    width: 40,
                    borderWidth: 1,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginTop: 10
                }} onPress={() => handleChooseAvatar()}>
                    {avatar ? <Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} /> :
                        <MaterialCommunityIcons name="camera" size={24} color="grey" />}
                </Pressable>
                <TextInput
                    style={{
                        fontSize: 18,
                        width: '60%',
                        height: 50,
                        borderRadius: 10,
                        borderWidth: 1,

                    }}
                    selectionColor='white'
                    placeholder="Group Name"
                    value={nameGroup}
                    onChangeText={text => setNameGroup(text)}

                />

                <Pressable style={{

                    flexDirection: 'column',
                    borderWidth: 1,
                    borderColor: "#fc58ac",
                    padding: 5,
                }}
                    onPress={() => handleAddGroup()}
                >
                    <Text>Done</Text>
                    <MaterialCommunityIcons name="check" size={25} color="#fc58ac" />
                </Pressable>

            </View>
            <View style={styles.dividerForMenu} />

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 15,
                marginTop: 10,
                width: '80%',
                margin: 'auto',
                marginLeft: 20,


            }}>
                <TextInput
                    placeholder="Search friend..."
                    style={{
                        width: '100%',
                        height: 50,

                        fontSize: 18,
                        backgroundColor: '#dbdbd9',
                        marginLeft: 20
                    }}
                    value={searchFriend}
                    onChangeText={(text) => setSearchFriend(text)}
                />
                <Pressable style={{}}>
                    <MaterialCommunityIcons name='magnify' color='black' size={30} />
                </Pressable>
            </View>

            <View style={{
                flex: 1,

            }}>
                <ScrollView style={{

                    flex: 1,
                    width: '95%',
                    flexDirection: 'column',

                }}>

                    {Object.keys(friends).map((letter) => (
                        <View style={{
                            width: '95%',

                        }} key={letter}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 15 }}>{letter}</Text>
                            {friends[letter].map((friend) => (

                                <View key={friend.userId}
                                    style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        marginTop: 10,
                                        marginLeft: 10,
                                        flex: 1,



                                    }}>


                                    {/* // api to get avatar */}
                                    <Image source={{ uri: friend.avatar }} style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 50

                                    }} />

                                    <Text style={{
                                        marginTop: 10,
                                        fontSize: 20
                                    }}>{friend.name}</Text>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        // alignContent: 'center',
                                        alignItems: 'end',

                                    }}>



                                    </View>
                                    <View>
                                        <Checkbox.Android
                                            style={{
                                                flex: 1,
                                                alignItems: 'end',
                                            }}
                                            status={selectedFriends.includes(friend.userId) ? 'checked' : 'unchecked'}
                                            onPress={() => handleCheckboxToggle(friend.userId)}
                                        />
                                    </View>


                                </View>



                            ))}
                        </View>
                    ))}

                </ScrollView>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    dividerForMenu: {
        height: 2,
        backgroundColor: 'grey',
        marginTop: 20,
        marginBottom: 10,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleSelected: {
        backgroundColor: 'black'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 16,
    },
    closeButton: {
        marginTop: 10,
        fontSize: 16,
        backgroundColor: '#f558a4',
        padding: 10,
        color: '#fff',
        borderRadius: 20
    },
    biggerModalContent: {
        width: '80%',
        height: '80%',
    },
})
export default AddGroup;
