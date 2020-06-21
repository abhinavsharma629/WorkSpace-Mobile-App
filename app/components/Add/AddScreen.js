import React, { Component } from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {View, StyleSheet, DrawerActions} from 'react-native';
import { ActivityIndicator, Colors } from "react-native-paper";
// Custom Created
import NoteScreen from './NoteScreen';
import CodeScreen from './CodeScreen';
import SavedNoteScreen from './SavedNoteScreen';


const StartApp = createDrawerNavigator({
  NoteScreen:{screen:NoteScreen},
  CodeScreen:{screen:CodeScreen},
  SavedNoteScreen:{screen:SavedNoteScreen},
},
{
  initialRouteName:'SavedNoteScreen',
  drawerWidth:250,
  drawerPosition:'left',
  drawerType:'slide',
  drawerBackgroundColor:'transparent',
})


const CreateContainer = createAppContainer(StartApp)

class App extends Component {
  constructor(props)  {
          super(props);
          this.state={
            access_token:null,
            isLoading:true,
            user:null,
            img_url:"",
          }
      }

    componentDidMount(){
      console.log("Inside componentDidMount od AddScreen")
      console.log(this.props.screenProps.access_token)
      console.log(this.props.screenProps.user)
      this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user, isLoading:false, img_url:this.props.screenProps.img_url})
    }

  render() {
    if(this.state.isLoading===false){

    return (
      <CreateContainer screenProps={{user:this.state.user, access_token:this.state.access_token, img_url:this.state.img_url}} />
    );
  }
  else{
    return (<View />);
  }
  }
}
const styles=StyleSheet.create({
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "48%"
  },
})

export default (App);
