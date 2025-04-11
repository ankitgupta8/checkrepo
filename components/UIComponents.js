/**
 * UIComponents.js - Reusable UI Components Library
 * 
 * This file contains a collection of reusable UI components used throughout the application:
 * - Button: Customizable button with different variants and sizes
 * - Card: Container component for content display
 * - Input: Form input component with validation
 * - Badge: Small status indicator
 * - Heading: Text component with different sizes and styles
 * 
 * Features:
 * - Theme integration
 * - Consistent styling
 * - Accessibility support
 * - Responsive design
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

// Button Component
export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  disabled = false,
  fullWidth = false,
  style,
  loading = false
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.gradient.primary;
      case 'secondary':
        return theme.colors.gradient.secondary;
      case 'outline':
        return ['transparent', 'transparent'];
      case 'ghost':
        return ['transparent', 'transparent'];
      default:
        return theme.colors.gradient.primary;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: theme.typography.fontSize.sm };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: theme.typography.fontSize.md };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: theme.typography.fontSize.lg };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: theme.typography.fontSize.md };
    }
  };

  const buttonSize = getSize();
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const textColor = isOutline || isGhost 
    ? variant === 'secondary' ? theme.colors.secondary : theme.colors.primary
    : '#ffffff';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      style={[
        styles.buttonContainer,
        fullWidth && styles.fullWidth,
        style
      ]}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          { 
            paddingVertical: buttonSize.paddingVertical, 
            paddingHorizontal: buttonSize.paddingHorizontal,
            borderWidth: isOutline ? 1 : 0,
            borderColor: isOutline 
              ? variant === 'secondary' ? theme.colors.secondary : theme.colors.primary
              : 'transparent',
            opacity: disabled ? 0.6 : 1,
          },
          fullWidth && styles.fullWidth,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <View style={styles.buttonContent}>
            {icon && (
              <Ionicons 
                name={icon} 
                size={buttonSize.fontSize + 4} 
                color={textColor} 
                style={styles.buttonIcon} 
              />
            )}
            <Text 
              style={[
                styles.buttonText, 
                { 
                  fontSize: buttonSize.fontSize,
                  color: textColor,
                  fontFamily: theme.typography.fontFamily.semiBold
                }
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Card Component
export const Card = ({ children, style, onPress }) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.95 : 1}
    >
      <LinearGradient
        colors={theme.colors.gradient.card}
        style={styles.cardGradient}
      >
        {children}
      </LinearGradient>
    </CardComponent>
  );
};

// Input Component
export const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  error, 
  icon,
  style,
  ...props 
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        error && styles.inputError
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={theme.colors.textSecondary} 
            style={styles.inputIcon} 
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Badge Component
export const Badge = ({ text, color = 'primary', icon, style }) => {
  const getColor = () => {
    switch (color) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'error': return theme.colors.error;
      case 'info': return theme.colors.info;
      default: return color;
    }
  };

  const badgeColor = getColor();
  
  return (
    <View style={[
      styles.badge,
      { backgroundColor: `${badgeColor}20` },
      style
    ]}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={14} 
          color={badgeColor} 
          style={styles.badgeIcon} 
        />
      )}
      <Text style={[
        styles.badgeText,
        { color: badgeColor }
      ]}>
        {text}
      </Text>
    </View>
  );
};

// Heading Component
export const Heading = ({ text, size = 'lg', color = 'text', style }) => {
  const getFontSize = () => {
    switch (size) {
      case 'xs': return theme.typography.fontSize.md;
      case 'sm': return theme.typography.fontSize.lg;
      case 'md': return theme.typography.fontSize.xl;
      case 'lg': return theme.typography.fontSize.xxl;
      case 'xl': return theme.typography.fontSize.xxxl;
      default: return theme.typography.fontSize.xxl;
    }
  };

  const getColor = () => {
    switch (color) {
      case 'text': return theme.colors.text;
      case 'textSecondary': return theme.colors.textSecondary;
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      default: return color;
    }
  };

  return (
    <Text style={[
      styles.heading,
      { 
        fontSize: getFontSize(),
        color: getColor(),
      },
      style
    ]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  // Button styles
  buttonContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Card styles
  card: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
    marginVertical: theme.spacing.sm,
  },
  cardGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  
  // Input styles
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  
  // Badge styles
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  
  // Heading styles
  heading: {
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.sm,
  },
}); 