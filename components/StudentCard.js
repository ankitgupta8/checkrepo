/**
 * StudentCard.js - Student Profile Card Component
 * 
 * A reusable component that displays student information in a card format:
 * - Student's name and photo
 * - Location information
 * - Grade level
 * - Subject preferences
 * - Teaching hours and salary requirements
 * 
 * Features:
 * - Animated touch feedback
 * - Gradient background
 * - Responsive layout
 * - Theme integration
 */

import React from 'react';
import { View, Text as RNText, StyleSheet, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import theme from '../theme';
import { Badge } from './UIComponents';

const { width } = Dimensions.get('window');

// Create a Text component that uses the theme
const Text = ({ style, children, ...props }) => {
  return (
    <RNText 
      style={[{ fontFamily: theme.typography.fontFamily.regular }, style]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <View style={styles.detailIconContainer}>
      <Ionicons name={icon} size={18} color={theme.colors.secondary} style={styles.detailIcon} />
    </View>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'Not specified'}</Text>
    </View>
  </View>
);

const StudentCard = ({ 
  name, 
  province, 
  district, 
  specificLocation, 
  grade, 
  subject, 
  phoneNumber, 
  photoURL, 
  navigation,
  teachingHours,
  salary,
  onPress
}) => {
  const scale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withSpring(0.97);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    navigation.navigate('StudentDetails', {
      student: {
        name,
        grade,
        teachingHours,
        province,
        district,
        specificLocation,
        salary,
        subject,
        phoneNumber,
        photoURL,
      }
    });
  };

  const getSubjectColor = () => {
    const colors = {
      'Mathematics': theme.colors.gradient.secondary,
      'Science': theme.colors.gradient.tertiary,
      'English': theme.colors.gradient.primary,
      'default': theme.colors.gradient.secondary
    };
    return colors[subject] || colors.default;
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyles]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <LinearGradient
          colors={getSubjectColor()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.profileSection}>
              <View style={styles.imageContainer}>
                {photoURL ? (
                  <Image source={{ uri: photoURL }} style={styles.profileImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="person" size={40} color={theme.colors.secondary} />
                  </View>
                )}
              </View>
              <View style={styles.nameSection}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color={theme.colors.secondary} />
                  <Text style={styles.location}>
                    {district}, {province}
                  </Text>
                </View>
                {specificLocation && (
                  <Text style={styles.specificLocation}>{specificLocation}</Text>
                )}
              </View>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailsRow}>
                <View style={styles.detailColumn}>
                  <DetailItem icon="school-outline" label="Grade" value={grade} />
                  <DetailItem icon="time-outline" label="Hours" value={teachingHours} />
                </View>
                <View style={styles.detailColumn}>
                  <DetailItem icon="cash-outline" label="Salary" value={salary} />
                  <DetailItem icon="book-outline" label="Subject" value={subject} />
                </View>
              </View>
            </View>

            <View style={styles.badgeContainer}>
              <Badge 
                text="Student" 
                color={theme.colors.secondary}
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 0,
  },
  cardContent: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  location: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    opacity: 0.8,
  },
  specificLocation: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    opacity: 0.7,
  },
  detailsSection: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    flex: 1,
    paddingHorizontal: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  detailIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailIcon: {
    opacity: 0.8,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    opacity: 0.8,
    marginBottom: 2,
    fontFamily: theme.typography.fontFamily.regular,
  },
  detailValue: {
    fontSize: 13,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
});

export default StudentCard; 