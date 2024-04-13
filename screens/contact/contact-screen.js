import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image, TextInput } from 'react-native';
import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setFriend } from '../../rtk/user-slice';
import { getAccessToken } from '../user-profile/getAccessToken';
import { useFocusEffect } from '@react-navigation/native';
import { findFriendById } from '../../service/friend.util';
import ActionSheet from 'react-native-actionsheet';

export function ContactScreen({ navigation }) {

    const dispatch = useDispatch();

    const [selectedOption, setSelectedOption] = useState('friends');
    const [friendIds, setFriendIds] = useState();

    const [groups, setGroups] = useState([]);

    const userProfile = async (id) => {
        console.log(id);
        const friendTemp = await findFriendById(id);
        console.log(friendTemp);
        navigation.navigate('FriendProfile', { friend: friendTemp })

    }

    const options = ['Add Friend', 'Add Group', 'Cancel'];
    const actionSheetRef = useRef();
    const handleAddFriend = () => {
        navigation.navigate('FindFriend')
    }

    const handleAddGroup = () => {
        navigation.navigate('AddGroup')
    }



    // find id list of friends

    async function fetchAllFriend() {
        // use redux to get current user
        const accessToken = await getAccessToken();

        await fetch("http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/friends", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                dispatch(setFriend({
                    friends:
                        data.data
                })

                );
                console.log("ok");
            });
    }

    async function fetchAllGroup() {
        // use redux to get current user
        const accessToken = await getAccessToken();

        await fetch("http://ec2-52-221-252-41.ap-southeast-1.compute.amazonaws.com:8555/api/v1/conservations?type=group", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setGroups(data.data);
                console.log("ok");
            })
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchAllFriend();
            fetchAllGroup();

        }, [])
    );

    const friends = useSelector((state) => state.user.friends);
    console.log(friends);

    const user = useSelector((state) => state.user.user);


    const groupFriendsByLetter = (friends) => {
        const friendGroupByName = friends.reduce((result, friend) => {
            const letter = friend?.name.charAt(0).toUpperCase();
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
        });

        return sortedFriendGroups;
    };
    const handlePress = () => {
        actionSheetRef.current.show();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerStyle: {
                backgroundColor: '#f558a4',
                height: 60,
            },
            headerLeft: () => (
                <View style={{ height: 50, marginTop: -5, paddingHorizontal: 10, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <MaterialCommunityIcons name="magnify" color="white" size={20} />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="white"
                            style={{ height: 20, fontSize: 17, color: 'white' }}
                        />
                    </View>
                </View>
            ),
            headerRight: () =>
                <View style={{ position: 'relative' }}>
                    <View style={{ marginRight: 20 }}>
                        {/* <ContextMenu /> */}
                        <Pressable onPress={handlePress}>
                            <MaterialCommunityIcons name="plus" color="white" size={25} />
                        </Pressable>
                        <ActionSheet
                            ref={actionSheetRef}
                            options={options}
                            cancelButtonIndex={2}
                            onPress={(index) => {
                                // Handle the selected option based on the index
                                switch (index) {
                                    case 0:
                                        handleAddFriend();
                                        break;
                                    case 1:
                                        handleAddGroup();
                                        break;
                                    default:
                                        break;
                                }
                            }}
                        />
                    </View>
                </View>
        })
    }, [])


    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };
    const groupedFriends = groupFriendsByLetter(friends);
    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => handleOptionSelect('friends')}
                >
                    <Text style={{ fontWeight: selectedOption === 'friends' ? 'bold' : 'normal', fontSize: 17 }}>Friends</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOptionSelect('groups')}>
                    <Text style={{ fontWeight: selectedOption === 'groups' ? 'bold' : 'normal', fontSize: 17 }}>Groups</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{
                height: '100%'

            }}>
                <View style={{
                    height: '100%',
                }}>

                    <View style={[styles.dividerForMenu]} />


                    {selectedOption === 'friends' && (
                        <View>
                            <Divider style={{
                                backgroundColor: '#f558a4',
                                height: 2,
                                width: '20%',
                                marginTop: -12,
                                marginLeft: 60,

                            }} />


                            <View style={{
                                flexDirection: 'column',
                                gap: 7,
                            }}>
                                <Pressable onPress={() => {
                                    navigation.navigate('FriendRequest')
                                }}>
                                    <Text style={{
                                        marginLeft: 20,
                                        fontSize: 16
                                    }}>Friend Request</Text>
                                </Pressable>

                                <Pressable>
                                    <Text style={{
                                        marginLeft: 20,
                                        fontSize: 16
                                    }}>Device contact</Text>
                                </Pressable>

                                <Pressable>
                                    <Text style={{
                                        marginLeft: 20,
                                        fontSize: 16
                                    }}>Birthday schedule</Text>
                                </Pressable>

                            </View>
                            <View style={styles.divider} />


                            <View style={{
                                width: '25%',
                                backgroundColor: '#b6b6ba',
                                borderRadius: 20,
                                height: 30,
                                flexDirection: 'row',
                                gap: 20
                            }}>

                                <Text style={{
                                    marginLeft: 10,
                                    fontWeight: 'bold',
                                    marginTop: 5,
                                    textAlign: 'center',
                                }}>All</Text>


                                {/* api to get number of friends */}
                                <Text style={{
                                    marginLeft: 5,
                                    marginTop: 5,
                                    textAlign: 'center',
                                }}>{friends.length}</Text>


                            </View>

                            <View style={styles.dividerForMenu} />


                            <View>
                                {Object.keys(groupedFriends).map((letter) => (
                                    <View key={letter}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 15 }}>{letter}</Text>
                                        {groupedFriends[letter].map((friend) => (
                                            // <Pressable onPress={() => userProfile(friend)}>
                                            <View key={friend.id}
                                                style={{
                                                    flexDirection: 'row',
                                                    gap: 10,
                                                    marginTop: 10,
                                                    marginLeft: 10
                                                }}>

                                                <View style={{
                                                    flexDirection: 'row',
                                                    gap: 20
                                                }}>

                                                    {/* onPress to go to message screen with friend */}
                                                    <Pressable style={{
                                                        flexDirection: 'row',
                                                        gap: 20
                                                    }} onPress={() => userProfile(friend.userId)}>
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
                                                    </Pressable>
                                                </View>
                                            </View>
                                            // </Pressable>
                                        ))}
                                    </View>
                                ))}
                            </View>

                        </View>


                    )
                    }

                    {selectedOption === 'groups' && (
                        <View>
                            <Divider style={{
                                backgroundColor: '#f558a4',
                                height: 2,
                                width: '20%',
                                marginTop: -12,
                                marginRight: 60,
                                marginLeft: 280

                            }} />
                            <View style={{
                                flexDirection: 'row',
                                gap: 10
                            }}>
                                <Pressable style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    marginLeft: 10

                                }} onPress={() => handleAddGroup()}>
                                    <View style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 50,
                                        backgroundColor: '#fc83dc'
                                    }}>
                                        <MaterialCommunityIcons name="plus" color="white" size={30} style={{
                                            marginLeft: 10,
                                            marginTop: 10
                                        }} />
                                    </View>

                                    <Text style={{
                                        marginLeft: 10,
                                        marginTop: 10,
                                        fontSize: 18,
                                        fontWeight: 650
                                    }}>New Group</Text>


                                </Pressable>

                            </View>
                            <Divider style={styles.divider} />
                            {/* api to get all of groups and number of group */}
                            <Text style={{
                                marginTop: 5,
                                marginLeft: 5,
                                fontSize: 17,
                                fontWeight: 'bold'
                            }}>Join group (15) </Text>
                            {groups.map((group) => (
                                <View key={group.id}
                                    style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        marginTop: 10,
                                        marginLeft: 10
                                    }}>

                                    <View style={{
                                        flexDirection: 'row',
                                        gap: 20
                                    }}>
                                        {/* onPress to go to message screen with group */}
                                        <Pressable style={{
                                            flexDirection: 'row',
                                            gap: 20
                                        }}>
                                            {/* // api to get avatar */}
                                            <Image source={{ uri: group.image }} style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 50

                                            }} />
                                            <Text style={{
                                                marginTop: 10,

                                                fontSize: 20
                                            }}>{group.name}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                </View>
            </ScrollView>





        </View>


    );
};
const styles = StyleSheet.create({
    divider: {
        height: 4,
        backgroundColor: '#bebec2',
        marginTop: 10,
        marginBottom: 10,
    },
    dividerForMenu: {
        height: 2,
        backgroundColor: '#bebec2',
        marginTop: 10,
        marginBottom: 10,
    },
    selectedDivider: {
        backgroundColor: '#f558a4',
    },

});
export default ContactScreen;