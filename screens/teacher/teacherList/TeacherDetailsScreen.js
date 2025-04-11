import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import theme from '../../../theme';
import { Button, Badge, Card, Heading } from '../../../components/UIComponents';

const TeacherDetailsScreen = ({ route, navigation }) => {
  const { teacher } = route.params;

  const handleCall = () => {
    Linking.openURL(`tel:${teacher.phoneNumber}`);
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient.secondary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileIconContainer}>
            {teacher.photoURL ? (
              <Image 
                source={{ uri: teacher.photoURL }} 
                style={styles.profilePhoto} 
              />
            ) : (
              <Ionicons name="person-circle" size={120} color="#fff" />
            )}
          </View>
          <Heading text={teacher.name} size="lg" color="#fff" style={styles.name} />
          <Badge text={teacher.subject} variant="secondary" style={styles.subjectBadge} />
        </View>

        <View style={styles.contactButton}>
          <Button
            title="Call Teacher"
            icon="call"
            onPress={handleCall}
            variant="success"
            style={styles.callButton}
          />
        </View>

        <Card style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <Heading text="Teacher Details" size="md" color="textPrimary" />
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="school-outline" size={24} color={theme.colors.secondary} />
            <View style={styles.detailTexts}>
              <Text style={styles.detailLabel}>Experience</Text>
              <Text style={styles.detailValue}>{teacher.experience} years</Text>
            </View>
          </View>

          <View style={styles.locationSection}>
            <Heading text="Location" size="sm" color="textPrimary" style={styles.sectionTitle} />
            
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={24} color={theme.colors.secondary} />
              <View style={styles.detailTexts}>
                <Text style={styles.detailLabel}>Province</Text>
                <Text style={styles.detailValue}>{teacher.province || 'Not specified'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={24} color={theme.colors.secondary} />
              <View style={styles.detailTexts}>
                <Text style={styles.detailLabel}>District</Text>
                <Text style={styles.detailValue}>{teacher.district || 'Not specified'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={24} color={theme.colors.secondary} />
              <View style={styles.detailTexts}>
                <Text style={styles.detailLabel}>Specific Location</Text>
                <Text style={styles.detailValue}>{teacher.specificLocation || 'Not specified'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Heading text="Contact Information" size="sm" color="textPrimary" style={styles.sectionTitle} />
            
            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <Ionicons name="call-outline" size={24} color={theme.colors.secondary} />
              <View style={styles.detailTexts}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{teacher.phoneNumber}</Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.md,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: 80,
  },
  profileIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginBottom: theme.spacing.xs,
  },
  subjectBadge: {
    marginBottom: theme.spacing.md,
  },
  contactButton: {
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  callButton: {
    borderRadius: theme.borderRadius.md,
  },
  detailsCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#fff',
    ...theme.shadows.medium,
    padding: theme.spacing.md,
  },
  cardHeader: {
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  sectionTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailTexts: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    fontFamily: theme.typography.fontFamily.regular,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  locationSection: {
    marginTop: theme.spacing.sm,
  },
  contactSection: {
    marginTop: theme.spacing.sm,
  },
});

export default TeacherDetailsScreen; 