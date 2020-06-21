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
  findNodeHandle
} from "react-native";

import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Button, Card, Divider } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import ViewMoreText from "react-native-view-more-text";
import moment from "moment";

import PostOverview from "./PostOverview";
import PostViewModal from "./PostViewModal";
import CommentViewModal from "./CommentViewModal";
import GitPostViewModal from "./GitPostViewModal";

export default class Network extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sharedNotes: [],
      sharedDetails: {},
      likes: {},
      loading: true,
      currentAccessingPost: null,
      type: null,
      access_token: null,
      previousAccessingPost: null,
      gitHubData: null,
      auth_login_name: null,
      gitHubData1: null,
      myMap: new Map(),
      rootMap: new Map(),
      rootMadeRepo: null,
      show:false,
    };
  }

  componentDidMount() {
    console.log("component did mount of network.js");
    this.setState({
      likes: this.props.likes,
      sharedDetails: this.props.sharedDetails,
      sharedNotes: this.props.sharedNotes,
      access_token: this.props.access_token
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("UNSAFE_componentWillReceiveProps of network.js");
    this.setState({
      likes: nextProps.likes,
      sharedDetails: nextProps.sharedDetails,
      sharedNotes: nextProps.sharedNotes,
      access_token: nextProps.access_token,
    });
  }

  showCommentModal = noteId => {
    console.log(
      "Showing parent component comment model with noteId" + " " + noteId
    );
    this.setState({ type: "comment", currentAccessingPost: noteId, show:true });
  };

  showPostModal = noteId => {
    console.log("Showing parent component post with noteId" + " " + noteId);
    this.setState({ type: "post", currentAccessingPost: noteId, show:true });
  };

  updateComment = noteId => {
    this.props.updateView(noteId);
  };

  setShow = () =>{
    console.log("setting modal show")
    this.setState({show:false})
  }

  showGithubPost = noteId => {
    console.log("navigating to github post for" + " " + noteId);
    console.log("navigated to github post for" + " " + noteId);
    if (this.state.previousAccessingPost === noteId) {
      this.setState({ type: "git_post", previousAccessingPost: noteId });
    } else {
      this.setState({
        type: "git_post",
        loading: true,
        previousAccessingPost: noteId,
        show:true,
      });
      this.getAllData(noteId, this.state.access_token);
    }
  };

  getAllData(noteId, access_token) {
    // console.log("Getting all post comments")
    console.log(noteId);
    console.log(access_token);
    fetch(
      "https://shielded-dusk-55059.herokuapp.com/shared/specificNoteDetailForGit?noteId=" +
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
          var gitHubData = JSON.parse(responseJson.gitHubData);
          var auth_login_name = responseJson.auth_login_name;
          var gitHubData1 = {};
          if (gitHubData["rootFolderData"].length !== undefined) {
            for (var j = 0; j < gitHubData["rootFolderData"].length; j++) {
              gitHubData1[gitHubData["rootFolderData"][j]["sha"]] =
                gitHubData["rootFolderData"][j];
            }
          } else {
            gitHubData1[gitHubData["rootFolderData"]["sha"]] =
              gitHubData["rootFolderData"];
          }

          this.setState({
            type: "git_post",
            previousAccessingPost: noteId,
            noteDetails: noteDetails,
            gitHubData: gitHubData,
            gitHubData1: gitHubData1,
            auth_login_name: auth_login_name,
            loading: false,

          });
        } else {
          alert("Try Again");
        }
      });
  }

  render() {
    if (this.state.sharedNotes.length > 0) {
      const { sharedNotes } = this.state.sharedNotes;
      const { sharedDetails } = this.state.sharedDetails;
      const { likes } = this.state.likes;
      //console.log("Fetching");
      var currentAccessingPost = this.state.currentAccessingPost;
      //console.log(Object.keys(sharedDetails))
      let posts = this.props.sharedNotes.map(note => {
        var image = note["admin_profile_picture"];
        var noteId = note["note_id"];
        var noteAdmin = note["note_admin"];
        var noteAdminOccupation = note["occupation"];
        var noteTitle = note["noteTitle"];
        var noteType = note["typeOfData"];
        var noteCaption = note["noteCaption"];
        var showUpImg = note["showUpImg"];
        var sharedAt = moment(this.state.sharedDetails[note["sharedAt"]]);
        sharedAt = sharedAt.fromNow();
        var comments = Object.keys(note["comments"]).length;
        console.log(comments);
        var createdFrom =
          note["createdFrom"] !== undefined
            ? note["createdFrom"]
            : "Unknown Source";
        //console.log(typeof { likes });
        var sharedFrom=""
        try{
        sharedFrom = this.state.sharedDetails[noteId]["sharedFrom"];
      }
      catch(error){
        sharedFrom="Unknown Source"
      }
        var isLiked = false;
        if (noteId in this.state.likes) {
          if (this.state.likes[noteId] !== undefined) {
            isLiked = true;
          }
        }
        //console.log(isLiked);
        var likes = Object.keys(note["likes"]).length;

        if (image) {
          image =
            "https://obscure-bayou-10492.herokuapp.com/media/" +
            note["admin_profile_picture"];
          //console.log("Admin Image Present");
        } else {
          image =
            "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg";
        }
        return (
          <PostOverview
            key={noteId}
            commentShowModal={this.showCommentModal}
            navigateToPost={this.showPostModal}
            navigateToGithub={this.showGithubPost}
            navigateToUser={this.props.navigateToUser}
            access_token={this.state.access_token}
            image={image}
            noteId={noteId}
            noteAdmin={noteAdmin}
            noteAdminOccupation={noteAdminOccupation}
            noteTitle={noteTitle}
            noteType={noteType}
            noteCaption={noteCaption}
            createdFrom={createdFrom}
            sharedFrom={sharedFrom}
            isLiked={isLiked}
            likes={likes}
            comments={comments}
            showUpImg={showUpImg}
            sharedAt={sharedAt}
          />
        );
      });
      console.log("rendering network");
      console.log(this.state.type);
      if (this.state.type === "comment") {
        return (
          <View>
            <DropdownAlert
              ref={ref => (this.dropDownAlertRef = ref)}
              closeInterval={this.state.closeInterval}
              elevation={20}
            />
            {posts}
            <CommentViewModal
              noteId={this.state.currentAccessingPost}
              access_token={this.state.access_token}
              updateComment={this.updateComment}
              show={this.state.show}
              setShow={this.setShow}
            />
          </View>
        );
      } else if (this.state.type === "git_post") {
        console.log("accessing git post");
        return (
          <View>
            <DropdownAlert
              ref={ref => (this.dropDownAlertRef = ref)}
              closeInterval={this.state.closeInterval}
              elevation={20}
            />
            {posts}
            <GitPostViewModal
              noteId={this.state.previousAccessingPost}
              access_token={this.state.access_token}
              gitHubData={this.state.gitHubData}
              gitHubData1={this.state.gitHubData1}
              auth_login_name={this.state.auth_login_name}
              loading={this.state.loading}
              show={this.state.show}
              setShow={this.setShow}
            />
          </View>
        );
      } else {
        console.log("inside post");
        return (
          <View>
            <DropdownAlert
              ref={ref => (this.dropDownAlertRef = ref)}
              closeInterval={this.state.closeInterval}
              elevation={20}
            />
            {posts}
            <PostViewModal
              noteId={this.state.currentAccessingPost}
              access_token={this.state.access_token}
              show={this.state.show}
              setShow={this.setShow}
            />
          </View>
        );
      }
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
