import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Alert, Button, TouchableOpacity, TouchableHighlight } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';




export default function App() {
  const [isBiometricSupported, setBiometricSupported] = useState(false);


  //for face detection and finger print
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setBiometricSupported(compatible);
    })();
  });



  const fallBackToDefaultAuth = () => {
    console.log("fall back to password authentication");
  };


  const alertComponent = (title, mess, btnText, btnFunction) => {
    return Alert.alert(title, mess, [
      {
        text: btnText,
        onPress: btnFunction,
      }
    ]);

  }


  const TwoButtonAlert = () => {
    Alert.alert('Welcome to app', 'Subscribe now', [
      {
        text: 'Back',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'OK', onPress: () => console.log('Ok Pressed')
      },
    ])
  }


  const handleBiometricAuth = async () => {

    //check for hardware support
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    //fall back to default auth if not available
    if (!isBiometricAvailable)
      return alertComponent(
        'Please enter your password',
        'Biometric auth not supported',
        'Ok',
        () => fallBackToDefaultAuth()
      );




    //chack biometric types available(fingerprint,faceID,iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();



    //check biometrics saved locally
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

    if (!savedBiometrics)
      return alertComponent(
        'Biometric recored not found',
        'Please Login with password',
        'Ok', () => fallBackToDefaultAuth()
      );

    //authenticate with biometric
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promtMessage: 'Login with biometrics',
      cancelLabel: 'cancel',
      disableDeviceFallback: true,
    });


    //log the user in on success
    if (biometricAuth) { TwoButtonAlert() };
    console.log({ isBiometricAvailable });
    console.log({ supportedBiometrics });
    console.log({ savedBiometrics });
    console.log({ biometricAuth });
  };


  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={{ color: 'black' }}>
          {isBiometricSupported ? 'Your device is compatible with biometics' : 'Face or Fingeerprint Scanner is available on this device.'}

        </Text>
        <TouchableHighlight style={{ height: 60, marginTop: 200 }}>
          <TouchableOpacity style={{
            height: 40,
            width: '40%', borderRadius: 12, backgroundColor: 'black', padding: 10, justifyContent: 'center', alignItems: 'center'
          }}
          onPress={handleBiometricAuth}
          >
            <Text style={{ color: '#fff', fontSize: 15, }}>Login With FingerPrint</Text>
          </TouchableOpacity>
        </TouchableHighlight>

        <StatusBar style='auto' />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',

  },
});
