import React, { Component } from "react";
import { View, Image, StyleSheet, KeyboardAvoidingView } from "react-native";
import VerifyForm from "../Components/VerifyForm";

export default class VerifyPage extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../assets/logotip.png")}
          />
        </View>
        <View style={styles.formContainer}>
          <VerifyForm
            goToRegister={() => this.props.goToRegister()}
            goToLogin={() => this.props.goToLogin()}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2e2e2"
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
