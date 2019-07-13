import React, { Component } from 'react'
import { ScrollView,Text,View,TouchableOpacity,Animated,AsyncStorage,Alert,ActivityIndicator} from 'react-native'
import Icon from './CustomIcon';
import { Notifications } from 'expo';
import axios from 'axios';
import sendPushNotification from './sendPushNotification';
import {getPushNotificationData} from '../constants/constant';

const linesHeight = 100;
export default class StatusBar extends Component {
    constructor(props) {  
        super(props);
        this.state={
            counter:0,
            onClick: true,
            customerToken:'',
            bookingStatus:'',
            bookingId: props.navigation.getParam('bookingId'),
            expoToken: props.navigation.getParam('expoToken'),
            modalVisible: false,
            notUpdate: false,
            isCancelCheck: false,
            showLoader: false,
            singleComponentFlag : props.navigation.getParam('singleComponentFlag')
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
        alert(this.state.singleComponentFlag)
        this.circleAnim1 = new Animated.Value(0);
        this.circleAnim2 = new Animated.Value(0);
        this.circleAnim3 = new Animated.Value(0);
        this.circleAnim4 = new Animated.Value(0);
        this.stepAnim2 = new Animated.Value(0);
        this.stepAnim3 = new Animated.Value(0);
        this.stepAnim4 = new Animated.Value(0);
        
        // To  get the status for the current Booking

        // To get the Customer Token
        AsyncStorage.getItem("customerToken").then((token)=>{
            if(token) {
             this.setState({
                customerToken : token
             },()=>{
                this.getBookingStatus();
             })
            }
          })
    }

    getBookingStatus=()=> {
        const URL = 'https://dev.driveza.space/v1/users/booking-status?token='
        +this.state.customerToken+'&bookingId='+this.state.bookingId
        axios.get(URL).then((response) => {
            this.setState({
                bookingStatus:response.data.bookingStatus,
                notUpdate: true
            }, () => {
                this._onPress();  
            })
          }).catch((response) => {
              alert('In Catch' + (response))
          });
        }

    // To check for the Push Notification
    componentDidMount(){
        this._notificationSubscription = Notifications.addListener(this.recieveNotification);
    }

    // For getting Notification
    recieveNotification = (notification) => {
        if(notification.data.bookingStatusFlag && this.state.notUpdate) {
            if(notification.data.bookingStatusValue >= this.state.counter)
            this._onPress();
        } else if(!notification.data.bookingStatusFlag){
            if(notification.data.bookingStatusValue === -1) {
                this.setState({
                    isCancelCheck: true
                })
            }
        }
    }

    _onPress = () => {
        // flag value created to take latest status update
        let timeInterval = 500;
        if(this.state.counter === 1) {
            this.stepAnimation();
        }
        if(this.state.counter === 3) {
            this.stepAnimation1();
            timeInterval = 1000
        }
        if(this.state.counter === 6) {
            this.stepAnimation2();
            timeInterval= 1000
        }
        if(this.state.counter === 7) {
            this.stepAnimation3();
            timeInterval= 1000
        }
        setTimeout(()=>{
            let test;
            if(this.state.counter === 3) {
                test = this.state.counter+2
            } else {
                test = this.state.counter+1
            }
            this.setState({
                counter: test
            },() => {
                if(this.state.counter <= this.state.bookingStatus) {
                    this._onPress();
                } else {
                    this.setState({
                        showLoader: true
                    })
                    return;
                }
            })
        },timeInterval);
    }
    stepAnimation = () => {
        Animated.sequence([
            Animated.timing( this.circleAnim1, {
                toValue: 1,
                duration: 500,
            }),
        ]).start();
    }
    stepAnimation1 = () => {
        Animated.sequence([
            Animated.timing( this.stepAnim2, {
                toValue: linesHeight,
                duration: 500,
            }),
            Animated.timing( this.circleAnim2, {
                toValue: 1,
                duration: 500,
            }),
            
        ]).start();
    }
    stepAnimation2 = (index) => {
        Animated.sequence([
            
            Animated.timing( this.stepAnim3, {
                toValue: linesHeight,     
                duration: 500,
            }),
            Animated.timing( this.circleAnim3, {
                toValue: 1,
                duration: 500,
            })
        ]).start();
    }
    stepAnimation3 = () => {
        Animated.sequence([
            Animated.timing( this.stepAnim4, {
                toValue: linesHeight,     
                duration: 500,
            }),
            Animated.timing( this.circleAnim4, {
                toValue: 1,
                duration: 500,
            })
        ]).start();
    }
    pickupRequest=(statusCode)=>{
        axios.post("https://dev.driveza.space/v1/users/update-booking-status",{
            token: this.state.customerToken,
            bookingId: this.state.bookingId,
            statusId: statusCode
          }).then((response) => {   
            sendPushNotification(getPushNotificationData(statusCode,{token : this.state.expoToken}))
            this._onPress();   
          }).catch((response) => {
            alert('In Catch Enter' + (response));
          });
    }
    setModalVisible(visible){
		this.setState({modalVisible: visible});
	}
    openJobCard = () =>{
        //Do It on successfull payment
        // this.pickupRequest(6);
        this.props.navigation.navigate("JobCardScreen",{bookingId: this.state.bookingId});
    }
    cancelBooking = () => {
        Alert.alert("Booking Cancelled")
        this.props.navigation.navigate("WelcomePageScreen");
    }
    render(){
        let { circleAnim1,circleAnim2,circleAnim3,circleAnim4,stepAnim2,stepAnim3,stepAnim4 } = this;
        if(this.state.showLoader) {

            return(
                <ScrollView style={{paddingLeft:20,paddingTop:20}}>
                    <View style={{flexDirection: 'row',height:31}}>
                        <Animated.View style={{opacity:1-circleAnim1,position:'absolute',left:0,top:0}}>
                            <Icon size={27} name="circle" type="font-awesome" color="#E3070A"/>
                        </Animated.View>
                        <Animated.View style={{opacity:circleAnim1,position:'absolute',left:0,top:0}}>
                            <Icon size={27} color='green' name="circle" type="font-awesome"/>
                        </Animated.View>
                       {this.state.counter>=2?<Text style={{fontSize:16,paddingLeft:40}}>Confirmed</Text>: <Text style={{fontSize:16,paddingLeft:40}}>{this.state.isCancelCheck ? "Booking Cancelled" : "Waiting for Confirmation"}</Text>}
                    </View>
                    <View style={{height:linesHeight,paddingLeft:14}}>
                        {this.state.counter>=2?
                        <Text style={{width:10,height:"100%",position:'absolute',left:6,top:-6,backgroundColor:"#E3070A",borderRadius:3}}>
                        </Text>:null}
                        <Animated.Text style={{width: 10,height:stepAnim2,backgroundColor:'green',position:'absolute',left:6,top:-6}}>
                        </Animated.Text>
                    </View>
                    <View style={{flexDirection: 'row',height:31}}>
                        {this.state.counter>=2?
                        <React.Fragment>
                            <Animated.View style={{opacity:1-circleAnim2,position:'absolute',left:0,top:-12}}>
                               <Icon size={27} name="circle" type="font-awesome" color="#E3070A"/>
                            </Animated.View>
                            <Animated.View style={{opacity:circleAnim2,position:'absolute',left:0,top:-12}}>
                               <Icon size={27} color='green' name="circle" type="font-awesome"/>
                            </Animated.View>
                        </React.Fragment>:null}
                      {this.state.counter==2?
                      <View style={{width:"60%"}}><Text style={{fontSize:16,paddingLeft:40,marginTop:-12}}>Serviceman is scheduled to pickup at 5:30AM, 23Sept,19</Text></View>:null}
                      {this.state.counter==3?<View style={{flexDirection:"row"}}><View style={{width:"60%"}}><Text style={{fontSize:16,paddingLeft:40,marginTop:-12}}>Serviceman on the way</Text></View><View style={{width:"40%",alignItems:"flex-end",paddingRight:22,marginTop:-12}}><TouchableOpacity style={{width:90,height:30,backgroundColor:"#015b63",borderRadius:5,alignItems:"center",justifyContent:"center",padding:5}}><Text style={{color:"#ffffff"}} onPress={()=>this.pickupRequest(3)}>Pickup Done</Text></TouchableOpacity></View></View>:null}
                      {this.state.counter>=5?<Text style={{fontSize:16,paddingLeft:40,marginTop:-12}}>Picked</Text>:null}             
                     </View>
                    <View style={{height:linesHeight,paddingLeft:14}}>
                        {this.state.counter>=5?<Text style={{width: 10,height:"100%",backgroundColor:'#E3070A',position:'absolute',left:7,top:-18,borderRadius:3}}></Text>:null}
                        <Animated.Text style={{width: 10,height:stepAnim3,backgroundColor:'green',position:'absolute',left:9,top:-22}}></Animated.Text>
                    </View>
                    <View style={{flexDirection: 'row',height:31}}>
                        {this.state.counter>=5?<React.Fragment><Animated.View style={{opacity:1-circleAnim3,position:'absolute',left:0,top:-25}}>
                            <Icon size={27} name="circle" type="font-awesome" color="#E3070A"/>
                        </Animated.View>
                        <Animated.View style={{opacity:circleAnim3,position:'absolute',left:0,top:-25}}>
                            <Icon size={27} color='green' name="circle" type="font-awesome"/>
                        </Animated.View></React.Fragment>:null}
                        {this.state.counter==5?<Text style={{fontSize:16,paddingLeft:40,marginTop:-25}}>Job Card Creation Initiated</Text>:null}
                        {this.state.counter==6?<View style={{flexDirection:"row"}}><View style={{width:"60%"}}><Text style={{fontSize:16,paddingLeft:40,marginTop:-25}}>Job Card Created</Text></View><View style={{width:"40%",alignItems:"flex-end",paddingRight:22,marginTop:-25}}>
                        {/* <Modal animationType="slide" visible={this.state.modalVisible}>
                            <ScrollView style={{padding:10,marginTop: 22}}>
                                <View style={{width:"100%",flexDirection:'row',padding:20}}>
                                        <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Services Name</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Qty</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Amount</Text></View>
                                </View>
                                <View style={{width:"100%",borderColor:"#E5E5E5",borderWidth:1,flexDirection:'row',padding:10}}>
                                        <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>AC-Blower Motor/Refit</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>2</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>1500</Text></View>
                                </View>
                                <View style={{width:"100%",borderColor:"#E5E5E5",borderBottomWidth:1,flexDirection:'row',padding:10}}>
                                        <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>AC-Blower Motor/Refit</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>2</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>150000</Text></View>
                                </View>
                                <View style={{width:"100%",borderColor:"#E5E5E5",borderBottomWidth:1,flexDirection:'row',padding:10}}>
                                        <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>AC-Blower Motor/Refit</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>2</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>1500</Text></View>
                                </View>
                                <View style={{width:"100%",flexDirection:'row',padding:20}}>
                                        <View style={{width:"50%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Total Amount</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15,fontFamily:'OpenSans'}}>:</Text></View>
                                        <View style={{width:"25%",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:17,fontFamily:'OpenSansSemiBold'}}>Rs 8000</Text></View>
                                </View>
                                <View style={{alignItems: 'center',justifyContent: 'center',marginTop: 10}}>
                                    <TouchableOpacity>
                                    <View style={{padding: 15,marginBottom:10,alignItems: 'center',borderRadius: 5,backgroundColor: '#015b63'}}>
                                        <Text style={{backgroundColor: 'transparent',fontSize:15,color: '#fff',width: 200,height: 20,textAlign: 'center'}}>
                                        Approve
                                        </Text>
                                    </View>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                    </Modal> */}
                        <TouchableOpacity style={{width:110,height:30,backgroundColor:"#015b63",borderRadius:5,alignItems:"center",justifyContent:"center",padding:5}} onPress={()=>this.openJobCard()}><Text style={{color:"#ffffff"}}>View</Text></TouchableOpacity></View></View>:null}   
                        {this.state.counter>=7?<Text style={{fontSize:16,paddingLeft:40,marginTop:-25}}>Payment Recieved</Text>:null}             
                    </View>
                    <View style={{height:linesHeight,paddingLeft:14}}>
                        {this.state.counter>=7?<Text style={{width: 2,height:"100%",backgroundColor:'#E3070A',position:'absolute',left:9,top:-35}}></Text>:null}
                        <Animated.Text style={{width: 2,height:stepAnim4,backgroundColor:'green',position:'absolute',left:9,top:-35}}></Animated.Text>
                    </View>
                    <View style={{flexDirection: 'row',height:31}}>
                         {this.state.counter>=7?<React.Fragment><Animated.View style={{opacity:1-circleAnim4,position:'absolute',left:0,top:-37}}>
                            <Icon size={22} name="circle" type="font-awesome" color="#E3070A"/>
                        </Animated.View>
                        <Animated.View style={{opacity:circleAnim4,position:'absolute',left:0,top:-37}}>
                            <Icon size={22} color='green' name="circle" type="font-awesome"/>
                        </Animated.View></React.Fragment>:null}
                        {this.state.counter==7?<Text style={{fontSize:16,paddingLeft:40,marginTop:-35}}>Drop Initiated</Text>:null}
                        {this.state.counter==8?<View style={{flexDirection:"row"}}><View style={{width:"40%"}}><Text style={{fontSize:16,paddingLeft:40,marginTop:-35}}>Dropped</Text></View><View style={{width:"60%",alignItems:"flex-end",paddingRight:22,marginTop:-35}}></View></View>:null}
                    </View>
                        <TouchableOpacity onPress={this._onPress}>
                            <Text>
                            counter
                            </Text>
                        </TouchableOpacity>
                        {this.state.counter<4?<View style={{flex: 1,alignItems: 'center',justifyContent: 'center',marginTop: 10}}>
                        <TouchableOpacity onPress={this.cancelBooking}>
                            <View style={{padding: 15,marginBottom:10,alignItems: 'center',borderRadius: 5,backgroundColor: '#015b63'}}>
                                <Text style={{backgroundColor: 'transparent',fontSize: 15,color:'#fff',width: 100,height: 20,textAlign: 'center',}}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                        </View>:null}
                </ScrollView>
            )
        } else {
            return (<View style={{marginTop:200}}><ActivityIndicator color="#015b63" /></View>)
        }
    }
}
