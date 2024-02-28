import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
export default function ProfileScreen({ navigation }) {
    const user = useSelector((state) => state.user.user);
    console.log(user);
    return (
        <View style={{

        }}>
            <View style={{
                backgroundColor: '#f558a4',
                flexDirection: 'row',
                width: '100%',
                gap: 15,
                height: 50
            }}>
                {/* // onPress to view detail of the user */}
                <Pressable style={{
                    flexDirection: 'row',

                }} onPress={() => {
                    navigation.navigate('DetailProfile')

                }}>
                    <Image source={{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }} style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        marginTop: 5,
                        border: '1px solid white',
                        marginLeft: 5

                    }} />

                    {/* get current user in redux */}
                    <View style={{
                        marginLeft: 10,
                        flexDirection: 'column',
                        gap: 5,
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: 'bold',
                            color: 'white'

                        }}>{user.name}</Text>
                        <Text style={{
                            color: 'white'
                        }}>View profile</Text>
                    </View>

                </Pressable>
            </View>
            {/* <Divider style={styles.divider} /> */}
            <View >
                <Pressable onPress={() => {
                    navigation.navigate('ChangePassword')
                }}>
                    <Text style={{
                        marginLeft: 10,
                        marginTop: 10
                    }}>Change password</Text>
                </Pressable>
                <Divider style={styles.dividerForMenu} />
                <Pressable>
                    <Text style={{
                        marginLeft: 10,
                        marginTop: 10
                    }}>Data and file</Text>
                </Pressable>
                <Divider style={styles.dividerForMenu} />

                <Pressable>
                    <Text style={{
                        marginLeft: 10
                    }}>Account and security</Text>
                </Pressable>
                <Divider style={styles.dividerForMenu} />
                <Pressable>
                    <Text style={{
                        marginLeft: 10
                    }}>Privacy</Text>
                </Pressable>

            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    divider: {
        height: 2,
        backgroundColor: '#bebec2',
        marginTop: 5,
        marginBottom: 10,
    },
    dividerForMenu: {
        height: 2,
        backgroundColor: '#bebec2',
        marginTop: 10,
        marginBottom: 10,
    }
});