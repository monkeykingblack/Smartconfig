import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  Alert,
  TextInput,
  TouchableHighlight,
  Linking,
  Image,
} from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import Logo from './images/logo.png';
import Smart from 'react-native-smartconfig';

var wifi = require('react-native-android-wifi')

export default class Smartconfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ssid: '',
      pass: '',
      text: '',
      btnLabel: 'Submit',
      isSmart: false,
      modalVisible: false,
    }
    this.enableWifi = this.enableWifi.bind(this)
    this.smartConfig = this.smartConfig.bind(this)
  }

  smartConfig = function (){
    if (this.state.isSmart) {
      console.log('stop');
      Smartconfig.stop();
      this.setState({ modalVisible: false, isSmart: false, btnLabel: 'Submit' });
      return;
    }
    console.log('start');
    this.setState({ modalVisible: true, isSmart: true, btnLabel: 'Cancel' });
    this.setState({ isSmart: true });
    var self = this;
    Smartconfig.start({  
      type: 'esptouch',
      ssid: this.state.ssid,
      bssid: '', //"" if not need to filter (don't use null)
      password: this.state.pass
    }).then(function (results) {
      //Array of device success do smartconfig
      self.setState({ modalVisible: false, btnLabel: 'Submit', isSmart: false });
      var alertMsg = 'Devices was connected:\n';
      for (var i = 0; i < results.length; i++) {
        alertMsg += results[i].ipv4 + '\n';
      }
      Alert.alert(
        'Smartconfig',
        alertMsg
      );
    }).catch(function (error) {

    });
  }

  enableWifi() {
    Alert.alert(
      'Wifi is dissable',
      'Do you want to enable Wifi?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => wifi.setEnabled(true) },
      ],
      { cancelable: false }
    )
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      wifi.isEnabled((isEnabled) => {
        if (isEnabled) {
          console.log("wifi service enabled");
        } else {
          this.enableWifi()
        }
      })
    }
    NetworkInfo.getSSID(ssid => {
      console.log(ssid);
      this.setState({ssid})
    });
  }
  render() {
    var enable = false;
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <View style={{ width: 300, height: 150, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ width: 150, height: 77, margin: 10 }}
              source={Logo}
            />
          </View>
          <Text style={styles.text}>SMARTCONFIG</Text>
          <TextInput
            style={styles.input}
            placeholder='SSID'
            autoCapitalize='none'
            onChangeText={(text) => this.setState({ ssid: text })}
            value={this.state.ssid}
          />
          <TextInput
            style={styles.input}
            placeholder='Password'
            autoCapitalize='none'
            onChangeText={(text) => this.setState({ pass: text })}
            value={this.state.pass}
          />
          <TouchableHighlight
            style={styles.submit}
            onPress={this.smartConfig}
            underlayColor='grey'
          >
            <Text style={styles.submitText}>
              {this.state.btnLabel}
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{ alignItems: 'center', backgroundColor: '#F5FCFF' }}>
          <TouchableHighlight
            style={styles.link}
            onPress={() => Linking.openURL('https://iotmaker.vn')}
            underlayColor='grey'
          >

            <Text style={{ fontSize: 17, margin: 25, color: 'darkcyan' }}>
              https://iotmaker.vn
            </Text>
          </TouchableHighlight>
        </View>
      </View>
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
  text: {
    fontSize: 30,
    textAlign: 'center',
    margin: 5,
    color: 'orange',
    fontWeight: 'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    margin: 5,
    height: 30,
    width: 200,
    borderRadius: 5,
    padding: 5,
    borderColor: 'grey',
    borderWidth: 1
  },
  submit: {
    borderRadius: 5,
    backgroundColor: 'orange',
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 38
  },
  submitText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  link: {
    justifyContent: 'space-between'
  }
});

AppRegistry.registerComponent('Smartconfig', () => Smartconfig);
