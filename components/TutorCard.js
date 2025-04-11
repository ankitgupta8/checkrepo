import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const TutorCard = ({
  grade,
  hoursToTeach,
  location,
  salary,
  name,
  subject,
  phoneNumber,
  photoURL,
  specificLocation,
  province,
  district,
  navigation,
  teachingHours,
}) => {
  const handlePress = () => {
    navigation.navigate('StudentDetails', {
      grade,
      hoursToTeach,
      location,
      salary,
      name,
      subject,
      phoneNumber,
      photoURL,
      specificLocation,
      province,
      district,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <AntDesign name="right" size={24} color="#666" />
        </View>
        <View style={styles.details}>
          <Text style={styles.info}>Grade: {grade}</Text>
          <Text style={styles.info}>Subject: {subject}</Text>
          <Text style={styles.info}>Location: {district || location}</Text>
          <Text style={styles.detailText}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} /> {teachingHours} hours/week
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1976D2',
    letterSpacing: 0.3,
  },
  details: {
    gap: 6,
  },
  info: {
    fontSize: 17,
    color: '#424242',
    paddingVertical: 2,
    fontWeight: '500',
  },
  detailText: {
    fontSize: 17,
    color: '#424242',
    paddingVertical: 2,
    fontWeight: '500',
  }
});

export default TutorCard; 