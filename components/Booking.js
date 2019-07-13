import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from '../components/CustomIcon';
import axios from 'axios';
import BookingDetails from './BookingDetails'
import {} from '../constants/constant';
import { Notifications } from 'expo';


class Booking extends Component {
  constructor(props){
    super(props);
    this.state={
      modalVisible: false,
      showLoader: true,
      listBookings:[],
      customerToken:null,
      currentBookingData: {},
      animating: true,
      refreshing : false
    }
    
  }
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
     <TouchableOpacity
        activeOpacity={1}
        style={{ width: 57, height: 57 }}
        onPress={() => navigation.goBack(null)}>
        <View
          style={{
            marginLeft: 12,
            height: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            size={25}
            name="back"
            color="#ffffff"
          />
        </View>
      </TouchableOpacity>
    ),

    headerTitle: (
        <View style={{justifyContent: 'center',
          alignItems: 'center',}}>
          <Text
            style={{
              fontSize: 20,
              color: 'red',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            My Booking
          </Text>
        </View>
    ),
    headerStyle: {
      backgroundColor: '#015b63',
    },
  });

  setModalVisible(visible, booking) {
    this.setState({
      modalVisible: visible,
      currentBookingData : booking
    });
  }
  bookingDetails=(booking)=>{
    if(booking.bookingStatus==-1 || booking.bookingStatus==7){
      this.setModalVisible(true, booking);
    }else{
      this.props.navigation.navigate('NewStatusBarScreen', {bookingId : booking.bookingId, expoToken: booking.partnerPushToken, singleComponentFlag : false});
    }
  }

componentDidMount = () => {
  this._notificationSubscription = Notifications.addListener(this.recieveNotification);
}

recieveNotification = () => {
  this.getDataPreviousBooking(this.state.customerToken)
}

componentWillMount() {
  AsyncStorage.getItem("customerToken").then((token)=>{
    this.setState({
      customerToken : token
    }, () => {
      this.getDataPreviousBooking(this.state.customerToken);
    })
  }) 
}



// To get the details of the Previous Bookings 
getDataPreviousBooking(customerToken){
  const URL = 'https://dev.driveza.space/v1/users/bookings?token=' + customerToken;
    axios.get(URL).then((response) => {
        this.setState({
          listBookings : response.data,
          refreshing : false 
        }, () => {
          console.log(JSON.stringify(customerToken));
          this.setState({
            showLoader:false
          })
        });    
    }).catch((response) => {
        // alert("Something Went Wrong")
        this.setAnimatingToFalse();
        console.log(response)
        });
}

setAnimatingToFalse = () => {
  this.setState({
    animating: false 
  })
}

// To Refresh the Component
_onRefresh = () => {
  let reactNativeInstance = this;
  this.setState({
    refreshing : true
  }, () => {
    this.getDataPreviousBooking(this.state.customerToken);
  })
}

  render() {
    if(!this.state.showLoader) {
      return (
        <React.Fragment>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}><ScrollView>
              <View style={{height:52,width:"100%",backgroundColor:"#015b63",padding:10,flexDirection:"row"}}>
              <TouchableOpacity onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
                }}>
                  <Icon
                  size={25}
                  name="back"
                   color="#ffffff"
                />
              </TouchableOpacity>
              <View style={{alignItems:"center",width:"100%",justifyContent:"center"}}>
                <Text style={{color:"#ffffff",fontSize:18,fontWeight:"bold"}}>Booking Details</Text>
              </View>
            </View>
                <BookingDetails currentBookingData = {this.state.currentBookingData}/>
           </ScrollView>
          </Modal>
        <ScrollView 
        refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          />
        }
        style={{backgroundColor:"#f8f8f8"}}>
          {
            this.state.listBookings.map((booking, index) => {
            return (
          <View key={index}> 
          <TouchableOpacity style={{backgroundColor:"#fff",marginTop:10}} onPress={() => this.bookingDetails(booking)}>        
            <View style={{flexDirection:"row",marginTop:10}}>
              <View style={{width:"60%",flexDirection:"row",paddingLeft:10}}>
                <Icon
                size={22}
                name="store"
               color="#015b63"
                />
              <View style={{marginLeft:12}}>
                  <Text style={{
                  fontSize:17,color:"#000000"
                  }}>{booking.shopName}
                  </Text>
              </View>        
            </View>
            <View style={{width:"40%",alignItems:"flex-end",paddingRight:10}}>
              <Text style=
              {{
               fontSize:13,
               color:"#5d5d59"
              }}>{(booking.dateTime)}
              </Text>
            </View>
            </View>
            <View style={{marginLeft:40,flexDirection:"row"}}>
            <View><Text style={{color:"#5d5b59", fontSize:15,marginTop:15}}>Booking ID : </Text></View>
            <Text style={{color:"#5d5b59", fontSize:15,marginTop:15}}>{booking.bookingId}</Text></View>
            <View style={{flexDirection:"row",marginTop:20,marginBottom:15}}>
              <View style={{width:"60%",flexDirection:"row"}}>
            <View style={{marginLeft:40}}>
            <Text style={{
              fontSize:13,color:"#5d5d59"
            }}>{booking.vehicle}</Text></View>        
            </View>
              <View style={{width:"40%",alignItems:"flex-end",paddingRight:10}}>
              <Text style={{color:booking.bookingStatus !== -1?(booking.bookingStatus === 7 ? 'green' : 'orange') : 'red'}}>
              {booking.bookingStatus !== -1 ? (booking.bookingStatus === 7 ? 'COMPLETED' : 'ONGOING') : 'CANCELLED '}</Text>
              </View>
            </View>
          </TouchableOpacity>
          </View>
          )
            })
          }
        </ScrollView>
        </React.Fragment>
        );
    } else {
      return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator animating = {this.state.animating} size="large" color="#015b63" />
      {!this.state.animating?<Text>No Bookings Present</Text>:null}
      </View>
      )
  }
  }
}

const styles = StyleSheet.create({
 sortStyle:{
  justifyContent: 'center',
  marginTop: 20,
  marginLeft:10,
  width:100,
  height:35,
  borderColor:"#dbdbdb",
  flexDirection:"row",
  borderWidth : 1,
  backgroundColor: '#ffffff',
  },
  filterStyle:{
  padding:10,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 20,
  width:100,
  borderColor:"#dbdbdb",
  height:35,
  flexDirection:"row",
  marginRight:10,
  borderWidth : 1,
  backgroundColor: '#ffffff',
  },
 
  textStyle: {
    fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
  },
  buttonStyle: {
    padding:10,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 20,
      marginTop: 20,
      marginRight: 20,
      width:300,
      backgroundColor: '#015b63',
    borderRadius:5
  }
});


export default Booking;
