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
import { useSelector } from "react-redux";
import { findFriendById } from "../../service/friend.util";
import { ScrollView } from "react-native";
export default function OptionGroup({ navigation, route }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [friends, setFriends] = useState([]);
    const [searchFriend, setSearchFriend] = useState();
    const user = useSelector((state) => state.user.user);

    const currentConversation = useSelector((state) => state.user.currentConversation);



    const conservationParam = route.params.data;

    const handleCheckboxToggle = (userId) => {
        if (selectedFriends.includes(userId)) {
            setSelectedFriends(selectedFriends.filter((id) => id !== userId));
        } else {
            setSelectedFriends([...selectedFriends, userId]);
        }
    };
    function groupFriendsByLetter() {
        console.log(currentConversation);
        const friendGroupByName = currentConversation.members.reduce((result, friend) => {
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
        groupFriendsByLetter();
    }, [])


    console.log(conservationParam);

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
                            uri: conservationParam.image,
                        }}

                        style={{ width: 100, height: 100, borderRadius: 50 }}
                    />

                    <Text style={styles.userName}>{conservationParam.name}</Text>

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
