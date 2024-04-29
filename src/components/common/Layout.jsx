import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image } from 'react-native';
import colors from 'constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const Layout = ({ children, navigation, backTitle, title, dynamicTitle }) => {

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          {backTitle ?
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={styles.backBtn} source={require('images/back.png')} />
              </TouchableOpacity>
              <View style={styles.backTitleContainer}>
                <Text style={styles.backTitle}>{backTitle}</Text>
                {dynamicTitle && <Text style={styles.dynamicTitle}>{dynamicTitle}</Text> }
              </View>
            </View> :
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          }
        </View>
        {children}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  orderNum: {
    color: colors.theme,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
  },
  backTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  backTitleContainer: {
    flexDirection: 'row',
  },
  dynamicTitle :{
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.theme,
  },
  titleContainer: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    flex: 1,
  },
});

export default Layout;
