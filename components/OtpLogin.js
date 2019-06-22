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
            customerExpoToken : null
        };
    }

    otpSubmit=() => {
    Keyboard.dismiss();

    // Object for Verify OTP :
    const verifyOTP = {
    phone : this.state.phone,
    otp : parseInt(this.state.otp)
    }

    axios.post('https://dev.driveza.space/v1/users/verify',verifyOTP).then(res => {
        if(res.data.isNew) {
            this.props.navigation.navigate('RegistrationPageScreen',{phone:this.props.navigation.state.params.phone});
        } else {
            this.setState({
                customerToken: res.data.token
            },()=>{
                this.generatePushToken()
            })
            AsyncStorage.setItem("customerToken", res.data.token);
            AsyncStorage.setItem("customerName", res.data.name);
            AsyncStorage.setItem("customerEmail", res.data.email);
            AsyncStorage.setItem("customerPhone", res.data.phone);
            this.props.loginCheckAction(true);
            if(this.props.CarServiceSelected.selectedServices.length) {
                this.props.navigation.navigate('ServiceBookScreen',{customerToken:res.data.token});
            } else {
                this.props.navigation.navigate('WelcomePageScreen');
            }
        }
    }).catch(error => {
        alert("Something Went Wrong");
        // this.props.navigation.navigate('PhoneNumberScreen');
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
            this.updateExpoPushToken();      
        })
      }

      // To Generate the Data for the Customer Expo Push Tokken
      updateExpoPushToken = () => {
        const tokens = {
            token : this.state.customerToken,
            pushToken: this.state.customerExpoToken
            }
        axios.post('https://dev.driveza.space/v1/users/update-push-token',tokens).then(res => {
           console.log(tokens.pushToken)
        }).catch(error => {
            alert("Something Went Wrong");
        })

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
                        onChangeText={(otp) => this.setState({otp})}
                        underlineColorAndroid="transparent"
                    />
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
