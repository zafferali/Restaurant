import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import Menu from 'components/Menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from 'constants/colors';

const Layout = ({ children, smallTitle, bigTitle, showBackButton, onBackPress, showMenu, isScrollable }) => {
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
      useNativeDriver: true, // Set to true if you want to offload animations to native thread
    },
  );
  const ContentComponent = isScrollable ? Animated.ScrollView : View;

  return (
    <>
    <SafeAreaView style={styles.container}>
      {showBackButton && visible && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackPress}>
            <Image style={styles.backButton} source={require('images/back.png')}/>
          </TouchableOpacity>
          <Text style={styles.smallTitle}>{smallTitle}
            <Text style={styles.orderNum}> #301</Text>
          </Text>
        </View>
      )}

      {/* Screen title */}
      {visible && 
      <Text style={styles.bigTitle}>{bigTitle}</Text>}

      {/* Screen content */}
      <ContentComponent style={styles.content} onScroll={handleScroll} scrollEventThrottle={16}>
        {children}
      </ContentComponent>
    </SafeAreaView>
    {showMenu && visible && <Menu />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: 20,
    gap: 10,
    zIndex: 10,
  },
  backButton: {
    width: 46,
    height: 46,
    zIndex: 10,
    flexDirection: 'row',
  },
  smallTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'black',
    // marginTop: -13,
    // marginLeft: 18,
  },

  bigTitle: {
    fontSize: 38,
    color: 'black',
    fontWeight: '700',
  },
  orderNum: {
    color: colors.theme,
  },
  content: {
    flex: 1,
    // Add padding or any styles you want to apply to all screens
  },
  bottomMenu: {
    height: 50, // Adjust as needed
    backgroundColor: '#eee', // Example color for the bottom menu
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Layout;
