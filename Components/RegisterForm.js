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
    name: "",
    pass: "",
    repeatPass: ""
  };

  onChangeLogin = login => this.setState({ login });
  onChangePass = pass => this.setState({ pass });
  onChangeRepeatPass = repeatPass => this.setState({ repeatPass });
  onChangeName = name => this.setState({ name });

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

  register = () => {
    let { name, login, pass, repeatPass } = this.state;
    if (login == "" || pass == "" || name == "" || repeatPass == "")
      return this.showToast("Empty fields!");
    if (pass != repeatPass) return this.showToast("Passwords don't matches!");
    this.showLoading();

    fetch(`${config.BASE_URL}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: login,
        password: pass
      })
    })
      .then(data => data.json())
      .then(data => {
        if (!data.auth) this.showToast(data.text);
        else {
          this.showToast("We've sent you email with a key. Please verify it!");
          AsyncStorage.setItem("email", login).then(() =>
            this.props.goToVerify()
          );
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
          onSubmitEditing={() => this.nameInput.focus()}
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          placeholder="Email"
          placeholderTextColor="rgba(225,225,225,0.7)"
        />
        <TextInput
          onChangeText={name => this.onChangeName(name)}
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.passwordInput.focus()}
          ref={input => (this.nameInput = input)}
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="next"
          placeholder="Name"
          placeholderTextColor="rgba(225,225,225,0.7)"
        />

        <TextInput
          onChangeText={pass => this.onChangePass(pass)}
          style={styles.input}
          returnKeyType="next"
          ref={input => (this.passwordInput = input)}
          onSubmitEditing={() => this.repeatPasswordInput.focus()}
          placeholder="Password"
          placeholderTextColor="rgba(225,225,225,0.7)"
          secureTextEntry
        />
        <TextInput
          onChangeText={repeatPass => this.onChangeRepeatPass(repeatPass)}
          style={styles.input}
          returnKeyType="go"
          ref={input => (this.repeatPasswordInput = input)}
          placeholder="Repeat password"
          placeholderTextColor="rgba(225,225,225,0.7)"
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.register}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerGrey}
          onPress={() => this.props.goToLogin()}
        >
          <Text style={styles.buttonText}>I ALREADY HAVE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: -75
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
