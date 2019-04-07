import React, { Component } from "react";
import LoginPage from "./Screens/LoginPage";
import RegisterPage from "./Screens/RegisterPage";
import VerifyPage from "./Screens/VerifyPage";
import { Root } from "native-base";
import { Font } from "expo";
import { StatusBar, AsyncStorage } from "react-native";
import HomePage from "./Screens/HomePage";

export default class App extends Component {
  async componentWillMount() {
    const token = await AsyncStorage.getItem("token");
    if (token) this.setState({ page: "Home" });
    else this.setState({ page: "Login" });

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }
  async componentDidMount() {}
  state = {};
  goToRegister = () => this.setState({ page: "Register" });
  goToLogin = () => this.setState({ page: "Login" });
  goToVerify = () => this.setState({ page: "Verify" });
  goToHome = () => this.setState({ page: "Home" });

  render() {
    return (
      <Root>
        <StatusBar hidden={true} />
        {this.state.page === "Login" ? (
          <LoginPage
            goToRegister={() => this.goToRegister()}
            goToVerify={() => this.goToVerify()}
            goToHome={() => this.goToHome()}
          />
        ) : this.state.page === "Register" ? (
          <RegisterPage
            goToLogin={() => this.goToLogin()}
            goToVerify={() => this.goToVerify()} 
          />
        ) : this.state.page === "Verify" ? (
          <VerifyPage
            goToRegister={() => this.goToRegister()}
            goToLogin={() => this.goToLogin()}
          />
        ) : this.state.page === "Home" ? (
          <HomePage goToLogin={() => this.goToLogin()} />  
        ) : null}
      </Root>
    );   
  }
}
