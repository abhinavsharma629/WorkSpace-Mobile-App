import React, {Component} from "react";
import { BottomNavigation, Text } from "react-native-paper";
import { StyleSheet, View, Button } from "react-native";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import { HeaderBackButton, createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
//import Icon from "react-native-elements";

import HomeScreen from "./HomeScreen";
import GitScreen from "../Git/GitScreen";
import AddScreen from "../Add/AddScreen";
import ProfileScreen from "../Profile/ProfileScreen";
import CloudScreen from "../Cloud/CloudScreen";
import GitPostViewScreen from './GitPostViewScreen';
import SearchScreen from './SearchScreen';
import NotificationsScreen from './NotificationsScreen';
import ScannerScreen from './ScannerScreen';
import ScanScreen from './ScanScreen';

const AppBarScreen = createMaterialBottomTabNavigator(
  {
    home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: () => (
          <View style={{marginLeft:-10, marginTop:-5}}>
            <Icon size={30} name={"home"} color="#FFFFFF" />
          </View>
        ),
        headerLeft: (
          <HeaderBackButton onPress={() => navigation.goBack(null)} />
        ),
        gesturesEnabled: true,
        tabBarColor: "#0360FF"
      }
    },
    git: {
      screen: GitScreen,
      navigationOptions: {
        tabBarLabel: "Git",
        tabBarIcon: () => (
          <View style={{marginLeft:-10, marginTop:-5}}>
            <Icon size={30} name={"git"} color="#FFFFFF" />
          </View>
        ),
        headerLeft: (
          <HeaderBackButton onPress={() => navigation.goBack(null)} />
        ),
        gesturesEnabled: true,
        tabBarColor: "#313340"
      }
    },
    add: {
      screen: AddScreen,
      navigationOptions: {
        tabBarLabel: "Add",
        tabBarIcon: () => (
          <View style={{marginLeft:-10, marginTop:-5}}>
            <Icon
              size={30}
              raised={true}
              reverse={true}
              name={"notebook"}
              color="#FFFFFF"
            />
          </View>
        ),
        headerLeft: (
          <HeaderBackButton onPress={() => navigation.goBack(null)} />
        ),
        gesturesEnabled: true,
        tabBarColor: "#A62655"
      }
    },
    cloud: {
      screen: CloudScreen,
      navigationOptions: {
        tabBarLabel: "Cloud",
        tabBarIcon: () => (
          <View style={{marginLeft:-10, marginTop:-5}}>
            <Icon size={30} name={"remote-desktop"} color="#FFFFFF" />
          </View>
        ),
        headerLeft: (
          <HeaderBackButton onPress={() => navigation.goBack(null)} />
        ),
        gesturesEnabled: true,
        tabBarColor: "#313340"
      }
    },
    profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: "Profile",

        tabBarIcon: () => (
          <View style={{marginLeft:-10, marginTop:-5}}>
            <Icon size={30} name={"account"} color="#FFFFFF" />
          </View>
        ),
        headerLeft: (
          <HeaderBackButton onPress={() => navigation.goBack(null)} />
        ),
        gesturesEnabled: true,
        tabBarColor: "#0DA66E"
      }
    }
  },
  {
    initialRouteName: "home",
    activeColor: "#f0edf6",
    inactiveColor: "#3e2465",
    animationEnabled: true,
    labeled:false,
    barStyle: { backgroundColor: "rgb(0,122,255)" }
  }
);

const CreateContainer = createAppContainer(AppBarScreen)


const StartApp = createStackNavigator({
  SearchScreen:SearchScreen,
  NotificationsScreen:NotificationsScreen,
  ScannerScreen:ScannerScreen,
  ScanScreen:ScanScreen,
  Drawer:CreateContainer
},
{
  initialRouteName:'Drawer',
  headerMode:'none',
  navigatorOptions:() => ({
    title:'Welcome'
  })
})

const CreateContainer1 = createAppContainer(StartApp)



class App extends Component {

  constructor(props){
    super(props);
    this.state={
      access_token:null,
      user:null,
      currentDistance:0,
      newSentArray:{},
      newReceivedArray:{},
      newFriendArray:{},
      friendsArray:{},
      server_url:"https://shielded-dusk-55059.herokuapp.com",
      img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      userStates:null,
    }
  }

  componentDidMount(){
    console.log(this.props.navigation.state.params.userStates)
    console.log("inside componentDidMount of MainPage")
    this.setState({access_token:this.props.navigation.state.params.access_token, userStates:this.props.navigation.state.params.userStates, user:this.props.navigation.state.params.user, img_url:this.state.server_url+this.props.navigation.state.params.img_url})
    console.log(this.props.navigation.state.params.userStates)
  }

  setResults = (newFriendArray, newSentArray, newReceivedArray, distance, friendsArray) =>{

    console.log(distance)
    console.log("setting distance results")
    console.log(newReceivedArray)
    this.setState({currentDistance:distance, newSentArray:newSentArray, newReceivedArray:newReceivedArray, newFriendArray:newFriendArray, friendsArray:friendsArray})
  }

  setUserState = (userStates) =>{
    this.setState({userStates:userStates})
  }

  render() {
    if(this.state.access_token){
    return (
      <CreateContainer1 screenProps={{rootNav:this.props.navigation,  setUserState:this.setUserState, userStates: this.state.userStates, access_token:this.state.access_token, user:this.state.user, img_url:this.state.img_url, newSentArray:this.state.newSentArray, newReceivedArray:this.state.newReceivedArray, newFriendArray:this.state.newReceivedArray, newFriendArray:this.state.newFriendArray, currentDistance:this.state.currentDistance, friendsArray:this.state.friendsArray, setResults:this.setResults}} />
    );
  }
  else{
    return (<View />);
  }
  }
}

export default (App);
