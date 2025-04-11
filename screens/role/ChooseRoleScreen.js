import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Text as RNText } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { Button, Heading, Card } from '../../components/UIComponents';

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

function ChooseRoleScreen({ navigation, route }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Signed out successfully');
      navigation.navigate('LandingPage');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Heading 
            text={`Welcome, ${route.params?.name || 'User'}!`} 
            size="lg" 
            color="#fff" 
            style={styles.welcomeText} 
          />
          <Text 
            style={styles.subtitle}
            color="rgba(255, 255, 255, 0.8)"
          >
            Choose your role to continue
          </Text>

          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => {
              try {
                console.log('Navigating to StudentDashboard');
                navigation.navigate('StudentDashboard');
              } catch (error) {
                console.error('Navigation error:', error);
                // Fallback navigation method
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'StudentDashboard' }],
                });
              }
            }}
          >
            <Card style={styles.card}>
              <LinearGradient
                colors={['#ffffff', '#f7f9ff']}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={theme.colors.gradient.primary}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="school-outline" size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Heading text="I'm a Student" size="md" color="textPrimary" style={styles.cardTitle} />
                <Text style={styles.cardDescription}>
                  Access your courses, assignments, and grades
                </Text>
              </LinearGradient>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => {
              try {
                console.log('Navigating to TeacherDashboard');
                navigation.navigate('TeacherDashboard');
              } catch (error) {
                console.error('Navigation error:', error);
                // Fallback navigation method
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'TeacherDashboard' }],
                });
              }
            }}
          >
            <Card style={styles.card}>
              <LinearGradient
                colors={['#ffffff', '#f7f9ff']}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={theme.colors.gradient.secondary}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="book-outline" size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Heading text="I'm a Teacher" size="md" color="textPrimary" style={styles.cardTitle} />
                <Text style={styles.cardDescription}>
                  Manage your classes, create assignments, and grade students
                </Text>
              </LinearGradient>
            </Card>
          </TouchableOpacity>

          <Button
            title="Sign Out"
            icon="log-out-outline"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  card: {
    width: width * 0.85,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  cardGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  cardTitle: {
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  signOutButton: {
    marginTop: theme.spacing.lg,
    minWidth: 150,
  },
});

export default ChooseRoleScreen;