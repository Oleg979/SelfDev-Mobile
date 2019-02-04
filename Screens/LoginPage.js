import React, { Component } from "react";
import { View, Image, StyleSheet, KeyboardAvoidingView } from "react-native";
import LoginForm from "../Components/LoginForm";

export default class LoginPage extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../assets/logo.png")}
          />
        </View>
        <View style={styles.formContainer}>
          <LoginForm
            goToRegister={() => this.props.goToRegister()}
            goToVerify={() => this.props.goToVerify()}
            goToHome={() => this.props.goToHome()}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3d566e"
  },
  loginContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  logo: {
    position: "absolute",
    width: 350,
    height: 100
  },
  title: {
    color: "#FFF",
    marginTop: 120,
    width: 180,
    textAlign: "center",
    opacity: 0.9
  }
});
