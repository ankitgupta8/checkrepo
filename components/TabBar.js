import React from 'react';
import { View, Text as RNText, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import theme from '../theme';

const { width } = Dimensions.get('window');

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

const TabBar = ({ state, descriptors, navigation }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  const tabItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Teachers', icon: 'people-outline', activeIcon: 'people' },
    { name: 'Students', icon: 'school-outline', activeIcon: 'school' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person' }
  ];

  return (
    <LinearGradient
      colors={['#ffffff', '#f8f9fa']}
      style={styles.container}
    >
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;
          
          const tabInfo = tabItems[index] || { 
            name: label, 
            icon: 'apps-outline', 
            activeIcon: 'apps' 
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const animatedIconStyle = useAnimatedStyle(() => {
            return {
              transform: [
                { 
                  scale: withSpring(isFocused ? 1.2 : 1, { 
                    duration: 200 
                  }) 
                }
              ],
              opacity: withSpring(isFocused ? 1 : 0.7, { 
                duration: 200 
              })
            };
          });

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                <Ionicons
                  name={isFocused ? tabInfo.activeIcon : tabInfo.icon}
                  size={24}
                  color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                />
              </Animated.View>
              
              <Text
                style={[
                  styles.label,
                  { 
                    color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
                    opacity: isFocused ? 1 : 0.7
                  }
                ]}
              >
                {tabInfo.name}
              </Text>
              
              {isFocused && (
                <View style={styles.indicator} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    ...theme.shadows.medium,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: theme.typography.fontFamily.medium,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 1.5,
  }
});

export default TabBar; 