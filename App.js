import { enableScreens } from 'react-native-screens';

import 'react-native-gesture-handler';
/**
 * App.js - Main Application Component
 * 
 * This is the root component of the application that sets up the navigation structure
 * and manages the overall app flow. It includes:
 * - Authentication flow (Sign In, Sign Up, Role Selection)
 * - Student and Teacher specific navigation stacks
 * - Tab navigation for both student and teacher interfaces
 * - Custom header and tab bar components
 * - Theme configuration and navigation linking
 * 
 * The app uses React Navigation with Stack and Tab navigators to manage
 * different user flows for students and teachers.
 */
import 'react-native-reanimated';

import React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Searchbar, Button } from 'react-native-paper';
import { getAuth, signOut } from "firebase/auth";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Import theme and custom components
import theme from './theme';
import CustomTabBar from './components/CustomTabBar';
import CustomHeader from './components/CustomHeader';
import { Button as CustomButton } from './components/UIComponents';

// Import your existing screens
import SignUpScreen from './screens/auth/signUpScreen';
import StudentRegisterScreen from './screens/student/studentRegister/StudentRegisterScreen';
import SignInScreen from './screens/auth/signinscreen.js';
import StudentDashboard from './screens/student/studentProfile/StudentDashboard';
import StudentsRequest from './screens/student/studentList/studentRequests';
import TeacherDashboard from './screens/teacher/teacherProfile/TeacherDashboard';
import TeacherRequest from './screens/teacher/teacherList/teacherRequests';
import TeacherRegisterScreen from './screens/teacher/teacherRegister/TeacherRegisterScreen';
import LandingPage from './initApp';
import ChooseRoleScreen from './screens/role/ChooseRoleScreen.js';
import { auth } from './firebase';
import StudentDetailsScreen from './screens/student/studentList/StudentDetailsScreen';
import TeacherDetailsScreen from './screens/teacher/teacherList/TeacherDetailsScreen';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const { width } = Dimensions.get('window');

function SearchTutorScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Location"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        style={styles.searchBar}
      />
      <CustomButton mode="contained" onPress={() => navigation.navigate('TutorResults')} style={styles.button}>
        Search
      </CustomButton>
    </View>
  );
}
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
function StudentScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{headerShown: false}} />
      <Stack.Screen name="Sregistration" component={StudentRegisterScreen} options={{headerShown: false}} />
      <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function TeacherScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} options={{headerShown: false}} />
      <Stack.Screen name="Tregistration" component={TeacherRegisterScreen} options={{headerShown: false}} />
      <Stack.Screen name="TeacherDetails" component={TeacherDetailsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function TabBar({ state, descriptors, navigation }) {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withTiming(state.index * (width / state.routes.length), { duration: 300 });
  }, [state.index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.tabBar}>
      <Animated.View style={[styles.slider, animatedStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

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
            style={styles.tabItem}
          >
            <AnimatedIcon
              name={options.tabBarIcon({ focused: isFocused, color: '', size: 24 }).props.name}
              size={24}
              color={isFocused ? '#4c669f' : '#b3b3b3'}
              style={[
                styles.icon,
                { transform: [{ scale: isFocused ? 1.2 : 1 }] },
              ]}
            />
            <Text style={[styles.label, { color: isFocused ? '#4c669f' : '#b3b3b3' }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function TeacherRequestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeacherRequestList" component={TeacherRequest} options={{headerShown: false}} />
      <Stack.Screen name="TeacherDetails" component={TeacherDetailsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function StudentsRequestStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StudentsRequestList" component={StudentsRequest} options={{headerShown: false}} />
      <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function StudentTabScreen({ navigation }) {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen 
        name="TeacherRequest" 
        component={TeacherRequestStack} 
        options={{
          tabBarLabel: 'Find Teacher',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="StudentRegister" 
        component={StudentScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TeacherTabScreen({ navigation }) {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen 
        name="StudentsRequest" 
        component={StudentsRequestStack} 
        options={{
          tabBarLabel: 'Find Students',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="TeacherRegister" 
        component={TeacherScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const handleSignOut = async (navigation) => {
  try {
    await signOut(auth);
    console.log('Signed out successfully');
    navigation.navigate('LandingPage');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

function App() {
  enableScreens();

  return (
    <NavigationContainer
      theme={{
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.card,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.secondary,
        }
      }}
      linking={{
        prefixes: [],
        config: {
          screens: {
            LandingPage: 'landing',
            SignIn: 'signin',
            Register: 'register',
            ChooseRole: 'choose-role',
            StudentDashboard: 'student-dashboard',
            TeacherDashboard: 'teacher-dashboard',
          }
        }
      }}
      fallback={<Text>Loading...</Text>}
      onError={(error) => {
        console.error('Navigation error:', error);
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown: false}} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Register" component={SignUpScreen} options={{headerShown: false}}/>
        <Stack.Screen 
          name="ChooseRole" 
          component={ChooseRoleScreen} 
          options={{headerShown: false}} 
        />
        <Stack.Screen 
          name="StudentDashboard" 
          component={StudentTabScreen}  
          options={({navigation}) => ({
            header: (props) => (
              <CustomHeader
                title="Student Dashboard"
                rightIcon="log-out"
                preventBack={true}
                showBackButton={false}
                showTitle={false}
                onRightPress={() => {
                  Alert.alert(
                    'Sign Out',
                    'Are you sure you want to sign out?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Sign Out',
                        onPress: () => handleSignOut(navigation),
                        style: 'destructive',
                      },
                    ]
                  );
                }}
              />
            ),
          })}
        />
        <Stack.Screen 
          name="TeacherDashboard" 
          component={TeacherTabScreen}  
          options={({navigation}) => ({
            header: (props) => (
              <CustomHeader
                title="Teacher Dashboard"
                rightIcon="log-out"
                preventBack={true}
                showBackButton={false}
                showTitle={false}
                onRightPress={() => {
                  Alert.alert(
                    'Sign Out',
                    'Are you sure you want to sign out?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Sign Out',
                        onPress: () => handleSignOut(navigation),
                        style: 'destructive',
                      },
                    ]
                  );
                }}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4c669f',
  },
  header: {
    backgroundColor: '#4c669f',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '20%',
    backgroundColor: '#4c669f',
  },
});

export default App;
