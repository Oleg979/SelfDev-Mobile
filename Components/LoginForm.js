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

export default class LoginForm extends Component {
  state = {
    login: "",
    pass: ""
  };

  onChangeLogin = login => this.setState({ login });
  onChangePass = pass => this.setState({ pass });

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

  logIn = () => {
    let { login, pass } = this.state;
    if (login == "" || pass == "") return this.showToast("Empty fields!");
    this.showLoading();
    fetch(`${config.BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: login,
        password: pass
      })
    })
      .then(data => data.json())
      .then(data => {
        if (!data.auth) {
          this.showToast(data.text);
          if (data.text == "Email is not verified") {
            this.showToast(
              "We've sent you email with a key. Please verify it!"
            );
            AsyncStorage.setItem("email", login).then(() =>
              this.props.goToVerify()
            );
          }
        } else {
          AsyncStorage.setItem("token", data.token);
          this.props.goToHome();
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TextInput
          onChangeText={login => this.onChangeLogin(login)}
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.passwordInput.focus()}
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          placeholder="Email"
          placeholderTextColor="rgba(225,225,225,0.7)"
        />

        <TextInput
          onChangeText={pass => this.onChangePass(pass)}
          style={styles.input}
          returnKeyType="go"
          ref={input => (this.passwordInput = input)}
          placeholder="Password"
          placeholderTextColor="rgba(225,225,225,0.7)"
          secureTextEntry
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={this.logIn}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerGrey}
          onPress={() => this.props.goToRegister()}
        >
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
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
