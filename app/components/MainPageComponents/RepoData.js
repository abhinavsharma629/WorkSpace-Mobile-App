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

import { Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Entypo";
import { Button, Card, Divider, Overlay } from "react-native-elements";
import base64 from "react-native-base64";
import ShowGithubPostSkeleton from "./ShowGithubPostSkeleton";
import moment from "moment";
export default class RepoData extends Component {
  constructor(props){
    super(props);
    this.state={
      rootMadeRepo:null
    }
  }
  componentDidMount(){
    this.setState({rootMadeRepo:this.props.rootMadeRepo})
  }

  UNSAFE_componentWillReceiveProps(nextProps){
      this.setState({rootMadeRepo:nextProps.rootMadeRepo})
  }
  render() {


    if(this.state.rootMadeRepo!==null){
      if('showB' in this.props){
        console.log("single blob")
        var rootFolderData = this.state.rootMadeRepo.map(repo => {
          var icon = "text"
          return (
            <View >

            <TouchableOpacity
              onPress={() => {
                repo.type === "tree"
                  ? this.props.showTree(repo.ancestor)
                  : this.props.showB(repo.name);
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
        });

        return (
          <View style={styles.container}>
            {rootFolderData}
          </View>
        );
      }
      else{
    var rootFolderData = this.state.rootMadeRepo.map(repo => {
      var icon = repo.type==="tree"?"flow-tree":"text"
      return (
        <View >

        <TouchableOpacity
          onPress={() => {
            repo.type === "tree"
              ? this.props.showTree(repo.ancestor)
              : this.props.showBlob(repo);
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
              width:280,
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
    });

    return (
      <View style={styles.container}>
        {rootFolderData}
      </View>
    );
  }
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
