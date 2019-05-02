import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, RouteComponentProps } from 'react-router-dom';
import RoomList from './components/RoomList';
import Room from './components/Room';

class App extends Component {
  userName: string;

  constructor( props: any ) {
    super( props );

    this.userName = 'temp user name' + Math.round( Math.random() * 100 );
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact={ true } path="/" component={ RoomList } />
          <Route 
            path="/room/:id" 
            component={ ( props:RouteComponentProps ) => <Room {...props} userName={ this.userName }/> } 
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
