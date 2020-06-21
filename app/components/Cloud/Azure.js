import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { ActivityIndicator, Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// Custom Created
import BeforeMALoginScreen from './Microsoft Azure/BeforeMALoginScreen'
import AfterMALoginScreen from './Microsoft Azure/AfterMALoginScreen'

const StartApp = createStackNavigator({
  BeforeMALoginScreen:BeforeMALoginScreen,
  AfterMALoginScreen:AfterMALoginScreen,
},
{
  initialRouteName:'BeforeMALoginScreen',
  headerMode:'none',
  navigatorOptions:() => ({
    title:'Welcome'
  })
})

const CreateContainer = createAppContainer(StartApp)

export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      access_token:null,
      isLoading:true,
      user:null,
    }
  }

  componentDidMount(){
    console.log("inside componentDidMount of BeforeMALoginScreen")
    console.log(this.props.screenProps.access_token)
    this.setState({access_token:this.props.screenProps.access_token, isLoading:false, user:this.props.screenProps.user})
  }

  static navigationOptions = {
    drawerLabel: "Azure",
    drawerIcon: () => <Icon size={25} name="azure" />,
    tapToClose: "true"
  };


  render() {
    if(this.state.isLoading){
      return(
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader}
          hidesWhenStopped
          color={Colors.blue800}
        />
      )
    }
    else{
    return (
      <CreateContainer screenProps={{maRootNav:this.props.navigation, access_token:this.state.access_token, user:this.state.user}} />
    );
  }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "48%"
  },
});
