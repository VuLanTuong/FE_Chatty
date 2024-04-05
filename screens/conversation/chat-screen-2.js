import React, { useState, useEffect, useCallback, useRef, useLayoutEffect, useContext } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Pressable,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    Animated, StyleSheet,
    Platform,
    Modal
} from "react-native";
import {
    AntDesign,
    Feather,
    MaterialCommunityIcons,
    Octicons,
} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { getAccessToken } from "../user-profile/getAccessToken";
import { findFriendById } from "../../service/friend.util";
import { useFocusEffect } from '@react-navigation/native';
import HeaderChat from "./header.chat-ui";
import { useDispatch, useSelector } from "react-redux";
import { useScrollToTop } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import { io } from "socket.io-client";

import { Checkbox } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSocket } from "../socket.io/socket-context";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getConservations } from "../../rtk/user-slice";
const ChatScreen = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [messages, setMessages] = useState([]);
    const [member, setMember] = useState();
    const [selected, setSelected] = useState();
    const [text, setText] = useState("");
    const [friends, setFriends] = useState([]);
    const [searchFriend, setSearchFriend] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [checked, setChecked] = React.useState(false);
    const [contentForward, setContentForward] = useState('');
    const friendInRedux = useSelector((state) => state.user.friends);
    const [file, setFile] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const dispatch = useDispatch()
    const { socket } = useSocket();
    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCheckboxToggle = (userId) => {
        if (selectedFriends.includes(userId)) {
            setSelectedFriends(selectedFriends.filter((id) => id !== userId));
        } else {
            setSelectedFriends([...selectedFriends, userId]);
        }
    };


    const checkIsFriend = () => {
        console.log(friendInRedux);
        conversationParams.members.map((member) => {
            console.log(member);
            if (member._id !== user._id && friendInRedux.find(friend => friend.userId === member._id)) {
                console.log("is friend");
                setIsFriend(true);
                return true;
            }
            else {
                return false;
            }

        })
    }


    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const conversationParams = route.params.data;
    console.log(conversationParams);


    const friendInParams = route.params.friends;

    const allConversationAtRedux = useSelector((state) => state.user.conversation);
    console.log(allConversationAtRedux);

    const scrollViewRef = useRef(null);

    const currentConversation = useSelector((state) => state.user.currentConversation);
    console.log(currentConversation);

    useEffect(() => {
        checkIsFriend()
        getAllMessage();
        console.log("effect");
        scrollToBottom(),
            groupFriendsByLetter();



    }, []);

    console.log(isFriend);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false })
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    const actionSheetRef = useRef();

    const handlePressIcon = () => {
        actionSheetRef.current.show();
    };
    const options = ['Delete', 'Forward', 'Reply', 'Cancel'];

    const handleDelete = async (id) => {
        // console.log(id);
        const token = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/messages/${id}`,
            {
                method: "DELETE",
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
                // console.log(data);
            })

            .catch(() => console.log("fetch error"))

    }


    const openModal = (content) => {
        setContentForward(content);
        setModalVisible(true);
    }


    const handleForward = async () => {
        console.log("press forward");
        // console.log("send text");
        // console.log(contentForward);
        console.log(selectedFriends);
        selectedFriends.map(async (friendId) => {
            console.log("friend forward", friendId);
            const token = await getAccessToken();
            fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/open/${friendId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                    }
                }).then((response) => response.json())
                .then(async (data) => {
                    // console.log(data)
                    if (data.status === "fail") {
                        console.log("fail");
                        return;
                    }
                    else {
                        let response = await fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${data.data._id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token
                            }
                        });
                        const conversationWithFriend = await response.json();

                        console.log(contentForward);
                        console.log(conversationWithFriend);
                        handleSendTextMessage(data.data._id, contentForward, conversationWithFriend.data);
                    }


                })

                .catch(() => console.log("fetch error"))

        })
        Toast.show({
            type: 'success',
            text1: 'Forward message successful',
            position: 'top',
            visibilityTime: 2000,

        });
        setContentForward('');
        setModalVisible(false);



    }


    const handleReply = () => {
        console.log("reply");
    }


    const user = useSelector((state) => state.user.user);

    const member1 = conversationParams.members.find(member => member._id !== user._id)

    useFocusEffect(
        React.useCallback(() => {
            socket.on('message:receive', (data) => {
                console.log(data);
                console.log(user);
                if (data.conversation._id.toString() === currentConversation._id.toString()) {
                    if (data.sender._id !== user._id) {
                        return setMessages([...messages, { ...data, isMine: false }])
                    }
                }
                return;

            })
        }, [messages])
    );
    const getAllMessage = async () => {
        const token = await getAccessToken();
        fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${conversationParams._id}/messages?page=1&limit=50`,
            {
                method: "GET",
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
                console.log(data.data);
                reverseData(data.data)
            })

            .catch(() => console.log("fetch error"))


    }

    const reverseData = (data) => {
        setMessages(data.reverse())

    }

    const handleSendTextMessage = async (id, text, conversation) => {
        // console.log("send text");
        // console.log(text);
        const token = await getAccessToken();
        if (text !== '') {
            fetch(`http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations/${id}/messages/sendText`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                    },
                    body: JSON.stringify({
                        content: text
                    }
                    )
                }).then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.status === "fail") {
                        console.log("fail");
                        return;
                    }

                    socket.emit('message:send', { ...data.data, conversation: conversation, sender: user._id })
                    //kiem tra dieu kien de set
                    if (conversation._id === currentConversation._id) {
                        setMessages([...messages, data.data])
                    }
                    // setMessages([...messages, data.data])
                    setText('');
                    dispatch(getConservations())
                }).then(() => setText(''))
                .catch(() => console.log("fetch error"))
        }
        else {
            console.log("empty text");
            return;
        }

    }
    const getTime = (updateAt) => {
        const date = new Date(updateAt);
        const hour = date.getHours();
        const minute = date.getMinutes();

        return `${hour}:${minute}`;
    }

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleOption = () => {
        navigation.navigate('Option', { data: conversationParams });
    }


    useLayoutEffect(() => {
        console.log(isFriend);
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MessageScreen')}
                        style={{ marginHorizontal: 15, marginLeft: 0 }}
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                        }}
                        onPress={() => handleOption()}>
                        <View>
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 4,
                                    height: 10,
                                    width: 10,
                                    backgroundColor: "green",
                                    borderRadius: 5,
                                    zIndex: 1,
                                    borderWidth: 999,
                                    borderWidth: 2,
                                    borderColor: "white",
                                }}
                            />
                            <Image
                                source={{ uri: conversationParams.image }}
                                resizeMode="contain"
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                }}
                            />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    color: "white",
                                }}
                            >
                                {conversationParams.name}
                            </Text>

                            {/* {isFriend ?
                                <Text style={{ color: "white" }}>Friend</Text>

                                :
                                <Text style={{ color: "white" }}>Not friend</Text>} */}

                            <Text style={{ color: "white" }}>Active now</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            ),
            headerRight: () =>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>

                    <TouchableOpacity style={{ marginHorizontal: 10 }}>
                        <Feather name="phone" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginHorizontal: 10 }}>
                        <Feather name="video" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOption()} style={{ marginHorizontal: 10 }}>
                        <AntDesign name="profile" size={24} color="white" />
                    </TouchableOpacity>
                </View>

        })
    }, [])

    function groupFriendsByLetter() {


        const friendGroupByName = friendInRedux.reduce((result, friend) => {
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
            console.log(sortedFriendGroups);
            setFriends(sortedFriendGroups);
        });

        return sortedFriendGroups;
    };

    const [textLength, setTextLength] = useState(0);
    const onTextLayout = useCallback(e => {
        setTextLength(e.nativeEvent.lines.length);
    }, []);


    const handleChoosePhoto = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // Allow all file types, or specify specific types like 'application/pdf' or 'image/*'
        });
        console.log(result);
        if (!result.canceled) {
            handleUploadPhoto(result.assets[0].uri);
        }
    };

    const handleUploadPhoto = async (file) => {
        const accessToken = await getAccessToken();

        fetch(
            `http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/converations/${conversationParams._id}/messages/sendFilesV2`,
            {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + accessToken,

                    "Content-Type": "application/json",
                },
                body: { file: [file] },
            }
        )
            .then((response) => {
                console.log("response", response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    };







    return (
        <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: 'flex-end' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
        >

            {/* <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}> */}
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ flexGrow: 1 }}
                inverted
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >

                {messages.map((message) => {
                    return (
                        <View key={message._id}
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "flex-end",
                                marginVertical: 5,
                                marginHorizontal: 5,
                                justifyContent:
                                    message.isMine == true ? "flex-end" : "flex-start",
                            }}
                        >
                            {message.isMine == false && (
                                <Image
                                    source={{ uri: message.avatar }}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        marginRight: 5,
                                    }}
                                />
                            )}

                            {/* {message.isMine == true && (
                                <TouchableOpacity onPress={handlePressIcon}>
                                    <MaterialCommunityIcons name="dots-vertical-circle-outline" color="black" size={20} />
                                </TouchableOpacity>
                            )
                            } */}

                            {/* <View
                                style={{
                                    backgroundColor:
                                        message.isMine == true ? "#ffadd5" : "lightgray",
                                    borderRadius: 10,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    flexDirection: 'column',
                                    gap: 5,


                                }}
                            > */}
                            {message.content.length > 20 ? (
                                <View style={{
                                    backgroundColor:
                                        message.isMine == true ? "#ffadd5" : "lightgray",
                                    borderRadius: 10,
                                    paddingHorizontal: 5,
                                    paddingVertical: 5,
                                    flexDirection: 'column',
                                    gap: 5,


                                }}>
                                    <Pressable style={{
                                        width: '80%'
                                    }} onPress={handlePressIcon}>

                                        <Text style={{
                                            fontSize: 16,
                                        }} onTextLayout={onTextLayout}>
                                            {message.content}
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 10,
                                            }}>{getTime(message.updatedAt)}</Text>
                                    </Pressable>

                                </View>

                            ) : (
                                <View style={{
                                    backgroundColor:
                                        message.isMine == true ? "#ffadd5" : "lightgray",
                                    borderRadius: 10,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    flexDirection: 'column',
                                    gap: 5,


                                }}>
                                    <Pressable style={{
                                        width: '100%'
                                    }} onPress={handlePressIcon}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                            }}
                                        >{message.content}</Text>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                            }}>{getTime(message.updatedAt)}</Text>
                                    </Pressable>
                                </View>

                            )}



                            <ActionSheet
                                ref={actionSheetRef}
                                options={options}
                                cancelButtonIndex={3}
                                onPress={(index) => {
                                    switch (index) {
                                        case 0:
                                            handleDelete(message._id);
                                            break;
                                        case 1:
                                            openModal(message.content);
                                            break;
                                        case 2:
                                            handleReply();
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            />

                            {/* </View> */}
                            {/* {message.isMine == false && (
                                <TouchableOpacity onPress={handlePressIcon}>
                                    <MaterialCommunityIcons name="dots-vertical-circle-outline" color="black" size={20} />
                                </TouchableOpacity>
                            )



                            } */}

                            {message.isMine == true && (
                                <Image
                                    source={{ uri: message.avatar }}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        marginLeft: 5,
                                    }}
                                />
                            )}
                        </View>
                    )
                })}
            </ScrollView>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: "#dddddd",
                marginBottom: 10,
            }}>
                <View style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10

                }}>
                    <TouchableOpacity>
                        <MaterialCommunityIcons
                            name="sticker-emoji"
                            size={26}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Message..."
                        style={[{
                            fontSize: 20,
                            height: 50,
                            width: '60%',
                            borderRadius: 20,
                            paddingHorizontal: 10,
                        }, isFocused && styles.textInputFocused
                        ]}
                        value={text}
                        onChangeText={(text) => { setText(text) }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <Pressable onPress={() => handleChoosePhoto()} >
                        <Octicons name="image" size={24} color="black" />
                    </Pressable>
                    <Pressable style={{ marginHorizontal: 5 }}>
                        <Octicons name="file" size={24} color="black" />
                    </Pressable>
                    <Pressable style={{ marginHorizontal: 10 }} onPress={() => handleSendTextMessage(conversationParams._id, text, conversationParams)}>
                        <Feather name="send" size={24} color="black" />
                    </Pressable>

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
                                                                    status={selectedFriends.includes(friend.userId) ? 'checked' : 'unchecked'}
                                                                    onPress={() => handleCheckboxToggle(friend.userId)}
                                                                />


                                                            </View>


                                                        </View>
                                                    </View>
                                                </View>


                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{
                                flexDirection: 'row', gap: 150, marginTop: 'auto'

                            }}>
                                <Pressable style={{

                                }} onPress={() => handleForward()}>
                                    <Text style={styles.closeButton}>Send</Text>
                                </Pressable>
                                <Pressable onPress={handleCloseModal}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </Pressable>

                            </View>

                        </View>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView >



    );
};
const styles = StyleSheet.create({
    textInputFocused: {
        borderColor: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        width: '80%',
        height: 300
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
export default ChatScreen;

