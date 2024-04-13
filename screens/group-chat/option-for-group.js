import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Modal, TextInput, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, Divider } from "react-native-paper";
import { Checkbox } from 'react-native-paper';

import {
    AntDesign,
    Feather,
    MaterialCommunityIcons,
    Octicons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { findFriendById } from "../../service/friend.util";
import { ScrollView } from "react-native";
import { getAccessToken } from "../user-profile/getAccessToken";
import Toast from "react-native-toast-message";
import { setCurrentConversation, setAllConversation } from "../../rtk/user-slice";
import { useSocket } from "../socket.io/socket-context";
import { Alert } from "react-native";
export default function OptionGroup({ navigation, route }) {
    const currentConversation = useSelector((state) => state.user.currentConversation);
    const allConversationAtRedux = useSelector((state) => state.user.conversation);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friends, setFriends] = useState([]);
    const [searchFriend, setSearchFriend] = useState();
    const user = useSelector((state) => state.user.user);
    const [onChange, setOnChange] = useState(false);

    const [isEditName, setIsEditName] = useState(false);


    const conservationParam = route.params.data;

    const { socket } = useSocket();
    const dispatch = useDispatch();



    const [newName, setNewName] = useState(currentConversation.name);

    //  navigation.navigate('FriendProfile', { friend: data.data });

    const handleGetMember = async () => {
        conservationParam.members.map(async (member) => {
            if (member._id !== user._id) {
                const friend = await findFriendById(member._id);
                return friend;
            }
            else {
                return null;

            }
        })

    }

    const handleProfileScreen = async () => {
        conservationParam.members.map(async (member) => {
            if (member._id !== user._id) {
                const friend = await findFriendById(member._id);
                console.log(friend);
                navigation.navigate('FriendProfile', { friend: friend });

            }
            else {
                return;

            }
        })
    }
    useLayoutEffect(() => {

        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Chat', { data: conservationParam })}
                        style={{ marginHorizontal: 15, marginLeft: 0 }}
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>

                </View>
            ),
        })
    }, [])

    const handleViewMember = () => {
        navigation.navigate('MemberList', { data: conservationParam });

    }
    const handleLeaveGroup = async () => {
        if (user._id !== conservationParam.leaders[0]._id) {
            const accessToken = await getAccessToken();
            fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${conservationParam._id}/leaveGroup`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken

                }

            }).then((response) => {
                return response.json()
            })
                .then((data) => {
                    console.log(data);
                    if (data.status === 'fail') {

                        Toast.show({
                            type: 'error',
                            text1: data.message,
                            visibilityTime: 2000,
                            position: 'top'

                        })
                        return;
                    }

                    Toast.show({
                        type: 'success',
                        text1: "Leave group successfully",
                        visibilityTime: 2000,
                        position: 'top'
                    })
                    navigation.navigate('MessageScreen');
                }).catch((err) => {
                    console.log(err);
                })
        }
        else {
            Toast.show({
                type: 'error',
                text1: "You can't leave this group",
                visibilityTime: 2000,
                position: 'top'
            })
            return;
        }
    }

    const isEditNameGroup = () => {
        setIsEditName(!isEditName);

    }

    const handleChangeNameGroup = async () => {

        const accessToken = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${conservationParam._id}/changeName`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken

            },
            body: JSON.stringify({
                name: newName
            })

        }).then((response) => {
            return response.json()
        })
            .then((data) => {
                console.log(data);
                if (data.status === 'fail') {
                    Toast.show({
                        type: 'error',
                        text1: data.message,
                        visibilityTime: 2000,
                        position: 'top'

                    })
                    return;
                }
                setOnChange(!onChange);

                Toast.show({
                    type: 'success',
                    text1: "Change name group successfully",
                    visibilityTime: 2000,
                    position: 'top'
                })
                setIsEditName(!isEditName);
                console.log(currentConversation);
                // navigation.navigate('Chat', { data: currentConversation });
            }).catch((err) => {
                console.log(err);
            })
    }


    useEffect(() => {
        console.log("effect member list");
        socket.on("message:notification", (data) => {
            console.log(data);
            if (currentConversation._id.toString() === data.conservationId.toString()) {
                console.log("set current conversation");
                dispatch(setCurrentConversation(data.conversation))
                const updateConservation = allConversationAtRedux.map(conversation => {
                    if (conversation._id.toString() === data.conversation._id.toString()) {
                        return { ...data.conversation }
                    }
                    return conversation;
                })
                dispatch(setAllConversation(updateConservation))
            }
        })
        setNewName(currentConversation.name);
    }, [onChange])
    console.log(currentConversation);
    const checkLeader = (id) => {
        if (currentConversation.leaders[0]._id === id) {
            return true;
        }
        return false;

    }

    // const alertDisbandGroup = () => {

    //     console.log("alert disband group")
    //     Alert.alert('Confirm disband group', 'This action is not undo', [
    //         {
    //             text: 'Cancel',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel',
    //         },
    //         { text: 'OK', onPress: () => handleDisbandGroup() },
    //     ]);
    // };

    const handleDisbandGroup = async () => {
        const accessToken = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${conservationParam._id}/disband`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken

            }

        }).then((response) => {
            return response.json()
        })
            .then((data) => {
                console.log(data);
                if (data.status === 'fail') {
                    Toast.show({
                        type: 'error',
                        text1: data.message,
                        visibilityTime: 2000,
                        position: 'top'

                    })
                    return;
                }

                Toast.show({
                    type: 'success',
                    text1: "Disband group successfully",
                    visibilityTime: 2000,
                    position: 'top'
                })
                navigation.navigate('MessageScreen');
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={{
                            uri: currentConversation.image,
                        }}

                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />

                    <View style={{
                        flexDirection: 'row',
                        gap: 15
                    }}>
                        {!isEditName ? (
                            <View style={{
                                flexDirection: 'row',
                                gap: 15
                            }}>
                                <Text style={styles.userName}>{currentConversation.name}</Text>
                                <Pressable onPress={() => isEditNameGroup()}>
                                    <MaterialCommunityIcons style={styles.userName} name="pencil" size={24} color="black" />
                                </Pressable>


                            </View>
                        ) :
                            (
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 15
                                }}>
                                    <TextInput style={{
                                        flex: 1,
                                        fontSize: 17,
                                        fontWeight: "600",
                                        textAlign: "center",
                                        height: 40,
                                        marginTop: 20,
                                        borderWidth: 1,
                                        borderColor: '#f558a4'

                                    }}
                                        value={newName}
                                        onChangeText={(text) => setNewName(text)}
                                    >

                                    </TextInput>
                                    <Pressable style={styles.userName} onPress={() => handleChangeNameGroup()}>
                                        <MaterialCommunityIcons style={{
                                            flex: 1,
                                            textAlign: "center",
                                            height: 40,
                                        }} name="check" size={30} color="black" />

                                    </Pressable>
                                    <Pressable style={styles.userName} onPress={() => isEditNameGroup()}>
                                        <MaterialCommunityIcons style={{
                                            flex: 1,
                                            textAlign: "center",
                                            height: 40,
                                        }} name="close" size={30} color="red" />

                                    </Pressable>


                                </View>

                            )}
                    </View>

                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            flex: 1,
                            alignItems: "flex-start",
                            marginTop: 50,
                            gap: 15
                        }}
                    >
                        <Button mode="text">
                            <View style={{ flexDirection: "column" }}>
                                <MaterialCommunityIcons
                                    name="file-find-outline"
                                    size={24}
                                    color="black"
                                />
                                <Text style={{ color: 'black' }}>Search</Text>
                                <Text style={{ color: 'black' }}>messages</Text>
                            </View>
                        </Button>
                        <Button mode="text">
                            <View style={{ flexDirection: "column" }}>
                                <MaterialCommunityIcons
                                    name="format-paint"
                                    size={24}
                                    color="black"
                                />
                                <Text style={{ color: 'black' }}>Change</Text>
                                <Text style={{ color: 'black' }}>background</Text>
                            </View>
                        </Button>
                        <Button mode="text">
                            <View style={{ flexDirection: "column" }}>
                                <MaterialCommunityIcons
                                    name="volume-mute"
                                    size={24}
                                    color="black"
                                />
                                <Text style={{ color: 'black' }}>Mute</Text>
                            </View>
                        </Button>
                    </View>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.function}>
                    <Button>
                        <MaterialCommunityIcons
                            name="account-edit-outline"
                            size={24}
                            color="black"
                        />
                        <Text style={styles.textFunc}>Change group name</Text>
                    </Button>
                    <Divider style={styles.divider} />
                    <Button>
                        <MaterialCommunityIcons name="file" size={24} color="black" />
                        <Text style={styles.textFunc}>Sent media, files, links</Text>
                    </Button>

                    <Divider style={styles.divider} />
                    <Button onPress={() => handleViewMember()}>
                        <MaterialCommunityIcons name="account" size={24} color="black" />
                        <Text style={styles.textFunc}>Member lists</Text>
                    </Button>
                    <Button>
                        <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={24}
                            color="red"
                        />
                        <Text style={{ color: "red", marginLeft: 20 }}>Delete chat history</Text>
                    </Button>
                    <Button onPress={() => handleLeaveGroup()}>
                        <MaterialCommunityIcons
                            name="exit-to-app"
                            size={24}
                            color="red"
                        />
                        <Text style={{ color: "red", marginLeft: 20 }}>Leave group</Text>
                    </Button>
                    {checkLeader(user._id) ? (
                        <Button onPress={() => handleDisbandGroup()}>
                            <MaterialCommunityIcons
                                name="cancel"
                                size={24}
                                color="black"
                            />
                            <Text style={{ color: "red", marginLeft: 20 }}>Disband group</Text>
                        </Button>
                    ) : null}

                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileContainer: {
        flex: 1,
        gap: 10,
        marginBottom: 20,
        marginTop: 50,
    },
    userName: {
        flex: 1,
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
        height: 40,
        marginTop: 20
    },
    divider: {
        marginTop: 5,
    },
    function: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 5,
        marginBottom: 50
    },
    textFunc: {

        color: 'black',
        marginLeft: 20
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
        height: '80%',
    },
});
