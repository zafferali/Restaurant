import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from 'constants/colors';

const Layout = ({ children, isScrollable }) => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  // Threshold to determine scroll direction
  const [lastScrollY, setLastScrollY] = useState(0);

  // Visibility state for header and bottom menu
  const [visible, setVisible] = useState(true);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: event => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        setVisible(currentScrollY <= lastScrollY || currentScrollY < 100);
        setLastScrollY(currentScrollY);
      },
      useNativeDriver: true, // Set to true to offload animations to native thread
    },
  );
  const ContentComponent = isScrollable ? Animated.ScrollView : View;

  return (
    <SafeAreaView style={styles.container}>
      <ContentComponent style={styles.content} onScroll={handleScroll} scrollEventThrottle={16}>
        {children}
      </ContentComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingTop: -30,
  },
  orderNum: {
    color: colors.theme,
  },
  content: {
    flex: 1,
  },
  bottomMenu: {
    height: 50, // Adjust as needed
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Layout;
