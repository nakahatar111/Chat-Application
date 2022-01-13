import react from 'react';
import React, { Component } from 'react';
import Inbox from './inbox';

class Login extends React.Component {
  state = {
    count: 1,
    name: '',
    user: '',
    users: [],
    all_user: []
  }

  componentDidMount(){
    this.getUsers();
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    const time = `${weekday[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })}`;
    //console.log(time);
    //console.log('Wed, Jan 12, 01:25 AM');
    //console.log(time.substring(time.length-8, time.length-3));
    //console.log(this.timeComparison('Wed, Jan 12, 01:25 AM','Feb, Jan 12, 02:25 AM'));
  }

  handleApp= ()=>{
    this.setState({users: [{id: this.state.count, user: this.state.user}]});
    this.setState({count: this.state.count+1});
    this.getUser();
  }

  getUser(){
    fetch(`http://192.168.1.156:4000/users/get-name?id=${this.state.user}`)
    .then(response => response.json())
    .then(response => this.setState({name: response.data}))
    .catch(err => console.error(err))
  }

  getUsers(){
    fetch('http://192.168.1.156:4000/users/get-all')
    .then(response => response.json())
    .then(response => this.setState({all_user: response.data}))
    .catch(err => console.error(err))
  }
  

  render() { 
    return (<react.Fragment>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand p-2" href="#">Messenger</a>
      </nav>
      <div style={{width: '60vw'}} className={this.getClasses()}>
        <input className='form-control' placeholder='Enter Username' value={this.state.user} onChange={e => this.setState({user:e.target.value})}/>
        <div className='input-group-append'>
          <button className='btn btn-outline-secondary' onClick={this.handleApp}>login</button>
        </div>
      </div>
      <div className='container-fluid p-0'>
        <div className='row m-0'>
            {this.state.users.map(user=>(
              <Inbox
                key = {user.id}
                name = {this.state.name}
                user = {user.user}
                all_user = {this.state.all_user}
              />
            ))}
        </div>
      </div>
      
    </react.Fragment>);
  }
  getClasses() {
    let classes = "input-group md-3 ";
    classes += this.state.users.length === 0 ? "" : "visually-hidden";
    return classes;
  }
}
 
export default Login;