/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ToastAndroid,
   Vibration,
  View
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Container, Header, Title, Content, Button} from 'native-base';
import GeoFencing from 'react-native-geo-fencing';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import GreatCircle from 'great-circle';
import _ from 'lodash'


class WarnfieldM extends Component {
  constructor(props){
    super(props);
    this.state={
      lat:0,
      lng:0,
      calculations:0,
      track:0,
      closest:0,
      enteredAstation:0,
      lastStaton:'null'
    }
  }
// sincap lat lng 38.006246 32.530351
  componentDidMount() {
      

    
  }

_getLoc(){

  stations = [
        { 
          name:'Amsterdam centraal',
          lat:52.379246,
          lng:4.900315
        },
        {
          name:'Amstel',
          lat:52.360112,
          lng:4.905175
        },
         {
          name:'Utrecht centraal',
          lat:52.089372,
          lng:5.110169
        },
        {
          name:'Eindhoven station ',
          lat:51.443880,
          lng:5.478372
        },
         {
          name:'Sincap',
          lat:38.006246,
          lng:32.530351
        },
         {
          name:'Migros',
          lat:38.010703,
          lng:32.522793
        },

      ]
  this.setState({
    track:1
  })
 BackgroundGeolocation.configure({
      desiredAccuracy: 0,
      stationaryRadius: 10,
      distanceFilter: 5,
      locationTimeout: 30,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: 1, // 0 => ANDROID_DISTANCE_FILTER_PROVIDER | 1 => ANDROID_ACTIVITY_PROVIDER 
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
     
    });
    
    BackgroundGeolocation.on('location', (location) => {
    

      
      //handle your locations here   
      lat=location.latitude
      lng=location.longitude
      
      Math.round(0.5234 * 10) / 10;
      calculations = []
   
  _.forEach(stations, function(station) {
        distan =Math.round(GreatCircle.distance(lat, lng, station.lat, station.lng, "KM")* 10)/ 10
                calculations.push({
                  name:station.name,
                  distance:distan
                }); 
        });

  closest= _.minBy(calculations, function(o) { return o.distance; });
  
  if (closest.distance<0.3) {
    this.setState({
      enteredAstation:1,
      lastStaton:closest.name
    })
    
    Vibration.vibrate([0, 500, 200, 500], true)

  }


  
  this.setState({
    calculations:calculations,
    closest:closest
  })
     
  



      
      
      this.setState({
        lat:lat,
        lng:lng
      })


    }); 
 
    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });
 
    BackgroundGeolocation.start(() => {
      console.log('[DEBUG] BackgroundGeolocation started successfully');    
    });

    
}

_stopLoc(){
  this.setState({
    calculations:0,
    track:0})
  BackgroundGeolocation.stop(() => {
      console.log('[DEBUG] BackgroundGeolocation stop successfully');    
    });
}
_stopVib(){
  this.setState({enteredAstation:0})
 Vibration.cancel()
}
  render() {
    if (this.state.track==0) {
      isTracking = 'Location is not tracking.'
      getLocButton = <Button block primary onPress={this._getLoc.bind(this)} > Get Location! </Button>
    } else {
       isTracking = 'Location is tracking.if any problem please push \n STOP GETTING LOCATION and GET LOCATION again'
      getLocButton = <Button block danger onPress={this._stopLoc.bind(this)} >  Stop Geting Location! </Button>
    }


    if(this.state.enteredAstation==1){
      stop_vibrate = <Button block danger onPress={this._stopVib.bind(this)} >  Stop vibrate! </Button>
    } else {
      stop_vibrate = <Text></Text>
    }
    
    if (this.state.enteredAstation==1) {
      inStation =  <Text  > You are in {this.state.lastStaton} </Text>
    } else {
      inStation =  <Text  > You are far from any station </Text>
    }

    if (this.state.calculations!=0) {
      distanceList=   <Text style={styles.numbers} >                              
                                distance to {this.state.calculations[0].name} is {this.state.calculations[0].distance} km {"\n"}
                                distance to {this.state.calculations[1].name} is {this.state.calculations[1].distance} km {"\n"}
                                distance to {this.state.calculations[2].name} is {this.state.calculations[2].distance} km {"\n"}
                                distance to {this.state.calculations[3].name} is {this.state.calculations[3].distance} km {"\n"}
                                distance to {this.state.calculations[4].name} is {this.state.calculations[4].distance} km {"\n"}
                                distance to {this.state.calculations[5].name} is {this.state.calculations[5].distance} km {"\n"}{"\n"}
                                closest : {this.state.closest.name} to {this.state.closest.distance}

                               </Text>
    } else {
     distanceList = <Text style={styles.numbers} >  Locations will appear here. It can take long time {"\n"}  please wait   </Text>
    }


    return (
      <Container>
                    <Header>
                        <Title>Warnfield</Title>
                    </Header>
                    <Content padder>
                        <Grid>
                            <Row style={{  height: 100 }}>

                              <Text style={styles.middleText} > lat:{this.state.lat} lng: {this.state.lng} {"\n"}
                              {isTracking} </Text>
                            </Row>
                            <Row style={{  height: 200  }}>
                              {distanceList}
                            </Row>

                           
                            {getLocButton}
                            {stop_vibrate}
                            

                            <Row style={{  height: 100 }}>
                              {inStation}
                            </Row>
                          </Grid>
                    </Content>

                </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('WarnfieldM', () => WarnfieldM);
