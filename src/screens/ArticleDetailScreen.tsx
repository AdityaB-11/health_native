import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, StatusBar } from 'react-native';
import { Title, Paragraph, Chip, ActivityIndicator, Surface, Button } from 'react-native-paper';
import { getArticleById } from '../api/services';
import { Article } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDate } from '../utils/dateUtils';

const ArticleDetailScreen = ({ route }: any) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      const data = await getArticleById(articleId);
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = async () => {
    if (article?.externalUrl) {
      const supported = await Linking.canOpenURL(article.externalUrl);
      if (supported) {
        await Linking.openURL(article.externalUrl);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F44336" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.centerContainer}>
        <Paragraph>Article not found</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#F44336" />
      
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        {article.imageUrl ? (
          <Image 
            source={{ uri: article.imageUrl }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={['#F44336', '#D32F2F'] as const}
            style={styles.heroImage}
          >
            <MaterialCommunityIcons name="newspaper-variant" size={80} color="rgba(255,255,255,0.9)" />
          </LinearGradient>
        )}
        <View style={styles.categoryBadge}>
          <Paragraph style={styles.categoryBadgeText}>{article.category}</Paragraph>
        </View>
      </View>

      {/* Content */}
      <Surface style={styles.contentContainer} elevation={4}>
        <Title style={styles.title}>{article.title}</Title>
        
        {/* Author & Meta Info */}
        <View style={styles.metaContainer}>
          <View style={styles.authorRow}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#F44336" />
            <View style={styles.authorInfo}>
              <Paragraph style={styles.authorName}>{article.author}</Paragraph>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="calendar" size={14} color="#999" />
                <Paragraph style={styles.metaText}>{formatDate(article.publishDate)}</Paragraph>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#999" style={styles.metaIcon} />
                <Paragraph style={styles.metaText}>{article.readTime} min read</Paragraph>
              </View>
            </View>
          </View>
        </View>

        {/* Summary */}
        <Surface style={styles.summaryBox} elevation={1}>
          <Paragraph style={styles.summary}>{article.summary}</Paragraph>
        </Surface>

        {/* Content */}
        <Paragraph style={styles.content}>{article.content}</Paragraph>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Title style={styles.tagsTitle}>Topics</Title>
          <View style={styles.tagsContainer}>
            {article.tags.map((tag, index) => (
              <View key={index} style={styles.tagPill}>
                <Paragraph style={styles.tagText}>#{tag}</Paragraph>
              </View>
            ))}
          </View>
        </View>

        {/* External Link Button */}
        {article.externalUrl && (
          <Button
            mode="contained"
            icon="open-in-new"
            onPress={handleOpenLink}
            style={styles.externalLinkButton}
            buttonColor="#F44336"
          >
            Read Full Article
          </Button>
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    margin: 0,
  },
  contentContainer: {
    marginTop: -30,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 34,
    color: '#212121',
    marginBottom: 16,
  },
  metaContainer: {
    marginBottom: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
    marginRight: 12,
    margin: 0,
  },
  metaIcon: {
    marginLeft: 8,
  },
  summaryBox: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  summary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
    margin: 0,
  },
  content: {
    fontSize: 15,
    lineHeight: 26,
    color: '#444',
    textAlign: 'justify',
    marginBottom: 24,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  tagText: {
    fontSize: 13,
    color: '#F44336',
    fontWeight: '600',
    margin: 0,
  },
  externalLinkButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 6,
  },
});

export default ArticleDetailScreen;
