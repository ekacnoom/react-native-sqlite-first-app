import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'ProductsDB',
    location: 'default',
  },
  () => {},
  error => { console.log(error); }
);

const App = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [calories, setCalories] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Products (id INTEGER PRIMARY KEY AUTOINCREMENT, productName TEXT, price REAL, manufacturer TEXT, calories INTEGER)",
        [],
        () => { console.log('Table created successfully'); },
        error => { console.log('Error creating table'); console.log(error); }
      );
    });

    updateProductsList();
  }, []);

  const addProduct = () => {
    if (!productName || !price || !manufacturer || !calories) {
      alert('Please fill all fields');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Products (productName, price, manufacturer, calories) VALUES (?, ?, ?, ?)",
        [productName, price, manufacturer, calories],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            updateProductsList();
            setProductName('');
            setPrice('');
            setManufacturer('');
            setCalories('');
          }
        },
        error => { console.log('Error inserting item into table'); console.log(error); }
      );
    });
  };

  const updateProductsList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Products",
        [],
        (tx, results) => {
          const rows = results.rows.raw();
          setProducts(rows);
        },
        error => { console.log('Error fetching products'); console.log(error); }
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setProductName}
        value={productName}
        placeholder="Product Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPrice}
        value={price}
        placeholder="Price (UAH)"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setManufacturer}
        value={manufacturer}
        placeholder="Manufacturer"
      />
      <TextInput
        style={styles.input}
        onChangeText={setCalories}
        value={calories}
        placeholder="Calories (kcal)"
        keyboardType="numeric"
      />
      <Button
        title="Add Product"
        onPress={addProduct}
      />
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.productName}</Text>
            <Text>Price: {item.price} UAH</Text>
            <Text>Manufacturer: {item.manufacturer}</Text>
            <Text>Calories: {item.calories} kcal</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
});

export default App;
