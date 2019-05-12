import React, { Component } from "react";
import classNames from 'classnames';
import styles from './ChatNotice.module.css'

interface IProps {
  noticeMsg: string
}

class ChatNotice extends Component<IProps, any> {
  render() {
    const { noticeMsg } = this.props;

    return (
      <li className={classNames(styles.wrapper)}>
        <span>{ noticeMsg }</span>
      </li>
    );
  }
}

export default ChatNotice