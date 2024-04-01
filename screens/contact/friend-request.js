import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAccessToken } from '../user-profile/getAccessToken';
import { findFriendById } from '../../service/friend.util';

export function FriendRequest({ navigation }) {
    const [requests, setRequests] = useState([]);
    const [isAcpRequest, setIsAcptrRequest] = useState(false);


    // .then((response) => response.json())
    // .then((data) => {
    //     if (data.status === 'fail') {
    //         console.log("fail");
    //         return;
    //     }
    //     console.log('response', data);
    //     console.log(data.data);
    //     return Promise.resolve(data.data);
    // })
    // .catch((error) => {
    //     console.log('Error:', error);
    // });
    // };

    // const cancelAddFriend = async () => {
    //     const accessToken = await getAccessToken();
    //     console.log(user._id);
    //     fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/cancel/${user._id}`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: "Bearer " + accessToken
    //         }


    //     })
    //         .then(response => {
    //             console.log(response.status);
    //             if (!response.ok) {
    //                 console.log('error');
    //                 setIsSendRequest(true)
    //                 return;
    //             }
    //             console.log('success');
    //             setIsSendRequest(false);


    //         }
    //         )

    // }
    async function fetchFriendRequest() {
        try {
            const accessToken = await getAccessToken();
            const response = await fetch('http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/requests', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                }
            });

            const data = await response.json();
            console.log(data);

            const findFriendPromises = data.data.map(async (request) => {
                console.log(request);

                const friend = await findFriendById(request.userId);
                console.log(friend);
                return friend;
            })

            const friends = await Promise.all(findFriendPromises);
            console.log(friends);
            setRequests(friends);
        } catch (error) {
            console.log('Error:', error);
            throw error;
        }
    }


    useEffect(() => {
        fetchFriendRequest();

    }, [])


    const addFriend = async (id) => {
        const accessToken = await getAccessToken();

        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/accept/${id}`, {
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



    const cancelAddFriend = async (id) => {
        const accessToken = await getAccessToken();
        console.log("cancel");
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/cancel/${id}`, {
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
        // <View>
        //     <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
        //         <View style={{
        //             // flexDirection: 'row',
        //             // gap: 5,
        //             // backgroundColor: '#f558a4'
        //         }}>
        //             {/* <MaterialCommunityIcons name="back" color="white" size={20} />
        //             <TextInput
        //                 placeholder="Friend Request"
        //                 placeholderTextColor="white"
        //                 // value={searchKeyword}
        //                 // onSubmitEditing={() => navigation.navigate('SearchEngine', { keyword: searchKeyword })}
        //                 // onChangeText={text => setSearchKeyword(text)}
        //                 style={{ height: 20, fontSize: 17, color: 'white' }}
        //             /> */}

        //         </View>
        //     </View>
        // </View>

        <View>
            <View style={{
                flexDirection: 'row',
                width: '100%',
                marginLeft: 10,
                height: 40,
                marginTop: 10,
                gap: 10
            }}>
                <Pressable style={{
                    flexDirection: 'row'
                }} onPress={() => {
                    navigation.navigate('contact')
                }}>
                    <MaterialCommunityIcons name="arrow-left-bold" color="black" size={20} />
                    <Text

                        // value={searchKeyword}
                        // onSubmitEditing={() => navigation.navigate('SearchEngine', { keyword: searchKeyword })}
                        // onChangeText={text => setSearchKeyword(text)}
                        style={{ height: 20, fontSize: 15, color: 'black', fontWeight: 700 }}
                    >Friend Request</Text>

                </Pressable>

            </View>

            {requests.map((request) => (
                // request = findFriendById(request._id)
                <View key={request._id}
                    style={{
                        flexDirection: 'column',
                        gap: 10,
                        marginLeft: 10
                    }}>

                    <View style={{
                        flexDirection: 'row',
                        gap: 20
                    }}>
                        {/* onPress to go to profile of user */}
                        <Pressable style={{
                            flexDirection: 'row',
                            gap: 20
                        }} onPress={() => viewProfileOfUser(request._id)}>
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
                                    marginTop: 10,

                                    fontSize: 15
                                }}>{request.name}</Text>



                                <Text style={{
                                    padding: 10,
                                    border: '1px solid #969190',
                                    width: 250,
                                    borderRadius: 5


                                }}>"{request.introduce}"</Text>
                            </View>


                        </Pressable>


                    </View>
                    <View style={{
                        marginLeft: 10,
                        flexDirection: 'row',
                        gap: 10
                    }}>
                        <Pressable style={{
                            height: 30,
                            width: 120,
                            borderRadius: 5,
                            backgroundColor: '#f558a4',
                            marginLeft: 60,

                        }} onPress={() => handleAddFriend(request.friend._id)}>
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


                        }} onPress={() => cancelAddFriend(request.friend._id).then(() => {
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

export default FriendRequest;