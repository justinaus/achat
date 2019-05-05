import React, { Component, RefObject } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { Button } from "react-bootstrap";

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
  
  onClickSend = () => {
    this.sendMsg();
  }

  onKeyUp = ( e: React.KeyboardEvent ) => {
    const ENTER_KEY_CODE: number = 13;

    if( e.keyCode !== ENTER_KEY_CODE )  return;

    this.sendMsg();
  }

  render() {
    return (
      <InputGroup className="mb-3" id='igChat'>
        <FormControl
          placeholder="Chat" ref={ this.refForm } onKeyUp={ this.onKeyUp }
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={ this.onClickSend }>Send</Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

export default ChatInput