import react from 'react';
import React, { Component } from 'react';


class Box extends React.Component {
  state={
    name: ''
  }
  constructor(props){
    super(props);  
  }

  componentDidMount(){ 
    const arr = this.props.chat_id.split('_').filter(id => id!==this.props.user);
    const name = this.props.all_user.filter(user => arr.includes(`${user.id}`)).map(user => user.name).join(', ');
    this.setState({name: name});
  }

  style = {
    padding: '14px',
    fontSize:'18px'
  }
  render() { 
    return (<react.Fragment>

      <a style={this.style} onClick= {() => {this.props.onChange(this.props.chat_id)}} className="list-group-item list-group-item-action">{this.state.name}   {this.props.time_stamp}</a>
    </react.Fragment>);
  }
}
 
export default Box;