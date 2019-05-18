import React, { Component } from "react";
import styles from './Footer.module.css'

class Footer extends Component {
  constructor( props: any  ) {
    super( props );

    console.log( 'footer' );
  }

  render() {
    return (
      <div className={ styles.container }>
        
      </div>
    );
  }
}

export default Footer