import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Text,
  View,
  TextInput,
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
  FlatList,
  Dimensions,
  DrawerActions,
  ProgressBarAndroid,
  findNodeHandle
} from "react-native";
import Drawer from "react-native-drawer";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import moment from "moment";
import {
  ClassicHeader,
  AppleHeader,
  ModernHeader
} from "@freakycoder/react-native-header-view";
import HTML from "react-native-render-html";

export default class PrivacyPolicies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      access_token: null,
      user: null,
      img_url:
        "https://image.shutterstock.com/image-illustration/photo-silhouette-male-profile-white-260nw-1018631086.jpg",
      activity_text: "Still Under Development!!\nStay Tuned"
    };
  }

  componentDidMount() {
    console.log("Inside componentDidMount of PrivacyPolicies");
    console.log(this.props.screenProps.img_url);
    this.setState({
      access_token: this.props.screenProps.access_token,
      user: this.props.screenProps.user,
      img_url: this.props.screenProps.img_url
    });
    //this.setState({access_token:this.props.screenProps.access_token, user:this.props.screenProps.user})
  }

  static navigationOptions = {
    drawerLabel: "PrivacyPolicies",
    drawerIcon: () => <Icon size={25} name="shield-lock" />,
    tapToClose: "true"
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
            headerTitle="Privacy Policy"
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon
                  size={30}
                  name="keyboard-backspace"
                  style={{ marginLeft: 10, marginTop: 3 }}
                />
              </TouchableOpacity>
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Icon
                  size={30}
                  name="shield-lock-outline"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            }
            height={60}
            statusBarHidden={true}
          />

          <ScrollView>
            <HTML
              html={policyHtml}
              imagesMaxWidth={Dimensions.get("window").width}
            />
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>I'm the PrivacyPolicies component</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.screenProps.rootNav.navigate("Login1", {
                screenProps1: this.props.screenProps.rootNav
              });
            }}
          >
            <Icon
              name="ios-add"
              size={100}
              style={{ marginTop: 250, marginLeft: 180 }}
            />
          </TouchableOpacity>
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

const policyHtml = `
<div class="container privacy mb-xlg" style="margin-left:10px;">
<p>This privacy policy has been compiled to better serve those who are concerned with how their 'Personally
identifiable information' (PII) is being used online. PII, as used in US privacy law and information security,
is information that can be used on its own or with other information to identify, contact, or locate a single
person, or to identify an individual in context. Please read our privacy policy carefully to get a clear
understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in
accordance with our website.</p>
<h4>What personal information do we collect from the people that visit our blog, website or app?</h4>
<p>We do not collect information from visitors of our site.
or other details to help you with your experience.</p>
<h4>When do we collect information?</h4>
<p>We collect information from you when you subscribe to a newsletter, fill out a form or enter information on our
site.
Provide us with feedback on our products or services </p>
<h4>How do we use your information?</h4>
<p>We may use the information we collect from you when you register, make a purchase, sign up for our newsletter,
respond to a survey or marketing communication, surf the website, or use certain other site features in the
following ways:</p>
<ul>
<li>
To improve our website in order to better serve you.
</li>
<li>
To allow us to better service you in responding to your customer service requests.
</li>
<li>
To ask for ratings and reviews of services or products
</li>
<li>
To follow up with them after correspondence (live chat, email or phone inquiries)
</li>
</ul>
<h4>How do we protect visitor information?</h4>
<p>
Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your
visit to our site as safe as possible.
We use regular Malware Scanning.
Your personal information is contained behind secured networks and is only accessible by a limited number of
persons who have special access rights to such systems, and are required to keep the information confidential.
In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
We implement a variety of security measures when a user enters, submits, or accesses their information to
maintain the safety of your personal information.
All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>
<h4>Do we use 'cookies'?</h4>
<p>We do not use cookies for tracking purposes
You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off
all cookies. You do this through your browser (like Internet Explorer) settings. Each browser is a little
different, so look at your browser's Help menu to learn the correct way to modify your cookies.
If you disable cookies off, some features will be disabled that make your site experience more efficient and
some of our services will not function properly.
However, you can still place orders .</p>
<h4>Third-party disclosure</h4>
<p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.</p>
<h4>Third-party links</h4>
<p>
We do not include or offer third-party products or services on our website.</p>
<h4>Google</h4>
<p>Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to
provide a positive experience for users. https://support.google.com/adwordspolicy/answer/1316548?hl=en
We have not enabled Google AdSense on our site but we may do so in the future.</p>
<h4>California Online Privacy Protection Act</h4>
<p>
CalOPPA is the first state law in the nation to require commercial websites and online services to post a
privacy policy. The law's reach stretches well beyond California to require a person or company in the United
States (and conceivably the world) that operates websites collecting personally identifiable information from
California consumers to post a conspicuous privacy policy on its website stating exactly the information being
collected and those individuals with whom it is being shared, and to comply with this policy. - See more at:
http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</p>
<h4>According to CalOPPA we agree to the following:</h4>
<p>Users can visit our site anonymously.
Once this privacy policy is created, we will add a link to it on our home page or as a minimum on the first
significant page after entering our website.
Our Privacy Policy link includes the word 'Privacy' and can be easily be found on the page specified above.
Users will be notified of any privacy policy changes:
• On our Privacy Policy Page
Users are able to change their personal information:
• By emailing us</p>
<h4>How does our site handle do not track signals?</h4>
<p>We honor do not track signals and do not track, plant cookies, or use advertising when a Do Not Track (DNT)
browser mechanism is in place.</p>
<h4>Does our site allow third-party behavioral tracking?</h4>
<p>It's also important to note that we do not allow third-party behavioral tracking</p>
<h4>COPPA (Children Online Privacy Protection Act)</h4>
<p>When it comes to the collection of personal information from children under 13, the Children's Online Privacy
Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the nation's consumer protection
agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to
protect children's privacy and safety online.
We do not specifically market to children under 13.</p>
<h4>Fair Information Practices</h4>
<p>
The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts
they include have played a significant role in the development of data protection laws around the globe.
Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply
with the various privacy laws that protect personal information.</p>
<h4>In order to be in line with Fair Information Practices we will take the following responsive action, should a
data breach occur:</h4>
<p>We will notify the users via in-site notification within 7 business days
<br>
We also agree to the Individual Redress Principle, which requires that individuals have a right to pursue
legally enforceable rights against data collectors and processors who fail to adhere to the law. This principle
requires not only that individuals have enforceable rights against data users, but also that individuals have
recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.</p>
</div>
`;
