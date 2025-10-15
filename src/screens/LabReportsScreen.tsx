import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, FAB, ActivityIndicator } from 'react-native-paper';
import { getLabReports } from '../api/services';
import { LabReport } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LabReportsScreen = ({ route, navigation }: any) => {
  const { patientId } = route.params || {};
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getLabReports(patientId);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
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
        <Paragraph style={styles.date}>Date: {item.date}</Paragraph>
        <Paragraph style={styles.fileName}>File: {item.fileName}</Paragraph>
        {item.notes && (
          <Paragraph style={styles.notes}>Notes: {item.notes}</Paragraph>
        )}
        <Button mode="outlined" style={styles.viewButton} icon="eye">
          View Report
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
        onPress={() => navigation.navigate('UploadReport', { patientId })}
      />
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
});

export default LabReportsScreen;
