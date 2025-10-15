import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, Card, RadioButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { uploadLabReport } from '../api/services';

const UploadReportScreen = ({ route, navigation }: any) => {
  const { patientId } = route.params || {};
  const [patientName, setPatientName] = useState('');
  const [reportType, setReportType] = useState('');
  const [notes, setNotes] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'image'>('pdf');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      
      if (result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setFileType('pdf');
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setFileType('image');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleUpload = async () => {
    if (!patientName || !reportType || !selectedFile) {
      Alert.alert('Error', 'Please fill all required fields and select a file');
      return;
    }

    setLoading(true);
    try {
      await uploadLabReport({
        patientId: patientId || 'unknown',
        patientName,
        reportType,
        date: new Date().toISOString().split('T')[0],
        fileUri: selectedFile.uri,
        fileName: selectedFile.name || 'report',
        fileType,
        notes,
      });

      Alert.alert('Success', 'Lab report uploaded successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Upload Lab Report</Title>

          <TextInput
            label="Patient Name *"
            value={patientName}
            onChangeText={setPatientName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Report Type *"
            value={reportType}
            onChangeText={setReportType}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Blood Test, X-Ray, MRI"
          />

          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <Paragraph style={styles.label}>Select File Type:</Paragraph>
          <RadioButton.Group onValueChange={value => setFileType(value as 'pdf' | 'image')} value={fileType}>
            <View style={styles.radioContainer}>
              <RadioButton.Item label="PDF Document" value="pdf" />
              <RadioButton.Item label="Image" value="image" />
            </View>
          </RadioButton.Group>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={pickDocument}
              style={styles.fileButton}
              icon="file-pdf-box"
            >
              Pick PDF
            </Button>
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.fileButton}
              icon="image"
            >
              Pick Image
            </Button>
          </View>

          {selectedFile && (
            <Card style={styles.fileCard}>
              <Card.Content>
                <Paragraph style={styles.fileName}>
                  Selected: {selectedFile.name || 'Image file'}
                </Paragraph>
                <Paragraph style={styles.fileSize}>
                  Type: {fileType.toUpperCase()}
                </Paragraph>
              </Card.Content>
            </Card>
          )}

          <Button
            mode="contained"
            onPress={handleUpload}
            loading={loading}
            disabled={loading}
            style={styles.uploadButton}
            icon="upload"
          >
            Upload Report
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  input: {
    marginTop: 12,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fileButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  fileCard: {
    marginTop: 16,
    backgroundColor: '#e3f2fd',
  },
  fileName: {
    fontWeight: 'bold',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  uploadButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default UploadReportScreen;
