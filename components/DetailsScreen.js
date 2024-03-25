import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const DetailsScreen = ({ route }) => {
  const { item } = route.params;
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(item.url);
      const json = await response.json();
      setItemDetails(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{itemDetails ? itemDetails.name : item.title}</Title>
          <Paragraph>Gender: {itemDetails ? itemDetails.gender : 'Loading...'}</Paragraph>
          <Paragraph>Birth Year: {itemDetails ? itemDetails.birth_year : 'Loading...'}</Paragraph>
          <Paragraph>Skin Color: {itemDetails ? itemDetails.skin_color : 'Loading...'}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 4, // for shadow on Android
  },
});

export default DetailsScreen;
