import React from 'react';
import {
    ScrollView,
    View,
	Text,
    Image,
    Modal,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	AsyncStorage
} from 'react-native';

import Icon from '../components/CustomIcon';
import {dataList} from '../constants/constant';
import {cars} from '../constants/constant';
import {commonStyle} from '../constants/styles';
import sendPushNotification from './sendPushNotification';
import axios from 'axios';

class ServiceBook extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			modalVisible: false,
			radio:{
		  		radio1: true,
				radio2: false,
			},
			merchantList:[],
			loader: false,
			customerToken:"",
			expoToken : props.MerchantInfo.MerchantInformation[5]
	  	}
	}

	dateFormat = (date = new Date()) => {
		let day = date.getDate();
		let month = date.getMonth();
		let year = date.getFullYear();
		fullDate = year+"-"+(month+1)+"-"+day;
		return fullDate;
	}

	createBooking = () => {
		const bookingData = {
			token : `${this.state.customerToken}`,
			serviceId : this.props.CarServiceSelected.selectedServices,
			shopId : this.props.MerchantInfo.MerchantInformation[2],
			partnerId : this.props.MerchantInfo.MerchantInformation[3],
			vehicle : this.props.VehicleSelected.selectedVehicle.id,
			lat : `${this.props.LocationSelected.latitude}`,
			long : `${this.props.LocationSelected.longitude}`,
			time : `${this.dateFormat()}`,
			address : `${this.props.LocationSelected.address}`,
			isSelfDrop: this.props.MerchantInfo.MerchantInformation[4]
		}

		axios.post('http://dev.driveza.space/v1/users/create-booking',bookingData).then(res => {
			// alert(JSON.stringify(res));
			this.callFunction(this.props.MerchantInfo.MerchantInformation[5]);
			this.setModalVisible(false);
			this.props.navigation.navigate("NewStatusBarScreen",{
				bookingId: res.data.id,
				expoToken: this.props.MerchantInfo.MerchantInformation[5],
				singleComponentFlag : true
			});
		}).catch(error => {
			// alert("Something Went Wrong");
		}) 
	}
	callFunction = (token) => {
		const notificationObject = {
		token,
		title : "New booking arrived",
		body : "Please accept",
		data : {
			"newBooking": true
		}
		}
		sendPushNotification(notificationObject);
	}
	componentDidUpdate(nextProps){
        if(this.props.LoginCheck.flagValue !== nextProps.LoginCheck.flagValue) {
			AsyncStorage.getItem("customerToken").then((token)=>{
				if(token) {
				 this.setState({
					customerToken : token
				 },()=>{
					this.partnerListFetch();
				 })
				}
			  })
		}
    }
   componentWillMount(){
	AsyncStorage.getItem("customerToken").then((token)=>{
		if(token) {
		 this.setState({
			customerToken : token
		 },()=>{
			this.partnerListFetch();
		 })
		}
	  })
   }
	partnerListFetch=()=>{
		axios.get('https://dev.driveza.space/v1/partners/list',{
			params: {
				token:`${this.state.customerToken}`,
				servicesList : `${this.props.CarServiceSelected.selectedServices}`,
				lat : `${this.props.LocationSelected.latitude}`,
				lang : `${this.props.LocationSelected.longitude}`
			}
		  })
		.then((res) => {
			this.setState({
				merchantList: res.data,
				loader: true
			},()=>{
				// alert(JSON.stringify(this.state.merchantList))
				console.log(JSON.stringify(this.state.merchantList))
			})
		}).catch(error => {
			// alert("Something went wrong");
			this.setState({
				loader: true
			})
		})
	}

	onPressLogin = () => {
		this.props.navigation.navigate('PhoneNumberScreen');
	}

  	static navigationOptions = ({ navigation }) => ({
    	headerTintColor: '#fff',
    	headerStyle: {
      		backgroundColor: '#015b63',
		},
		headerTitle: (
			    <View style={{
			        justifyContent: 'center',
			        alignItems: 'center',
			      }}>
			        <View style={{ alignItems: 'center',justifyContent: 'center'}}>
			            <Text
			                style={{
			                    fontSize: 20,
			                    color: '#ffffff',
			                    fontWeight: 'bold',
			                    justifyContent: 'center',
			                    alignItems: 'center',
			            }}>Service Centers Near You  </Text>
			        </View>
			    </View>
			  ),
	});
	
	setModalVisible(visible){
		this.setState({modalVisible: visible});
	}
	radioButton = (index) => {
		this.setState({
		  	radio:{
				...this.state.radio,
				radio1:false,
				radio2:false,
				[`radio${index}`]:true
		  	}
		});
	}
	dateDisplay=()=>{
		let month=["January","February" ,"March" ,"April" ,"May" ,"June" ,"July" ,"August","September","October" ,"November" ,"December"]
		let day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
		return day[this.props.DateSelected.dateTime.getDay().toString()]+","+this.props.DateSelected.dateTime.getDate().toString()+" "+month[this.props.DateSelected.dateTime.getMonth().toString()]+" "+this.props.DateSelected.dateTime.getFullYear()+","+this.props.DateSelected.dateTime.getHours()+":"+this.props.DateSelected.dateTime.getMinutes()
	}

  	selectPlace=()=>{
    	this.props.navigation.navigate("SelectPlaceScreen");
	}
	  
	// To generate the Push Token
 	onBookingRequest= () => {
		this.createBooking();
	}
	
	merchantSelect=(data)=>{
		let merchantInfoArray=[data.name,data.address,data.id,data.partnerId,data.isPickupAvailable,data.pushToken];
		this.props.merchantInfoAction(merchantInfoArray)
		// if(!this.props.LoginCheck.flagValue){
		// 	alert("Please login first")
		// 	this.props.navigation.navigate('PhoneNumberScreen')
		// } else {
		 	this.setModalVisible(true);
		// }
	 }
  	render() {
    	return (
			<ScrollView style={{paddingLeft:10,paddingRight:10,paddingTop:10}}>
				<TouchableOpacity onPress={this.selectPlace}>
				<View style={{ backgroundColor:"#ffffff",marginBottom:20,borderColor:"#dcdcdc",borderWidth:1,flexDirection: 'row',paddingLeft:10,alignItems: 'center',}}>
						<Icon name="location" color="#d8d8d8" size={22}/>
						<Text numberOfLines={1} ellipsizeMode='tail' style={{width: "90%",fontSize:15,marginLeft:10}}>{this.props.LocationSelected.address}</Text>
				</View>
				</TouchableOpacity>
				{/* <View style={{backgroundColor: '#efefef',height: 50,zIndex: 22,flex: 1,justifyContent: 'center',marginBottom: 20}}>
                      <Text style={{fontSize: 17,textAlign: 'left',marginLeft: 12,        fontWeight:"bold"}}>
                       Service Centres near you
                       </Text>
                    </View>	 */}
				<Modal animationType="slide" visible={this.state.modalVisible} onRequestClose={() => this.props.navigation.goBack(null)}>
				
					<View style={{backgroundColor:"#015b63",flexDirection: "row" ,padding: 20,borderWidth:2,borderColor:"red"}}>
						<TouchableOpacity onPress={() => {
							this.setModalVisible(!this.state.modalVisible);
					  	}}><View style={{}}>
					  		<Icon
								size={25}
								name="left-open"
								color="#ffffff"
							/>
							</View>
						</TouchableOpacity>
						<View style={{paddingLeft:10}}>
							<Text style={{color:"#ffffff",fontSize:17,paddingLeft:10,justifyContent: 'center',alignItems: 'center'}}>Kindly Confirm</Text>
						</View>
					</View>
					 <View>
						{/* <Text style={{color:"#000000",fontSize:17,fontWeight:"bold",padding:20,}}>Kindly Confirm The Deatils You Have Chosen</Text> */}
					</View>
					<ScrollView>
						
					<View>

					<View style={{padding:10}}>
						<View style={{flexDirection:"row"}}>
				  			
						<Image source={require("../assets/hamburgerImages/merchant.png")}/>
					<View style={{padding:10,paddingLeft:5}}><Text style={{fontSize:17}}> {this.props.MerchantInfo.MerchantInformation[0]}</Text></View>        
							</View>
			      
						</View>
						<View style={{
							
						borderWidth:1,
						borderColor:"#efefef",
						
					}}>

					</View>
{/*
                  <Text>
					  View For Date and Time
				  </Text>
*/}
					<View style={{padding:10,paddingTop:20}}>
						<View style={{flexDirection:"row"}}>
				  			
				  				<Icon
									Icon size={15} 
									name="calendar"  
									color="#000000"
				   				/>
					<View style={{paddingLeft:10}}><Text style={{fontSize:15,color:"green"}}>SCHEDULED DATE</Text></View>        
							</View>
							<View style={{padding:10,paddingLeft:26}}><Text style={{fontSize:15,color:"#000000"}}> {this.dateDisplay()}</Text></View>        

			      
						</View>
					
					{/*
                  <Text>
					  View End For Date and Time
				  </Text>

*/}




{/*
                  <Text>
					  View For Vehicle
				  </Text>
*/}
					<View style={{padding:10}}>
						<View style={{flexDirection:"row"}}>
				  			
				  				<Icon
									Icon size={15} 
									name="car"  
									color="#000000"
				   				/>
					<View style={{paddingLeft:10}}><Text style={{fontSize:15,color:"green"}}>VEHICLE CHOSEN</Text></View>        
							</View>
							<View style={{padding:10,paddingLeft:26}}><Text style={{fontSize:15,color:"#000000"}}> {this.props.VehicleSelected.selectedVehicle.name}</Text></View>        

			      
						</View>
					
					{/*
                  <Text>
					  View End For Vehicle
				  </Text>

*/}

                 {/*
                  <Text>
					  View For Address
				  </Text>
                 */}
					<View style={{padding:10}}>
						<View style={{flexDirection:"row"}}>
				  			
				  				<Icon
									Icon size={15} 
									name="address-confirm"  
									color="#000000"
				   				/>
					<View style={{paddingLeft:10}}><Text style={{fontSize:15,color:"green"}}>YOUR ADDRESS</Text></View>        
							</View>
							<View style={{padding:10,paddingLeft:26}}><Text style={{fontSize:15,color:"#000000"}}> {this.props.MerchantInfo.MerchantInformation[1]}</Text></View>        

			      
						</View>
					
					{/*
                  <Text>
					  View End For Address Ended
				  </Text>

*/}
{/*
                  <Text>
					  View Start For Service List
				  </Text>

*/}



<View style={{padding:10,paddingTop:15,borderBottomWidth:1,borderColor:"#efefef"}}>
<View style={{flexDirection:"row"}}>
				  	
<Icon
												size={15}
												name="briefcase"
												color="#000000"
											/><Text style={{fontSize:17,color:"#696969",paddingLeft:10}}>SERVICES</Text>

</View>
</View>
					    {
							this.props.CarServiceSelected.selectedServices.map((item,index) =>{
								return(
									<View style={{padding:20,flexDirection:"row"}} key={index}>
										<View style={{alignItems:"flex-start",width:"70%"}}><Text>{dataList[item-1].name}</Text></View>
										<View style={{alignItems:"flex-end",width:"30%"}}>
											<Icon
												size={15}
												name="tick"
												color="#000000"
											/>
										</View>
									</View>
								)
						   })
						}
{/*
                  <Text>
					  View End For Service List
				  </Text>

*/}

{/*
                  <Text>
					  View Start For Mode chosen start
				  </Text>

*/}

<View style={{padding:10,borderBottomWidth:1,borderColor:"#efefef"}}>

<View style={{flexDirection:"row"}}>


<Icon
												size={15}
												name="choose-mode"
												color="#000000"
											/><Text style={{fontSize:17,color:"#000000"}}>Choose Mode</Text>
</View>
</View>
					 		<View style={{padding:20,flexDirection:"row"}}>
								<View style={{alignItems:"flex-start",width:"70%"}}><Text>Pickup</Text></View>
								<View style={{alignItems:"flex-end",width:"30%"}}>
									<TouchableOpacity onPress= {()=>this.radioButton(1)}>
										{this.state.radio.radio1?<Icon
										size={20}
										name="filled-confirm"
										color="#015b63"
										/>:<Icon size={20} name="hollow-pickup" color="#015b63"
											/>}
									</TouchableOpacity>
								</View>
				   			</View>


							   <View style={{borderBottomWidth:1,borderColor:"#efefef"}}></View>
				   				<View style={{padding:20,flexDirection:"row"}}>
									<View style={{alignItems:"flex-start",width:"70%"}}><Text>Self Delivery</Text></View>
									<View style={{alignItems:"flex-end",width:"30%"}}>
										<TouchableOpacity onPress = {()=>this.radioButton(2)}>
										{this.state.radio.radio1?<Icon
										size={20}
										name="hollow-pickup"
										color="#015b63"
										/>:<Icon size={20} name="filled-confirm" color="#015b63"
											/>}
										</TouchableOpacity>
									</View>
				   				</View>		   
{/*
                  <Text>
					  View End For Mode Chosen Ended
				  </Text>

*/}


















						
					</View>
					{/*<Text>
						Parent view ends
					</Text>*/}
			   		
										
				   				<View style={{borderBottomWidth:2,borderColor:"#dbdbdb"}}></View>
								<View style={{alignItems:"center"}}>
									<TouchableOpacity onPress={() => this.onBookingRequest()} style={{alignItems: 'center',width:"100%",marginTop:25,marginBottom:25,height:50,width:200,borderRadius:7,backgroundColor:"#015b63",justifyContent:"center"}}>
										<Text style={styles.textStyle}>Confirm</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
			  			</Modal>
						 {
							!this.state.loader? this.props.LoginCheck.flagValue ?
							( <View style={{marginTop:200}}><ActivityIndicator/></View>):(
								<View style={{height: 500,flex:1,alignItems: "center",justifyContent:"center"}}>

									<TouchableOpacity
									onPress={this.onPressLogin
									}>
									<View
										style={{
										padding: 15,
										marginBottom:10,
										alignItems: 'center',
										borderRadius: 5,
										backgroundColor: '#015b63',
										}}>
										<Text
										style={{
											backgroundColor: 'transparent',
											fontSize: 15,
											color: '#fff',
											width: 200,
											height: 20,
											textAlign: 'center',
										}}>
										Please Login first
										</Text>
									</View>
									</TouchableOpacity>
								</View>
							):
							<React.Fragment>
								{
							 this.state.merchantList.length==0?(<View style={{marginTop:200,alignItems:"center"}}><Text>No merchants found</Text></View>):this.state.merchantList.map((data,index)=>{
								  return(  		  
					<TouchableOpacity onPress={() => this.merchantSelect(data)} key={index}>
			  			<View key={index} style={{backgroundColor:"#efefef",width:"100%",paddingLeft:20,paddingTop:20,paddingRight:20,paddingBottom:20}}>
							<View style={{backgroundColor:"#ffffff",borderRadius:8}}>
							<View style={{flexDirection: "row",marginTop:10}}>
							<View style={{alignItems:"flex-start",width:"50%",paddingLeft:10}}>
								<Text style={{fontSize: commonStyle.Heading_fontSize, fontWeight:"bold"}}>{data.name}</Text>
							</View>
							<View style={{alignItems:"flex-end",width:"50%",paddingRight:10,justifyContent:"center"}}>
								<Text style={{fontSize:15,color:"#8d8d8d"}}>{data.distance}</Text>
							</View>
			   			</View>
			   			<View style={{marginTop:10,paddingLeft:10,paddingRight:10}}>
			   				<Text style={{fontSize:15,color:"#8d8d8d"}}>Kaspate vasti</Text>
			   			</View>
			   			<View style={{flexDirection: "row",marginTop:10,paddingLeft:10}}>
			   			<View style={{width:"80%",justifyContent:"center"}}><TouchableOpacity style={styles.buttonStyle}>
				   		<Text style={styles.textStyle}>Pickup Available</Text>
					</TouchableOpacity>
				</View>
			   </View>
			   <View style={{flexDirection: "row",paddingLeft:10,marginTop:15,marginBottom:10}}>
			   			<View style={{justifyContent:"center"}}>
				   		<Text style={{fontWeight:"bold",fontSize:15}}>USE CODE :  </Text>
				        </View>
				<View style={{width:"40%",justifyContent:"center"}}><TouchableOpacity style={styles.couponStyle}>
				   		<Text style={styles.textStyle}>FREEPICK</Text>
					</TouchableOpacity>
				</View>
			   </View>
			   </View>
			   
			  </View>
			</TouchableOpacity> )})}
			</React.Fragment>
			}
			</ScrollView>
    	);  
	}
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize:15,
        color: '#ffffff',
        textAlign: 'center'
    },
    buttonStyle: {
        padding:5,
        alignItems: 'center',
		justifyContent: 'center',
		width:150,
        backgroundColor: '#008516',
	},
	couponStyle: {
        padding:5,
        alignItems: 'center',
        justifyContent: 'center',
        width:100,
        backgroundColor: '#ffc30f',
    }
});

export default ServiceBook;