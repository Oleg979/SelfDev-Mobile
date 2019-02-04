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

export default class AddForm extends Component {
  state = {
    text: null,
    tag: null,
    hours: null,
    minutes: null
  };
  handleTextChange = text => this.setState({ text });
  handleTagChange = tag => this.setState({ tag });
  handleHoursChange = hours => this.setState({ hours });
  handleMinutesChange = minutes => this.setState({ minutes });
  addTask = async () => {
    let { text, tag, hours, minutes } = this.state;
    console.log(text, tag, hours, minutes);
    const token = await AsyncStorage.getItem("token");
    if (
      text == null ||
      text.trim() == "" ||
      tag == null ||
      tag.trim() == "" ||
      hours == null ||
      hours.trim() == "" ||
      hours > 23 ||
      hours < 0 ||
      minutes == null ||
      minutes.trim() == "" ||
      minutes > 59 ||
      minutes < 0
    )
      this.showToast("Incorrect field values!");
    else {
      let date = new Date();
      date.setHours(+hours);
      date.setMinutes(+minutes);

      fetch(`${config.BASE_URL}tasks/add`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          tag: tag,
          time: `${this.state.hours}:${this.state.minutes}`
        })
      })
        .then(data => {
          this.setState(
            {
              text: "",
              hours: "",
              minutes: "",
              tag: ""
            },
            () => {
              this.props.goToMainPage();
              console.log("done");
            }
          );
        })
        .catch(e => this.showToast(e));
      fetch(`${config.BASE_URL}push/send`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          time: Math.round(+date / 1000)
        })
      }).catch(e => this.showToast(e));
    }
  };
  showToast = text =>
    Toast.show({
      text,
      buttonText: "Okay",
      position: "top",
      duration: 3000
    });
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          placeholder="Text"
          placeholderTextColor="rgba(225,225,225,0.7)"
          onChangeText={text => this.handleTextChange(text)}
          onSubmitEditing={() => this.tagInput.focus()}
          value={this.state.text}
        />

        <TextInput
          style={styles.input}
          placeholder="Tag"
          placeholderTextColor="rgba(225,225,225,0.7)"
          onChangeText={text => this.handleTagChange(text)}
          ref={input => (this.tagInput = input)}
          onSubmitEditing={() => this.hoursInput.focus()}
          value={this.state.tag}
        />

        <TextInput
          style={styles.input}
          placeholder="Hours"
          placeholderTextColor="rgba(225,225,225,0.7)"
          keyboardType="numeric"
          onChangeText={text => this.handleHoursChange(text)}
          ref={input => (this.hoursInput = input)}
          onSubmitEditing={() => this.minutesInput.focus()}
          value={this.state.hours}
        />
        <TextInput
          style={styles.input}
          placeholder="Minutes"
          placeholderTextColor="rgba(225,225,225,0.7)"
          keyboardType="numeric"
          onChangeText={text => this.handleMinutesChange(text)}
          ref={input => (this.minutesInput = input)}
          value={this.state.minutes}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.addTask()}
        >
          <Text style={styles.buttonText}>ADD TASK</Text>
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
    height: 60,
    backgroundColor: "rgba(225,225,225,0.2)",
    borderRadius: 5,
    marginBottom: 10,
    padding: 15,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600"
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
