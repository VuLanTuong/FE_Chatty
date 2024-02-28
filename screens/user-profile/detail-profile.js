import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, TextInput } from 'react-native';
import { Divider, Checkbox, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
export default function DetailProfile({ navigation }) {
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState('User name');
    const [gender, setGender] = useState('Female');
    const [dob, setDob] = useState('01/01/1990');
    const [phoneNumber, setPhoneNumber] = useState('079 432 5642');

    const user = useSelector((state) => state.user.user);
    const handleEditPress = () => {
        setIsEditing(true);
    };

    const handleSavePress = () => {
        setIsEditing(false);

    };

    const formatDateOfBirth = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        return `${day}/${month}/${year}`;
    }

    return (
        <View>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.navigate('ProfileScreen')}>
                    <MaterialCommunityIcons name="arrow-left" color="white" size={20} />
                    <Text style={styles.headerText}>User Information</Text>
                </Pressable>
            </View>

            {/* Form to change information */}
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    {/* <Image source = {{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }}/> */}

                    {
                        isEditing ? (
                            <Image source={{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }} />
                        ) : (
                            <Image source={{ uri: 'https://i.pinimg.com/736x/4b/e5/f3/4be5f377959674df9c2fe172df272482.jpg' }} />
                        )
                    }




                    {
                        isEditing ? (
                            <TextInput
                                style={styles.userName}
                                value={user.name}
                                onChangeText={setUserName}
                            />
                        ) : (
                            <Text style={styles.userName}>{user.name}</Text>
                        )
                    }
                </View>
                <Divider style={styles.divider} />

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={{
                            marginTop: 10,
                            color: 'grey'
                        }}>Gender</Text>
                        {isEditing ? (
                            <View style={{
                                flexDirection: 'row',
                                gap: 2,
                                marginLeft: 25
                            }}>
                                <RadioButton
                                    status={gender === 'Male' ? 'checked' : 'unchecked'}
                                    onPress={() => setGender('Male')}
                                    color="#f558a4"
                                    value='Male'
                                />
                                <Text style={styles.checkboxLabel}>Male</Text>
                                <RadioButton
                                    status={gender === 'Female' ? 'checked' : 'unchecked'}
                                    onPress={() => setGender('Female')}
                                    color="#f558a4"
                                />
                                <Text style={styles.checkboxLabel}>Female</Text>
                                <RadioButton
                                    status={gender === 'Other' ? 'checked' : 'unchecked'}
                                    onPress={() => setGender('Other')}
                                    color="#f558a4"
                                />
                                <Text style={styles.checkboxLabel}>Other</Text>
                            </View>
                        ) : (

                            <Text style={{
                                marginLeft: 50,
                                marginTop: 10
                            }}>{gender}</Text>
                        )}
                    </View>
                    <Divider style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date of Birth</Text>
                        {isEditing ? (
                            <TextInput
                                style={{
                                    marginLeft: 7
                                }}
                                value={formatDateOfBirth(user.dateOfBirth)}
                                onChangeText={setDob}
                            />
                        ) : (
                            <Text style={{
                                marginLeft: 15
                            }}>{formatDateOfBirth(user.dateOfBirth)}</Text>
                        )}
                    </View>
                    <Divider style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone Number</Text>
                        {isEditing ? (
                            <TextInput
                                style={{
                                    marginLeft: -10
                                }}
                                value={user.phone}
                                onChangeText={setPhoneNumber}
                            />
                        ) : (
                            <Text style={{
                                marginLeft: -2
                            }}>{user.phone}</Text>
                        )}
                    </View>

                    {isEditing ? (
                        <Pressable style={styles.saveButton} onPress={handleSavePress}>
                            <MaterialCommunityIcons name="content-save" size={20} style={styles.saveIcon} />
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                    ) : (
                        <Pressable style={styles.editButton} onPress={handleEditPress}>
                            <MaterialCommunityIcons name="pencil" size={20} style={styles.editIcon} />
                            <Text style={styles.editButtonText}>Edit Information</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View >
    );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: '#f558a4',
        paddingHorizontal: 10,
    },
    backButton: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 10,
        height: 30,
        marginTop: 15,
        gap: 10,
    },
    headerText: {
        height: 20,
        fontSize: 15,
        color: 'white',
        fontWeight: '700',
        marginLeft: 5,
    },
    container: {
        display: 'flex',
        marginTop: 5,
        marginLeft: 10,
    },
    profileContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'white',
    },
    userName: {
        marginTop: 5,
        fontSize: 17,
        fontWeight: '600',
    },
    divider: {
        marginTop: 5,
    },
    infoContainer: {
        flexDirection: 'column',
        marginTop: 10,
        gap: 10,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 30,
    },
    infoLabel: {
        color: 'grey',
    },
    infoValue: {
        fontWeight: '450',
        marginLeft: 15,
    },
    editButton: {
        width: 340,
        height: 40,
        backgroundColor: '#f5a4c6',
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    editIcon: {
        marginTop: 10,
    },
    editButtonText: {
        color: 'black',
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
    },
    saveButton: {
        width: 340,
        height: 40,
        backgroundColor: '#f5a4c6',
        borderRadius: 5,
        marginTop: 20,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
    saveIcon: {
        marginTop: 10,
    },
    saveButtonText: {
        color: 'black',
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '500',
    },
    checkboxLabel: {
        marginTop: 7
    }
});