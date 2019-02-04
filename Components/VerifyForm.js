import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  AsyncStorage
} from "react-native";
import { Toast } from "native-base";
import config from "../config/config";

export default class VerifyForm extends Component {
  state = {
    token: "",
    email: null
  };
  componentDidMount = async () => {
    let email = await AsyncStorage.getItem("email");
    this.setState({ email });
  };

  showToast = text =>
    Toast.show({
      text,
      buttonText: "Okay",
      position: "top",
      duration: 3000
    });

  showLoading = () =>
    Toast.show({
      text: "Loading...",
      buttonText: "",
      position: "top",
      duration: 1000
    });

  onChangeToken = token => this.setState({ token });

  verify = () => {
    let { token, email } = this.state;
    console.log(email);
    if (token == "") return this.showToast("Empty key");
    this.showLoading();
    fetch(`${config.BASE_URL}auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        verificationCode: token,
        email
      })
    })
      .then(data => data.json())
      .then(data => {
        if (!data.success) this.showToast(data.text);
        else {
          this.showToast("Success! Now log in");
          this.props.goToLogin();
        }
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TextInput
          onChangeText={token => this.onChangeToken(token)}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numeric"
          returnKeyType="next"
          placeholder="Enter key from your email"
          placeholderTextColor="rgba(225,225,225,0.7)"
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.verify()}
        >
          <Text style={styles.buttonText}>VERIFY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerGrey}
          onPress={() => this.props.goToRegister()}
        >
          <Text style={styles.buttonText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: "rgba(225,225,225,0.2)",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    color: "#fff",
    fontSize: 15,
    fontWeight: "400"
  },
  buttonContainer: {
    borderRadius: 5,
    backgroundColor: "#2980b6",
    paddingVertical: 15
  },
  buttonContainerGrey: {
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "#878484",
    paddingVertical: 15
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  },
  loginButton: {
    backgroundColor: "#2980b6",
    color: "#fff"
  }
});
