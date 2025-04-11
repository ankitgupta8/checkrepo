import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  // Animation values
  const tabCount = state.routes.length;
  const tabWidth = width / tabCount;
  const indicatorPosition = useRef(state.index * tabWidth);

  React.useEffect(() => {
    indicatorPosition.current = state.index * tabWidth;
  }, [state.index]);


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.tabBar}
      >
        {/* Indicator */}
        <View style={[styles.indicator, { transform: [{ translateX: indicatorPosition.current }] }]}>
          <LinearGradient
            colors={theme.colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.indicatorGradient}
          />
        </View>
        
        {/* Tab buttons */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;
          
          // Get icon from options
          const iconName = options.tabBarIcon ? 
            options.tabBarIcon({ focused: isFocused, color: '', size: 24 }).props.name : 
            'help-circle';
          
          // Handle tab press
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

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <TabItem 
                icon={iconName} 
                label={label} 
                isFocused={isFocused} 
              />
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};

// Individual tab item component
const TabItem = ({ icon, label, isFocused }) => {
  const iconColor = isFocused ? theme.colors.primary : theme.colors.textSecondary;
  const textColor = isFocused ? theme.colors.primary : theme.colors.textSecondary;

  return (
    <View style={styles.tabItem}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <Text style={[styles.tabLabel, { color: textColor, opacity: isFocused ? 1 : 0.7 }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: width / 2, // Assuming 2 tabs by default
    height: 3,
    zIndex: 10,
  },
  indicatorGradient: {
    width: '50%',
    height: '100%',
    alignSelf: 'center',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 4,
  },
});

export default CustomTabBar; 