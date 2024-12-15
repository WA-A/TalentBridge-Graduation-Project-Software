import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NightModeContext } from './NightModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

const SearchScreen = ({ navigation, route }) => {
  const nav = useNavigation();
  const { searchQuery } = route.params || {};
  const [query, setQuery] = useState(searchQuery || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { isNightMode } = useContext(NightModeContext);
  const [lastVisitedProfile, setLastVisitedProfile] = useState(null);

  const baseUrl =
    Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.239:3000';

  // دالة البحث
  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length > 0) {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token not found');
          return;
        }

        const response = await fetch(`${baseUrl}/User/searchUsers/${text}`, {
          method: 'GET',
          headers: {
            Authorization: `Wasan__${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user search');
        }

        const data = await response.json();
        setFilteredSuggestions(data);
      } catch (error) {
        setFilteredSuggestions([]);
    }
    } else {
      setFilteredSuggestions([]);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const visibleSuggestions = showAll
    ? filteredSuggestions
    : filteredSuggestions.slice(0, 5);

  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: isNightMode ? '#000' : '#fff' },
        ]}
      >
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isNightMode ? '#fff' : '#000'}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: isNightMode ? '#444' : '#fff' },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isNightMode ? '#fff' : '#888'}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.input, { color: isNightMode ? '#fff' : '#000' }]}
            placeholder="Search..."
            placeholderTextColor={isNightMode ? '#aaa' : '#888'}
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(query)}
            autoFocus
          />
        </View>
      </View>

      {filteredSuggestions.length === 0 ? (
        <View style={[styles.noResultsContainer,{backgroundColor: isNightMode ? '#000' : '#fff',}]}>
          <Text style={{ color: isNightMode ? '#fff' : '#000', fontSize: 16 }}>
            No results found
          </Text>
        </View>
      ) : (
        <FlatList
          style={{
            backgroundColor: isNightMode ? '#000' : '#fff',
            padding: 10,
          }}
          data={visibleSuggestions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.suggestionItem,
                { borderBottomColor: isNightMode ? '#444' : '#ddd' },
              ]}
              onPress={() => navigation.navigate('ViewOtherProfile', { userData: item })} // تمرير بيانات المستخدم
              >
              <View style={styles.profileContainer}>
                {item.PictureProfile && (
                  <Image
                    source={{ uri: item.PictureProfile.secure_url }}
                    style={styles.profileImage}
                  />
                )}
                <Text
                  style={{
                    color: isNightMode ? '#fff' : '#000',
                    marginLeft: 10,
                  }}
                >
                  {item.FullName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            filteredSuggestions.length > 5 && (
              <TouchableOpacity
                style={[
                  styles.showAllButton,
                  { backgroundColor: isNightMode ? '#555' : '#e0e0e0' },
                ]}
                onPress={() => setShowAll((prev) => !prev)}
              >
                <Text
                  style={{
                    color:  isNightMode ? '#fff' : '#000',
                    fontWeight: 'bold',
                  }}
                >
                  {showAll ? 'Show Less' : 'Show All Results'}
                </Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  showAllButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default SearchScreen;
