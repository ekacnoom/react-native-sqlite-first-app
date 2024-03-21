// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';
import SQLite from 'react-native-sqlite-storage';

// Define the navigation stack parameters for the app
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Settings: undefined;
};

// Define navigation prop types for each screen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;
type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

// Define props interfaces for the screens
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface DetailsScreenProps {
  navigation: DetailsScreenNavigationProp;
}

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Open a SQLite database to store product data
const db = SQLite.openDatabase(
  {
    name: 'ProductsDB',
    location: 'default',
  },
  () => {},
  error => { console.log(error); }
);

// Home screen component
function HomeScreen({ navigation }: HomeScreenProps) {
  // State variables to handle input and products list
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [calories, setCalories] = useState('');
  const [products, setProducts] = useState([]);

  // Keyboard event listeners to adjust the UI when keyboard is visible
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardOffset(e.endCoordinates.height); // Adjust UI based on keyboard height
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0); // Reset UI adjustment when keyboard hides
    });

    // Cleanup on component unmount
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Initialize the products table in the database and update the products list
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

  // Function to add a new product to the database
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

  // Function to fetch the updated products list from the database
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

  // Render the UI components for the Home screen
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
      <View style={styles.buttonContainer}>
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
}

// Details screen component with navigation buttons
function DetailsScreen({ navigation }: DetailsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Home"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </View>
  );
}

// Settings screen component with navigation buttons
function SettingsScreen({ navigation }: SettingsScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Home"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          title="Details"
          onPress={() => navigation.navigate('Details')}
        />
      </View>
    </View>
  );
}

// Main App component setup with navigation container
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Screen' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 20,
  },
  spacer: {
    width: 10,
  },
});

export default App;

