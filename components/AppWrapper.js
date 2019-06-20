import React from 'react';
import {View,Text, Dimensions, ScrollView, SafeAreaView,AsyncStorage,TouchableOpacity,ImageBackground} from 'react-native';
import {createDrawerNavigator, DrawerItems, createAppContainer } from 'react-navigation';
import Icon from '../components/CustomIcon';
import { connect } from 'react-redux';
import { loginCheckAction } from '../actions/index';

const { width } = Dimensions.get('window');
let removeRoute = "Booking";
let removeRouteAlways = "StatusBar";
let customerName = null,customerPhone = null, customerEmail = null;

//components or containers
import Test from './test';
import StatusBar from "./StatusBar";
import BookingNavigator from '../navigations/BookingNavigatorContainer';
import AppNavigator from '../navigations/AppNavigatorContainer';
import AuthNavigator from '../navigations/AuthNavigatorContainer';
import KnowYourServices from '../navigations/KnowYourServicesContainer.js';
import OffersPage from '../navigations/OffersContainer.js';

class AppWrapper extends React.Component {
  constructor(){
    super();
  }
  componentWillMount(){
    this.checkToken();
  }
  checkToken=()=>{
		AsyncStorage.getItem("customerToken").then((token)=>{
      if(token) {
        this.props.loginCheckAction(true);
        this.setCustomerDetails();
      }
    })
  }
 
  setCustomerDetails = () => {
    AsyncStorage.getItem("customerName").then(value => {
      if(value)
      customerName = value.substring(0, 2).toUpperCase();
    })
    AsyncStorage.getItem("customerPhone").then(value => {
      if(value)
      customerPhone = value;
    })
    AsyncStorage.getItem("customerEmail").then(value => {
      if(value)
      customerEmail = value;
    })
  }
  
  componentDidUpdate () {
    if(this.props.LoginCheck.flagValue) {
      removeRoute = "Login";
      this.setCustomerDetails();
    }else{
      removeRoute = "Booking"; 
      customerName = null;
      customerEmail = null;
      customerPhone = null;
    }
  }

  render() {
    return (
      <AppContainer />
    );
  }
}

const customDrawerContentComponent=(props)=>{
  const { items, ...rest } = props;
  let filteredItems = items.filter(item => item.key !== removeRoute);
  filteredItems = filteredItems.filter(item => item.key !== removeRouteAlways);
  profileSectionNavigation=()=>{
    AsyncStorage.getItem("customerToken").then((token)=>{
      if(token) {
        props.navigation.navigate("ProfileSectionScreen");
      }else{
        props.navigation.navigate("PhoneNumberScreen");
      }
      props.navigation.closeDrawer();
    })
  }
  return (
    <React.Fragment>
    <TouchableOpacity style={{width: "100%",height: 200, alignItems:"center",justifyContent:"center"}} onPress={()=>this.profileSectionNavigation()}>
      <View style={{width: "100%",height:"100%",alignItems:"center",justifyContent:"center"}}>
     <ImageBackground source={require("../assets/hamburgerImages/hamburger.jpeg")}
     style={{alignItems:"center",justifyContent:"center",width:"100%",height:"100%"}}
     ><View style={{alignItems:"center",justifyContent:"center",width:70,height:70,backgroundColor:"#ffffff",marginBottom:20,borderRadius: 10,marginTop:25}}>
     <Text style={{fontSize: 36}}>{customerName}</Text>
   </View>
   <Text style={{color:"#ffffff",fontSize:17}}>{customerPhone? customerPhone : "Not Signed Yet"}</Text>
   <Text style={{color:"red",fontSize:17}}>{customerEmail? customerEmail: null}</Text>
     </ImageBackground>
      </View>
    </TouchableOpacity>
    <ScrollView>
      <SafeAreaView style={{flex:1}} forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems items={filteredItems} {...rest} itemStyle={{borderColor: '#dcdcdc',borderBottomWidth:1, marginTop: 5,marginBottom: 5, marginLeft: 15, marginRight: 15}}/>
      </SafeAreaView>
    </ScrollView>
  </React.Fragment>
  )
}

const DrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppNavigator,
    navigationOptions: () => ({
      drawerLabel: 'Home  ',
      drawerIcon : ({tintColor}) => (
       <Icon name="home" size={22} color="#000000" />
      )
    })
  },
  Login : {
    screen : AuthNavigator,
    navigationOptions: () => ({
      drawerLabel: ' Login / SignUp   ',  
      drawerIcon : ({tintColor}) => (
        <Icon name="user-circle" size={22} color="#000000" />
      )
    })
  },
  Booking : {
    screen : BookingNavigator,
    navigationOptions: () => ({
      drawerLabel: 'My Booking  ',
      drawerIcon : ({tintColor}) => (
        <Icon name="booking" size={22} color="#000000" />
      )
    })
  },
  knowServices : {
    screen : KnowYourServices,
    navigationOptions: () => ({
      drawerLabel: 'Know Services     ',
      drawerIcon : ({tintColor}) => (
        <Icon name="know service" size={22} color="#000000" />
      )
    })
  },
  offers : {
    screen : OffersPage,
    navigationOptions: () => ({
      drawerLabel: 'Offers  ',
      drawerIcon : ({tintColor}) => (
        <Icon name="offers" size={22} color="#000000" />
      )
    })
  },
  refer : {
    screen : Test,
    navigationOptions: () => ({
      drawerLabel: 'Refer & Earn  ',
      drawerIcon : ({tintColor}) => (
        <View><Icon name="refer-earn" size={22} color="#000000" /></View>
      )
    })
  },
  support : {
    screen : Test,
    navigationOptions: () => ({
      drawerLabel: 'Support  ',
      drawerIcon : ({tintColor}) => (
        <Icon name="support" size={22} color="#000000" />
      )
    })
  },
  About : {
    screen : Test,
    navigationOptions: () => ({
      drawerLabel: 'About  ',
      drawerIcon : ({tintColor}) => (
        <Icon name="mobile-number" size={22} color="#000000" />
      )
    })
  },
  StatusBar : {
    screen : StatusBar,
    navigationOptions: () => ({
      drawerLabel: null
    })
  }
},{
  contentComponent: customDrawerContentComponent,
  contentOptions : {
    activeTintColor: '#15737c',
    activeBackgroundColor: '#dcdcdc'
  },
  drawerWidth: width*0.70,
  drawerOpenRoute:'DrawerOpen',
  drawerCloseRoute:'DrawerClose',
  drawerToggleRoute:'DrawerToggle',
});

const AppContainer = createAppContainer(DrawerNavigator);

const mapStateToProps = (state) => ({
  LoginCheck: state.LoginCheck
});

const mapDispatchToProps= (dispatch) => ({
  loginCheckAction: (flag) => dispatch(loginCheckAction(flag))
})

export default connect(mapStateToProps,mapDispatchToProps)(AppWrapper);