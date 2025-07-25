/* NavBar.js */
import React from 'react';
import "../../styles/AdminDashboard.css" ;
import menu from "../../assets/images/menu.svg";
import adsearch from '../../assets/images/adsearch_1.svg';
import message  from '../../assets/images/message.svg';
import noti from '../../assets/images/noti.svg';
import wid from '../../assets/images/wid.svg';
import expand from '../../assets/images/expand.svg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token hoặc thông tin đăng nhập từ localStorage/sessionStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    // Hoặc sessionStorage.removeItem('authToken');
    
    // Redirect về trang login
    navigate('/login');
    
    // Hoặc nếu bạn muốn reload trang
    // window.location.href = '/login';
  };

  const navItemsLeft = [
    { type: 'button', icon: null, img: menu },
    { type: 'link', label: 'Home', to: '/' },
    { type: 'link', label: 'Log out', onClick: handleLogout },
  ];

  const navItemsRight = [
    { type: 'link-icon', icon: 'fas fa-comments', badge: '3', badgeClass: 'danger', img: message },
  ];

  return (
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
};

const NavItem = ({ type, icon, img, label, badge, badgeClass, to, onClick }) => {
  const classNames = ['nav-item'];
  if (type === 'button') classNames.push('nav-item--button');
  if (type === 'link') classNames.push('nav-item--link');
  if (type === 'link-icon') classNames.push('nav-item--link-icon');

  const renderContent = () => (
    <>
      {img && <img src={img} alt="menu icon" className="nav-item__img" />}      
      {icon && <i className={icon}></i>}
      {label && <span className="nav-item__label">{label}</span>}
      {badge && (
        <span className={`nav-item__badge nav-item__badge--${badgeClass}`}>{badge}</span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classNames.join(' ')}>
        {renderContent()}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div className={classNames.join(' ')} onClick={onClick} style={{ cursor: 'pointer' }}>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className={classNames.join(' ')}>
      {renderContent()}
    </div>
  );
};

export default Navbar;