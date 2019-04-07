import React, { Component } from 'react';
import { Container, Header, Content, ListItem, CheckBox, Text, Body, Button, Form, Item, Picker, Icon  } from 'native-base';
import { View } from 'react-native';
export default class AddForm extends Component {
  state = {
    food: true,
    clothes: true,
    cosmetic: true,
    radius: "150"
  }
  
  render() {
    return (
      <View>
        <Text style={{padding: 10, margin: 10, fontWeight: '300'}}>Выберите радиус видимости уведомлений:</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Выберите радиус видимости"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.radius}
                onValueChange={e => this.setState({radius: e})}
              >
                <Picker.Item label="100м" value="100" />
                <Picker.Item label="150м" value="150" />
                <Picker.Item label="200м" value="200" />
                <Picker.Item label="250м" value="250" />
              </Picker>
            </Item>
          </Form>
        <Text style={{padding: 10, margin: 10, fontWeight: '300'}}>Получать уведомления в следующих категориях:</Text>
          <ListItem onPress={() => {this.setState({food: !this.state.food});}}>
            <CheckBox checked={this.state.food} color="#ff3b1b"/>
            <Body>
              <Text>Еда</Text>
            </Body>
          </ListItem>
          <ListItem onPress={() => {this.setState({clothes: !this.state.clothes}); }}>
            <CheckBox checked={this.state.clothes} color="#ff3b1b"/>
            <Body>
              <Text>Одежда</Text>
            </Body>
          </ListItem>
          <ListItem onPress={() => {this.setState({cosmetic: !this.state.cosmetic});}}>
            <CheckBox checked={this.state.cosmetic} color="#ff3b1b"/>
            <Body>
              <Text>Косметика</Text>
            </Body>
          </ListItem>
          <Button block danger onPress={() => {this.setState({food: false, clothes: false, cosmetic: false});}}> 
            <Text>Отключить все уведомления</Text>
          </Button>
          <Button block success onPress={() => this.props.changeSettings(this.state)}>
            <Text>Сохранить</Text>
          </Button>
          </View>
       
    );
  }
}