import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, TextInput, Platform, SafeAreaView, Modal } from 'react-native';
import { Divider, Checkbox, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { launchImageLibrary } from 'react-native-image-picker';
import { getAccessToken } from '../user-profile/getAccessToken';
import { useDispatch } from "react-redux"
import { fetchAllFriend, removeFriend, setCurrentConversation, setFriend, updateFriend } from "../../rtk/user-slice";
import { findFriendById } from '../../service/friend.util';
import { getAllConversation } from '../../service/conversation.util';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { useSocket } from '../socket.io/socket-context';
import { Alert } from "react-native";

export default function FriendProfile({ route, navigation }) {
    const user = route.params.friend;
    // console.log("user", user);
    const BASE_URL = "http://ec2-13-212-80-57.ap-southeast-1.compute.amazonaws.com:8555/api/v1"

    let isFriendTemp = false;
    const dispatch = useDispatch();
    const [isFriend, setIsFriend] = useState(false);
    const [isSendRequest, setIsSendRequest] = useState(false);
    const [isRecipient, setIsRecipient] = useState(false)
    const [friend, setFriend] = useState([]);
    const [friendList, setFriendList] = useState();
    const [currentFriend, setCurrentFriend] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const handleCloseModal = () => {
        setModalVisible(!modalVisible);
    };
    const { socket } = useSocket();
    const [newRequest, setNewRequest] = useState();



    const myInfor = useSelector(state => state.user)



    const fetchFriends = async () => {
        setFriendList(myInfor.friends);
        return;

    }


    const modalConfirm = () => {

        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Alert.alert('Confirm unfriend', 'This action is not undo', [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => handleUnfriend() },
            ]);

        }

        // handleUnfriend();

        // console.log("disband group");
        // console.log(modalVisible);
        // setModalVisible(!modalVisible)

    }


    const checkIsFriend = async () => {
        console.log("fetched");
        myInfor.friends.map((fr) => {
            if (fr.userId === user._id) {
                setIsFriend(true)
                console.log("is friend");
                return;
            }
            else {
                setIsFriend(false)
            }
            return;
        })



    }

    const getFriendOfUser = async () => {
        // console.log(user);
        findFriendById(user._id).then((friend) => {
            // console.log(friend);
            if (friend) {
                setCurrentFriend(friend)
                // console.log(friend);
                // console.log(friend.friend.status);
                if (myInfor.user._id === friend.friend.requester && friend.friend.status !== "accepted") {
                    console.log("isSendRequest");
                    setIsSendRequest(true)
                    setFriend(friend.friend)
                    return;
                }
                if (friend.friend.recipient === myInfor.user._id && friend.friend.status !== "accepted") {
                    console.log("recipient");
                    setIsRecipient(true)
                    setFriend(friend.friend)
                    return;


                }
                if (myInfor.user._id === friend.friend.requester && friend.friend.status === "accepted") {
                    console.log("is friend");
                    setIsFriend(true)
                    setIsRecipient(false)
                    setIsSendRequest(false)
                    setFriend(friend.friend)
                    return;
                }
                if (myInfor.user._id === friend.friend.recipient && friend.friend.status === "accepted") {
                    console.log("is friend");
                    setIsFriend(true)
                    setIsRecipient(false)
                    setIsSendRequest(false)
                    setFriend(friend.friend)
                    return;
                }
                // console.log(friend.friend);
            }

        })
    }

    useFocusEffect(
        React.useCallback(() => {
            console.log("Effect");
            getFriendOfUser();
            fetchFriends().then(() => {
                checkIsFriend().then(() => {
                    console.log("running");
                })
            })
            // socket.on("friend:request", (data) => {
            //     console.log(data);
            // })


        }, [])
    );


    useEffect(() => {
        socket.on('friend:request', (data) => {
            // console.log("***8 friend request", data.friendRequest);
            if (myInfor.user._id === data.friendRequest.requester && data.friendRequest.status != "accecpt") {
                console.log("isSendRequest socket");
                setIsSendRequest(true)
                setIsFriend(false)
            }
            if (data.friendRequest.recipient === myInfor.user._id && data.friendRequest.status != "accecpt") {
                console.log("recipient socket");
                setIsRecipient(true)
                setFriend(data.friendRequest)
                setIsFriend(false)

            }
            return;
        })
        // friend:accept
        socket.on('friend:accept', (data) => {
            // console.log(data);
            if (myInfor.user._id === data.friendRequest.requester && data.friendRequest.status === "accepted") {
                console.log("is friend socket");
                setIsFriend(true)
                const mappedObject = {
                    "_id": data.friendRequest._id,
                    "avatar": data.userInfo.avatar,
                    "name": data.userInfo.name,
                    "userId": data.userId
                };

                dispatch(updateFriend(mappedObject))
                return;
            }
            if (data.friendRequest.recipient === myInfor.user._id && data.friendRequest.status === "accepted") {
                console.log("recipient socket");
                setIsFriend(true)
                const mappedObject = {
                    "_id": data.friendRequest._id,
                    "avatar": data.userInfo.avatar,
                    "name": data.userInfo.name,
                    "userId": data.userId
                };

                dispatch(updateFriend(mappedObject))
                return;

            }

            return;
        })
        socket.on('friend:reject', (data) => {
            // console.log(data);
            if (myInfor.user._id === data.userId) {
                console.log("reject socket");
                setIsSendRequest(false)
                setIsRecipient(false)
                setIsFriend(false)

            }

            return;
        })
        socket.on('friend:cancel', (data) => {
            // console.log(data);
            if (myInfor.user._id === data.userId) {
                console.log("cancel socket");
                setIsSendRequest(false)
                setIsRecipient(false)
                setIsFriend(false)

            }

            return;
        })
        socket.on('friend:remove', (data) => {
            // console.log(data);
            if (myInfor.user._id === data.userId) {
                console.log("remove socket");
                setIsFriend(false)
                setIsSendRequest(false)
                setIsRecipient(false)
                dispatch(removeFriend(data.userId))

            }

            return;
        })
    }, [])


    // console.log(friend);
    // console.log(friend.requester);
    // console.log(isFriend);
    // console.log(isRecipient);
    // console.log(isSendRequest);



    const sendRequest = async () => {
        const accessToken = await getAccessToken();
        // console.log(user);
        // console.log(friend);
        fetch(`${BASE_URL}/friends/request/${user._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        }
        ).then(response => {
            // console.log(response);

            if (response.status === 200) {
                console.log('success');
                setIsSendRequest(true);
                getFriendOfUser();
                Toast.show({
                    type: 'success',
                    text1: 'Request sent successfully',
                    position: 'top',
                    visibilityTime: 2000,
                })
                return;

            }
            else {
                console.log('error');
                setIsSendRequest(false);
                return;
            }
        }
        ).catch((error) => console.log("fetch error", error))

    }

    const handleCancelSendRequest = async () => {
        const accessToken = await getAccessToken();
        // console.log(user);
        // console.log(friend);
        fetch(`${BASE_URL}/friends/cancel/${friend._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        })
            .then(response => {
                // console.log(response);
                // console.log(response.status);
                if (!response.ok) {
                    console.log('error');
                    return;
                }

                console.log('cancel success');

                // getFriendOfUser();
                setIsSendRequest(false);
                setIsRecipient(false);
                Toast.show({
                    type: 'success',
                    text1: 'Cancel request successfully',
                    position: 'top',
                    visibilityTime: 2000,
                })
            }
            )

    }
    const handleRejectRequest = async () => {
        const accessToken = await getAccessToken();
        // console.log(user);
        // console.log(friend);
        fetch(`${BASE_URL}/friends/reject/${friend._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        })
            .then(response => {
                // console.log(response);
                // console.log(response.status);
                if (!response.ok) {
                    console.log('error');
                    return;
                }

                console.log('cancel success');

                // getFriendOfUser();
                setIsSendRequest(false);
                setIsRecipient(false);
                Toast.show({
                    type: 'success',
                    text1: 'Cancel request successfully',
                    position: 'top',
                    visibilityTime: 2000,
                })
            }
            )

    }

    const handleUnfriend = async () => {
        // console.log(currentFriend);
        const accessToken = await getAccessToken();
        fetch(`${BASE_URL}/friends/remove/${friend._id}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        })
            .then(response => {
                // console.log(response.status);
                console.log('success');
                if (!response.ok) {
                    console.log("error");

                    return;
                }
                console.log("unfriend success");
                setIsFriend(false);
                setIsSendRequest(false)
                setIsRecipient(false)
                getFriendOfUser();
                Toast.show({
                    type: 'success',
                    text1: 'Unfriend successfully',
                    position: 'top',
                    visibilityTime: 2000,
                })
                dispatch(removeFriend(friend.userId))
                return;
            })

    }


    const handleAcceptRequest = async () => {
        const accessToken = await getAccessToken();
        // console.log(user._id);
        // console.log(friend);
        fetch(`${BASE_URL}/friends/accept/${friend._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        }
        ).then(response => {
            // console.log(response.status);
            if (!response.ok) {
                // console.log(response);
                setIsFriend(false)
                return;
            }
            console.log('add friend success');
            setIsFriend(true)
            getFriendOfUser();

            return response.json();
        }).then((data) => {
            // console.log(data);
            // if (!data.data) {
            //     console.log("fail");
            //     return;
            // }
            // else {
            dispatch(updateFriend(currentFriend))
            Toast.show({
                type: 'success',
                text1: 'Add friend successfully',
                position: 'top',
                visibilityTime: 2000,
            })
        }

            // }
        )

    }


    const handleSendMessage = async () => {
        const token = await getAccessToken();
        // console.log(token);
        // console.log(user);
        // console.log("user id", user._id);
        fetch(`${BASE_URL}/conservations/open/${user._id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                }
            }).then((response) => response.json())
            .then((data) => {
                // console.log(data)
                if (data.status === "fail") {
                    console.log("fail");
                    return;
                }
                else {
                    // console.log(data.data._id);
                    dispatch(setCurrentConversation(data.data))
                    navigation.navigate('Chat', { data: data.data, isFriend: true })

                }


            })

            .catch(() => console.log("fetch error"))


    }

    const handleUserInformation = () => {
        setModalVisible(true);

    }

    const formatDate = (date) => {

        const d = new Date(date);
        const day = d.getDate();
        let temp = day;
        if (temp < 10) {
            temp = '0' + day;
        }
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return `${temp}/${month}/${year}`;
    }



    return (
        <SafeAreaView>
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
                                    {/* <Pressable style={styles.button} onPress={() => handleSendMessage()}>
                                        <Text style={styles.textStyle}>Send Message</Text>
                                    </Pressable> */}
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
                                            <Pressable style={styles.button} onPress={() => handleRejectRequest()}>
                                                <Text style={styles.textStyle}>Reject Request</Text>
                                            </Pressable>
                                            {/* <Pressable style={styles.button} onPress={() => handleSendMessage()}>
                                                <Text style={styles.textStyle}>Send Message</Text>
                                            </Pressable> */}
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
                                            {/* <Pressable style={styles.button} onPress={() => handleSendMessage()}>
                                                <Text style={styles.textStyle}>Send Message</Text>
                                            </Pressable> */}

                                        </View>
                                    }


                                </View>
                            )}
                        </View>
                        :
                        <View>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 20,
                                flexDirection: 'row',
                                gap: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Pressable style={styles.button} onPress={() => handleSendMessage()}>
                                    <Text style={styles.textStyle}>Send Message</Text>
                                </Pressable>
                                <Pressable style={{
                                    height: 40,
                                    width: '30%',
                                    backgroundColor: '#757573',
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} onPress={() => modalConfirm()}>
                                    <Text style={styles.textStyle}>Unfriend</Text>
                                </Pressable>


                            </View>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 30
                            }}>
                                <Pressable style={{
                                    height: 40,
                                    width: '70%',
                                    backgroundColor: '#f558a4',
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} onPress={() => handleUserInformation()}>
                                    <Text style={{
                                        color: 'white',
                                    }}>
                                        View user information
                                    </Text>
                                </Pressable>
                            </View>

                        </View>



                    }
                </View>

            </View>
            <View style={{}}>
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={handleCloseModal}

                >
                    <View style={styles.modalContainer}>
                        {/* // content of modal */}
                        <View style={[styles.modalContent, styles.biggerModalContent]}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                                <Divider style={styles.divider} />

                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Date of Birth</Text>
                                    <Text>{formatDate(user.dateOfBirth)}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Name</Text>
                                    <Text>{user.name}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Gender</Text>
                                    <Text>{user.gender}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text>{user.email}</Text>
                                </View>
                                <Divider style={styles.divider} />






                            </View>


                            <View style={{
                                flexDirection: 'row', gap: 150, marginTop: 'auto'

                            }}>
                                <Pressable onPress={handleCloseModal}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        width: '30%',
        backgroundColor: '#f558a4',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'

    },
    textStyle: {
        color: 'white',
        fontSize: '15',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    openButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 16,
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
        height: '50%',
    },
    divider: {
        marginTop: 5,
        width: '100%',
        margin: 'auto'
    },
    infoContainer: {
        flexDirection: "column",
        marginTop: 10,
        gap: 10,
    },
    infoRow: {
        flexDirection: "row",
        gap: 5,
        height: 30,
        alignItems: "center",
    },
    infoLabel: {
        color: "grey",
        width: 100,
        // marginLeft: 20,
    },
    infoValue: {
        fontWeight: "450",
        // marginLeft: 10,
    },
})