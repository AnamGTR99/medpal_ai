import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { PlaceholderIcon } from '../../components/PlaceholderIcons';
import { theme, spacing } from '../../theme/theme';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'scan') {
              router.push('/scan-modal');
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        // Central scan button
        if (route.name === 'scan') {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.scanButton}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/images/scan.png')}
                style={styles.scanIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          );
        }

        // Regular tab buttons
        const labelText = route.name === 'index' ? 'Home' : 'My Meds';
        const iconColor = isFocused ? theme.colors.primary : '#666';
        
        // Get the appropriate image source
        const getIconImage = () => {
          if (route.name === 'index') {
            return require('../../assets/images/home.png');
          } else {
            return require('../../assets/images/meds.png');
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.6}
          >
            <Image
              source={getIconImage()}
              style={[
                styles.tabIcon,
                { tintColor: iconColor }
              ]}
              resizeMode="contain"
            />
            <Text style={[styles.tabLabel, { color: iconColor }]}>
              {labelText}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen 
        name="scan" 
        options={{
          title: 'Scan',
        }}
      />
      <Tabs.Screen 
        name="settings" 
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 30,
    paddingTop: 15,
    paddingHorizontal: spacing.global,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  scanIcon: {
    width: 24,
    height: 24,
  },
});