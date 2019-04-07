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
    pass: "",
    active: false
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
    fetch(`https://gt99.ru/Hakaton/BackEnd/request.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        method: "auth",
        params: {
          login,
          password: pass
        }
      })
    })
      .then(data => data.json())
      .then(data => {  
        console.log(data)
        if (data.status != "ok") {
          this.showToast(data.error.msg.RU);
          if (data.error.msg.EU == "INCORRECT_STATUS") {
            this.showToast(
              "We've sent you email with a key. Please verify it!"
            );
            AsyncStorage.setItem("email", login).then(() => 
              this.props.goToVerify()
            );
          }
        } else {
          AsyncStorage.setItem("token", data.response.token);
          this.props.goToHome(); 
        } 
      });
  };

  goToLogin = () => this.setState({active: true})

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.state.active && (
          <View>
            <TextInput
            onChangeText={login => this.onChangeLogin(login)}
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => this.passwordInput.focus()}
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            placeholder="Логин"
            placeholderTextColor="rgba(225,225,225,0.7)"
          />

          <TextInput
            onChangeText={pass => this.onChangePass(pass)}
            style={styles.input}
            returnKeyType="go"
            ref={input => (this.passwordInput = input)}
            placeholder="Пароль"
            placeholderTextColor="rgba(225,225,225,0.7)"
            secureTextEntry
          />
          <TouchableOpacity style={styles.buttonContainerRed} onPress={this.logIn}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>
        </View>
        )}
        {!this.state.active && (
          <View>
          <TouchableOpacity style={styles.buttonContainer}  onPress={() => this.props.goToRegister()} >
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainerGrey}
         
          onPress={this.goToLogin}
        >
          <Text style={styles.buttonText}>Войти</Text>
        </TouchableOpacity>
        </View>
        )} 
        
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
    paddingVertical: 15,
    
  },
  buttonContainerGrey: {
    borderRadius: 5, 
    marginTop: 10,
    backgroundColor: "#4c4c4e",
    paddingVertical: 15,
  },
  buttonContainerRed: {
    borderRadius: 5, 
    marginTop: 10,
    backgroundColor: "#ff3b1d",
    paddingVertical: 15,
  },
  buttonText: { 
    color: "#fff",    
    textAlign: "center",
    fontWeight: "700"
  },
  loginButton: {
    backgroundColor: "#ff3b1d",
    color: "#fff"
  }
});
