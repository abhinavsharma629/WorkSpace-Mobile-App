import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking,
  Image,
  BackHandler,
  ScrollView,
} from "react-native";

import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Card, Divider } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import ViewMoreText from "react-native-view-more-text";
import Modal from 'react-native-modalbox';
import Slider from 'react-native-slider';
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";

import PostViewModal from './PostViewModal';

export default class PostOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      noteId: null,
      noteAdmin: null,
      noteAdminOccupation: null,
      noteTitle: null,
      noteType: null,
      noteCaption: null,
      createdFrom: null,
      sharedFrom: null,
      isLiked: false,
      likes: null,
      commentsCount: null,
      showUpImg: null,
      sharedAt: null,
      access_token:null,
      modalVisible:false,
    };
  }

  componentDidMount() {
    console.log(this.props.image)
    this.setState({
      access_token:this.props.access_token,
      image: this.props.image,
      noteId: this.props.noteId,
      noteAdmin: this.props.noteAdmin,
      noteAdminOccupation: this.props.noteAdminOccupation,
      noteTitle: this.props.noteTitle,
      noteType: this.props.noteType,
      noteCaption: this.props.noteCaption,
      createdFrom: this.props.createdFrom,
      isLiked: this.props.isLiked,
      likes: this.props.likes,
      commentsCount: this.props.comments,
      showUpImg: this.props.showUpImg,
      sharedAt: this.props.sharedAt,
      sharedFrom: this.props.sharedFrom
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("Received post overview props again")
    this.setState({
      access_token:nextProps.access_token,
      image: nextProps.image,
      noteId: nextProps.noteId,
      noteAdmin: nextProps.noteAdmin,
      noteAdminOccupation: nextProps.noteAdminOccupation,
      noteTitle: nextProps.noteTitle,
      noteType: nextProps.noteType,
      noteCaption: nextProps.noteCaption,
      createdFrom: nextProps.createdFrom,
      isLiked: nextProps.isLiked,
      likes: nextProps.likes,
      commentsCount: nextProps.comments,
      showUpImg: nextProps.showUpImg,
      sharedAt: nextProps.sharedAt,
      sharedFrom: nextProps.sharedFrom
    });
  }

  renderViewMore(onPress) {
    return (
      <TouchableOpacity>
        <View>
          <Text onPress={onPress} style={styles.viewMore}>
            View more
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  navigateToProfile(user) {
    console.log("Navigating to profile of" + " " + user);
    this.props.navigateToUser(user);
    //this.setState({modalVisible:true})
  }
  toggleArrowHead() {
    console.log("Toggle Arrow Head");
  }

  renderViewLess(onPress) {
    return (
      <TouchableOpacity>
        <View>
          <Text />
          <Text onPress={onPress} style={styles.view}>
            View less
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  likeOrDislike(noteId, isLiked) {
    console.log(this.state.access_token)
    if (isLiked) {
      console.log("disliking");

      this.setState({ isLiked: false, likes: this.state.likes - 1 });
      fetch(
        "https://shielded-dusk-55059.herokuapp.com/shared/likeOnNote",
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.access_token
          },
          body:JSON.stringify({
            noteId:noteId
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson.status)

          console.log("disliked");
            if(responseJson.status!=="200"){
              console.log("disliking failed")
              this.setState({ isLiked: false, likes: this.state.likes + 1 });
        }
        })



    } else {
      this.setState({ isLiked: true, likes: this.state.likes + 1 });
      fetch(
        "https://shielded-dusk-55059.herokuapp.com/shared/likeOnNote",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.state.access_token
          },
          body:JSON.stringify({
            noteId:noteId
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson.status)
          console.log("liked");
          if(responseJson.status!=="201"){
            console.log("liking failed")
          this.setState({ isLiked: true, likes: this.state.likes - 1 });
        }
        })

      console.log("liking");

    }
  }

  navigateToComments(note) {
    console.log("navigating to comments for" + " " + note);
    this.props.commentShowModal(note);
  }



  render() {

    if (this.state.sharedFrom !== null) {
      var whichHeart = this.state.isLiked ? "ios-heart" : "ios-heart-empty";
      var showUpImg = ""
        try{
          if(this.state.showUpImg !== null && (this.state.showUpImg).length>0){
          showUpImg=this.state.showUpImg
        }
        else{
          showUpImg= "https://www.polytec.com.au/img/products/960-960/white.jpg";
        }
      }
      catch(error){
        showUpImg="https://www.polytec.com.au/img/products/960-960/white.jpg";
      }
      console.log(this.state.noteType)
      return (

        <Card style={styles.container} key={this.state.noteId}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={this.navigateToProfile.bind(this, this.state.noteAdmin)}
            >
              <View>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginTop: -5,
                    marginLeft: -5,
                    borderColor:'black',
                    borderWidth:1,
                    backgroundColor:'white'
                  }}
                  source={{ uri: this.state.image }}
                />
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={this.navigateToProfile.bind(
                    this,
                    this.state.noteAdmin
                  )}
                >
                  <View style={{flexWrap:'wrap'}}>
                    <Text style={{ marginLeft: 20, fontWeight: "bold" }}>
                      {this.state.noteAdmin}
                    </Text>
                  </View>
                </TouchableOpacity>

                <Text
                  style={{
                    marginLeft: 15,
                    fontWeight: "400",
                    color: "#a6a6a6",
                    fontSize: 12,
                    marginTop: 2
                  }}
                >
                  {" "}
                  ⬤ 1st
                </Text>

                <TouchableOpacity onPress={this.toggleArrowHead}>
                  <View>
                    <Icon
                      size={25}
                      name={"ios-arrow-down"}
                      color="black"
                      style={{
                        right:-40,
                        marginTop: -2,

                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    marginLeft: 30,
                    fontWeight: "400",
                    color: "#a6a6a6"
                  }}
                >
                  {this.state.noteAdminOccupation}
                </Text>
                <Text
                  style={{
                    marginLeft: 15,
                    fontWeight: "400",
                    color: "#a6a6a6",
                    fontSize: 12,
                    marginTop: 2
                  }}
                >
                  <Icon size={15} name={"ios-clock"} color="#CCCCCC" />{" "}
                  {this.props.sharedAt}
                </Text>
              </View>
            </View>
          </View>
          <Text />
          <Text style={styles.title}>{this.state.noteTitle}</Text>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={this.state.noteType!=="git"?this.props.navigateToPost.bind(this, this.state.noteId):this.props.navigateToGithub.bind(this, this.state.noteId)}>
              <Image
                style={{
                  width: 150,
                  height: 120,
                  borderRadius: 10,
                  marginTop: 15,
                  marginLeft: -5,
                  borderColor:'black',
                  borderWidth:2,
                  backgroundColor:'white'
                }}
                source={{ uri: showUpImg }}
              />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "column", marginTop: 20, marginLeft: 15 }}
            >
              <ViewMoreText
                numberOfLines={2}
                renderViewMore={this.renderViewMore}
                renderViewLess={this.renderViewLess}
                textStyle={{ fontSize: 15 }}
              >
                <Text>
                  Open To See Me More.
                </Text>
              </ViewMoreText>
              <Text
                style={{ marginTop: 13, fontWeight: "400", color: "#CCCCCC" }}
              >
                <Icon size={15} name={"ios-create"} color="#CCCCCC" />{" "}
                {this.state.createdFrom}
              </Text>
              <Text
                style={{ marginTop: 2, fontWeight: "400", color: "#CCCCCC" }}
              >
                <Icon size={15} name={"ios-send"} color="#CCCCCC" />{" "}
                {this.state.sharedFrom}
              </Text>
            </View>
          </View>
          <Divider
            style={{ backgroundColor: "#CCCCCC", height: 2, marginTop: 15 }}
            light={true}
            orientation="center"
          />
          <View style={{ flexDirection: "row", marginTop: 7 }}>
            <TouchableOpacity
              onPress={this.likeOrDislike.bind(
                this,
                this.state.noteId,
                this.state.isLiked
              )}
            >
              <View style={{ flexDirection: "row" }}>
                <Icon
                  size={25}
                  name={whichHeart}
                  color="red"
                  style={{ marginLeft: 5 }}
                />
                <Text style={{ marginTop: 2 }}> {this.state.likes} Likes</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.navigateToComments.bind(this, this.state.noteId)}
            >
              <View style={{ flexDirection: "row" }}>
                <Icon
                  size={25}
                  name={"ios-chatbubbles"}
                  color="grey"
                  style={{ marginLeft: 50, marginTop: -2 }}
                />
                <Text style={{ marginTop: 1 }}>
                  {" "}
                  {this.state.commentsCount} Comments
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>

      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 5,
    fontStyle: "italic"
  },
  view: {
    color: "blue",
    marginTop: -13
  },
  viewMore: {
    color: "blue",
    marginTop: 2
  }
});
