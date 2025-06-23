/* NavBar.js */
import React from 'react';
import "../../styles/AdminDashboard.css" ;
import menu from "../../assets/images/menu.svg";
import adsearch from '../../assets/images/adsearch_1.svg';
import message  from '../../assets/images/message.svg';
import noti from '../../assets/images/noti.svg';
import wid from '../../assets/images/wid.svg';
import expand from '../../assets/images/expand.svg';
import { Link } from 'react-router-dom';
const navItemsLeft = [
  { type: 'button', icon: null, img: menu },
  { type: 'link', label: 'Home' },
  { type: 'link', label: 'Log out' },
];

const navItemsRight = [
  { type: 'button', icon: 'fas fa-search' , img: adsearch},
  { type: 'link-icon', icon: 'fas fa-comments', badge: '3', badgeClass: 'danger' , img: message},
  { type: 'link-icon', icon: 'fas fa-bell', badge: '15', badgeClass: 'warning' , img: noti},
  { type: 'button', icon: 'fas fa-sync-alt' , img: expand},
  { type: 'button', icon: 'fas fa-th-large' , img: wid},
];

const Navbar = () => (
  <div className="navbar">
    <div className="navbar__section navbar__section--left">
      {navItemsLeft.map((item, idx) => (
        <NavItem key={idx} {...item} />
      ))}
    </div>
    <div className="navbar__section navbar__section--right">
      {navItemsRight.map((item, idx) => (
        <NavItem key={idx} {...item} />
      ))}
    </div>
  </div>
);

const NavItem = ({ type, icon, img, label, badge, badgeClass }) => {
  const classNames = ['nav-item'];
  if (type === 'button') classNames.push('nav-item--button');
  if (type === 'link') classNames.push('nav-item--link');
  if (type === 'link-icon') classNames.push('nav-item--link-icon');

  return (
    <div className={classNames.join(' ')}>
      {img && <img src={img} alt="menu icon" className="nav-item__img" />}      
      {icon && <i className={icon}></i>}
      {label && <span className="nav-item__label">{label}</span>}
      {badge && (
        <span className={`nav-item__badge nav-item__badge--${badgeClass}`}>{badge}</span>
      )}
    </div>
  );
};
export default Navbar;