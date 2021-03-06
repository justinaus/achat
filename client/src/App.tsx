import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RoomList from './components/room_list/RoomList';
import Room from './components/room/Room';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact={ true } path="/" component={ RoomList } />
          <Route path="/room/:id" component={ Room } />
        </Switch>
      </Router>
    );
  }
}

export default App;
