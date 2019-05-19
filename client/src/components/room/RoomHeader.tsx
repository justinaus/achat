import React from 'react';
import { Link } from 'react-router-dom'
import styles from './RoomHeader.module.css';
import ConnectedCount from '../common/ConnectedCount';

interface IProps {
  title: string
  connectedCount: number
}

const connectedCountStyle = {
  'fontSize': '12px',
  'color': '#ffffff'
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
      <ConnectedCount count={ connectedCount } iconColor={ '#ffffff' } objStyle={ connectedCountStyle } />
    </div>
  </div>
)

export default RoomHeader