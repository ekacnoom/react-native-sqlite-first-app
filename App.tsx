import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from '@react-navigation/stack';

// Визначення типів для параметрів наших екранів
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Settings: undefined;
};

interface ListItem {
  id: string;
  title: string;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;
type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface DetailsScreenProps {
  navigation: DetailsScreenNavigationProp;
}

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const Stack = createNativeStackNavigator();

// Основний компонент списку
function HomeScreen({ navigation }: HomeScreenProps) {
  const [inputText, setInputText] = useState('');
  const [list, setList] = useState<ListItem[]>([]);

  const handleAddPress = () => {
    setList([...list, { id: Date.now().toString(), title: inputText }]);
    setInputText('');
  };

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setInputText}
        value={inputText}
        placeholder="Input text"
      />
      <Button
        title="Add item"
        onPress={handleAddPress}
      />
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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

// Екран налаштувань
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

// Екран інформації
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
    width: 10, // Або більше, залежно від того, скільки простору ви хочете
  },
});

export default App;

