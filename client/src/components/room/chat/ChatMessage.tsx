import React, { Component } from "react";

interface IProps {
  userName: string,
  msg: string,
  strTime: string,
  isMyChat: boolean
}

class ChatMessage extends Component<IProps, any> {
  render() {
    const { userName, msg, strTime, isMyChat } = this.props;

    return (
      <li className={ isMyChat ? 'liMe' : 'liOthers' }>
        <span>{ userName + ': ' }</span>
        <span>{ msg + ' - ' }</span>
        <span>{ strTime }</span>
      </li>
    );
  }
}

export default ChatMessage