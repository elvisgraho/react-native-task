import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import ListItem from '../components/ListItem';

const HomeScreen = ({ navigation }) => {
	const [data, setData] = useState([]);
	const [nextPage, setNextPage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const flatListRef = useRef(null);

  useEffect(() => {
    fetchData(); 
  }, []); 

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://swapi.dev/api/people');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const json = await response.json();
	  setError(null)
	  setData(prevData => {
		const newData = json.results.filter(result => !prevData.some(item => item.name === result.name));
		return [...prevData, ...newData];
	  });
      setNextPage(json.next);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const loadMoreData = async () => {
    if (!isLoading && nextPage) {
      setIsLoading(true);
      try {
        const response = await fetch(nextPage);
        const json = await response.json();
		setData(prevData => {
			const newData = json.results.filter(result => !prevData.some(item => item.name === result.name));
			return [...prevData, ...newData];
		});
        setNextPage(json.next);
      } catch (error) {
        console.error('Error fetching more data:', error);
      }
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <ListItem
      item={item}
      onPress={() => navigation.navigate('Details', { item })}
    />
  );

  if (error) {
	return (
	  <View style={styles.errorContainer}>
		<View style={styles.card}>
		  <Text style={styles.errorText}>{error}</Text>
		</View>
	  </View>
	);
  }

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.card}>
			<Text style={styles.errorText}>No data was loaded!</Text>
		</View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          ListFooterComponent={isLoading && <ActivityIndicator size="large" />}
        />
      )}
    </View>
  );

};

const styles = StyleSheet.create({
	errorContainer: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	},
	card: {
	  backgroundColor: 'red',
	  padding: 20,
	  borderRadius: 10,
	  elevation: 3, // for Android shadow
	  shadowColor: '#000', // for iOS shadow
	  shadowOffset: { width: 0, height: 2 }, // for iOS shadow
	  shadowOpacity: 0.25, // for iOS shadow
	  shadowRadius: 3.84, // for iOS shadow
	},
	errorText: {
	  color: 'white',
	  fontSize: 18,
	},
  });

export default HomeScreen;
