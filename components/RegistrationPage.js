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

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            phoneNumber:this.props.navigation.state.params.phone,
            name:'',
            email:'',
            password: '',
            confirmPassword : '',
            token : null
        };
    }

    componentDidMount() {
        this.generatePushToken();     
    }

    componentDidUpdate(nextProps){
        if(this.props.LoginCheck.resetVal !== nextProps.LoginCheck.resetVal) {
            this.setState({
                phoneNumber:'',
                name:'',
                email:''
            });
        }
      }

    onSubmit = () => {
        Keyboard.dismiss();
        // Regular Expression to validate for the Name field
        const regexName = /^[a-zA-Z ]/;
        if(!regexName.test(this.state.name)) {
            alert("Please enter valid Name");
            return;
        }

        // Regular expression to validate for the Phone Number Field
        const RegPhoneNumber = /^((?!(0))[0-9]{10})$/g;
        if(!RegPhoneNumber.test(this.state.phoneNumber)) {
            alert("Please enter valid phone number");
            return;
        }

        // Regular expression to validate for the Email Field  
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!regex.test(this.state.email)) {
            alert("Please enter valid Email address");
            return;
        }

        // Checking for the Password Confirmation
        // if(this.state.password === '') {
        //     alert('Please enter a valid Password');
        //     return;
        // }

        // Checking for the Password Confirmation
        // if(this.state.password !== this.state.confirmPassword) {
        //     alert('Password and Confirm Password is not same');
        //     return;
        // }
        const usersCreateObject = {
            name : this.state.name,
            email : this.state.email,
            phone : this.state.phoneNumber,
            pushToken : this.state.token
        }

        alert(JSON.stringify(usersCreateObject));

        axios.post('https://dev.driveza.space/v1/users/create',usersCreateObject)
        .then(res => {
            AsyncStorage.setItem("customerToken", res.data.token);
            AsyncStorage.setItem("customerName", res.data.name);
            AsyncStorage.setItem("customerEmail", res.data.email);
            AsyncStorage.setItem("customerPhone", res.data.phone);
            // this.props.loginCheckAction(true);
            if(this.props.CarServiceSelected.selectedServices.length) {
                this.props.navigation.popToTop();
                this.props.navigation.navigate('ServiceBookScreen');
            } else {
                this.props.navigation.popToTop();
                this.props.navigation.navigate('WelcomePageScreen');
            }
        }).catch(error => {
            alert("Something Went Wrong");
        }) 
    }
    // Regex validation for Merchant Name : onChange()
    validateName = (value, inputField) => {
        const regex = /^([a-zA-Z ]+$)/;
        if(!regex.test(value) && value !== "") {
            return;
        }
        this.setState({[inputField]:value});
    }

    // Regex validation for Phone Number : OnChange()
    validatePhone = (value, inputField) => {
        const regex = /^([0-9]{0,10})$/g;
        if(!regex.test(value)) {
            return;
        }
        this.setState({[inputField]:value});
    }

    // General Validation for Email and Password
    validate = (value, inputField) => {
        this.setState({[inputField]:value});
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
      token : await Notifications.getExpoPushTokenAsync()
    }, () => {
        alert(this.state.token);
        console.log(this.state.token);
    })
  }
 
    render(){
        return(
            <ScrollView keyboardShouldPersistTaps='always' style={{backgroundColor:"#ffffff", paddingTop: 20}}>
                <View style={styles.inputWrapper}>
                    <Icon style={styles.inputIcon} name="profile" color="#d8d8d8" size={22}/>
                    <TextInput
                    style={styles.input} 
                    value={this.state.name}
                    placeholder="Name"
                    onChangeText={(text) => this.validateName(text,"name")}
                    underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Icon style={styles.inputIcon} name="mobile-number" color="#d3d3d3" size={22}/>
                    <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={10} 
                    value={this.state.phoneNumber}
                    placeholder="Mobile Number"
                    onChangeText={(text) => this.validatePhone(text,"phoneNumber")}
                    underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Icon style={styles.inputIcon} name="email" color="#d3d3d3" size={22}/>
                    <TextInput
                    style={styles.input}
                    value={this.state.email}
                    placeholder="Email Address"
                    onChangeText={(text) => this.validate(text,"email")}
                    underlineColorAndroid="transparent"
                    />
                </View>
                {/*<View style={styles.inputWrapper}>
                    <Icon style={styles.inputIcon} name="lock" type="entypo" color="#d3d3d3"/>
                    <TextInput
                    style={styles.input} 
                    value={this.state.password}
                    placeholder="Password"
                    onChangeText={(text) => this.validate(text,"password")}
                    underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Icon style={styles.inputIcon} name="lock" type="entypo" color="#d3d3d3"/>
                    <TextInput
                    style={styles.input} 
                    value={this.state.confirmPassword}
                    placeholder="Confirm Password"
                    onChangeText={(text) => this.validate(text,"confirmPassword")}
                    underlineColorAndroid="transparent"
                    />
                </View>*/}
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onSubmit()}>
                        <Text style={styles.textStyle}>Register</Text>
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

export default RegistrationPage;

