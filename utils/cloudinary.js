import * as ImagePicker from 'expo-image-picker';

// Parse Cloudinary URL
const CLOUDINARY_URL = 'cloudinary://162373579457844:6CobwuPX91Fv0P2yQtpocrqANHg@dh9m5bq8p';
const [, credentials] = CLOUDINARY_URL.split('://');
const [auth, cloud_name] = credentials.split('@');
const [api_key, api_secret] = auth.split(':');

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloud_name}/upload`;
const UPLOAD_PRESET = "ankitg"; // Your unsigned upload preset name

// Image picker function
export const pickImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

// Upload image to Cloudinary with optimization parameters
export const uploadToCloudinary = async (imageUri) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const public_id = `student_${timestamp}`;

    const formData = new FormData();
    
    // Append the image file directly with proper type
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg'
    });

    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'student_photos');

    console.log('Uploading to Cloudinary...', {
      preset: UPLOAD_PRESET,
      publicId: public_id,
      url: UPLOAD_URL
    });

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary response error:', errorData);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Cloudinary upload error:', data.error);
      throw new Error(data.error.message);
    }

    console.log('Upload successful:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Get optimized URL for an image
export const getOptimizedUrl = (public_id) => {
  const transformations = [
    'f_auto', // auto format
    'q_auto', // auto quality
    'w_500', // width 500
    'h_500', // height 500
    'c_fill', // crop fill
  ].join(',');

  return `https://res.cloudinary.com/${cloud_name}/image/upload/${transformations}/${public_id}`;
}; 