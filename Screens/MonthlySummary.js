import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function MonthlySummary() {

    const [legalHours, setLegalHours] = useState(0);
    const [cashHours, setCashHours] = useState(0);
    const [legalPay, setLegalPay] = useState(0);
    const [cashPay, setCashPay] = useState(0);

    useEffect(() => {
        getMonthlySummary();
    }, [])

    const getMonthlySummary = async () => {
        const getDayRef = collection(db, 'daily', auth.currentUser.email, getCurrentDate());
        const getDayDoc = query(getDayRef, where('dayNum', '==', getCurrentDate()));
        const getDayData = await getDocs(getDayDoc);
        if (getDayData.docs.length === 0) {
            setLegalHours(0);
            setCashHours(0);
            setLegalPay(0);
            setCashPay(0);
        } else {
            setLegalHours(getDayData.docs[0].data().legalHours);
            setCashHours(getDayData.docs[0].data().cashHours);
            setLegalPay(getCashPayData.docs[0].data().legalPay);
            setCashPay(getCashPayData.docs[0].data().cashPay);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.calculationContainer}>
                    <View style={styles.calculationCard}>
                        <View style={styles.cardHeader}>
                            <FontAwesome5 name="calendar-week" size={20} color="#63B3ED" />
                            <Text style={styles.calculationTitle}>Monthly Hours</Text>
                        </View>
                        <View style={styles.calculationRow}>
                            <Text style={styles.calculationLabel}>Legal Hours:</Text>
                            <Text style={styles.calculationValue}>{legalHours}</Text>
                        </View>
                        <View style={styles.calculationRow}>
                            <Text style={styles.calculationLabel}>Cash Hours:</Text>
                            <Text style={styles.calculationValue}>{cashHours}</Text>
                        </View>
                        <View style={[styles.calculationRow, styles.totalRow]}>
                            <Text style={styles.calculationLabel}>Total Hours:</Text>
                            <Text style={styles.calculationValue}>{legalHours + cashHours}</Text>
                        </View>
                    </View>
                    <View style={styles.calculationCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="cash-outline" size={24} color="#63B3ED" />
                            <Text style={styles.calculationTitle}>Monthly Pay</Text>
                        </View>
                        <View style={styles.calculationRow}>
                            <Text style={styles.calculationLabel}>Legal Pay:</Text>
                            <Text style={styles.calculationValue}>$ {legalPay}</Text>
                        </View>
                        <View style={styles.calculationRow}>
                            <Text style={styles.calculationLabel}>Cash Pay:</Text>
                            <Text style={styles.calculationValue}>$ {cashPay}</Text>
                        </View>
                        <View style={[styles.calculationRow, styles.totalRow]}>
                            <Text style={styles.calculationLabel}>Total Pay:</Text>
                            <Text style={styles.calculationValue}>$ {legalPay + cashPay}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark background for the entire screen
    },
    scrollContent: {
        flexGrow: 1,
    },
    calculationContainer: {
        padding: 16,
    },
    calculationCard: {
        backgroundColor: '#1F1F1F', // Dark card background
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // Darker shadow for better elevation effect
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    calculationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F7FAFC', // Light accent color for titles
        marginLeft: 10,
    },
    calculationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    calculationLabel: {
        fontSize: 16,
        color: '#A0A0A0', // Lighter gray for labels
    },
    calculationValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f8f8f8', // Lighter text for values
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#7F8487', // Subtle border for total row
        paddingTop: 8,
        marginTop: 8,
    },
});