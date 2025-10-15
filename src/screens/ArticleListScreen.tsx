import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Searchbar, Title, Paragraph, Chip, ActivityIndicator, Surface } from 'react-native-paper';
import { getArticles } from '../api/services';
import { Article } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../utils/dateUtils';

const ArticleListScreen = ({ navigation }: any) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Nutrition', 'Fitness', 'Mental Health', 'Prevention', 'Lifestyle'];

  // Article placeholder images (using gradient backgrounds with icons)
  const articleImages: {[key: string]: {gradient: readonly [string, string, ...string[]], icon: string}} = {
    '1': { gradient: ['#FF6B6B', '#C44569'] as const, icon: 'food-apple' },
    '2': { gradient: ['#4ECDC4', '#44A08D'] as const, icon: 'run-fast' },
    '3': { gradient: ['#A8E6CF', '#56AB91'] as const, icon: 'sleep' },
    '4': { gradient: ['#FFD93D', '#F4A261'] as const, icon: 'bottle-tonic-plus' },
    '5': { gradient: ['#6C5CE7', '#A29BFE'] as const, icon: 'meditation' },
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      console.log('📰 Fetching articles...');
      const data = await getArticles();
      console.log('📰 Articles fetched:', data.length);
      console.log('📰 Articles data:', data.map(a => a.title));
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterArticles(query, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterArticles(searchQuery, category);
  };

  const filterArticles = (query: string, category: string) => {
    let filtered = articles;
    
    if (category !== 'All') {
      filtered = filtered.filter(a => a.category === category);
    }
    
    if (query.trim() !== '') {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.summary.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    setFilteredArticles(filtered);
  };

  const renderArticle = ({ item, index }: { item: Article, index: number }) => {
    const imageData = articleImages[item.id] || articleImages['1'];
    const isEven = index % 2 === 0;
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
        activeOpacity={0.9}
      >
        <Surface style={styles.blogCard} elevation={3}>
          <View style={styles.blogImageContainer}>
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.blogImage}
                resizeMode="cover"
                onError={() => console.log('Image failed to load:', item.imageUrl)}
              />
            ) : (
              <LinearGradient
                colors={articleImages[item.id]?.gradient || ['#4ECDC4', '#44A08D']}
                style={styles.blogImage}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.placeholderContent}>
                  <MaterialCommunityIcons 
                    name={articleImages[item.id]?.icon as any || 'newspaper-variant'} 
                    size={64} 
                    color="rgba(255,255,255,0.9)" 
                  />
                </View>
              </LinearGradient>
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            />
            <View style={styles.categoryBadge}>
              <Paragraph style={styles.categoryBadgeText}>{item.category}</Paragraph>
            </View>
          </View>

          <View style={styles.blogContent}>
            <View style={styles.blogMeta}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="account-circle" size={16} color="#666" />
                <Paragraph style={styles.metaText}>{item.author}</Paragraph>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                <Paragraph style={styles.metaText}>{item.readTime} min</Paragraph>
              </View>
            </View>

            <Title style={styles.blogTitle} numberOfLines={2}>{item.title}</Title>
            <Paragraph style={styles.blogSummary} numberOfLines={3}>{item.summary}</Paragraph>

            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag, idx) => (
                <View key={idx} style={styles.tagPill}>
                  <Paragraph style={styles.tagText}>#{tag}</Paragraph>
                </View>
              ))}
            </View>

            <View style={styles.blogFooter}>
              <View style={styles.dateContainer}>
                <MaterialCommunityIcons name="calendar" size={14} color="#999" />
                <Paragraph style={styles.dateText}>{formatDate(item.publishDate)}</Paragraph>
              </View>
              <TouchableOpacity style={styles.readMoreButton}>
                <Paragraph style={styles.readMoreText}>Read More</Paragraph>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F44336" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F44336" />
      <LinearGradient
        colors={['#F44336', '#D32F2F'] as const}
        style={styles.header}
      >
        <Title style={styles.headerTitle}>Health Blog</Title>
        <Paragraph style={styles.headerSubtitle}>
          {filteredArticles.length} articles • Stay informed
        </Paragraph>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search articles..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#F44336"
          inputStyle={styles.searchInput}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => handleCategoryFilter(item)}
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === item && styles.categoryChipTextSelected
              ]}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="newspaper-variant-outline" size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>No Articles Found</Title>
            <Paragraph style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'No articles available at the moment'}
            </Paragraph>
            <Paragraph style={styles.debugText}>
              Total articles: {articles.length}, Filtered: {filteredArticles.length}
            </Paragraph>
          </View>
        )}
      />
    </View>
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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 16,
  },
  searchbar: {
    elevation: 4,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  categoryChip: {
    marginHorizontal: 4,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipSelected: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  categoryChipText: {
    color: '#666',
  },
  categoryChipTextSelected: {
    color: 'white',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  blogCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  blogImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  blogImageContainer: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  blogContent: {
    padding: 16,
  },
  blogMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    margin: 0,
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
    lineHeight: 28,
  },
  blogSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#F44336',
    margin: 0,
  },
  blogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    margin: 0,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
    marginRight: 4,
    margin: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    color: '#999',
    textAlign: 'center',
  },
  debugText: {
    marginTop: 8,
    fontSize: 12,
    color: '#FF9800',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ArticleListScreen;
