import React, { Component } from "react";

interface IProps {
  noticeMsg: string
}

class ChatNotice extends Component<IProps, any> {
  render() {
    const { noticeMsg } = this.props;

    return (
      <li className={ 'liConnected' }>
        <span>{ noticeMsg }</span>
      </li>
    );
  }
}

export default ChatNotice