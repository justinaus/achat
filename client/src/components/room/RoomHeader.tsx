import React from 'react';
import { Link } from 'react-router-dom'
import styles from './RoomHeader.module.css';

interface IProps {
  title: string
  connectedCount: number
}

const RoomHeader: React.FC<IProps> = ({ title, connectedCount }) => (
  <div className={styles.wrapper}>
    <Link to="/" className={styles.prev}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
        <path d="M20,11H7.83l5.59-5.59L12,4,4,12l8,8,1.41-1.41L7.83,13H20Z" transform="translate(-4 -4)" fill="#fff"/>
      </svg>
    </Link>

    <div className={styles.body}>
      <h3 className={styles.title}>{ title }</h3>
      <h4 className={styles.users}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6.5" viewBox="0 0 12 6.5">
          <path d="M4,7.5H2.5V6h-1V7.5H0v1H1.5V10h1V8.5H4ZM9,8a1.5,1.5,0,1,0-.455-2.93A2.467,2.467,0,0,1,9,6.5a2.516,2.516,0,0,1-.45,1.43A1.5,1.5,0,0,0,9,8ZM6.5,8A1.5,1.5,0,1,0,5,6.5,1.494,1.494,0,0,0,6.5,8ZM9.81,9.08a1.85,1.85,0,0,1,.69,1.42v1H12v-1C12,9.73,10.815,9.255,9.81,9.08ZM6.5,9c-1,0-3,.5-3,1.5v1h6v-1C9.5,9.5,7.5,9,6.5,9Z" transform="translate(0 -5)" fill="#fff"/>
        </svg>
        { connectedCount }명
      </h4>
    </div>
  </div>
)

export default RoomHeader