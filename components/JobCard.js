import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  AsyncStorage,
  WebView
} from 'react-native';
import axios from 'axios'; 
import { Permissions, Notifications } from 'expo';
import sendPushNotification from './sendPushNotification';
import {getPushNotificationData} from '../constants/constant';

class JobCard extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      modalVisible: false,
      bookingId: props.navigation.getParam('bookingId'),
      expoToken: props.navigation.getParam('expoToken'),
      customerToken: null,
      customerExpoToken: null,
      dataJobcard : [],
      totalAmount : null
    }
  }
  

  static navigationOptions = ({ navigation }) => ({
    headerTintColor: '#fff',
    headerTitle: (
      <View style={{justifyContent: 'center',
        alignItems: 'center',}}>
        <Text
          style={{
            fontSize: 20,
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Approve Job Card
        </Text>
      </View>
  ),
    headerStyle: {
      backgroundColor: '#015b63',
    },
  });

  // To get the details of Customer Token
  componentWillMount() {
    this.getJobCardDetails();
    this.generatePushToken();
    AsyncStorage.getItem("customerToken").then((token)=>{
      this.setState({
        customerToken : token
      })
    }) 
  }

  /*
  * To get the Details for the jobcard 
  */
 getJobCardDetails = () => {
  AsyncStorage.getItem("customerToken").then((token)=>{
    this.setState({
      customerToken : token
    }, () => {
      this.showJobcard();
    })
  })
 }

 /*
 * To display the Jobcard Data
 */

showJobcard = () => {
const URL = "https://dev.driveza.space/v1/users/job-card?token=" + this.state.customerToken + "&bookingId=" + this.state.bookingId;
axios.get(URL).then((response) => {
  this.setState({
    dataJobcard : response.data.data,
    totalAmount : response.data.total
  }, () => {
alert(JSON.stringify(this.state.dataJobcard))
  });
}).catch((response) => {
  alert('In Catch' + (response))
  console.log(response)
  });
}



  // Generating then Push Token 
  generatePushToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return;
    }
  
    //  Get the token that uniquely identifies this device
    this.setState({
      customerExpoToken : await Notifications.getExpoPushTokenAsync()
    })
  }

transactionStatus = (status) => {
  if(status.title === "PAYMENT_RESPONSE") {
    this.setState({
      modalVisible: false
    },() => {
      // Do ajax call for transaction status check
      this.updateStatusPayment(6);
    })
  }
}

// To Update the Status Value
updateStatusPayment= (statusCode) => {
  axios.post("https://dev.driveza.space/v1/users/update-booking-status",{
      token: this.state.customerToken,
      bookingId: this.state.bookingId,
      statusId: statusCode
      }).then(() => {
        alert('Status Update hoga')
      this.pushTokenToMerchant(statusCode);
      this.pushTokenToCustomer();
      this.props.navigation.goBack();
  }).catch((response) => {
      alert('In Catch Enter' + (response))
  });
}

pushTokenToMerchant = (statusCode) => {
  sendPushNotification(getPushNotificationData(statusCode,{token : this.state.expoToken, bookingId : this.state.bookingId}))
}

pushTokenToCustomer = () => {
  let data = {
    token: this.state.customerExpoToken,
    title: "Payment Done",
    body: "Amount Rs: "+ this.state.totalAmount +" is done",
    data : {
      "bookingStatusFlag": true,
      "bookingId": this.state.bookingId,
      "bookingStatusValue": 6
    }
  }
  sendPushNotification(data);
}

transactionStatusCheck = () => {
  if(true) {

  }
}



// Payment Checkout
checkout = () => {
  // alert(this.state.bookingId);
  // this.getOrderId();
  const payAsCash = this.props.navigation.getParam('updateByCash');
  payAsCash();
  this.props.navigation.goBack(null);
  ///
} 

// To get the Order ID for the Transaction
getOrderId = () => {
const URL = 'https://dev.driveza.space/v1/users/init-payment?token=' + this.state.customerToken + '&bookingId=' + this.state.bookingId
  axios.get(URL).then((response) => {
    // alert(response.data.orderId)    
    this.setState({
      webViewUrl: "https://static.driveza.space?id="+response.data.orderId
    },() => {
      this.openPaytmPage();
    })
  }).catch((response) => {
    alert('In Catch Error' + (response))
  });
}

openPaytmPage = () => {
  this.setState({
    modalVisible: true
  })
}

  render() {
    return (
      <ScrollView style={{padding:10,marginTop: 22}}>
      <View style={{width:"100%",flexDirection:'row',padding:20}}>
              <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Services Name</Text></View>
              <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Qty</Text></View>
              <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Amount</Text></View>
      </View>
      {
        this.state.dataJobcard.map((service, index) => {
          return(
            <View key = {index} style={{width:"100%",borderColor:"#E5E5E5",borderWidth:1,flexDirection:'row',padding:10}}>
                  <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>{service.serviceName}</Text></View>
                  <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>{service.quantity}</Text></View>
                  <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>{service.amount}</Text></View>
            </View>
          )
        })
      }
      <View style={{width:"100%",flexDirection:'row',padding:20}}>
              <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Total Amount</Text></View>
              <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>:</Text></View>
              <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Rs {this.state.totalAmount}</Text></View>
      </View>
      <View style={{alignItems: 'center',justifyContent: 'center',marginTop: 10}}>
          <TouchableOpacity onPress={() => {
						this.checkout();
					}}>
          <View style={{padding: 15,marginBottom:10,alignItems: 'center',borderRadius: 5,backgroundColor: '#015b63'}}>
              <Text style={{backgroundColor: 'transparent',fontSize:15,color: '#fff',width: 200,height: 20,textAlign: 'center'}}>
              Pay For Services
              </Text>
          </View>
          </TouchableOpacity>
      </View>
      <Modal visible={this.state.modalVisible} onRequestClose={() => this.setState({modalVisible: false})}>
          <WebView 
            source={{uri: this.state.webViewUrl}}
            onNavigationStateChange={data => this.transactionStatus(data)}
          />
      </Modal>
  </ScrollView>
    );
  }
}

export default JobCard;