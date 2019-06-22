import React from 'react'
import { View, ScrollView, Image, StyleSheet, Dimensions, Text, Animated, TouchableOpacity} from 'react-native';
import {dataList} from '../constants/constant.js';
import Icon from './CustomIcon';
import axios from 'axios';
const { width } = Dimensions.get('window');


class Carousel extends React.Component {
    constructor(props){
        super(props);
        this.state={
            counter: 0,
            animateLeft: new Animated.Value(0),
        }
    }

    componentDidMount(){
        this.interval = setInterval(() => {
            Animated.timing(
                this.state.animateLeft,
            {
                toValue: -this.state.counter*width,
                duration: 200
            }
        ).start();
        if(this.state.counter === this.props.images.length-1) {
            this.setState({
                counter: 0
            })
        } else {
            this.setState({
                counter: this.state.counter+1
            })
        }
        }, 1600)
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    offerPage = () => {
        this.props.componentProps.navigation.navigate('OfferScreen');
    }

    render() {
        const {animateLeft} = this.state
        return (
            <React.Fragment>
                <Animated.View style={{left:animateLeft,width:this.props.images.length*width,flexDirection: 'row', height: 0.6*width,marginTop:20}}>
                {
                    this.props.images.map((data,index) => {
                        return(
                            <TouchableOpacity activeOpacity={1} style={{width}} onPress={() => this.offerPage()} key={index}>
                                <Image style={{width: '100%', height: "100%"}} source={data.uri}/>
                            </TouchableOpacity>
                        )
                    })
                }
                </Animated.View>
                <View style={{flexDirection: "row",justifyContent: "center",width:"100%",bottom:30}}><View><Icon size={15} color="#dbdbdb" name={this.state.counter === 1 ? "hollow-pickup": "filled-confirm"}/></View><View><Icon size={15} color="#dbdbdb" name={this.state.counter === 2 ? "hollow-pickup": "filled-confirm"}/></View><View><Icon size={15} color="#dbdbdb" name={this.state.counter === 3? "hollow-pickup": "filled-confirm"}/></View><View><Icon size={15} color="#dbdbdb" name={this.state.counter === 0 ? "hollow-pickup": "filled-confirm"}/></View></View>
            </React.Fragment>
        );
    }
}

class WelcomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            type : false,
            position: {
                latitude: 0,
                longitude: 0,
                address:'',
            }
        }
    }
    componentWillMount(){
        for (let index = 0; index < dataList.length; index++) {
            let latestIndex = index+1;
            this.setState({
                ["type"+latestIndex] : false,
            });
        }
    }

    componentDidUpdate(nextProps){
        if(this.props.LoginCheck.resetVal !== nextProps.LoginCheck.resetVal) {
            for (let index = 0; index < dataList.length; index++) {
                let latestIndex = index+1; 
                this.setState({
                    ["type"+latestIndex] : false
                });
            }
            this.props.carServiceSelectedAction([]);
        }
    }

    onPressImage=(index)=>{
        this.setState ({
            ["type"+index]: !this.state["type"+index]
        });
    }
    onPressButton=()=>{
        const selectedServices = [];
        for (let index = 1; index <= dataList.length; index++) {
            if (this.state["type"+index]===true) {
                selectedServices.push(index);
            }
        }
        this.props.carServiceSelectedAction(selectedServices);
        if(!selectedServices.length){
            alert("Please book a service")
        }else{
            this.props.navigation.navigate('SelectVehicleScreen');
        }
        let addressReceived;
        
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                position: {
                ...this.state.position,
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            }},() => {
                axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.state.position.latitude+','+this.state.position.longitude+'&key=AIzaSyAaKNdcx_twduM4Ag3ZCZDHotJQhCKA-QI').then(response => {
                    addressReceived = response.data.results[0].formatted_address
                    this.setState({
                        position: {
                        ...this.state.position,
                        address: addressReceived
                    }
                },()=>{
                    this.props.locationSelectedAction(this.state.position);
                })
              }).catch(error => {
                alert("Unable to fetch your location");
              })  
           
        });
        }, (error) => {
            alert(JSON.stringify(error));
        });
    }
    knowMore=()=>{
      this.props.navigation.navigate('KnowServicesScreen')
    }

    render() {
      const images = [
        {uri:require('../assets/carousalImages/dent-paint.png')},
        {uri:require('../assets/carousalImages/b.jpg')},
        {uri:require('../assets/carousalImages/c.jpg')},
        {uri:require('../assets/carousalImages/Spa.png')},
      ];
      return (
        <ScrollView style={styles.container}>
          <View style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
            <View style={{ flex: 1, justifyContent: 'center'}}>
              <Carousel images={images} componentProps={this.props}/>
            </View>
            <TouchableOpacity style={{backgroundColor:"#f8f8f8",justifyContent: 'center'}} onPress={this.knowMore}>
              <Text style={{fontSize: 17,color: "#000000",marginTop:20,marginBottom:20,textAlign: 'left',marginLeft: 20}}>
               Know more about our services 
              </Text>
            </TouchableOpacity>
            <View style={{backgroundColor:"#015b63" ,justifyContent: 'center'}}>
              <Text style={{fontSize: 17,color: "#ffffff",marginTop:10,marginBottom:10,textAlign: 'left',marginLeft: 20}}>
                Select Services  
              </Text>
            </View>	
            <View style={{ flex: 1, backgroundColor:"ffffff",marginTop:10}}>
            
            {dataList.map((data,index) => {
                return (
                  <TouchableOpacity
                    style={{ flexDirection: 'row',backgroundColor:"#f8f8f8",marginTop:20,marginBottom:10,padding: 10,border:5,padding:10 , shadowColor: '#dbdbdb',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 1,
                    elevation: 1, borderColor:"#015b63",borderWidth: this.state["type"+data.id]?1:0}}
                    onPress={() => this.onPressImage(data.id)} activeOpacity={1} key={index}>
                    
                    <View style={{width: "60%"}}>
                    <Text
                        style={{
                          color: '#000000',
                          fontSize: 15,
                          fontWeight: "bold"
                          }}>
                        {data.name}
                      </Text>
                      <View>
                        {data.subservives.map((subData,index) =>{
                        return (
                       
                        <View style={{flexDirection: 'row',marginTop:15}} key={index}><Text style={{color: '#c38603',fontSize:12}}>{subData}</Text>

                      </View>
                        );

                       })
                       }
                      </View>
                    </View>
                    <View
                style={{width: '40%', justifyContent: 'center', alignItems: 'flex-end'}}> 
                     <View style={{ height:100,width:100}}>    
                      <Image
                        source={data.path}
                        style={{
                            margin:10,
                           height:"80%",
                          width:"80%",

                          backgroundColor: '#dcdcdc',
                           opacity:this.state["type"+data.id]?0.5:1
                        }}
                      />
                       <Image
                          source={require('../assets/servicesImages/tick.png')}
                          style={{
                            height: 30,
                            width: 30,
                            top:0,
                            left:70,
                            position: "absolute",
                            zIndex: 2,
                            opacity:this.state["type"+data.id]?1:0
                          }}
                        />
                        </View>
                        </View>
                          
                  </TouchableOpacity>
                );
              })}
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() =>{
                    this.onPressButton()
                  }
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
                      Book Service
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
           
          </View>
        </ScrollView>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor:"#ffffff"
    },
  });
 
  
export default WelcomePage;