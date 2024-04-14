import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
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
import { useSocket } from "../socket.io/socket-context";
import { setAllConversation, setCurrentConversation, updateConversation } from "../../rtk/user-slice";
import ActionSheet from 'react-native-actionsheet';
import { Platform } from "react-native";

export default function MemberList({ navigation, route }) {
    const conservationParam = route.params.data;
    const user = useSelector((state) => state.user.user);
    const friendsInRedux = useSelector((state) => state.user.friends);
    const [searchFriend, setSearchFriend] = useState();
    const [friends, setFriends] = useState([]);
    const [nameGroup, setNameGroup] = useState(conservationParam.name);
    const [image, setImage] = useState(conservationParam.image);
    const [modalVisible, setModalVisible] = useState(false);
    const [members, setMembers] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [isRemove, setIsRemove] = useState(false);
    const [newMember, setNewMember] = useState();
    const dispatch = useDispatch()
    const currentConversation = useSelector((state) => state.user.currentConversation);
    const allConversationAtRedux = useSelector((state) => state.user.conversation);
    const [onChange, setOnChange] = useState(false);
    const [isLeader, setIsLeader] = useState(false);



    const handleCheckboxToggle = (userId) => {
        if (selectedFriends.includes(userId)) {
            setSelectedFriends(selectedFriends.filter((id) => id !== userId));
        } else {
            setSelectedFriends([...selectedFriends, userId]);
        }
    };

    const { socket } = useSocket();
    useEffect(() => {
        groupMembersByLetter(currentConversation.members)
        groupFriendsByLetter();
    }, [])


    function groupMembersByLetter(members) {
        const friendGroupByName = members.reduce((result, friend) => {
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
            setMembers(sortedFriendGroups);

        });

        return sortedFriendGroups;
    };


    function groupFriendsByLetter() {
        const friendGroupByName = friendsInRedux.reduce((result, friend) => {
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
                        onPress={() => navigation.navigate('OptionGroup', { data: conservationParam })}
                        style={{ marginHorizontal: 15, marginLeft: 0 }}
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Memmber List</Text>

                </View>
            ),
        })
    }, [])
    // useEffect(() => {
    //     groupMembersByLetter()
    //     groupFriendsByLetter();
    // }, [])

    const handleOpenModal = () => {
        setModalVisible(true);
    }
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedFriends([]);
    };

    const handleAddMember = async () => {
        const accessToken = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${conservationParam._id}/addMembers`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken

            },
            body: JSON.stringify({ members: selectedFriends })
        }).then((response) => {
            return response.json()
        })
            .then((data) => {
                console.log(data);
                if (data.status === 'fail') {
                    setModalVisible(false);
                    setSelectedFriends([]);
                    Toast.show({
                        type: 'error',
                        text1: data.message,
                        visibilityTime: 2000,
                        position: 'top'

                    })
                    return;
                }

                setOnChange(!onChange)
                setModalVisible(false);
                setSelectedFriends([]);
                Toast.show({
                    type: 'success',
                    text1: "Add member successfully",
                    visibilityTime: 2000,
                    position: 'top'
                })
                // dispatch(updateConversation(data.data))
            }).catch((err) => {
                console.log(err);
            })



    }




    const options = ['View profile', 'Transfer group leader', 'Cancel'];
    const actionSheetRef = useRef();
    const handlePress = () => {
        actionSheetRef.current.show();
    };

    const handleViewProfile = async (friend) => {
        // members.map(async (member) => {
        // if (member._id !== user._id) {
        //     const friend = await findFriendById(member._id);
        //     console.log(friend);
        navigation.navigate('FriendProfile', { friend: friend });

        // }
        // else {
        //     return;

        // }
        // })
    }


    const listIdsOfMembers = currentConversation.members.map(member => member._id);
    const handleRemoveMultipleChoose = () => {
        setIsRemove(!isRemove);
        setSelectedFriends([]);

    }

    const handleRemoveMember = async () => {
        if (user._id === conservationParam.leaders[0]._id) {
            if (selectedFriends.length !== 0) {
                const accessToken = await getAccessToken();
                fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${conservationParam._id}/removeMembers`, {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken

                    },
                    body: JSON.stringify({ members: selectedFriends })
                }).then((response) => {
                    return response.json()
                })
                    .then((data) => {
                        console.log(data);
                        if (data.status === 'fail') {
                            setModalVisible(false);
                            setSelectedFriends([]);
                            Toast.show({
                                type: 'error',
                                text1: data.message,
                                visibilityTime: 2000,
                                position: 'top'

                            })
                            return;
                        }
                        setOnChange(!onChange)

                        setModalVisible(false);
                        Toast.show({
                            type: 'success',
                            text1: "Remove member successfully",
                            visibilityTime: 2000,
                            position: 'top'
                        })
                        setSelectedFriends([]);
                        setIsRemove(false);


                        // dispatch(setAllConversation(updateConservation))
                        // dispatch(setCurrentConversation({...currentConversation}))
                    }).catch((err) => {
                        console.log(err);
                    })
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: "Please choose member to remove",
                    visibilityTime: 2000,
                    position: 'top'
                })
                return;
            }
        }
        else {
            Toast.show({
                type: 'error',
                text1: "You are not leader of this group",
                visibilityTime: 2000,
                position: 'top'
            })
            setSelectedFriends([]);
            return;
        }


    }
    const handleConversationUpdate = (data) => {
        const members = data.conversation.members;
        let updatedConversationArray = allConversationAtRedux;
        const newConversation = checkIsMember(data, members);
        if (newConversation !== null) {
            updatedConversationArray = [...allConversationAtRedux, newConversation];
        }

        const updatedConversation = updatedConversationArray.map((item) => {
            if (item._id.toString() === data.conversation._id.toString()) {
                return {
                    ...item,
                    lastMessage: data,
                    updatedAt: new Date(Date.now()).toISOString(),
                    isReadMessage: false,
                };
            }
            return item;
        });


        dispatch(setAllConversation(updatedConversation));

    };
    useEffect(() => {
        console.log("effect member list");
        socket.on("message:notification", (data) => {
            console.log(data);
            console.log(currentConversation._id);
            if (data) {
                if (currentConversation._id.toString() === data.conservationId.toString()) {
                    console.log(data.conversation.members);
                    groupMembersByLetter(data.conversation.members)
                    dispatch(setCurrentConversation(data.conversation))
                    const updateConservation = allConversationAtRedux.map(conversation => {
                        if (conversation._id.toString() === data.conversation._id.toString()) {
                            console.log("update conversation delete");
                            const updateConservation1 = { ...data.conversation, lastMessage: data.messages[0] }
                            console.log(updateConservation1);

                            return updateConservation1;
                        }
                        return conversation;
                    })
                    dispatch(setAllConversation(updateConservation))
                }

            }



        }),
            socket.on("conversation:new", (data) => {
                console.log(data);
                data.conversation.members.map((member) => {
                    if (member._id.toString() === user._id.toString()) {
                        console.log("notification");
                        handleConversationUpdate(data);
                    }
                }
                )
            })

        groupFriendsByLetter();
    }, [currentConversation.members])

    const checkLeader = (id) => {
        if (currentConversation.leaders[0]._id === id) {
            return true;
        }
        return false;

    }
    const handleTransferLeader = async (friend) => {
        console.log(friend);
        //conservations/661a5ce649564aa5a3dec8a0/transfer/65bedb350b324b838f18a699
        if (user._id !== conservationParam.leaders[0]._id) {
            Toast.show({
                type: 'error',
                text1: "You are not leader of this group",
                visibilityTime: 2000,
                position: 'top'
            })
            return;
        }
        const accessToken = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${currentConversation._id}/transfer/${friend._id}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        }).then((response) => {
            return response.json()
        }).then((data) => {

            if (data.status === 'fail') {
                Toast.show({
                    type: 'error',
                    text1: data.message,
                    visibilityTime: 2000,
                    position: 'top'
                })
                return;
            }
            setOnChange(!onChange)

            Toast.show({
                type: 'success',
                text1: data.message,
                visibilityTime: 2000,
                position: 'top'
            })
        })
    }

    const EachMemberComponent = ({ friend }) => {
        const actionSheetRef = useRef(null);
        const handlePressIcon = () => {
            actionSheetRef.current.show();
        };
        const handleActionPress = (index) => {
            switch (index) {
                case 0:
                    handleViewProfile(friend);
                    break;
                case 1:
                    handleTransferLeader(friend);
                default:
                    break;
            }

        };

        return (
            <Pressable onPress={() => handlePressIcon()}>
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

                    {(checkLeader(friend._id)) ? (
                        <MaterialCommunityIcons name="key" size={24} color="#f558a4" style={{
                            marginTop: 10,
                        }} />
                    ) : null
                    }


                    {isRemove ? (
                        <View style={{
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "center",
                            // alignContent: 'center',
                            alignItems: 'end',

                        }}>
                            <Checkbox.Android
                                status={selectedFriends.includes(friend._id) ? 'checked' : 'unchecked'}
                                disabled={user._id === friend._id}
                                onPress={() => handleCheckboxToggle(friend._id)}
                            />
                        </View>
                    ) : null}
                    <ActionSheet
                        ref={actionSheetRef}
                        options={options}
                        cancelButtonIndex={2}
                        onPress={handleActionPress}
                    />
                </View>
            </Pressable>
        )
    }

    const memberComponent = () => {

        return (
            <View style={{
                flex: 1,

            }}>
                <ScrollView style={{

                    flex: 1,
                    width: '95%',
                    flexDirection: 'column',

                }}>
                    {Object.keys(members).map((letter) => (
                        <View style={{
                            width: '95%',

                        }} key={letter}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 15 }}>{letter}</Text>
                            {members[letter].map((friend) =>

                                <EachMemberComponent key={friend.userId} friend={friend} />



                            )}

                        </View>

                    ))}

                </ScrollView>

            </View>
        )

    }

    return (
        <View style={{
            flexDirection: 'column',
            flex: 1,

        }}>

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 15,
                marginTop: 10,
                width: Platform.OS === 'web' ? '90%' : '60%',

                marginLeft: Platform.OS === 'web' ? 20 : 50,

            }}>
                <TextInput
                    placeholder="Search friend..."
                    style={{
                        width: Platform.OS === 'web' ? '100%' : '80%',
                        height: 50,
                        borderRadius: 10,
                        fontSize: 18,
                        backgroundColor: '#f0f0f0',

                    }}
                    value={searchFriend}
                    onChangeText={(text) => setSearchFriend(text)}
                />
                <Pressable style={{}}>
                    <MaterialCommunityIcons name='magnify' color='black' size={30} />
                </Pressable>
                <Pressable onPress={() => handleOpenModal()}>
                    <MaterialCommunityIcons name="account-plus" size={30} color="black" />
                </Pressable>
                <Pressable onPress={() => handleRemoveMultipleChoose()}>
                    <MaterialCommunityIcons name="account-remove" size={30} color="black" />
                </Pressable>
                {isRemove ? (
                    <Pressable onPress={() => handleRemoveMember()}>
                        <MaterialCommunityIcons name="delete" size={30} color="red" />
                    </Pressable>
                ) : null}

            </View>
            <View style={styles.dividerForMenu} />
            {memberComponent()}



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
                                flexDirection: 'row',
                                gap: 5,
                            }}>
                                <TextInput
                                    placeholder="Search"
                                    style={{
                                        padding: 10,
                                        borderWidth: 1,
                                        borderColor: '#f558a4',
                                    }}
                                    value={searchFriend}
                                    onChangeText={(text) => setSearchFriend(text)}

                                />
                                <Pressable style={{}}>
                                    <MaterialCommunityIcons name='magnify' color='black' size={30} />
                                </Pressable>

                            </View>

                            <ScrollView style={{
                                flex: 1,
                                width: '100%',
                            }}>

                                {/* {isRemove ? memberComponent() : ( */}
                                <View>
                                    {Object.keys(friends).map((letter) => (
                                        <View style={{
                                            width: '100%'
                                        }}>
                                            <View key={letter} >
                                                <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 15 }}>{letter}</Text>

                                                {friends[letter].map((friend) => (

                                                    <View key={friend.userId}
                                                        style={{
                                                            flexDirection: 'row',
                                                            gap: 10,
                                                            marginTop: 10,
                                                            marginLeft: 10,


                                                        }}>

                                                        <View style={{
                                                            flexDirection: 'row',
                                                            gap: 20,
                                                            flex: 1,

                                                        }}>
                                                            <View style={{
                                                                flexDirection: 'row',
                                                                gap: 20,
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
                                                                    <Checkbox.Android
                                                                        status={selectedFriends.includes(friend.userId) || listIdsOfMembers.includes(friend.userId) ? 'checked' : 'unchecked'}
                                                                        disabled={listIdsOfMembers.includes(friend.userId)}
                                                                        onPress={() => handleCheckboxToggle(friend.userId)}
                                                                    />


                                                                </View>


                                                            </View>
                                                        </View>

                                                    </View>



                                                ))}
                                            </View>

                                        </View>


                                    ))
                                    }
                                </View>
                                {/* )} */}

                            </ScrollView>
                            <View style={{
                                flexDirection: 'row', gap: 150, marginTop: 'auto'

                            }}>
                                <Pressable style={{

                                }} onPress={() => handleAddMember()}>
                                    <Text style={styles.closeButton}>Add</Text>
                                </Pressable>
                                <Pressable onPress={handleCloseModal}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </Pressable>

                            </View>


                        </View>
                    </View>
                </Modal>
            </View>

        </View>

    )
}
const styles = StyleSheet.create({
    dividerForMenu: {
        height: 2,
        backgroundColor: 'grey',
        marginBottom: 10,
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
        color: 'white',
        fontSize: 20,

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