export default function ModalListFriend() {
    return (
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
                            <Pressable onPress={handleCloseModal}>
                                <Text style={styles.closeButton}>Close</Text>
                            </Pressable>

                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )

}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
    },
    biggerModalContent: {
        height: '90%',
    },
    closeButton: {
        color: 'red',
        fontSize: 20,
    }
})