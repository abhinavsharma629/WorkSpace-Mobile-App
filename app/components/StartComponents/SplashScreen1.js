/* @flow */

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  AsyncStorage,
  Dimensions
} from "react-native";

// Custom Created
import MainScreen from "../MainPageComponents/MainPage.js";
import LoginScreen from "./LoginScreen.js";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StackActions, NavigationActions } from "react-navigation";
//Fade In Image Animation

console.disableYellowBox = true;
class LogoLoader extends Component {
  state = {
    opacity: new Animated.Value(0)
  };

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  render() {
    return (
      <Animated.Image
        onLoad={this.onLoad}
        {...this.props}
        style={[
          {
            opacity: this.state.opacity,
            transform: [
              {
                scale: this.state.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1]
                })
              }
            ]
          },
          this.props.style
        ]}
      />
    );
  }
}

// Splash Screen
export default class SplashScreen1 extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    //SplashScreen.hide();
    console.log("inside componentDidMount of splash screen");
    //AsyncStorage.clear()
    this._checkLoginStatus();
  }

  _checkLoginStatus = async () => {
    console.log("checking logging status");
    try {
      let userData = await AsyncStorage.getItem("user");
      let access_token = await AsyncStorage.getItem("access_token");
      let img_url = await AsyncStorage.getItem("img_url");


      const userStates = await AsyncStorage.getItem('userStates');

      console.log(userStates)

      const userStates1 = JSON.parse(userStates)

      if (userData) {
        setTimeout(() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "MainPage",
                params: {
                  user: userData,
                  fromScreen: "splash",
                  access_token: access_token,
                  img_url: img_url,
                  userStates:userStates1
                }
              })
            ]
          });
          this.props.navigation.dispatch(resetAction);
        }, 1000);

        // this.props.navigation.navigate("MainPage", {
        //   user: userData,
        //   fromScreen: "splash",
        //   access_token:access_token
        // });
      } else {
        //console.log("try")
        setTimeout(() => {
          // this.props.navigation.navigate("Login", {
          //   user: undefined
          // });

          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Login",
                params: { user: undefined }
              })
            ]
          });
          this.props.navigation.dispatch(resetAction);
        }, 1000);
      }
    } catch (error) {
      alert("Sorry Some Error Occured!! Please Try Again Later!!");
      alert(error);
      //await AsyncStorage.clear();
    }
  };

  render() {
      const screenWidth = Dimensions.get("window").width;
      console.log(screenWidth);
    return (
      <View style={styles.main_coin}>
        <View style={styles.container1}>
          <LogoLoader
            source={require("../../required_images/splash1.png")}
            style={{ marginLeft:screenWidth-(screenWidth+screenWidth/4.5), justifyContent: 'center', alignItems:'center',  marginTop: hp('12%') }}
          />
          <Text style={styles.productName}>WorkSpace</Text>
        </View>
        <View style={styles.container2} >
          <Text style={styles.madeBy}>QUBITS</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_coin:{
    flex:1,
    backgroundColor: "#313340"
  },

  container1: {
    flex: 0.9,
  },
  container2: {
    flex: 0.1,
  },

  p:{
    fontSize:30,
    top: -30,
    fontWeight:'bold',
    alignSelf: "center",
    color:'white',
    fontFamily:'Arial'
  },

  madeBy: {
    color: "grey",
    fontSize: 23,
    alignSelf: "center",
    fontFamily: "San Francisco",
    fontWeight: "bold"
  },
  productName: {
    color: "white",
    fontSize: 30,
    marginTop:'-5%',
    alignSelf: "center",
    fontWeight: "bold",
    fontStyle: "italic"
  }
});
