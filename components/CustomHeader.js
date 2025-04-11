import React, { useEffect } from 'react';
import { View, Text as RNText, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../theme';
import { Heading } from './UIComponents';

// Create a Text component that uses the theme
const Text = ({ style, color, children, ...props }) => {
  const textColor = color || theme.colors.text;
  return (
    <RNText 
      style={[{ color: textColor, fontFamily: theme.typography.fontFamily.regular }, style]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const CustomHeader = ({ 
  title, 
  navigation, 
  showBackButton = true, 
  showTitle = true, 
  rightIcon = null,
  onRightPress = null,
  preventBack = false
}) => {
  // Handle device back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (preventBack) {
          return true; // Prevent going back
        }
        return false; // Allow going back
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [preventBack])
  );

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (!preventBack) {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        
        {showTitle && (
          <View style={styles.titleContainer}>
            <Heading text={title} size="lg" color="#fff" />
          </View>
        )}
        
        <View style={styles.rightContainer}>
          {rightIcon && onRightPress && (
            <TouchableOpacity 
              style={styles.rightButton} 
              onPress={onRightPress}
            >
              <Ionicons name={rightIcon} size={24} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingTop: 40,
    paddingHorizontal: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomHeader; 