import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';

type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('MainApp')}
        style={styles.button}
      >
        Login to MedPal
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.global,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.h1,
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.vertical * 2,
  },
  button: {
    marginTop: theme.spacing.vertical,
  },
});