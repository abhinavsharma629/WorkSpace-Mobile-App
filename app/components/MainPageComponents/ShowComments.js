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
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import { Text, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Card, Divider } from "react-native-elements";

import CommentSkeleton from "./CommentSkeleton";
import moment from "moment";

export default class ShowComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteId: null,
      loading: true,
      access_token: null,
      noteDetails: null,
      commentData: "",
      refreshing:false,
    };
  }

  componentDidMount() {
    console.log("Show Comments componentDidMount");
    console.log(this.props.noteId);
    this.setState({
      noteId: this.props.noteId,
      access_token: this.props.access_token
    });

    this.getAllComments(this.props.noteId, this.props.access_token);
  }

  _onRefresh = () =>{
    this.setState({refreshing:true})
    this.getAllComments(this.state.noteId, this.state.access_token)
  }

  getAllComments(noteId, access_token) {
    // console.log("Getting all post comments")
    console.log(noteId);
    console.log(access_token);
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/shared/specificNoteDetailForComments?noteId=" +
        noteId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "200") {
          var noteDetails = JSON.parse(responseJson.noteDetails);
          console.log(noteDetails);

          this.setState({ noteDetails: noteDetails, loading: false, refreshing:false });
        } else {
          alert("Try Again");
        }
      });
  }

  submitComment = () => {
    console.log(this.state.noteId);

    console.log("Submitting comment");
    // this.props.updateComment(this.state.noteId);
    fetch("https://shielded-dusk-55059.herokuapp.com/shared/commentOnNote", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.state.access_token
      },
      body: JSON.stringify({
        noteId: this.state.noteId,
        comment: this.state.commentData
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === "201") {
          this.getAllComments(this.state.noteId, this.state.access_token);
          this.setState({ commentData: "" });
          this.props.updateComment(this.state.noteId);
        } else {
          alert("Some Error Occured");
        }
      });
  };

  onChangeText(text) {
    console.log(text);
    this.setState({ commentData: text });
  }

  render() {
    if (this.state.loading === true || this.state.noteDetails === null) {
      return (
        <View>
          <CommentSkeleton />
        </View>
      );
    } else {
      let comments = this.state.noteDetails[0]["comments"].map(note => {
        console.log("ok updating view");
        //console.log(note)
        var date = moment(note["timeOfComment"]);
        date = date.fromNow(date);
        console.log(date);
        var commentId = note["commentId"];
        var userWhoCommented = note["user"];
        var comment = note["comment"];
        let image =
          "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg";
        if(note['user_img_url']){
          image="https://shielded-dusk-55059.herokuapp.com/media/"+note['user_img_url']
        }
        //console.log(note['user_img_url'])
        //console.log(image)
        return (
          <View
            key={commentId}
            style={{
              flexDirection: "row",
              marginTop: 10
            }}
          >
            <TouchableOpacity>
              <View>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginTop: 10,
                    marginLeft: 10,
                    borderColor:'black',
                    borderWidth:1,
                    backgroundColor:'white'
                  }}
                  source={{
                    uri:
                      image
                  }}
                />
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: "column", flex: -1 }}>
              <Text
                style={{
                  marginLeft: 30,
                  fontSize: 15,
                  flex: -1,
                  marginLeft: 20,

                  marginTop: -20,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  padding: 5,
                  fontWeight: "400",
                  fontWeight: "bold"
                }}
              >
                {userWhoCommented}
              </Text>

              <View
                style={{
                  flex: -1,
                  marginLeft: 20,
                  marginRight: 10,
                  marginTop: 5,
                  backgroundColor: "#CCC",
                  borderRadius: 10,
                  padding: 5
                }}
              >
                <Text
                  style={{
                    fontSize: 15
                  }}
                >
                  {comment}
                </Text>
              </View>

              <Text
                style={{
                  marginLeft: 30,
                  fontSize: 15,
                  flex: -1,
                  marginLeft: 20,
                  marginRight: 250,
                  marginTop: 5,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 10,
                  padding: 5,
                  fontWeight: "400",
                  fontWeight: "bold",
                  color: "#a6a6a6"
                }}
              >
                {date}
              </Text>
              <Text />
            </View>
            <Text />
            <Text />
          </View>
        );
      });

      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.9 }}>
          <ScrollView

            refreshControl={
              <RefreshControl

                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <ScrollView>{comments}</ScrollView>
            </ScrollView>
          </View>

          <View style={{ flex: 0.1 }}>
            <KeyboardAvoidingView>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  onChangeText={text => {
                    this.onChangeText(text);
                  }}
                  placeholder="Comment"
                  style={{
                    padding: 1,
                    marginLeft: 10,
                    width: wp('80%'),
                    height: 40,
                    marginTop: 5
                  }}
                  outline={true}
                  value={this.state.commentData}
                />

                <TouchableOpacity onPress={this.submitComment}>
                  <View>
                    <Icon
                      size={30}
                      name="ios-paper-plane"
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        color: "#0360FF"
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            <Text />
            <Text />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomView: {
    width: "100%",
    height: 50,

    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0
  }
});
