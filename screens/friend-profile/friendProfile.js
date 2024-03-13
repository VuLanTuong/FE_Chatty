import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, TextInput, Platform } from 'react-native';
import { Divider, Checkbox, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { launchImageLibrary } from 'react-native-image-picker';
import { getAccessToken } from '../user-profile/getAccessToken';
import { useDispatch } from "react-redux"
import { setFriend } from "../../rtk/user-slice";
import { findFriendById } from '../../service/friend.util';
export default function FriendProfile({ route }) {
    const user = route.params.friend;
    console.log(user);




    const dispatch = useDispatch();
    const [isFriend, setIsFriend] = useState(false);
    const [isSendRequest, setIsSendRequest] = useState(false);
    const [isRecipient, setIsRecipient] = useState(false)
    const [friend, setFriend] = useState([]);
    const [friendList, setFriendList] = useState();



    const myInfor = useSelector(state => state.user)



    const fetchFriends = async () => {
        setFriendList(myInfor.friends);
        return;

    }



    const checkIsFriend = async () => {
        console.log("fetched");
        myInfor.friends.map((fr) => {
            if (fr.userId === user._id) {
                setIsFriend(true)
                console.log("is friend");
                return;
            }
            return;
        })



    }

    function getFriendOfUser() {
        findFriendById(user._id).then((friend) => {
            if (friend) {
                console.log(friend);
                if (friend.friend.requester === myInfor.user._id && friend.status != "accecpt") {
                    console.log("isSendRequest");
                    setIsSendRequest(true)
                }
                if (friend.friend.recipient === myInfor.user._id && friend.status != "accecpt") {
                    console.log("recipient");
                    setIsRecipient(true)

                }
                setFriend(friend.friend)
                return;
            }

        })
    }

    useEffect(() => {
        getFriendOfUser();
        checkIsFriend();
    }, []);



    console.log(friend);
    console.log(friend.requester);
    console.log(isFriend);
    console.log(isRecipient);
    console.log(isSendRequest);


    // const logAllFriend = async () => {
    //     findFriendById().then((friendList) => {
    //         console.log(friendList);
    //     })
    //     logAllFriend();
    // }

    // function checkStatusRelationship() {
    //     console.log(friend);
    //     console.log(typeof (friend));
    //     console.log(friend.requester);

    //     if (friend.requester === myInfor.user._id)
    //         console.log(friend.requester);
    //     console.log(myInfor.user._id);
    //     console.log(isSendRequest);
    //     return;

    // }



    const sendRequest = async () => {
        const accessToken = await getAccessToken();
        console.log(user._id);
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/request/${user._id}`, {
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
                setIsSendRequest(false);
                return;
            }
            console.log('success');
            setIsSendRequest(true);
            getFriendOfUser();
            return;


        }


        )

    }




    const handleCancelSendRequest = async () => {
        const accessToken = await getAccessToken();
        console.log(user._id);
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/cancel/${user._id}`, {
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
                    return;
                }
                console.log('cancel success');
                // getFriendOfUser();
                setIsSendRequest(false);
            }
            )

    }

    const handleUnfriend = async () => {
        const accessToken = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/remove/${friend._id}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        })
            .then(response => {
                console.log(response.status);
                console.log('success');
                if (!response.ok) {
                    console.log("error");

                    return;
                }
                console.log("unfriend success");
                setIsFriend(false);
                getFriendOfUser();
                return;
            })

    }


    const handleAcceptRequest = async () => {
        const accessToken = await getAccessToken();
        console.log(user._id);
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends/accept/${friend._id}`, {
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
                setIsFriend(false)
                return;
            }
            console.log('add friend success');
            setIsFriend(true)
            getFriendOfUser();
            return;

        })

    }




    return (
        <View style={{
            width: '100%',
        }}>
            <Image source={{ uri: user.background }}
                style={{
                    width: '100%',
                    height: 150,

                    borderWidth: 1,
                    borderColor: 'white',

                }} />
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'flex-start',
                alignItems: 'center'

            }}>
                <Image source={{ uri: user.avatar }}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderWidth: 3,
                        borderColor: 'white',
                        marginTop: 100

                    }} />
            </View>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>{user.name}</Text>
                <Text>
                    {user.bio}
                </Text>
            </View>
            <View>
                {isFriend === false ?
                    <View>
                        {isSendRequest === true ? (
                            <View style={{
                                flexDirection: 'row',
                                gap: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20

                            }}>
                                <Pressable style={styles.button} onPress={() => handleCancelSendRequest()}>
                                    <Text style={styles.textStyle}>Cancel Request</Text>
                                </Pressable>
                                <Pressable style={styles.button}>
                                    <Text style={styles.textStyle}>Send Message</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View>
                                {isRecipient === true ? (
                                    <View style={{
                                        flexDirection: 'row',
                                        gap: 25,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 20

                                    }}>
                                        <Pressable style={styles.button} onPress={() => handleAcceptRequest()}>
                                            <Text style={styles.textStyle}>Accept Request</Text>
                                        </Pressable>
                                        <Pressable style={styles.button} onPress={() => handleCancelSendRequest()}>
                                            <Text style={styles.textStyle}>Reject Request</Text>
                                        </Pressable>
                                        <Pressable style={styles.button}>
                                            <Text style={styles.textStyle}>Send Message</Text>
                                        </Pressable>
                                    </View>

                                )
                                    : <View style={{
                                        flexDirection: 'row',
                                        gap: 35,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 20

                                    }}>
                                        <Pressable style={styles.button} onPress={() => sendRequest()}>
                                            <Text style={styles.textStyle}>Add Friend</Text>
                                        </Pressable>
                                        <Pressable style={styles.button}>
                                            <Text style={styles.textStyle}>Send Message</Text>
                                        </Pressable>

                                    </View>
                                }


                            </View>
                        )}
                    </View>
                    :
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        flexDirection: 'row',
                        gap: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Pressable style={styles.button}>
                            <Text style={styles.textStyle}>Send Message</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={() => handleUnfriend()}>
                            <Text style={styles.textStyle}>Unfriend</Text>
                        </Pressable>
                    </View>



                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        width: '40%',
        backgroundColor: '#f558a4',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'

    },
    textStyle: {
        color: 'white',
        fontSize: '17',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }
})