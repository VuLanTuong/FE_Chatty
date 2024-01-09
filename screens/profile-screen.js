import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Divider } from "react-native-paper";

export default function ProfileScreen() {
    return (
        <View>
            <View style={{
                marginTop: 10,
                marginLeft: 10,
                flexDirection: 'row',
                width: '100%',
            }}>
                {/* // onPress to view detail of the user */}
                <Pressable style={{
                    flexDirection: 'row',
                }}>
                    <Image source={{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50

                    }} />

                    {/* get current user in redux */}
                    <View style={{
                        marginLeft: 10,
                        flexDirection: 'column',
                        gap: 5,
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: 'bold'

                        }}>Username</Text>
                        <Text>View profile</Text>
                    </View>

                </Pressable>

            </View>
            <Divider style={styles.divider} />
            <View >
                <Pressable>
                    <Text style={{
                        marginLeft: 10
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
    }
});