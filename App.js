import React from 'react';
import {View, Text} from 'react-native';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

//reducer
import rootReducer from './reducers/index';
const store = createStore(rootReducer,applyMiddleware(thunk));

//components or containers
import AppWrapper from './components/AppWrapper';

//Fonts Loading
import { Font } from 'expo';
import OpenSans from './fonts/OpenSans-Regular.ttf';
// import OpenSansSemiBold from './fonts/OpenSans-Semibold.ttf';    
import OpenSansSemiBold from './fonts/OpenSans-SemiBold.ttf';       
import OpenSansItalic from './fonts/OpenSans-Italic.ttf';
import fontello from './fonts/fontello/fontello.ttf';

export default class App extends React.Component {

  constructor(){
    super();
    this.state = {
      fontLoaded: false
    };
  }

  async componentWillMount() {
    try {
      await Font.loadAsync({
        fontello,
        OpenSans,
        OpenSansSemiBold,
        OpenSansItalic
      });
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log("error loading icon fonts", error);
    }
  }
  
  render() {
    if(this.state.fontLoaded){
      return (
        <Provider store={store}>
          <AppWrapper/>
        </Provider>
      );
    } else {
      return(<View><Text>Need a loader</Text></View>);
    }
  }
}