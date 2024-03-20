import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
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
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [calories, setCalories] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      // Get keyboard height and adjust container
      setKeyboardOffset(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      // Reset offset when keyboard is hidden
      setKeyboardOffset(0);
    });

    // Cleanup on component unmount
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
      <View style={[styles.buttonContainer, {bottom: 20 + keyboardOffset}]}>
        <Button
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <View style={styles.spacer} />
        <Button
          title="Details"
          onPress={() => navigation.navigate('Details')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
  },
  spacer: {
    width: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 10,
    padding: 10,
  },
  item: {
    backgroundColor: '#9cf7f6',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    width: '100%'
  },
  title: {
    fontSize: 24,
  },
});

export default App;
