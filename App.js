import React, { Component } from 'react';
import { View, Text,TextInput,TouchableOpacity } from 'react-native';
import './config';
import * as firebase from 'firebase'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",
      age:"",
      email:"",
      data:[],
      userId:""
    };
  }

  submit = () => {
    firebase.database().ref("users").push({
      name:this.state.name,
      email:this.state.email,
      age:this.state.age,
    })
  }

  fetchData = () => {
    firebase.database().ref("users").once("value").then(snapShot => {
      snapShot.forEach(value => {
        console.log(value.val())
        console.log(value.key)

        this.state.data.push({
          name:value.val().name,
          age:value.val().age,
          email:value.val().email,
          id:value.key
        })

        this.setState(this.state)
      })
    })
  }

  onUpdate = (item) => {
    this.setState({
      name:item.name,
      age:item.age,
      email:item.email,
      userId:item.id
    })
  }

  updateValue = (id) => {
    firebase.database().ref("users").child(id).update({
      name:this.state.name,
      age:this.state.age,
      email:this.state.email
    })
  }

  onDelete = (id) => {
    firebase.database().ref("users").child(id).remove()
  }

  componentDidMount(){
    this.fetchData()
  }

  render() {
    return (
      <View style={{marginTop:30,flex:1}}>
        <Text> App </Text>
        {console.log(this.state)}
      <TextInput value={this.state.name} placeholder="name" onChangeText={(val) => this.setState({name:val})} />
      <TextInput value={this.state.age} placeholder="age" onChangeText={(val) => this.setState({age:val})} />
      <TextInput value={this.state.email} placeholder="email" onChangeText={(val) => this.setState({email:val})} />
      <TouchableOpacity onPress={() => this.submit()}><Text>Add</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => this.updateValue(this.state.userId)}><Text>update</Text></TouchableOpacity>
      <View style={{width:"100%",flex:1,marginTop:20}}>
        {
          this.state.data.map(item => (
            <TouchableOpacity onPress={() => this.onUpdate(item)}  key={item.id} style={{marginTop:20,width:"100%",backgroundColor:"gray"}}>
              <Text>Name: {item.name}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Age: {item.age}</Text>
              <TouchableOpacity onPress={() => this.onDelete(item.id)}>Delete</TouchableOpacity>
              </TouchableOpacity>
          ))
        }
      </View>
      </View>
    );
  }
}
