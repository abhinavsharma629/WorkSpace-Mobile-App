import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

// Custom Created
import MainScreen from './app/components/MainPageComponents/MainPage.js'
import LoginScreen from './app/components/StartComponents/LoginScreen.js'
import LoginScreen1 from './app/components/StartComponents/LoginScreen1.js'
import SignupScreen from './app/components/StartComponents/SignupScreen.js'
import SplashScreen1 from './app/components/StartComponents/SplashScreen1.js'
import GitPostViewScreen from './app/components/MainPageComponents/GitPostViewScreen.js';

const StartApp = createStackNavigator({
  MainPage:MainScreen,
  Login:LoginScreen,
  Login1:LoginScreen1,
  SignupScreen:SignupScreen,
  Splash:SplashScreen1
},
{
  initialRouteName:'Splash',
  headerMode:'none',
  navigatorOptions:() => ({
    title:'Welcome'
  })
})

const CreateContainer = createAppContainer(StartApp)

class App extends Component {

  render() {
    return (
      <CreateContainer />
    );
  }
}

export default (App);
