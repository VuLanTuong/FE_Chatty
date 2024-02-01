import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function FriendRequest({ navigation }) {
    const [requests, setRequest] = useState([]);

    useEffect(() => {
        async function fetchFriendRequest() {
            // use redux to get current user
            const response = await fetch('http://localhost:3000/friend-request');
            const allRequest = await response.json();
            const temp = allRequest.filter(
                (request) => request.receiver === 1
            )
            console.log(temp);
            setRequest(temp);
        }

        fetchFriendRequest();

    }

    )



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
                <View key={request.id}
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
                        }}>
                            {/* // api to get avatar */}
                            <Image source={{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }} style={{
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
                                }}>Sender</Text>



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

                        }}>
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


                        }}>
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