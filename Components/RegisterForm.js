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
    let { name, login, pass } = this.state;
    if (login == "" || pass == "" || name == "")
      return this.showToast("Empty fields!");
    this.showLoading();

    fetch(`https://gt99.ru/Hakaton/BackEnd/request.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        method: "registration",
        params: {
          login,
          password: pass,
          email: login
        }
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log(data)
         if (data.status != "ok") this.showToast(data.error.msg.RU);
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
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.register}
        >
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
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
    backgroundColor: "rgb(76,76,78)",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    color: "#fff",
    fontSize: 15,
    fontWeight: "400"
  },
  buttonContainer: {
    borderRadius: 5,
    backgroundColor: "#ff3b1d",
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
