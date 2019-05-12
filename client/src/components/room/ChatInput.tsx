import React, { Component, RefObject, SyntheticEvent } from "react";
import styles from './ChatInput.module.css'

interface IProps {
  onSendChat: ( msg: string ) => void
}

class ChatInput extends Component<IProps, any> {
  refForm: RefObject<any>;

  constructor( props: IProps ) {
    super( props );

    this.refForm = React.createRef();
  }

  sendMsg = () => {
    const currentText: string = this.refForm.current.value;
    const currentTextTrim: string = currentText.trim();

    if( currentTextTrim === '' ) return;

    this.props.onSendChat( currentTextTrim );

    this.refForm.current.value = '';
  }
  
  onSubmit = ( e: SyntheticEvent ) => {
    e.preventDefault();

    this.sendMsg();
  }

  render() {
    return (
      <form onSubmit={ this.onSubmit } className={styles.wrapper}>
        <input placeholder="Type a Message..." ref={ this.refForm } className={styles.input} />
        <button type="submit" className={styles.button}>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18">
            <path d="M2.01,21,23,12,2.01,3,2,10l15,2L2,14Z" transform="translate(-2 -3)" fill="#ff922b"/>
          </svg>
        </button>
      </form>
    );
  }
}

export default ChatInput