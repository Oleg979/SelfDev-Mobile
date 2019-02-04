import React, { Component } from "react";
import { List } from "native-base";
import { StyleSheet, View } from "react-native";
import Task from "../Components/Task";

export default class TaskList extends Component {
  render() {
    return (
      <View style={styles.item}>
        <List style={styles.item}>
          {this.props.tasks.map(task => (
            <Task
              time={task.time}
              tag={task.tag}
              text={task.text}
              key={task._id}
              id={task._id}
              isChecked={task.isChecked}
              deleteTask={id => this.props.deleteTask(id)}
            />
          ))}
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tag: {
    color: "black",
    fontWeight: "500",
    fontSize: 20
  },
  text: {
    color: "white",
    fontWeight: "500"
  },
  time: {
    fontWeight: "500"
  },
  item: {
    flex: 1
  }
});
