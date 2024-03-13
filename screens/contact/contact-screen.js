import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setFriend } from '../../rtk/user-slice';
import { getAccessToken } from '../user-profile/getAccessToken';
import { useFocusEffect } from '@react-navigation/native';
export function ContactScreen({ navigation }) {

    const dispatch = useDispatch();

    const [selectedOption, setSelectedOption] = useState('friends');
    const [friendIds, setFriendIds] = useState();

    const [groups, setGroups] = useState([]);



    // find id list of friends

    async function fetchAllFriend() {
        // use redux to get current user
        const accessToken = await getAccessToken();
        const dispatch = useDispatch();
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


    // useFocusEffect(() => {
    //     fetchAllFriend();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchAllFriend();

        }, [])
    );

    const friends = useSelector((state) => state.user.friends);
    // const friends = user.friends;
    // console.log(user);
    console.log(friends);

    const user = useSelector((state) => state.user.user);

    // async function findFriendById(friendId) {
    //     const response = await fetch(`http://localhost:3000/users?id=${friendId}`);
    //     const friendInfo = await response.json();
    //     return friendInfo;
    // }

    // recieve list friend id and return list friend info

    //     async function fetchFriendsInfo(friendIds) {
    //         // const friendsTemp = await Promise.all(friendIds.map(
    //         //     friendId => findFriendById(friendId)

    //         // ));


    //         const friendsTemp = await Promise.all(friendIds.map(
    //             friendId => findFriendById(friendId)
    //         ));
    //         console.log(friendsTemp);
    //         // sort friends by full name

    //         const flattenedFriends = friendsTemp.flat();

    //         const uniqueFriends = flattenedFriends.filter(
    //             (friend, index, self) => self.findIndex(f => f.id === friend.id) === index
    //         );

    //         console.log(uniqueFriends); // Single array without duplicates

    //         // Sort friends by full name
    //         const sortedFriends = uniqueFriends.sort((a, b) => a.fullName.localeCompare(b.fullName));
    //         setFriends(sortedFriends);

    //         return friends;
    //     }

    //     async function fetchCoversation() {
    //         // use redux to get current user
    //         const response = await fetch('http://localhost:3000/conversations');
    //         const conversations = await response.json();
    //         console.log(conversations);


    //         const findGroupOfUser = (userId, type) => conversations.filter(
    //             (conversation) => conversation.userId.includes(userId) && conversation.type === type
    //         );


    //         const groupedConversations = findGroupOfUser(1, 'group');


    //         const sortedGroup = groupedConversations.sort((a, b) => a.nameGroup.localeCompare(b.nameGroup));
    //         setGroups(sortedGroup);

    //         return conversations;
    //     }

    //     async function findFriendById(friendId) {
    //         const response = await fetch(`http://localhost:3000/users?id${friendId}`);
    //         const friendInfo = await response.json();
    //         console.log(friendInfo);
    //         return friendInfo;
    //     }



    //     fetchFriendIds();
    //     fetchCoversation();
    //     // fetchFriendsInfo();
    // }, []);

    // console.log(friendIds);
    // console.log(friends);
    // console.log(groups);


    // group friends by a starting letter
    const groupFriendsByLetter = (friends) => {
        console.log(friends);
        const friendGroupByName = friends.reduce((result, friend) => {
            // get first letter of each friend
            const letter = friend.name.charAt(0).toUpperCase();
            if (!result[letter]) {
                result[letter] = [];
            }
            console.log(result);
            console.log(letter);
            console.log(result['A'])
            // add friend to group
            // result is a list of friends
            // result[letter] is a list of friends with the same starting letter
            result[letter].push(friend);
            return result;
        }, {});
        return friendGroupByName;
    };



    // const handleOptionSelect = (option) => {
    //     setSelectedOption(option);
    // };
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
                                }}>100</Text>


                            </View>

                            <View style={styles.dividerForMenu} />


                            <View>
                                {Object.keys(groupedFriends).map((letter) => (
                                    <View key={letter}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 15 }}>{letter}</Text>
                                        {groupedFriends[letter].map((friend) => (
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
                                                    }}>
                                                        {/* // api to get avatar */}
                                                        <Image source={{ uri: user.avatar }} style={{
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

                                }}>
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
                                            <Image source={{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }} style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 50

                                            }} />
                                            <Text style={{
                                                marginTop: 10,

                                                fontSize: 20
                                            }}>{group.nameGroup}</Text>
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