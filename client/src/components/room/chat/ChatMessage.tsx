import React, { Component } from "react";
import classNames from "classnames";
import styles from './ChatMessage.module.css'

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
      <li className={classNames(styles.wrapper, {
        'is-me': isMyChat,
        'is-others': !isMyChat
      })}>
        <span className={styles.name}>{ userName }</span>
        {' '}
        { msg }
        {' '}
        <span className={styles.time}>{ strTime }</span>
      </li>
    );
  }
}

export default ChatMessage