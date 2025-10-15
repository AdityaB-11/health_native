import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import { addArticle } from '../api/services';

const AddArticleScreen = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    category: '',
    readTime: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.summary || !formData.content || !formData.author) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await addArticle({
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        author: formData.author,
        category: formData.category || 'General',
        imageUrl: 'https://via.placeholder.com/400x200',
        publishDate: new Date().toISOString().split('T')[0],
        readTime: parseInt(formData.readTime) || 5,
        tags: tags.length > 0 ? tags : ['health'],
      });

      Alert.alert('Success', 'Article published successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Add New Article</Title>

          <TextInput
            label="Title *"
            value={formData.title}
            onChangeText={text => setFormData({ ...formData, title: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Summary *"
            value={formData.summary}
            onChangeText={text => setFormData({ ...formData, summary: text })}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={2}
          />

          <TextInput
            label="Content *"
            value={formData.content}
            onChangeText={text => setFormData({ ...formData, content: text })}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={10}
          />

          <TextInput
            label="Author *"
            value={formData.author}
            onChangeText={text => setFormData({ ...formData, author: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Category"
            value={formData.category}
            onChangeText={text => setFormData({ ...formData, category: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Cardiology, Mental Health"
          />

          <TextInput
            label="Read Time (minutes)"
            value={formData.readTime}
            onChangeText={text => setFormData({ ...formData, readTime: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Tags (comma separated)"
            value={formData.tags}
            onChangeText={text => setFormData({ ...formData, tags: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., diabetes, prevention, diet"
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="publish"
          >
            Publish Article
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
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default AddArticleScreen;
