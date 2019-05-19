import React, { Component } from "react";

interface IProps {
  count: number,
  iconColor: string,
  objStyle: object
}

class ConnectedCount extends Component<IProps, any> {
  render() {
    const { count, iconColor, objStyle } = this.props;

    return (
      <div style={ objStyle }>
        <svg xmlns="http://www.w3.org/2000/svg" height="8" viewBox="0 0 12 6.5">
          <path d="M4,7.5H2.5V6h-1V7.5H0v1H1.5V10h1V8.5H4ZM9,8a1.5,1.5,0,1,0-.455-2.93A2.467,2.467,0,0,1,9,6.5a2.516,2.516,0,0,1-.45,1.43A1.5,1.5,0,0,0,9,8ZM6.5,8A1.5,1.5,0,1,0,5,6.5,1.494,1.494,0,0,0,6.5,8ZM9.81,9.08a1.85,1.85,0,0,1,.69,1.42v1H12v-1C12,9.73,10.815,9.255,9.81,9.08ZM6.5,9c-1,0-3,.5-3,1.5v1h6v-1C9.5,9.5,7.5,9,6.5,9Z" transform="translate(0 -5)" fill={ iconColor }/>
        </svg>
        <span>  </span>
        { count }명
      </div>
    );
  }
}

export default ConnectedCount