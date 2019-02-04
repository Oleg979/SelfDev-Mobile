import React, { Component } from "react";
import { View, Image, StyleSheet, KeyboardAvoidingView } from "react-native";
import RegisterForm from "../Components/RegisterForm";

export default class RegisterPage extends Component {
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
          <RegisterForm
            goToLogin={() => this.props.goToLogin()}
            goToVerify={() => this.props.goToVerify()}
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
