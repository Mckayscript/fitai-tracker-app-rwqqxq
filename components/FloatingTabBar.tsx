
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth * 0.92,
  borderRadius = 40,
  bottomMargin
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const animatedValue = useSharedValue(0);

  // Improved active tab detection
  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;

      if (pathname === tab.route) {
        score = 100;
      } else if (pathname.startsWith(tab.route as string)) {
        score = 80;
      } else if (pathname.includes(tab.name)) {
        score = 60;
      } else if (tab.route.includes('/(tabs)/') && pathname.includes(tab.route.split('/(tabs)/')[1])) {
        score = 40;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  React.useEffect(() => {
    if (activeTabIndex >= 0) {
      animatedValue.value = withSpring(activeTabIndex, {
        damping: 20,
        stiffness: 120,
        mass: 1,
      });
    }
  }, [activeTabIndex, animatedValue]);

  const handleTabPress = (route: Href) => {
    console.log('User tapped tab:', route);
    try {
      router.push(route);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const tabWidthPercent = Math.max(10, ((100 / tabs.length) - 2));

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = (containerWidth - 16) / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            animatedValue.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  const dynamicStyles = {
    blurContainer: {
      ...styles.blurContainer,
      borderWidth: 1.2,
      borderColor: 'rgba(255, 255, 255, 1)',
      ...Platform.select({
        ios: {
          backgroundColor: theme.dark
            ? 'rgba(28, 28, 30, 0.8)'
            : 'rgba(255, 255, 255, 0.6)',
        },
        android: {
          backgroundColor: theme.dark
            ? 'rgba(28, 28, 30, 0.95)'
            : 'rgba(255, 255, 255, 0.6)',
        },
        web: {
          backgroundColor: theme.dark
            ? 'rgba(28, 28, 30, 0.95)'
            : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
        },
      }),
    },
    background: {
      ...styles.background,
    },
    indicator: {
      ...styles.indicator,
      backgroundColor: theme.dark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)',
      width: `${tabWidthPercent}%` as `${number}%`,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[
        styles.container,
        {
          width: containerWidth,
          marginBottom: bottomMargin ?? 24
        }
      ]}>
        <BlurView
          intensity={80}
          style={[dynamicStyles.blurContainer, { borderRadius }]}
        >
          <View style={dynamicStyles.background} />
          <Animated.View style={[dynamicStyles.indicator, indicatorStyle]} />
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = activeTabIndex === index;

              return (
                <React.Fragment key={`tab-${index}-${tab.name}`}>
                  <TouchableOpacity
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tabContent}>
                      <IconSymbol
                        android_material_icon_name={tab.icon}
                        ios_icon_name={tab.icon}
                        size={28}
                        color={isActive ? theme.colors.primary : '#757575'}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: theme.dark ? '#98989D' : '#8E8E93' },
                          isActive && { color: theme.colors.primary, fontWeight: '600' },
                        ]}
                        numberOfLines={1}
                      >
                        {tab.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    left: 4,
    bottom: 6,
    borderRadius: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 75,
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
});
