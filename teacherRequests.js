import React, { useState, useEffect, useRef } from 'react';
import { View, Text as RNText, StyleSheet, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Portal, Modal, Provider as PaperProvider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './firebase';
import { fetchWholeTodoListTeacher } from './firestore/read';
import TeacherCard from './components/TeacherCard';
import TeacherDetailsScreen from './screens/teacher/teacherList/TeacherDetailsScreen';
import theme from './theme';
import { Button, Badge, Heading, Card } from './components/UIComponents';

const { width, height } = Dimensions.get('window');
const Stack = createStackNavigator();
const user = auth.currentUser;

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

const TeacherListScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [district, setDistrict] = useState('');
  const [sortNewest, setSortNewest] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const scrollY = useSharedValue(0);

  async function getMyFiles() {
    const result = await fetchWholeTodoListTeacher();
    const myTodos = result.docs.map((d) => ({ docId: d.id, ...d.data() }));
    setData(myTodos);
    
    // Extract unique locations
    const locations = [...new Set(myTodos.map(item => item.district))].filter(Boolean);
    setAvailableLocations(locations);
    
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await getMyFiles();
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [district, sortNewest, data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getMyFiles();
  };

  const filterAndSortData = () => {
    let filtered = [...data];

    if (district) {
      filtered = filtered.filter(item => 
        item.district === district
      );
    }

    if (sortNewest) {
      filtered.sort((a, b) => {
        const aSeconds = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        const bSeconds = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return bSeconds - aSeconds;
      });
    }

    setFilteredData(filtered);
  };

  const toggleSort = () => {
    setSortNewest(!sortNewest);
  };

  const selectLocation = (location) => {
    setDistrict(location);
    setShowLocationModal(false);
  };

  const clearLocation = () => {
    setDistrict('');
  };

  // Create animated styles
  const headerTranslateY = useAnimatedStyle(() => {
    return {
      transform: [{ 
        translateY: interpolate(
          scrollY.value,
          [0, 100],
          [0, -50],
          Extrapolate.CLAMP
        ) 
      }],
      opacity: interpolate(
        scrollY.value,
        [0, 100],
        [1, 0],
        Extrapolate.CLAMP
      )
    };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={theme.colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Animated Header */}
        <Animated.View 
          style={[
            styles.headerContainer,
            headerTranslateY
          ]}
        >
          <Heading 
            text="Find Teachers" 
            size="lg" 
            color="#fff" 
            style={styles.heading}
          />
          
          <View style={styles.filterContainer}>
            <Button
              title={district || "All Locations"}
              icon="location"
              onPress={() => setShowLocationModal(true)}
              variant={district ? "primary" : "outline"}
              size="small"
              style={styles.locationButton}
            />
            
            <Button
              title={sortNewest ? "Newest First" : "Default Sort"}
              icon={sortNewest ? "time" : "swap-vertical"}
              onPress={toggleSort}
              variant="outline"
              size="small"
              style={styles.sortButton}
            />
          </View>
        </Animated.View>

        {/* Location Selection Modal */}
        <Portal>
          <Modal
            visible={showLocationModal}
            onDismiss={() => setShowLocationModal(false)}
            contentContainerStyle={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Heading text="Select Location" size="md" />
              <Button 
                title="Close" 
                variant="ghost" 
                icon="close-circle" 
                onPress={() => setShowLocationModal(false)}
                size="small"
              />
            </View>
            
            {district && (
              <Button
                title="Clear Selection"
                icon="trash-outline"
                onPress={clearLocation}
                variant="outline"
                size="small"
                style={styles.clearButton}
              />
            )}
            
            <ScrollView style={styles.modalScroll}>
              {availableLocations.length > 0 ? (
                availableLocations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.locationItem,
                      district === location && styles.selectedLocation
                    ]}
                    onPress={() => selectLocation(location)}
                  >
                    <Ionicons 
                      name="location" 
                      size={18} 
                      color={district === location ? theme.colors.primary : theme.colors.textSecondary} 
                    />
                    <Text style={[
                      styles.locationText,
                      district === location && styles.selectedLocationText
                    ]}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noLocationsText}>No locations available</Text>
              )}
            </ScrollView>
          </Modal>
        </Portal>

        {/* Main Content */}
        <Animated.ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor="#ffffff"
            />
          }
          onScroll={useAnimatedScrollHandler((event) => {
            scrollY.value = event.contentOffset.y;
          })}
          scrollEventThrottle={16}
        >
          {/* Filter Indicators */}
          {(district || sortNewest) && (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersText}>Active filters:</Text>
              <View style={styles.filtersRow}>
                {district && (
                  <Badge 
                    text={district} 
                    icon="location" 
                    color="primary" 
                    style={styles.filterBadge}
                  />
                )}
                {sortNewest && (
                  <Badge 
                    text="Newest First" 
                    icon="time" 
                    color="secondary" 
                    style={styles.filterBadge}
                  />
                )}
              </View>
            </View>
          )}
          
          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Finding teachers...</Text>
            </View>
          ) : filteredData.length > 0 ? (
            // Teacher Cards
            filteredData.map((e) => (
              <TeacherCard
                key={e.docId}
                name={e.name}
                experience={e.experience}
                subject={e.subject}
                phoneNumber={e.phoneNumber}
                photoURL={e.photoURL}
                province={e.province}
                district={e.district}
                specificLocation={e.specificLocation}
                navigation={navigation}
              />
            ))
          ) : (
            // No Results
            <Card style={styles.noResultsCard}>
              <View style={styles.noResultsContent}>
                <Ionicons name="search" size={48} color={theme.colors.textSecondary} />
                <Heading text="No teachers found" size="md" color="textSecondary" />
                <Text style={styles.noResultsText}>
                  {district 
                    ? `No teachers found in ${district}. Try another location or clear filters.` 
                    : "No teacher profiles available at the moment."}
                </Text>
                {district && (
                  <Button
                    title="Clear Filters"
                    icon="refresh"
                    onPress={clearLocation}
                    variant="outline"
                    style={styles.clearFiltersButton}
                  />
                )}
              </View>
            </Card>
          )}
          
          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </Animated.ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default function TeacherRequest() {
  return (
    <PaperProvider>
      <Stack.Navigator>
        <Stack.Screen 
          name="TeacherList" 
          component={TeacherListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TeacherDetails" 
          component={TeacherDetailsScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    paddingTop: 20,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    zIndex: 10,
  },
  heading: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  locationButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  sortButton: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 120, // Space for the header
  },
  activeFiltersContainer: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  activeFiltersText: {
    color: '#ffffff',
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterBadge: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    margin: width * 0.05,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  clearButton: {
    marginBottom: theme.spacing.md,
  },
  modalScroll: {
    maxHeight: height * 0.5,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedLocation: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  locationText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular,
  },
  selectedLocationText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  noLocationsText: {
    textAlign: 'center',
    padding: theme.spacing.lg,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  noResultsCard: {
    margin: theme.spacing.md,
  },
  noResultsContent: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  noResultsText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  clearFiltersButton: {
    marginTop: theme.spacing.sm,
  },
  bottomPadding: {
    height: 100,
  },
});

