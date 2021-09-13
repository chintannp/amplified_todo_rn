import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Todo App</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 30,
        backgroundColor: '#4696ec',
    },
    title: {
        marginTop: 20,
        textAlign: "center",
        color: "white",
        fontSize: 24,
        fontWeight: "600"
    }
});
