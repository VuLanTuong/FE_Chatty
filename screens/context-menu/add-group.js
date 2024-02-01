import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { TextInput } from 'react-native-paper';

import { Divider } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';


const AddGroup = () => {
    const [nameGroup, setNameGroup] = useState("");
    const [selectedOption, setSelectedOption] = useState('friends');
    const [friendIds, setFriendIds] = useState();
    const [friends, setFriends] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState([]);
    useEffect(() => {
        // find id list of friends
        async function fetchFriendIds() {
            // use redux to get current user
            const response = await fetch('http://localhost:3000/users?id=1');
            const currentUser = await response.json();
            const userTemp = currentUser[0];


            setFriendIds(userTemp.listFriend);
            // pass list friend id to fetchFriendsInfo
            fetchFriendsInfo(userTemp.listFriend);
        }

        async function findFriendById(friendId) {
            const response = await fetch(`http://localhost:3000/users?id=${friendId}`);
            const friendInfo = await response.json();
            return friendInfo;
        }

        // recieve list friend id and return list friend info
        async function fetchFriendsInfo(friendIds) {
            // const friendsTemp = await Promise.all(friendIds.map(
            //     friendId => findFriendById(friendId)

            // ));


            const friendsTemp = await Promise.all(friendIds.map(
                friendId => findFriendById(friendId)
            ));
            // console.log(friendsTemp);
            // sort friends by full name

            const flattenedFriends = friendsTemp.flat();

            const uniqueFriends = flattenedFriends.filter(
                (friend, index, self) => self.findIndex(f => f.id === friend.id) === index
            );

            // console.log(uniqueFriends); // Single array without duplicates

            // Sort friends by full name
            const sortedFriends = uniqueFriends.sort((a, b) => a.fullName.localeCompare(b.fullName));
            setFriends(sortedFriends);

            return friends;
        }

        async function fetchCoversation() {
            // use redux to get current user
            const response = await fetch('http://localhost:3000/conversations');
            const conversations = await response.json();
            // console.log(conversations);


            const findGroupOfUser = (userId, type) => conversations.filter(
                (conversation) => conversation.userId.includes(userId) && conversation.type === type
            );


            const groupedConversations = findGroupOfUser(1, 'group');


            const sortedGroup = groupedConversations.sort((a, b) => a.nameGroup.localeCompare(b.nameGroup));
            setGroups(sortedGroup);

            return conversations;
        }

        async function findFriendById(friendId) {
            const response = await fetch(`http://localhost:3000/users?id${friendId}`);
            const friendInfo = await response.json();
            // console.log(friendInfo);
            return friendInfo;
        }



        fetchFriendIds();
        fetchCoversation();
        // fetchFriendsInfo();
    }, []);

    // console.log(friendIds);
    // console.log(friends);
    // console.log(groups);


    // group friends by a starting letter
    const groupFriendsByLetter = () => {
        const groupedFriends = friends.reduce((result, friend) => {
            // get first letter of each friend
            const letter = friend.fullName.charAt(0).toUpperCase();
            if (!result[letter]) {
                result[letter] = [];
            }
            // console.log(result);
            // console.log(letter);
            // console.log(result['A'])
            // add friend to group
            // result is a list of friends
            // result[letter] is a list of friends with the same starting letter
            result[letter].push(friend);
            return result;
        }, {});
        return groupedFriends;
    };

    const groupedFriends = groupFriendsByLetter();

    const handleRadioButtonPress = (friendId) => {
        console.log(friendId);
        if (selectedFriend.includes(friendId)) {
            setSelectedFriend(selectedFriend.filter((id) => id !== friendId));
        } else {
            setSelectedFriend([...selectedFriend, friendId]);
        }


    };

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                height: 50,
                marginTop: 20,
                gap: 10
            }}>
                <Pressable style={{
                    height: 40,
                    width: 40,
                    borderWidth: 1,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginTop: 10
                }}>
                    <MaterialCommunityIcons name="camera" size={24} color="grey" />
                </Pressable>
                <TextInput
                    style={{
                        fontSize: 18,
                        width: '60%',
                        backgroundColor: '#fcbbdc',
                        height: 50,
                        borderRadius: 10
                    }}
                    selectionColor='white'
                    placeholder="Name group"
                    value={nameGroup}
                    onChangeText={text => setNameGroup(text)}
                // contentStyle={{
                //   fontSize: 18
                // }}
                />

                <Pressable style={{
                    marginTop: 10
                }}
                >
                    <MaterialCommunityIcons name="check" size={30} color="#fc58ac" />
                </Pressable>

            </View>

            <View>
                {/* <Divider style={{
          backgroundColor: '#f558a4',
          height: 2,
          width: '20%',
          marginTop: -12,
          marginLeft: 60,

        }} /> */}

                <View style={styles.dividerForMenu} />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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

                                            <Pressable
                                                style={[
                                                    styles.circle,
                                                    selectedFriend.includes(friend.id) && styles.circleSelected
                                                ]}
                                                onPress={() => handleRadioButtonPress(friend.id)}
                                            >
                                                {selectedFriend.includes(friend.id) ? (
                                                    <MaterialCommunityIcons name="check" size={20} color="white" />
                                                ) : null}
                                            </Pressable>

                                            {/* onPress to go to message screen with friend */}
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
                                                }}>{friend.fullName}</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    dividerForMenu: {
        height: 2,
        backgroundColor: '#bebec2',
        marginTop: 10,
        marginBottom: 10,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleSelected: {
        backgroundColor: 'black'
    }
})
export default AddGroup;
