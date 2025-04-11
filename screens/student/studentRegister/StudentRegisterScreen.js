import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text as RNText, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { createTodoTask } from '../../../firestore/create';
import { auth } from '../../../firebase';
import { pickImage, uploadToCloudinary } from '../../../utils/cloudinary';
import theme from '../../../theme';
import { Button, Heading, Card, Input } from '../../../components/UIComponents';

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

const nepal_districts = {
  "Province 1": ["Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"],
  "Madhesh Province": ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"],
  "Bagmati Province": ["Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"],
  "Gandaki Province": ["Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun"],
  "Lumbini Province": ["Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Nawalparasi", "Palpa", "Pyuthan", "Rolpa", "Rukum (East)", "Rupandehi"],
  "Karnali Province": ["Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Rukum (West)", "Salyan", "Surkhet"],
  "Sudurpashchim Province": ["Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur"]
};

function StudentRegisterScreen({ navigation, route }) {
  const studentData = route.params?.studentData;
  const isEditing = !!studentData;

  const [name, setName] = useState(studentData?.name || '');
  const [province, setProvince] = useState(studentData?.province || '');
  const [district, setDistrict] = useState(studentData?.district || '');
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [provinces] = useState(Object.keys(nepal_districts).map(prov => ({
    label: prov,
    value: prov
  })));
  const [districts, setDistricts] = useState([]);
  const [specificLocation, setSpecificLocation] = useState(studentData?.specificLocation || '');
  const [grade, setGrade] = useState(studentData?.grade || '');
  const [subject, setSubject] = useState(studentData?.subject || '');
  const [phoneNumber, setPhoneNumber] = useState(studentData?.phoneNumber || '');
  const [photoUri, setPhotoUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [salary, setSalary] = useState(studentData?.salary || '');
  const [teachingHours, setTeachingHours] = useState(studentData?.teachingHours || '');


  useEffect(() => {
    if (province) {
      const districtOptions = nepal_districts[province].map(dist => ({
        label: dist,
        value: dist
      }));
      setDistricts(districtOptions);
    }
  }, [province]);

  const handleProvinceChange = (selectedProvince) => {
    setProvince(selectedProvince);
    setDistrict('');
    if (selectedProvince) {
      const districtOptions = nepal_districts[selectedProvince].map(dist => ({
        label: dist,
        value: dist
      }));
      setDistricts(districtOptions);
    } else {
      setDistricts([]);
    }
  };

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) {
      setPhotoUri(uri);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name) newErrors.name = "Name is required";
    if (!grade) newErrors.grade = "Grade is required";
    if (!subject) newErrors.subject = "Subject is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!province) newErrors.province = "Province is required";
    if (!district) newErrors.district = "District is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to create a profile');
        setUploading(false);
        return;
      }

      let photoURL = '';
      if (photoUri) {
        photoURL = await uploadToCloudinary(photoUri);
      } else if (studentData?.photoURL) {
        photoURL = studentData.photoURL;
      }

      const studentProfileData = {
        name,
        grade,
        subject,
        phoneNumber,
        photoURL,
        province,
        district,
        specificLocation: specificLocation || '',
        salary,
        teachingHours,
        userId: user.uid,
        createdAt: new Date(),
      };

      await createTodoTask(studentProfileData);
      setUploading(false);
      alert(`Student profile ${isEditing ? 'updated' : 'created'} successfully!`);
      navigation.navigate('StudentDashboard');
    } catch (error) {
      setUploading(false);
      alert(`Error ${isEditing ? 'updating' : 'creating'} student profile: ` + error.message);
    }
  };


  const renderPhotoUpload = () => (
    <TouchableOpacity style={styles.photoUploadContainer} onPress={handleImagePick}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.photoPreview} />
      ) : studentData?.photoURL ? (
        <Image source={{ uri: studentData.photoURL }} style={styles.photoPreview} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Ionicons name="camera" size={30} color={theme.colors.primary} />
          <Text style={styles.photoPlaceholderText}>Add Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Heading text={isEditing ? "Edit Student Profile" : "Create Student Profile"} size="lg" color="#fff" />
    </View>
  );

  const renderForm = () => (
    <Card style={styles.formCard}>
      <View style={styles.formSection}>
        <Heading text="Personal Information" size="md" color="textPrimary" style={styles.sectionTitle} />
        
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          icon="person-outline"
          error={errors.name}
          style={styles.input}
        />
        
        <Input
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          icon="call-outline"
          error={errors.phoneNumber}
          style={styles.input}
        />
        
        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>Profile Photo (Optional)</Text>
          {renderPhotoUpload()}
        </View>
      </View>
      
      <View style={styles.formSection}>
        <Heading text="Education Details" size="md" color="textPrimary" style={styles.sectionTitle} />
        
        <Input
          label="Grade/Class"
          value={grade}
          onChangeText={setGrade}
          placeholder="Enter your grade or class"
          icon="school-outline"
          error={errors.grade}
          style={styles.input}
        />
        
        <Input
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter subject you need help with"
          icon="book-outline"
          error={errors.subject}
          style={styles.input}
        />

        <Input
          label="Salary to Provide (NPR)"
          value={salary}
          onChangeText={setSalary}
          placeholder="Enter amount to give"
          keyboardType="numeric"
          icon="cash-outline"
          error={errors.salary}
          style={styles.input}
        />

        <Input
          label="Teaching Hours per Week"
          value={teachingHours}
          onChangeText={setTeachingHours}
          placeholder="Enter hours per week"
          keyboardType="numeric"
          icon="time-outline"
          error={errors.teachingHours}
          style={styles.input}
        />
      </View>
      
      <View style={styles.formSection}>
        <Heading text="Location" size="md" color="textPrimary" style={styles.sectionTitle} />
        
        <Text style={styles.dropdownLabel}>Province</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={provinceOpen}
            value={province}
            items={provinces}
            setOpen={() => setProvinceOpen(!provinceOpen)}
            setValue={(val) => setProvince(val)}
            placeholder="Select province"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            placeholderStyle={styles.dropdownPlaceholder}
            onChangeValue={handleProvinceChange}
            zIndex={3000}
            zIndexInverse={1000}
            listMode="MODAL"
            modalProps={{
              animationType: "slide"
            }}
            modalTitle="Select Province"
            modalContentContainerStyle={styles.modalContentContainer}
          />
          {errors.province && <Text style={styles.errorText}>{errors.province}</Text>}
        </View>
        
        <Text style={styles.dropdownLabel}>District</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={districtOpen}
            value={district}
            items={districts}
            setOpen={() => setDistrictOpen(!districtOpen)}
            setValue={(val) => setDistrict(val)}
            placeholder="Select district"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            placeholderStyle={styles.dropdownPlaceholder}
            disabled={!province}
            zIndex={2000}
            zIndexInverse={2000}
            listMode="MODAL"
            modalProps={{
              animationType: "slide"
            }}
            modalTitle="Select District"
            modalContentContainerStyle={styles.modalContentContainer}
          />
          {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
        </View>
        
        <Input
          label="Specific Location (Optional)"
          value={specificLocation}
          onChangeText={setSpecificLocation}
          placeholder="Enter specific location"
          icon="location-outline"
          style={styles.input}
        />
      </View>
      
      <View style={styles.submitButtonContainer}>
        <Button
          title={uploading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Profile" : "Create Profile")}
          onPress={handleSubmit}
          variant="primary"
          icon={uploading ? null : "checkmark-circle"}
          loading={uploading}
          style={styles.submitButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={theme.colors.gradient.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <FlatList
          data={[1]} // Dummy data since we only need one item
          renderItem={() => renderForm()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.lg,
  },
  subHeaderText: {
    fontSize: theme.typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  formCard: {
    margin: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  dropdownLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.medium,
  },
  dropdownContainer: {
    marginBottom: theme.spacing.md,
    zIndex: 1,
  },
  dropdownContainerStyle: {
    backgroundColor: '#fff',
    borderColor: theme.colors.border,
    marginTop: 2,
  },
  dropdown: {
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  dropdownPlaceholder: {
    color: theme.colors.placeholder,
    fontFamily: theme.typography.fontFamily.regular,
  },
  photoSection: {
    marginTop: theme.spacing.sm,
  },
  photoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.medium,
  },
  photoUploadContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  submitButtonContainer: {
    marginTop: theme.spacing.md,
  },
  submitButton: {
    paddingVertical: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.sm,
    marginTop: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  modalContentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: '80%',
  },
});

export default StudentRegisterScreen;

