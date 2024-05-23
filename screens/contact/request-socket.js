import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAccessToken } from '../user-profile/getAccessToken';
import { findFriendById } from '../../service/friend.util';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../socket.io/socket-context';
import { setNumberOfRequest } from '../../rtk/user-slice';

export function RequestSocket({ navigation }) {
    const [requests, setRequests] = useState([]);
    const [isAcpRequest, setIsAcptrRequest] = useState(false);
    const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555/api/v1"
    const myInfor = useSelector(state => state.user)
    const { socket } = useSocket()
    const dispatch = useDispatch();

    useEffect(() => {
        // fetchFriendRequest();
        socket.on('friend:request', async (data) => {
            console.log(requests);
            // fetchFriendRequest().then(() => console.log('fetchFriendRequest'))
            if (data.friendRequest.recipient === myInfor.user._id && data.friendRequest.status !== "accecpt") {
                const mappedObject = {
                    "_id": data.friendRequest._id,
                    "avatar": data.requestInfo.avatar,
                    "name": data.requestInfo.name,
                    "userId": data.userId
                };
                console.log("***request request", requests);
                setRequests([...requests, mappedObject]);
                dispatch(setNumberOfRequest(requests.length + 1));
                fetchFriendRequest()


            }
            return;
        })
        socket.on('friend:accept', (data) => {
            console.log(data);
            if (data.friendRequest.recipient === myInfor.user._id && data.friendRequest.status === "accepted") {
                dispatch(setNumberOfRequest(requests.length - 1));
                setRequests(requests.filter(request => request._id !== data.friendRequest._id));
            }
            return;
        })
        socket.on('friend:cancel', (data) => {
            console.log("** cancel request", requests);
            if (myInfor.user._id === data.userId) {

                // setRequests(requests.filter(request => request._id !== data.friendRequest._id));
                fetchFriendRequest();


            }
            return;
        })
    }, [])
    async function fetchFriendRequest() {
        try {
            const accessToken = await getAccessToken();
            const response = await fetch(`${BASE_URL}/friends/requests`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });

            const data = await response.json();
            console.log("========================================");
            console.log("fetch friend request", data.data);
            setRequests(data.data);
            dispatch(setNumberOfRequest(data.data.length));
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }

    console.log("** request", requests);


    useEffect(() => {
        fetchFriendRequest();

    }, [])

    const friends = useSelector(state => state.friends)


    const addFriend = async (id) => {
        const accessToken = await getAccessToken();

        fetch(`${BASE_URL}/friends/accept/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        }
        ).then(response => {
            console.log(response.status);
            if (!response.ok) {
                console.log('error');
                setIsAcptrRequest(false);
                return;
            }
            console.log('success');
            setIsAcptrRequest(true);
            fetchFriendRequest();



        }


        )

    }



    const handleAddFriend = async (id) => {
        try {
            console.log(id);
            await addFriend(id);
            fetchFriendRequest();
            // const newRequests = requests.filter(request => request._id !== id);
            // setRequests(newRequests);
            // setRequests(requests.filter(request => request._id !== id));
            // fetchFriendRequest();
            // console.log("running");
        } catch (error) {
            console.log('Error:', error);
        }
    }



    const cancelAddFriend = async (request) => {
        let id;

        if (request) {
            id = request._id;
        } else {
            id = request.friendRequest._id;
        }
        const accessToken = await getAccessToken();
        fetch(`${BASE_URL}/friends/reject/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        })
            .then(response => {
                console.log(response.status);
                if (!response.ok) {
                    console.log('error');
                    // setIsAcptrRequest(false)
                    return;
                }

                console.log('cancel');
                fetchFriendRequest()

                // setIsAcptrRequest(true);



            }
            )

    }

    const viewProfileOfUser = async (id) => {
        const friend = await findFriendById(id);
        console.log(friend);
        if (friend) {
            navigation.navigate('FriendProfile', { friend: friend });
        }

    }

    return (
        <View>

            {requests.map((request) => (
                // request = findFriendById(request._id)
                <View key={request._id}
                    style={{
                        flexDirection: 'column',
                        gap: 10,
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: '#e0cade',
                        width: '80%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 120,
                        alignSelf: 'center',
                        borderRadius: 10,
                        backgroundColor: '#f2e9f1'


                    }}>


                    <View style={{
                        flexDirection: 'row',
                        gap: 20,
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                    }}>
                        {/* onPress to go to profile of user */}
                        <Pressable style={{
                            flexDirection: 'row',
                            gap: 20

                        }} onPress={() => viewProfileOfUser(request.userId)}>
                            {/* // api to get avatar */}
                            <Image source={{ uri: request.avatar }} style={{
                                width: 50,
                                height: 50,
                                borderRadius: 50

                            }} />
                            <View style={{
                                marginTop: -10,
                                flexDirection: 'column',
                                gap: 5
                            }}>
                                {/* <Text style={{
                                    marginTop: 10,

                                    fontSize: 20
                                }}>{request.sender}</Text> */}
                                <Text style={{
                                    marginTop: 20,

                                    fontSize: 15
                                }}>{request.name}</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        gap: 10,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'

                    }}>
                        <Pressable style={{
                            height: 30,
                            width: 120,
                            borderRadius: 5,
                            backgroundColor: '#f558a4',
                            // marginLeft: 60,

                        }} onPress={() => handleAddFriend(request._id)}>
                            <Text style={{
                                color: 'white',
                                marginLeft: 40,
                                marginTop: 5
                            }}>Accept</Text>
                        </Pressable>
                        <Pressable style={{
                            height: 30,
                            width: 120,
                            borderRadius: 5,
                            backgroundColor: '#969190',


                        }} onPress={() => cancelAddFriend(request).then(() => {
                            console.log("cancel success");
                            fetchFriendRequest()
                        })}>
                            <Text style={{
                                color: 'white',
                                marginLeft: 40,
                                marginTop: 5
                            }}>Reject</Text>
                        </Pressable>
                    </View>
                </View>
            ))}

        </View>
    )

}

export default RequestSocket;