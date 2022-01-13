import react from 'react';
import React, { Component } from 'react';
import App from './App';
import Box from './box';
import Create_chat from './create_chat';

class Inbox extends React.Component {
  state = {
    chat_ids: [],
    chat_id: [],
    receiver: [],
    name: [],
    create_chat: [],
    time_stamp: ''
  }

  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.getChats();
  }

  styles = {
    height: '90vh',
    width: '30vw',
    overflow: 'auto',
    border: '1px solid grey'
  };

  getChats=()=>{
    fetch(`http://192.168.1.156:4000/inbox/get-chats?user=${this.props.user}`)
    .then(response => response.json())
    .then(response => this.setState({chat_ids: response.data}))
    .catch(err => console.error(err))
  }

  handleIdChange = (chat_id) => {
    const time_stamp = this.state.chat_ids.filter(id => id.chat_id === chat_id).map(id=>id.time);
    const arr = chat_id.split('_').filter(id => id!==this.props.user);
    const name = this.props.all_user.filter(user => arr.includes(`${user.id}`));
    this.setState({name: name});
    this.setState({create_chat: []});
    this.setState({chat_id: [chat_id]});
    this.setState({time_stamp: time_stamp[0]});
  }

  handleAddChat=()=>{
    this.setState({chat_id: []});
    this.setState({create_chat: [1]});
  }

  handleTimestamp = (time) =>{
    fetch(`http://192.168.1.156:4000/time_stamp?chat_id=${this.state.chat_id[0]}&time=${time}`)
    .then(this.setState({time_stamp: time}))
    .catch(err => console.error(err))
    this.getChats();
  }

  render() {
    return (
    <react.Fragment>
    <div  style={this.styles} className='col p-0'>
      <h4 className='m-3' style={{ textAlign: 'center', fontWeight: 'bold'}}>Chats
      <button onClick={this.handleAddChat} className='badge rounded-pill bg-white float-end p-0 m-1' style={{fontWeight: '400', fontSize:'25px',border:'none', color: 'black'}}>+</button></h4>
      <div className="bg-light list-group">
        {this.state.chat_ids.map(chat_id =>
          <Box
            key = {chat_id.id}
            user = {this.props.user}
            chat_id = {chat_id.chat_id}
            onChange = {this.handleIdChange}
            all_user = {this.props.all_user}
            time_stamp = {chat_id.time}
          />
        )}
      </div>
    </div>
    {<div style={{border: '1px solid grey'}} className='col p-0'>
    {this.state.chat_id.map(chat => (
      <App
        key = {chat}
        user = {this.props.user}
        chat_id = {this.state.chat_id}
        name = {this.state.name}
        time_stamp = {this.state.time_stamp}
        setTimestamp = {this.handleTimestamp}
      />)
    )}
    {this.state.create_chat.map(()=>
      <Create_chat
        key = {1}
        chat_ids = {this.state.chat_ids}
        onChange = {this.handleIdChange}
        user = {this.props.user}
        getChats = {this.getChats}
        time_stamp = {this.state.time_stamp}
        setTimestamp = {this.handleTimestamp}
      />
    )}
    </div>}
    </react.Fragment>);
  }
}
/*
{<App
        key = {this.props.user.id}
        user = {this.props.user}
        chat_id = {this.state.chat_id}
        name = {this.state.name}
      />}
{this.state.chat_id.map(chat => (
  <App
    key = {this.props.user.id}
    user = {this.props.user}
    chat_id = {this.state.chat_id}
    name = {this.state.name}
  />
))}
*/
export default Inbox;