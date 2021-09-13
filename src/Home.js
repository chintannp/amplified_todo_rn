import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function Home() {
    return (
        <View style={styles.container}>
            <Text >Todo App</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
