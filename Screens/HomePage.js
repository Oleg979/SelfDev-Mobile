import React, { Component } from "react";
import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'
import { Constants, MapView, Location, Permissions, Notifications } from 'expo';
import PTRView from "react-native-pull-to-refresh";
import { Text, View, Image, StyleSheet, AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Body,
  Right,
  Title,
  Left,
  Toast
} from "native-base";
import { Font } from "expo"; 
import AddForm from "../Components/AddForm";
import TaskList from "../Components/TaskList";
import config from "../config/config";

export default class HomePage extends Component {

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color="white" name={icon} />
  )
 
  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  tabs = [
    {
      key: 'Лента',
      icon: 'apps',
      label: 'Настройки',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'Настройки',
      icon: 'flag',
      label: 'Уведомления',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'Карта',
      icon: 'map',
      label: 'Карта',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'Выход',
      icon: 'close-circle',
      label: 'Выход',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }
  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    markers: [],
    activeTab: "Лента",
    active: 0,
    tasks: [],
    food: true,
    clothes: true,
    cosmetic: true,
    radius: "150",
    title: "sdsd",
    body: "adasxxxxxxd"
  }

  changeSettings = async ({food, clothes, cosmetic, radius}) => {
    fetch(`https://gt99.ru/Hakaton/BackEnd/request.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        method: "setSettings",
        params: {
          token: await AsyncStorage.getItem("token"),
          radius: Number(radius),
          categories: {
            "eat": food,
            "cloth": clothes,
            "cosmetics": cosmetic
          }
        }
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log(data)
      })
  }

  ///////////////////////////////////////////
  getMarkers = async () => {
    fetch(`https://gt99.ru/Hakaton/BackEnd/request.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        method: "getPlaces",
        params: {
          token: await AsyncStorage.getItem("token"),
          lat: this.locationResult.coords.latitude,
          lon: this.locationResult.coords.longitude
        }
      })
    })
      .then(data => data.json())
      .then(data => {
        console.log(data.response)
        this.setState({markers: data.response}) 
      })
  }
  ///////////////////////////////////////////
  async componentDidMount() {
    //await this.refreshTasks();
    let location = await this._getLocationAsync();
    this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0022, longitudeDelta: 0.0021 }});
    setInterval(this._getLocationAsync, 8000);
    await registerForPushNotifications();
  }

  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();

    this.subscription = Notifications.addListener(this.handleNotification);

    this.setState({
      token,
    });
  }

  sendPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
    return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: { message: `${title} - ${body}` },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  
  locationResult = {}
  _handleMapRegionChange =  mapRegion => {
     this.mapRegion = mapRegion;
  };

  _getLocationAsync = async () => { 
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      /* this.setState({
        locationResult: 'Permission to access location was denied',
      }); */
    } else {
      /* this.setState({ hasLocationPermissions: true });*/
    } 
 
    let location = await Location.getCurrentPositionAsync({});
    //this.setState({ locationResult: JSON.stringify(location) });
    this.locationResult =  location;
    console.log(location);
    await this.getMarkers();
    return location;
    // Center the map on the location we just fetched.
     //this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0022, longitudeDelta: 0.0021 }});
   };

   
   
  showToast = text =>
    Toast.show({
      text,
      buttonText: "Okay",
      position: "top",
      duration: 3000
    });

  
  setActive = active => this.setState({ active });
  logout = async () => {
    await AsyncStorage.removeItem("token");
    this.props.goToLogin();
  };

  refreshTasks = async () => {
    const token = await AsyncStorage.getItem("token");
    
  };

  goToMainPage = () => {
    this.setActive(0);
    this.refreshTasks();
  };
  //////////////////////////
  deleteTask = async id => {
    this.setState({ tasks: this.state.tasks.filter(task => task._id != id) });
    const token = await AsyncStorage.getItem("token");
    fetch(`${config.BASE_URL}tasks/${id}`, {
      method: "DELETE",
      headers: {
        "x-access-token": token
      }
    })
      .then(data => data.json())
      .then(data => {
        if (!data.success) this.showToast("Error!");
        this.refreshTasks();
      })
      .catch(e => this.showToast(e));
  };

  checkTask = async (id, isChecked) => {
    const token = await AsyncStorage.getItem("token");
    let type = isChecked ? "un" : "";
    fetch(`${config.BASE_URL}tasks/${type}check/${id}`, {
      method: "GET",
      headers: {
        "x-access-token": token
      }
    })
      .then(data => data.json())
      .then(data => {
        if (!data.success) throw new Error();
        this.refreshTasks();
      })
      .catch(e => history.push("/login"));
  };

  /////////////////////////////////////////////////
  render() {
    return (
      <Container style={styles.container}>
        {<Header style={{backgroundColor: '#4c4c4e'}}> 
          <Left/>
          <Body>
            <Title>{this.state.activeTab}</Title>
          </Body>
          <Right />
        </Header>}
        
          <Content>
            {this.state.activeTab == "Лента" && (
               <AddForm goToMainPage={() => this.goToMainPage()} changeSettings = {({food, clothes, cosmetic, radius}) => this.changeSettings({food, clothes, cosmetic, radius})} />
            )}
            {this.state.activeTab == "Профиль" && (
              <TaskList
                tasks={this.state.tasks}
                deleteTask={id => this.deleteTask(id)}
              /> 
            )}
            {this.state.activeTab == "Карта" && (
              <Container>
              <MapView 
                showsScale={true}
                showsCompass={true}
                showsPointsOfInterest={true}
                showsBuildings={true}
                style={{ flex: 1 }}
                initialRegion={ this.mapRegion || this.state.initialRegion}
                region={this.mapRegion || this.state.mapRegion}
                onRegionChange={this._handleMapRegionChange}
                loadingIndicatorColor="#666666"
                loadingBackgroundColor="#eeeeee"
                moveOnMarkerPress = {true} 
                
                showsPointsOfInterest = {false}
                loadingEnabled = {true}
                showsUserLocation={true}
                followsUserLocation={false}
                
                
              >
              {this.state.markers && this.state.markers.length > 0 && this.state.markers.map((marker, index) => 
              <MapView.Marker
                  coordinate={{ latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude)}}
                  image={marker.type == "eat" ? require('../assets/fast-food.png') : marker.type == "cloth" ? require('../assets/clothes.png') : require('../assets/make-up.png')  }
                  title={marker.name}
                  description={marker.type}
                  key={index}
                />  
              )}
            </MapView> 

      </Container> 
      )}
          </Content> 
          <BottomNavigation
          onTabPress={newTab => {
            try {
              if(newTab.key == "Выход")
              return this.logout();  
              else if(newTab.key == "Настройки") {
                 this.sendPushNotification().catch(e => console.log(e))
                 console.log(1)
              }
              
              else this.setState({ activeTab: newTab.key })
            }
            catch(e) {
              console.log(e); 
            } 
          }} 
          renderTab={this.renderTab}
          tabs={this.tabs} 
        />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  logo: {
    position: "absolute",
    marginTop: -45,
    marginLeft: 120,
    width: 150,
    height: 218
  },
  container: {
    flex: 1,
    backgroundColor: "#dbdbdb"
  },
  header: {
    backgroundColor: "#e2e2e2"
  },
  footer: {
    backgroundColor: "#ff3b1d"
  },
  button: {
    backgroundColor: "#80ff3b1d"
  }
});
