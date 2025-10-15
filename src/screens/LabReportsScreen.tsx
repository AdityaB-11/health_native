import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Linking, Alert, Modal, Image, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB, ActivityIndicator, IconButton } from 'react-native-paper';
import { getLabReports } from '../api/services';
import { LabReport } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

const LabReportsScreen = ({ route, navigation }: any) => {
  const { patientId } = route.params || {};
  const { user } = useAuth();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // If user is a patient, only show their own reports
      // For patients, we can use either patientId or patientName to filter
      let filterPatientId = patientId;
      
      if (user?.role === 'patient') {
        // Use the user's linked patientId if available, otherwise fall back to name matching
        filterPatientId = user.patientId || user.name;
      }
      
      const data = await getLabReports(filterPatientId);
      
      // Additional filtering for patients to ensure they only see their own reports
      if (user?.role === 'patient') {
        const filteredReports = data.filter(report => {
          // Match by patientId if available, otherwise by name
          if (user.patientId) {
            return report.patientId === user.patientId;
          }
          return report.patientName.toLowerCase() === user.name.toLowerCase();
        });
        setReports(filteredReports);
      } else {
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (report: LabReport) => {
    try {
      if (!report.fileUri) {
        Alert.alert('Error', 'File not available');
        return;
      }

      if (report.fileType === 'image') {
        // For images, show in modal viewer
        setSelectedImageUri(report.fileUri);
        setImageModalVisible(true);
      } else if (report.fileType === 'pdf') {
        // For PDFs, try to open with external app (may not work with local files)
        if (report.fileUri.startsWith('http')) {
          // External URL - can open directly
          const supported = await Linking.canOpenURL(report.fileUri);
          if (supported) {
            await Linking.openURL(report.fileUri);
          } else {
            Alert.alert('Error', 'Cannot open this file type on your device');
          }
        } else {
          // Local file - show info alert
          Alert.alert(
            'PDF Report', 
            `File: ${report.fileName}\nType: ${report.reportType}\nDate: ${report.date}\n\nNote: Local PDF files cannot be opened directly. In a production app, files would be uploaded to cloud storage for viewing.`,
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert('Error', 'Unsupported file type');
      }
    } catch (error) {
      console.error('Error opening report:', error);
      Alert.alert('Error', 'Failed to open report. This may be a local file that cannot be accessed directly.');
    }
  };

  const renderReport = ({ item }: { item: LabReport }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name={item.fileType === 'pdf' ? 'file-pdf-box' : 'image'}
            size={40}
            color={item.fileType === 'pdf' ? '#d32f2f' : '#1976d2'}
          />
          <View style={styles.headerText}>
            <Title style={styles.reportType}>{item.reportType}</Title>
            <Paragraph>{item.patientName}</Paragraph>
          </View>
        </View>
        <Paragraph style={styles.date}>Date: {formatDate(item.date)}</Paragraph>
        <Paragraph style={styles.fileName}>File: {item.fileName}</Paragraph>
        {item.notes && (
          <Paragraph style={styles.notes}>Notes: {item.notes}</Paragraph>
        )}
        <Button 
          mode="outlined" 
          style={styles.viewButton} 
          icon={item.fileType === 'image' ? 'eye' : 'file-pdf-box'}
          onPress={() => handleViewReport(item)}
        >
          {item.fileType === 'image' ? 'View Image' : 'View PDF'}
        </Button>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={80} color="#ccc" />
            <Paragraph style={styles.emptyText}>No lab reports found</Paragraph>
          </View>
        }
      />
      <FAB
        style={styles.fab}
        icon="upload"
        label="Upload Report"
        onPress={() => {
          const targetPatientId = user?.role === 'patient' ? user.patientId : patientId;
          navigation.navigate('UploadReport', { patientId: targetPatientId });
        }}
      />

      {/* Image Viewer Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              iconColor="white"
              size={30}
              onPress={() => setImageModalVisible(false)}
            />
          </View>
          <View style={styles.imageContainer}>
            {selectedImageUri ? (
              <Image
                source={{ uri: selectedImageUri }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  reportType: {
    fontSize: 18,
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  fileName: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  viewButton: {
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 40,
    right: 10,
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default LabReportsScreen;
