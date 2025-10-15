import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, List } from 'react-native-paper';

const AdminScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Admin Panel</Title>
          <List.Section>
            <List.Subheader>Content Management</List.Subheader>
            <List.Item
              title="Add Doctor"
              description="Add a new doctor to the system"
              left={props => <List.Icon {...props} icon="doctor" />}
              onPress={() => navigation.navigate('AddDoctor')}
            />
            <List.Item
              title="Add Medicine"
              description="Add a new medicine to the catalog"
              left={props => <List.Icon {...props} icon="pill" />}
              onPress={() => navigation.navigate('AddMedicine')}
            />
            <List.Item
              title="Add Article"
              description="Publish a new health article"
              left={props => <List.Icon {...props} icon="newspaper" />}
              onPress={() => navigation.navigate('AddArticle')}
            />
          </List.Section>

          <List.Section>
            <List.Subheader>Data Management</List.Subheader>
            <List.Item
              title="View All Patients"
              description="Manage patient records"
              left={props => <List.Icon {...props} icon="account-group" />}
              onPress={() => navigation.navigate('PatientList')}
            />
            <List.Item
              title="View Lab Reports"
              description="Manage all lab reports"
              left={props => <List.Icon {...props} icon="file-document" />}
              onPress={() => navigation.navigate('LabReports')}
            />
          </List.Section>
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
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#6200ee',
  },
});

export default AdminScreen;
