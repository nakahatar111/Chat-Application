import React, { Component,useEffect } from 'react';
import Chat from './chat';

class App extends React.Component {
  state = {
    isPending: true,
    sender: '',
    messages: [],
    msg: '',
    msg_num: 0
  }


  constructor(props){
    super(props);
  }

  componentDidMount(){
    this.setState({sender: this.props.user});
    this.getMessages();
  }

  
  checkScroll(){
    if(this.state.msg_num == 0){
      document.getElementById('message').scrollTop = document.getElementById('message').scrollHeight;
      this.setState({msg_num: this.state.messages.length});
    }
    else if(this.state.messages.length !== this.state.msg_num){
      document.getElementById('message').scrollTop = document.getElementById('message').scrollHeight;
      this.setState({msg_num: this.state.messages.length});
    }
  }

  timeComparison(time1, time2){
    const arr1 = time1.split(', ');
    const arr2 = time2.split(', ');
    if(arr1[1] !== arr2[1]){return true}
    const t1 = arr1[2].substring(0,5).split(':');
    const t2 = arr2[2].substring(0,5).split(':');
    if(t1[1] <= t2[1]){
      if(t1[0] < t2[0]){return true}
      else{return false}}
    else{
      if(t2[0] - t1[0] > 1){return true}
      else{return false}}
  }

  addTimestamp =_=>{
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const time = `${weekday[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}`;
    console.log(this.props.time_stamp);
    if(this.props.time_stamp === '0'){
      fetch(`http://192.168.1.156:4000/message/add?id=0&sender=-1&msg=${time}&chat_id=${this.props.chat_id}`)
      .catch(err => console.error(err))
    }
    else{
      if(this.timeComparison(this.props.time_stamp, time)){
        console.log(`add time stamp: ${time}`)
        fetch(`http://192.168.1.156:4000/message/add?id=0&sender=-1&msg=${time}&chat_id=${this.props.chat_id}`)
        .catch(err => console.error(err))
      }
    }
    this.props.setTimestamp(time);
  }

  addMessages = _ =>{
    this.addTimestamp();
    fetch(`http://192.168.1.156:4000/message/add?id=0&sender=${this.props.user}&msg=${this.state.msg}&chat_id=${this.props.chat_id}`)
    .then(this.getMessages)
    .catch(err => console.error(err))
    this.setState({msg: ''});
  }

  getMessages = _ =>{
    fetch(`http://192.168.1.156:4000/message/get?chat_id=${this.props.chat_id}`)
    .then(response => response.json())
    .then(response => {this.setState({messages: response.data}); this.setState({isPending: false})})
    .catch(err => console.error(err))
    this.checkScroll();
  }

  styles = {
    height: '79.2vh',
    width: '50vw',
    overflow: 'auto',
    right: '0',
    margin: '0px'
  };

  handleDisable(){
    if(this.state.msg.length != 0){
      return 'btn btn-primary';
    }
    return 'btn btn-outline-primary disabled';
  }

  render() { 
    const {messages} = this.state;
    return (
    <React.Fragment>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand p-2" href="#">User: {this.props.name.map(user => user.name).join(', ')}</a>
      </nav>
      <div id='message' style={this.styles}>
        {this.state.isPending && <div>Loading...</div>}
        {messages.map(chat => (
          <Chat
          key = {chat.id}
          chat = {chat}
          sender = {this.props.user}
          name = {this.props.name}
          chat_id = {this.props.chat_id}
          />
        ))}
      </div>
    <Refetch/>
    
    <div style={{width: '50vw', right: 0}} className='input-group md-3'>
      <input id = 'msg-box' className='form-control' placeholder='message' value={this.state.msg} onChange={e => this.setState({msg:e.target.value})}/>
      <div className='input-group-append'>
        <button className= {this.handleDisable()} onClick={this.addMessages}>Send</button>
      </div>
    </div>
    
    <button className='visually-hidden' id = 'refresh' onClick={this.getMessages}>Refresh</button>
    </React.Fragment>);
  }

}

function Refetch() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Fetching Data...');
      document.getElementById('refresh').click();
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return null
}

export default App;