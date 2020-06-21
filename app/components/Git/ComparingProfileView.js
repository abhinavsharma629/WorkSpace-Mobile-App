import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage,
  Linking,
  Image,
  BackHandler,
  ScrollView,
  Modal,
  DrawerActions,
  RefreshControl,
  findNodeHandle
} from "react-native";
import GestureRecognizer, {
  swipeDirections
} from "react-native-swipe-gestures";
import RNExitApp from "react-native-exit-app";
import { WebView } from "react-native-webview";
import DeepLinking from "react-native-deep-linking";
import { Container, Footer, FooterTab } from "native-base";
import { ActivityIndicator, Colors, TextInput } from "react-native-paper";
import { Button, Divider } from "react-native-elements";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import base64 from "react-native-base64";
import ViewMoreText from "react-native-view-more-text";
import { StackActions, NavigationActions, Actions } from "react-navigation";
import moment from "moment";
import { RootFolderData } from "./RootFolderData";
import Overlay from "react-native-modal-overlay";
import {
  ClassicHeader,
  AppleHeader,
  ModernHeader
} from "@freakycoder/react-native-header-view";
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage
} from "react-native-material-cards";


import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";

export default class ComparingProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      git_access_token: null,
      git_user: null,
      comparing_user: null,
      isLoading: true,
      modalVisible: false,
      activity_text: "Comparing...",
      showCard: false,
      analysisDict: null,
      analysisDict1: null,
      userRepos: null,
      userRepos1: null,
      img_url: null,
      img_url1: null,
      refreshing:false,
      git_img_url:"https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg"
    };
  }

  componentDidMount() {
    console.log("Component did mount of ComparingProfileView");

    try {
      this.setState({
        git_access_token: this.props.screenProps.git_access_token,
        git_user: this.props.screenProps.auth_login_name,
        comparing_user: "maarcingebala",
        git_img_url:this.props.screenProps.git_img_url,
        isLoading: true,
        showCard: false,
        access_token: this.props.screenProps.access_token
      });
      //console.log(this.state.comparing_user+" "+"maarcingebala")
      if(this.state.comparing_user !== "maarcingebala"){
      this.compareProfiles(
        this.props.screenProps.auth_login_name,
        "maarcingebala",
        this.props.screenProps.access_token,
        this.props.screenProps.git_access_token
      );
      //console.log(this.props.navigation.state);
    }
    } catch (error) {
      console.log("error"+error)
      this.setState({ isLoading: false, showCard: true, git_img_url:this.props.screenProps.git_img_url });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("ComponentWillReceiveProps of ComparingProfileView");

    //console.log(this.state.comparing_user!==nextProps.navigation.state.params.comparison_user)

    try {
      this.setState({
        git_access_token: nextProps.screenProps.git_access_token,
        git_user: nextProps.screenProps.auth_login_name,
        comparing_user: nextProps.navigation.state.params.comparison_user,
        git_img_url:nextProps.screenProps.git_img_url,
        showCard: false,
        isLoading:true,
        access_token: this.props.screenProps.access_token
      });

      console.log(this.state.comparing_user+" "+nextProps.navigation.state.params.comparison_user)
      if(this.state.comparing_user !== nextProps.navigation.state.params.comparison_user){
        console.log("comparing")
        this.setState({isLoading: true})
        this.compareProfiles(
          nextProps.screenProps.auth_login_name,
          nextProps.navigation.state.params.comparison_user,
          nextProps.screenProps.access_token,
          nextProps.screenProps.git_access_token
        );
      //console.log(nextProps.navigation.state);

    }
    else{
      this.setState({isLoading:false})
    }

    } catch (error) {
      this.setState({ isLoading: false, showCard: true });
    }
  }

  goToFollowers() {
    this.props.navigation.navigate("FollowersView");
  }

  goToFollowing() {
    this.props.navigation.navigate("FollowingView");
  }



  compareProfiles = (git_user, comparing_user, access_token, git_access_token) => {
    console.log("ok comparing" + " " + git_user + " with " + comparing_user);

    fetch(
      "http://shielded-dusk-55059.herokuapp.com/hi/compareUserProfiles?owner_name=" +
        git_user +
        "&comparing_user=" +
        comparing_user +
        "&access_token=" +
        git_access_token,
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
        // console.log(JSON.parse(responseJson.analysisDict))
        // console.log(JSON.parse(responseJson.analysisDict1))
        // console.log(JSON.parse(responseJson.userRepos))
        // console.log(JSON.parse(responseJson.userRepos1))
        this.setState({
          refreshing:false,
          img_url: responseJson.img_url,
          img_url1: responseJson.comparing_img_url,
          analysisDict: JSON.parse(responseJson.analysisDict),
          analysisDict1: JSON.parse(responseJson.analysisDict1),
          userRepos: JSON.parse(responseJson.userRepos),
          userRepos1: JSON.parse(responseJson.userRepos1),
          isLoading: false
        });

        // console.log("--------------------------")
        // console.log(this.state.img_url)
        // console.log("--------------------------\n\n")
        // console.log("--------------------------")
        // console.log(this.state.img_url1)
        // console.log("--------------------------\n\n")
        // console.log("--------------------------")
        // console.log(this.state.analysisDict)
        // console.log("--------------------------\n\n")
        // console.log("--------------------------")
        // console.log(this.state.analysisDict1)
        // console.log("--------------------------\n\n")
        // console.log("--------------------------")
        // console.log(this.state.userRepos)
        // console.log("--------------------------\n\n")
        // console.log("--------------------------")
        // console.log(this.state.userRepos1)
        // console.log("--------------------------\n\n")
      });
  }

  _onRefresh = () =>{
    this.setState({refreshing:true})
    this.compareProfiles(this.state.git_user, this.state.comparing_user, this.state.access_token, this.state.git_access_token)
  }

  compareAnalysis = () => {

    console.log("compare analysis");
    //console.log(this.state.userRepos);
    let ownerAnalysis = this.state.analysisDict;
    let competitorAnalysis = this.state.analysisDict1;
    // console.log(ownerAnalysis);
    // console.log(competitorAnalysis);
    let competitorArray = [];
    let ownerArray = [];
    let ownerCount = [];
    let competitorCount = [];
    if (
      Object.keys(ownerAnalysis).length >=
      Object.keys(competitorAnalysis).length
    ) {
      let maxDict = ownerAnalysis;
      let minDict = competitorAnalysis;
      for (let i in maxDict) {
        ownerArray.push([i, maxDict[i]["total"] / maxDict[i]["count"]]);
        ownerCount.push([i, maxDict[i]["count"]]);
        if (i in competitorAnalysis) {
          competitorArray.push([i, minDict[i]["total"] / minDict[i]["count"]]);
          competitorCount.push([i, minDict[i]["count"]]);
          delete minDict[i];
        } else {
          competitorArray.push([i, 0]);
          competitorCount.push([i, 0]);
        }
      }
      for (let i in minDict) {
        competitorArray.push([i, minDict[i]["total"] / minDict[i]["count"]]);
        competitorCount.push([i, minDict[i]["count"]]);
        ownerArray.push([i, 0]);
        ownerCount.push([i, 0]);
      }
    } else {
      let maxDict = competitorAnalysis;
      let minDict = ownerAnalysis;
      for (let i in maxDict) {
        competitorArray.push([i, maxDict[i]["total"] / maxDict[i]["count"]]);
        competitorCount.push([i, maxDict[i]["count"]]);
        if (i in ownerAnalysis) {
          ownerArray.push([i, minDict[i]["total"] / minDict[i]["count"]]);
          ownerCount.push([i, minDict[i]["count"]]);
          delete minDict[i];
        } else {
          ownerArray.push([i, 0]);
          ownerCount.push([i, 0]);
        }
      }
      for (let i in minDict) {
        ownerArray.push([i, minDict[i]["total"] / minDict[i]["count"]]);
        ownerCount.push([i, minDict[i]["count"]]);
        competitorArray.push([i, 0]);
        competitorCount.push([i, 0]);
      }
    }
    // console.log(ownerArray);
    // console.log(competitorArray);
    // console.log(ownerCount);
    // console.log(competitorCount);

    return [ownerArray, competitorArray, ownerCount, competitorCount];
  };

  static navigationOptions = {
    drawerLabel: "Compare",
    drawerIcon: () => <Icon size={30} name="ios-shuffle" />,
    tapToClose: "true"
  };

  _renderItem = ({ index }) => {
    const screenWidth = Dimensions.get("window").width;

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#CCC",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5
    };
    let data11 = this.compareAnalysis();
    let data1 = data11[0];
    let data2 = data11[1];
    let data3 = data11[2];
    let data4 = data11[3];

    let languages = [];
    let ownerUsage = [];
    let ownerCount = [];
    let comparerUsage = [];
    let comparerCount = [];
    for (let i = 0; i < data1.length; i++) {
      languages.push(data1[i][0]);
      if (data1[i][1] === undefined) {
        ownerUsage.push(0);
      } else {
        ownerUsage.push(data1[i][1]);
      }
    }
    for (let i = 0; i < data2.length; i++) {
      if (data2[i][1] === undefined) {
        comparerUsage.push(0);
      } else {
        comparerUsage.push(data2[i][1]);
      }
    }

    for (let i = 0; i < data3.length; i++) {
      if (data3[i][1] === undefined) {
        ownerCount.push(0);
      } else {
        ownerCount.push(data3[i][1]);
      }
    }

    for (let i = 0; i < data4.length; i++) {
      if (data4[i][1] === undefined) {
        comparerCount.push(0);
      } else {
        comparerCount.push(data4[i][1]);
      }
    }

    let count = -1;
    let makeComparerUsageArray = [];
    let makeLanguageArray = [];
    let makeOwnerUsageArray = [];

    // console.log(ownerCount)
    // console.log(comparerCount);


    if (index === 0) {
      let graphs = languages.map(language => {
        count += 1;
        if (count !== 0 && count % 8 === 0) {
          let datas = {
            labels: [...makeLanguageArray],
            datasets: [
              {
                data: [...makeOwnerUsageArray],

              },
              {
                data: [...makeComparerUsageArray],
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#CCC",
                backgroundGradientToOpacity: 0.5,
                fillShadowGradient:'red',
                color: (opacity = 1) => `rgba(237,85,101, ${opacity})`,
                strokeWidth: 2,
                barPercentage: 0.5
              }
            ]
          };
          makeComparerUsageArray = [];
          makeLanguageArray = [];
          makeOwnerUsageArray = [];
          // console.log("data");
          //console.log(datas.data);
          return (
            <View style={{ flex: 1, marginTop: 10 }}>
              <LineChart
                data={datas}
                width={screenWidth}
                height={300}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                style={{ borderRadius: 10, elevation: 5 }}
              />

              <Text />
            </View>
          );
        } else if (count === languages.length) {
          let datas = {
            labels: [...makeLanguageArray],
            datasets: [
              {
                data: [...makeOwnerUsageArray]
              },
              {
                data: [...makeComparerUsageArray],
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#CCC",
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(237,85,101, ${opacity})`,
                strokeWidth: 2,
                barPercentage: 0.5
              }
            ]
          };
          makeComparerUsageArray = [];
          makeLanguageArray = [];
          makeOwnerUsageArray = [];

          return (
            <View style={{ flex: 1, marginTop: 10 }}>
              <LineChart
                data={datas}
                width={screenWidth}
                height={300}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                style={{ borderRadius: 10, elevation: 5 }}
              />
            </View>
          );
        } else {
          makeLanguageArray.push(language);
          makeOwnerUsageArray.push(ownerUsage[count]);
          makeComparerUsageArray.push(comparerUsage[count]);
        }
      });
      //console.log("graphing for index 0")


      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              borderRadius: 10,
              marginLeft: -7,
              marginRight: -7,
              padding: 5,
              elevation: 5,
              backgroundColor: "#00b5ec"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "bold",
                marginLeft: 30,
                marginTop: 10,
                color: "white"
              }}
            >
              Language Usage Percentage Comparison
            </Text>
            <Text />
          </View>
          <ScrollView>
            {graphs}
            <Text />
          </ScrollView>
        </View>
      );
    }
    else if (index === 1) {

      let graphs1 = languages.map(language => {
        count += 1;
        if (count !== 0 && count % 8 === 0) {
          let datas = {
            labels: [...makeLanguageArray],
            datasets: [
              {
                data: [...makeOwnerUsageArray]
              },
              {
                data: [...makeComparerUsageArray],
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#CCC",
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(237,85,101, ${opacity})`,
                strokeWidth: 2,
                barPercentage: 0.5
              }
            ]
          };
          // console.log('started')
          // console.log(datas.datasets.data);
          // console.log('finished')

          makeComparerUsageArray = [];
          makeLanguageArray = [];
          makeOwnerUsageArray = [];

          return (
            <View style={{ flex: 1, marginTop: 10 }}>
              <LineChart
                data={datas}
                width={screenWidth}
                height={300}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                style={{ borderRadius: 10, elevation: 5 }}
              />

              <Text />
            </View>
          );
        } else if (count === languages.length) {
          let datas = {
            labels: [...makeLanguageArray],
            datasets: [
              {
                data: [...makeOwnerUsageArray]
              },
              {
                data: [...makeComparerUsageArray],
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#CCC",
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(237,85,101, ${opacity})`,
                strokeWidth: 2,
                barPercentage: 0.5
              }
            ]
          };
          // console.log('started')
          // console.log(datas.datasets.data);
          // console.log('finished')

          makeComparerUsageArray = [];
          makeLanguageArray = [];
          makeOwnerUsageArray = [];

          return (
            <View style={{ flex: 1, marginTop: 10 }}>
              <LineChart
                data={datas}
                width={screenWidth}
                height={300}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                style={{ borderRadius: 10, elevation: 5 }}
              />
            </View>
          );
        } else {
          makeLanguageArray.push(language);
          makeOwnerUsageArray.push(ownerCount[count]);
          makeComparerUsageArray.push(comparerCount[count]);
        }
      });
      //console.log("graphing for index 1")


      //console.log(graphs11)
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              borderRadius: 10,
              marginLeft: -7,
              marginRight: -7,
              padding: 5,
              elevation: 5,
              backgroundColor: "#00b5ec"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "bold",
                marginLeft: 30,
                marginTop: 10,
                color: "white"
              }}
            >
              Language Usage Count Comparison
            </Text>
            <Text />
          </View>
          <ScrollView>
            {graphs1}
            <Text />
          </ScrollView>
        </View>
      );
    } else if (index === 2) {
      let repos = this.state.userRepos;
      let repos1 = this.state.userRepos1;

      let userArray = [];
      let comparerArray = [];

      let xAxis = [
        "Total Repos",
        "Forks Count",
        "Watchers Count",
        "Forked Repos",
        "Self Repos"
      ];

      userArray.push(Object.keys(repos).length);
      comparerArray.push(Object.keys(repos1).length);
      let forks = 0;
      let watchers = 0;
      let isForked = 0;
      let open_issues = 0;

      let forks1 = 0;
      let watchers1 = 0;
      let isForked1 = 0;
      let open_issues1 = 0;

      for (let i in repos) {
        // console.log(i);
        forks += repos[i]["forks_count"];
        watchers += repos[i]["watchers_count"] - 1;
        isForked += repos[i]["fork"] === true ? 1 : 0;
        open_issues += repos[i]["open_issues_count"];
      }

      for (let i in repos1) {
        forks1 += repos1[i]["forks_count"];
        watchers1 += repos1[i]["watchers_count"] - 1;
        isForked1 += repos1[i]["fork"] === true ? 1 : 0;
        open_issues1 += repos1[i]["open_issues_count"];
      }

      userArray.push(forks);
      userArray.push(watchers);
      userArray.push(isForked);
      userArray.push(userArray[0] - isForked);

      comparerArray.push(forks1);
      comparerArray.push(watchers1);
      comparerArray.push(isForked1);
      comparerArray.push(comparerArray[0] - isForked1);

      let datas = {
        labels: [...xAxis],
        datasets: [
          {
            data: [...userArray]
          },
          {
            data: [...comparerArray],
            backgroundGradientFrom: "#1E2923",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#CCC",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(237,85,101, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5
          }
        ]
      };

      // console.log(userArray);
      // console.log(comparerArray);
      // console.log("graphing")
      // console.log(graphs1)
      // console.log("graphing for index 2")
      // console.log(datas);
      // let graphs111 = datas.filter(obj =>{
      //   return obj!=undefined
      // })
      // console.log(graphs111)
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              borderRadius: 10,
              marginLeft: -7,
              marginRight: -7,
              padding: 5,
              elevation: 5,
              backgroundColor: "#00b5ec"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontStyle: "italic",
                fontWeight: "bold",
                marginLeft: 100,
                marginTop: 10,
                color: "white"
              }}
            >
              General Comparison
            </Text>
            <Text />
          </View>
          <ScrollView>
            <View style={{ flex: 1, marginTop: 10 }}>
              <LineChart
                data={datas}
                width={screenWidth - 15}
                height={335}
                verticalLabelRotation={30}
                chartConfig={chartConfig}
                withInnerLines={false}
                withOuterLines={false}
                bezier
                style={{ borderRadius: 10, elevation: 5 }}
              />
            </View>
            <Text />
          </ScrollView>
        </View>
      );
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="Comparison"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      this.state.git_img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />

          <ActivityIndicator
            animating={true}
            size="large"
            style={styles.loader}
            hidesWhenStopped
            color={Colors.blue800}
          />
          <Text
            style={{
              color: "blue",
              top: "42%",
              padding: 10,
              elevation: 5,
              textAlign: "center"
            }}
          >
            {this.state.activity_text}
          </Text>
        </View>
      );
    } else if (this.state.showCard) {
      return (
        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="View Repo"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      this.state.git_img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                flex: 0.6,
                marginTop: 150,
                marginLeft: 20,
                marginRight: 20
              }}
            >
              <Card
                style={{
                  elevation: 15,
                  borderRadius: 10,
                  padding: 10,
                  borderColor: "black",
                  borderSize: 2,
                  shadowOffset: 5,
                  shadowColor: "black"
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <CardTitle title="Select A Person To Compare Your Profile With" />
                  <Icon
                    size={20}
                    name="ios-git-network"
                    style={{ marginRight: 20, marginTop: 22 }}
                  />
                </View>
                <CardContent text="Go To Your Followers / Following Page And Choose One To Compare Your Profile With" />

                <CardAction
                  seperator={true}
                  inColumn={false}
                  style={{ marginTop: 20, marginLeft: 40 }}
                >
                  <CardButton
                    onPress={() => {
                      this.goToFollowers();
                    }}
                    title="Followers"
                    color="blue"
                  />

                  <CardButton
                    onPress={() => {
                      this.goToFollowing();
                    }}
                    title="Following"
                    color="blue"
                  />
                </CardAction>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      const screenWidth = Dimensions.get("window").width;
      console.log("preparing to show comparison")
      return (
        <View style={{ flex: 1 }}>
          <DropdownAlert
            ref={ref => (this.dropDownAlertRef = ref)}
            closeInterval={this.state.closeInterval}
            elevation={20}
          />
          <ClassicHeader
            headerTitle="View Repo"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon size={30} name="md-menu" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity onPress={() => {}}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    marginRight: 10
                  }}
                  source={{
                    uri:
                      this.state.git_img_url
                  }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />
          <ScrollView

            refreshControl={
              <RefreshControl

                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
        <View>
        <Carousel
          layout={"default"}
          layoutCardOffset={18}
          ref={c => {
            this._carousel = c;
          }}
          data={[
            {
              index: 0,
              data: "1"
            },
            {
              index: 1,
              data: "2"
            },
            {
              index: 2,
              data: "3"
            }
          ]}
          renderItem={this._renderItem}
          sliderWidth={screenWidth}
          itemWidth={screenWidth}
          useScrollView={true}
        />

        </View>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    top: "40%"
  }
});
