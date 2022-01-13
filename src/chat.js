import react from 'react';
import React, { Component } from 'react';

class Chat extends React.Component {
  constructor(props){
    super(props);
  }
  render() { 
    return (<react.Fragment>
      <h5>{this.userBadge()}<div className={this.getBadgeClassses()} style={this.getStyle()} key={this.props.chat.id}>{this.props.chat.msg}</div><br></br></h5>
    </react.Fragment>);
  }

  getStyle(){
    if(this.props.chat.sender == -1){
      return {fontSize: '13px', color: 'gray'}
    }
    return {fontWeight: '450'}
  }
  
  getBadgeClassses() {
    let classes = "badge rounded-pill p-2 bg-";
    if(this.props.chat.sender == this.props.sender){
      classes += "primary float-end"; 
    }
    else if(this.props.chat.sender == -1){
      classes = 'text-center';
    }
    else{
      classes +="secondary float-start";
    }
    return classes;
  }

  userBadge(){
    if(this.props.chat.sender == -1){
      return
    }
    else if(this.props.chat.sender != this.props.sender){
      const name = this.props.name.filter(name => this.props.chat.sender === name.id).map(user => user.name).toString().substring(0,1).toUpperCase();
      return <span className='badge rounded-pill bg-light float-start' 
      style={{fontWeight: '700', fontSize: '15px', border: '2px solid grey', padding:'6px', color:'black', marginTop:'0px'}}>{name}</span>
    }
    return
  }
  
}
 
export default Chat;