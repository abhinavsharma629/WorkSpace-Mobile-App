/* @flow */

import React, { Component } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  KeyboardAwareView,
  TouchableHighlight,
  Image,
  Dimensions,
  Modal,
  SafeAreaView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Entypo";
import { Button, Card, Divider, Overlay } from "react-native-elements";
import base64 from "react-native-base64";

import moment from "moment";
export default class RepoData1 extends Component {
  constructor(props){
    super(props);
    this.state={
      rootMadeRepo:null,
      accessType:null,
    }
  }
  componentDidMount(){
    this.setState({rootMadeRepo:this.props.rootMadeRepo, accessType:this.props.accessType})
  }

  UNSAFE_componentWillReceiveProps(nextProps){
      this.setState({rootMadeRepo:nextProps.rootMadeRepo, accessType:this.props.accessType})
  }
  render() {


    if(this.state.rootMadeRepo!==null){

    var rootFolderData = this.state.rootMadeRepo.map(repo => {
      console.log(repo)
      var icon = repo.type==="tree"?"flow-tree":"text";
      if(this.state.accessType==="admin"){
      return (
        <View key={repo.id}>

        <TouchableOpacity
          onPress={() => {
            repo.type === "tree"
              ? this.props.showTree(repo.ancestor)
              : this.props.showBlob(repo.id, repo.path)
          }}
        >
        <View style={{flexDirection:'row'}}>
        <View
          style={{
            marginLeft: 20,
            marginRight: 10,
            marginTop: 5,
            backgroundColor: "#CCC",
            borderRadius: 10,

            padding: 5,
            elevation: 5,

          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight:'bold',
              width:300,
              height:30,
              justifyContent:'center',
              textAlign:'center',

            }}
          >
            {repo.name}
          </Text>
        </View>

        <View
          style={{
            marginLeft: 8,
            marginRight: 10,
            marginTop:13,
            marginBottom:5,
            backgroundColor: "#454753",
            borderRadius: 5,
            padding: 5,
            elevation: 2
          }}
        >
        <Icon size={15} name={icon} style={{color:'#0DA66E'}}/>

        </View>
            </View>
            <Text />

        </TouchableOpacity>

        </View>
      );
    }
    else{
      return (
        <View key={repo.id}>

        <TouchableOpacity
          onPress={() => {
            repo.type === "tree"
              ? this.props.showTree(repo.ancestor)
              : this.props.showBlob(repo.id, repo.path)
          }}
          onLongPress={ () => {this.props.showOverlay(repo)}}
        >
        <View style={{flexDirection:'row'}}>
        <View
          style={{
            marginLeft: 20,
            marginRight: 10,
            marginTop: 5,
            backgroundColor: "#CCC",
            borderRadius: 10,

            padding: 5,
            elevation: 5,

          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight:'bold',
              width:wp('75%'),
              height:30,
              justifyContent:'center',
              textAlign:'center',

            }}
          >
            {repo.name}
          </Text>
        </View>

        <View
          style={{
            marginLeft: 8,
            marginRight: 10,
            marginTop:13,
            marginBottom:5,
            backgroundColor: "#454753",
            borderRadius: 5,
            padding: 5,
            elevation: 2
          }}
        >
        <Icon size={15} name={icon} style={{color:'#0DA66E'}}/>

        </View>
            </View>
            <Text />

        </TouchableOpacity>

        </View>
      );
    }
    });

    return (
      <View style={styles.container}>
        {rootFolderData}
      </View>
    );
  }
  else{
    return (
      <View style={styles.container}>
      </View>
    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
