/**
 * StudentDashboard.js - Student Dashboard Component
 * 
 * This component serves as the main interface for students, providing:
 * - Profile information display
 * - List of available teachers
 * - Search and filtering capabilities
 * - Navigation to teacher details
 * - Profile management options
 * 
 * Features:
 * - Animated UI elements
 * - Real-time data updates
 * - Pull-to-refresh functionality
 * - Responsive design with theme support
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StatusBar,
  Animated,
  Dimensions,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../firebase';
import { fetchOnlyMyTodoList } from '../../../firestore/read.ts';
import StudentCard from '../../../components/StudentCard';
import theme from '../../../theme';

const { width, height } = Dimensions.get('window');

const StudentDashboard = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const user = auth.currentUser;

  const fetchRequests = async () => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigation.navigate('Login');
      return;
    }
    
    console.log('Current user uid:', user.uid);
    try {
      const result = await fetchOnlyMyTodoList(user.uid);
      console.log('Raw result from fetchOnlyMyTodoList:', result);
      
      if (!result || !result.docs) {
        console.log('No valid result returned from fetchOnlyMyTodoList');
        setRequests([]);
        return;
      }

      const myRequests = result.docs.map((d) => {
        const data = d.data();
        console.log('Processing document:', d.id, data);
        return { docId: d.id, ...data };
      });
      
      console.log('Processed requests:', myRequests);
      setRequests(myRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const fabScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={theme.colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <Text style={styles.headerText}>Student Dashboard</Text>
        </Animated.View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.requestsContainer}>
            {requests.length > 0 ? (
              requests.map((request) => (
                <StudentCard
                  key={request.docId}
                  {...request}
                  navigation={navigation}
                />
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No requests found</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('Sregistration')}
          >
            <Ionicons name="add" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
          <Ionicons name="arrow-up" size={24} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + StatusBar.currentHeight,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: theme.spacing.lg,
  },
  requestsContainer: {
    padding: theme.spacing.lg,
  },
  emptyCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
  fabContainer: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollTopButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: 90,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentDashboard; 