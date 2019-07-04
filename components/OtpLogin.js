import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Keyboard,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import Icon from '../components/CustomIcon';
import axios from 'axios';
import { Permissions, Notifications } from 'expo';

class OtpLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp:'',
            phone: props.navigation.state.params.phone,
            customerToken:'',
            customerExpoToken : null,
            time: '02:00',  // add initial timer value
            showTimer: true
        };
        this.otpTimer
    }

    componentDidMount(){
        this.startTimer();
        this.generatePushToken();
    }

    otpSubmit=() => {
    Keyboard.dismiss();

    // Object for Verify OTP :
    const verifyOTP = {
    phone : this.state.phone,
    otp : parseInt(this.state.otp)
    }

    // console.log(verifyOTP);

    axios.post('https://dev.driveza.space/v1/users/verify',verifyOTP).then(res => {
        alert(JSON.stringify(res))
        if(res.data.isNew) {
            this.props.navigation.navigate('RegistrationPageScreen',{phone:this.props.navigation.state.params.phone});
        } else {
            this.updateExpoPushToken(res.data.token);
            AsyncStorage.setItem("customerToken", res.data.token);
            AsyncStorage.setItem("customerName", res.data.name);
            AsyncStorage.setItem("customerEmail", res.data.email);
            AsyncStorage.setItem("customerPhone", res.data.phone);
            this.props.loginCheckAction(true);
            if(this.props.CarServiceSelected.selectedServices.length) {
                this.props.navigation.popToTop();
                this.props.navigation.navigate('ServiceBookScreen',{customerToken:res.data.token});
            } else {
                this.props.navigation.popToTop();
                this.props.navigation.navigate('WelcomePageScreen');
            }
        }
    }).catch(error => {
        alert("Something Went Wrong");
    }) 
  }
  componentDidUpdate(nextProps){
    if(this.props.LoginCheck.resetVal !== nextProps.LoginCheck.resetVal) {
        this.setState({
            otp: ''
        });
    }
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
        }, () => {
            alert(this.state.customerExpoToken);      
        })
      }

    startTimer = () => {
        let timer = 10, minutes, seconds; // 2 in minutes
        this.otpTimer = setInterval( () => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            let time = minutes + ":" + seconds;
    
            this.setState({time});
    
            if (--timer < 0) {
                this.setState({
                    showTimer: false
                },() => {
                    clearInterval(this.otpTimer);
                })
            }
        }, 1000);
    }

    //   To Generate the Data for the Customer Expo Push Tokken
      updateExpoPushToken = (customerToken) => {
        const tokens = {
            token : customerToken,
            pushToken: this.state.customerExpoToken
            }
            console.log(tokens);
        axios.post('https://dev.driveza.space/v1/users/update-push-token',tokens).then(res => {
           console.log("success");
        }).catch(error => {
            alert("Something Went Wrong");
        })

      }

      componentWillUnmount(){
        clearInterval(this.otpTimer);
      }

      resendOtp = () => {
        axios.post('https://dev.driveza.space/v1/users/otp',{phone:this.props.navigation.state.params.phone})
        .then((res) => {
            alert(res.data.otp);
            this.setState({
                time: "02:00",
                showTimer: true
            },() => {
                this.startTimer();
            })
            // this.props.navigation.navigate('OtpLoginScreen',{phone:this.state.phoneNumber});
        }).catch(error => {
            alert("Something Went Wrong");
        })
      }

    // Regex for OTP Validation
    validateOTP = (value) => {
        const regex = /^([0-9]{0,6})$/g;
        if(!regex.test(value)) {
            return;
        }
        this.setState({otp:value});
    }

    render(){
        return(
            <ScrollView keyboardShouldPersistTaps='always' style={{backgroundColor:"#ffffff", paddingTop: 20}}>
                <View style={styles.inputWrapper}>
                    <Icon style={styles.inputIcon} name="service-list" size={22} color="#d8d8d8"/>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={this.state.otp}
                        placeholder="Enter OTP"
                        maxLength={6}
                        onChangeText={(otp) => this.validateOTP(otp)}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View>
                    {
                        this.state.showTimer ?(
                                <View style={{paddingBottom: 15,paddingTop: 15,flex: 1, justifyContent:'center', alignItems:'center'}}>
                                    <Text>
                                        {this.state.time}
                                    </Text>
                                </View>
                            ) :
                            (
                                <TouchableOpacity style={{paddingBottom: 15,paddingTop: 15,flex: 1, justifyContent:'center', alignItems:'center'}} onPress={this.resendOtp}>
                                    <Text style={{fontWeight:'bold',color:'#800080',textDecorationLine: 'underline'}}>
                                        Resend OTP
                                    </Text>
                                </TouchableOpacity>
                            )
                    }
                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={this.otpSubmit}>
                        <Text style={styles.textStyle}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 3,
        borderColor: "#e5e5e5",
        paddingLeft: 5,
        borderRadius: 5,
    },
    inputIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 5,
        paddingBottom: 10,
        backgroundColor: '#fff',
        color: '#424242',
        borderWidth: 1,
        borderColor: "transparent",
        borderRadius: 5,
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
        width:200,
        backgroundColor: '#015b63',
    	borderRadius:5
    }
});

export default OtpLogin;
