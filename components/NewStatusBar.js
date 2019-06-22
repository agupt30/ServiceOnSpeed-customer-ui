import React, { Component } from 'react'
import { StyleSheet,ScrollView,Text,View,TouchableOpacity,Animated,AsyncStorage,Alert,ActivityIndicator} from 'react-native'
import Icon from './CustomIcon';
import { Notifications } from 'expo';
import axios from 'axios';
import sendPushNotification from './sendPushNotification';
import {getPushNotificationData} from '../constants/constant';

const scrollViewLeftRight = 20, tickImageSize = 40, sectionHeight = 160, verticleLineWidth = 6, tickImageBox = tickImageSize+20, verticleLineLeft = (tickImageBox - verticleLineWidth)/2, heightTopHide = (sectionHeight - tickImageSize)/2,heightTopLeft = verticleLineLeft;
export default class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.state={
            counter:0,
            customerToken: null,
            bookingId: props.navigation.getParam('bookingId'),
            expoToken: props.navigation.getParam('expoToken'),
            showLoader: true,
        }
    }

    static navigationOptions = ({ navigation }) => ({
          headerTitle: (
            <View style={{width:"80%"}}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}>
               Booking Status
              </Text>
            </View>
          ),
    	headerTintColor: '#fff',
    	headerStyle: {
      		backgroundColor: '#015b63',
    	},
    });

    componentWillMount(){
        alert(this.state.expoToken);
        AsyncStorage.getItem("customerToken").then((token)=>{
            if(token) {
             this.setState({
                customerToken : token
             }, () => {
                this.getBookingStatus();
             })
            }
          })
    }

    // To check for the Push Notification
    componentDidMount(){
        this._notificationSubscription = Notifications.addListener(this.recieveNotification);
    }

        // For getting Notification
    recieveNotification = (notification) => {
        if(notification.origin === 'received' && notification.data.bookingId === this.state.bookingId){
            this.setState({
                counter: notification.data.bookingStatusValue
            });
        }
    
    }

    // To get the Status of the Current Booking
    getBookingStatus= () => {
        const URL = 'https://dev.driveza.space/v1/users/booking-status?token='
        +this.state.customerToken+'&bookingId='+this.state.bookingId
        axios.get(URL).then((response) => {
            this.setState({
                counter:response.data.bookingStatus,
            }, () => {
                this.setState({
                    showLoader:false
                })
            })
          }).catch((response) => {
              alert('In Catch' + (response))
          });
        }

    // To update the Request for Vehicle Pick Up
    updateStatusPickedUp= (statusCode) => {
        axios.post("https://dev.driveza.space/v1/users/update-booking-status",{
            token: this.state.customerToken,
            bookingId: this.state.bookingId,
            statusId: statusCode
            }).then((response) => {
             this.UpdateValue();
             sendPushNotification(getPushNotificationData(statusCode,{token : this.state.expoToken, bookingId : this.state.bookingId}))
        }).catch((response) => {
            alert('In Catch Enter' + (response))
        });
    }

    // To get the Details of the Job Card
    getJobcardDetails = () =>{
        this.props.navigation.navigate("JobCardScreen",{bookingId: this.state.bookingId, expoToken: this.state.expoToken});
    }  
   
    // Increament for the Counter Value
    UpdateValue=()=>{
        this.setState({
            counter: this.state.counter+1
        }, () => {
            alert(this.state.counter)
        })
    }

    // Cancelling the Booking
    UpdateValueCancel=()=>{
        this.setState({
            counter: -1
        })
    }

    render(){
        if(!this.state.showLoader) {
        return(
            <ScrollView style={{paddingRight:scrollViewLeftRight,paddingLeft:scrollViewLeftRight/2}}>
                <View style={styles.hideTopLines}></View>
                <View style={styles.hideBottomLines}></View>
                <View style={styles.trackerBox}>
                    <View style={styles.verticleLine}></View>
                    <View style={styles.greenTickBox}>
                        <View style={styles.greenTickImageBox}>
                        {this.state.counter>=1?<Icon size={40} name="checked-tick" color="#ffffff"/>:null}
                        </View>
                    </View>
                    <View style={styles.trackerDetailsContainer}>
                        <View style={styles.trackerDetails}>
                        <View>
                            <Text style = {styles.textContent}>
                            {
                                this.state.counter===0? 
                                "Awaiting Confirmation" :
                                this.state.counter === -1 ? "Booking Cancelled" : "Booking Confirmed"
                            }
                            </Text>   
                        </View>
                        </View>
                    </View>
                </View>
                <View style={styles.trackerBox}>
                    <View style={styles.verticleLine}></View>
                    <View style={styles.greenTickBox}>
                        <View style={styles.greenTickImageBox}>
                        {this.state.counter>=1?<Icon size={40} name="checked-tick" color="#ffffff"/>:null}
                        </View>
                    </View>
                    <View style={styles.trackerDetailsContainer}>
                        <View style={styles.trackerDetails}>
                            <View>
                                <Text style = {styles.textContent}>
                                {
                                    this.state.counter ===1? 
                                    "Serviceman is scheduled to pickup at 5:30AM, 23Sept,19" :
                                    (this.state.counter === 2 ? "Service Man on the Way" : "")
                                 }
                                {   this.state.counter >=3 ?  "Picked Up" :  null  
                                }   
                                </Text>
                            </View>
                            {this.state.counter===2?
                            <TouchableOpacity style={{width:120,height:30,backgroundColor:"#158590",borderRadius:5,alignItems:"center",justifyContent:"center",padding:5, marginTop:10}} onPress={() => this.updateStatusPickedUp(3)}>
                            <Text style={{color:"#ffffff"}}>Pickup Done</Text>
                            </TouchableOpacity>:
                            null}
                        </View>
                    </View>
                </View>
                <View style={styles.trackerBox}>
                    <View style={styles.verticleLine}></View>
                    <View style={styles.greenTickBox}>
                        <View style={styles.greenTickImageBox}>
                        {this.state.counter>=4?<Icon size={40} name="checked-tick" color="#ffffff"/>:null}
                        </View>
                    </View>
                    <View style={styles.trackerDetailsContainer}>
                        <View style={styles.trackerDetails}>
                        <View>
                            <Text style = {styles.textContent}>
                                {
                                    this.state.counter ===3 || this.state.counter===4? 
                                    "Job Card Creation Initiated" :  null     
                                }
                                {
                                    this.state.counter ===5?"Job card Created":null
                                }
                                {
                                    this.state.counter >=6?"Payment Received":null
                                }
                            </Text>
                        </View>
                        {this.state.counter===5?
                            <TouchableOpacity style={{width:120,height:30,backgroundColor:"#158590",borderRadius:5,alignItems:"center",justifyContent:"center",padding:5, marginTop:10}} onPress={() => this.getJobcardDetails()}>
                            <Text style={{color:"#ffffff"}}>View Jobcard</Text>
                            </TouchableOpacity>:
                            null
                        }
                        </View>
                    </View>
                </View>
                <View style={styles.trackerBox}>
                    <View style={styles.verticleLine}></View>
                    <View style={styles.greenTickBox}>
                        <View style={styles.greenTickImageBox}>
                        {this.state.counter>=7?<Icon size={40} name="checked-tick" color="#ffffff"/>:null}
                        </View>
                    </View>
                    <View style={styles.trackerDetailsContainer}>
                        <View style={styles.trackerDetails}>
                        <Text style = {styles.textContent}>
                            {
                                this.state.counter ===6? 
                                "Drop Initiated" :  null     
                            }
                            {
                                this.state.counter >=7? 
                                "Completed" :  null     
                            }
                        </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={this.UpdateValue}>
                        <Text>
                        Counter
                        </Text>
                    </TouchableOpacity>
                    { this.state.counter <= 2?
                        <TouchableOpacity onPress={this.UpdateValueCancel}>
                         <View style={{
                             alignItems    :"center",
                             flex:1,
                             backgroundColor:"#015b63",
                             
                            marginTop:20,
                             padding:10
                         
                         }}>
                         
                         
                            <Text>
                            Cancel
                            </Text>

                            </View>
                        </TouchableOpacity>: null 
                    }
                {/* <View style={{width:"100%", height: 500,borderColor:"000000",borderWidth:1}}> */}
                    {/* <View style={{width: '100%', height: 50, backgroundColor: 'red'}}>
                        <View style={{width: 25, height: 25, backgroundColor: 'blue'}}></View>
                        <View style={{width: '', height: 25, backgroundColor: 'yellow'}}></View>
                    </View> */}
                    {/* <View style={{flexDirection: 'row',height:31}}>
                        {this.state.counter>=1?<Icon size={27} name="circle" type="font-awesome" color="green"/>:<Icon size={27} name="circle" type="font-awesome" color="red"/>}
                        {this.state.counter===0?<Text style={{fontSize:16,paddingLeft:40}}>Waiting for Confirmation</Text>: <Text style={{fontSize:16,paddingLeft:40}}> {this.state.counter === -1 ? "Booking Cancelled" : "Booking Confirmed"}</Text>}
                    </View>
                    <View style={{height:linesHeight,paddingLeft:14}}>
                        <Text style={{width:3,height:"100%",position:'absolute',left:10,top:-6,backgroundColor:"#E3070A",borderRadius:3}}>
                        </Text>
                    </View>
                    <View style={{flexDirection: 'column',height:31,marginTop:-10}}>
                        <Icon size={27} name="circle" type="font-awesome" color="#E3070A"/>
                        {this.state.counter===2?<View style={{height:60,borderColor:"000000",borderWidth:1,backgroundColor:"red"}}><Text style={{fontSize:16}}>Serviceman is scheduled to pickup at 5:30AM, 23Sept,19</Text></View>:null}
                        </View>
                    <View style={{height:linesHeight,paddingLeft:14}}>
                        <Text style={{width:3,height:"100%",position:'absolute',left:10,top:-6,backgroundColor:"#E3070A",borderRadius:3}}>
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row',height:31,marginTop:-10}}>
                        <Icon size={27} name="circle" type="font-awesome" color="#E3070A"/>
                        <Text style={{fontSize:16,paddingLeft:40}}>Confirmed</Text>
                    </View>
                    <View style={{height:linesHeight,paddingLeft:14}}>
                        <Text style={{width:3,height:"100%",position:'absolute',left:10,top:-6,backgroundColor:"#E3070A",borderRadius:3}}>
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row',height:31,marginTop:-10}}>
                        <Icon size={27} name="circle" type="font-awesome" color="#E3070A"/>
                        <Text style={{fontSize:16,paddingLeft:40}}>Confirmed</Text>
                    </View>
                    <TouchableOpacity onPress={this.UpdateValue}>
                        <Text>
                        Counter
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.UpdateValueCancel}>
                        <Text>
                        Cancel
                        </Text>
                    </TouchableOpacity> */}
                    {/* </View> */}
            </ScrollView>
            )
        } else {
            return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#015b63" /></View>)
        }
    }
}

const styles = StyleSheet.create({
    hideTopLines: {
        width:verticleLineWidth,
        height: heightTopHide,
        top:0,
        left: heightTopLeft,
        zIndex: 4,
        backgroundColor: 'white',
        position: 'absolute'
    },
    hideBottomLines: {
        width:verticleLineWidth,
        height: heightTopHide,
        top: ((sectionHeight*4) - heightTopHide),
        left: heightTopLeft,
        zIndex: 4,
        backgroundColor: 'white',
        position: 'absolute'
    },
    trackerBox: {
        height: sectionHeight,
    },
    verticleLine: {
        position: 'absolute',
        top: 0,
        left: verticleLineLeft,
        height: '100%',
        width: verticleLineWidth,
        zIndex: 1,
        backgroundColor: '#dbdbdb'
    },
    greenTickBox : {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: tickImageBox,
        zIndex: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    greenTickImageBox : {
        width: tickImageSize,
        height: tickImageSize,
        backgroundColor: '#158590',
        justifyContent:"center",
        alignItems:"center",
    },
    trackerDetailsContainer : {
        paddingLeft: tickImageBox,
        height: '100%',
        paddingTop : 20,
        paddingBottom: 20
    },
    trackerDetails : {
        borderWidth: 1,
        borderColor: '#dbdbdb',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        padding : 15
    },
    textContent : {
        fontSize : 16, 
        fontWeight : "bold"
    }
});