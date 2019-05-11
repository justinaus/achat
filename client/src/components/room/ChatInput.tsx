import React, { Component, RefObject, SyntheticEvent } from "react";

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
      <form onSubmit={ this.onSubmit }>
        <input placeholder='Chat' ref={ this.refForm } />
        <button>Send</button>
      </form>
    );
  }
}

export default ChatInput