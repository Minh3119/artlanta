// Sidebar.js
import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';
import arlanta from '../../assets/images/arlanta.svg';
import more from '../../assets/images/more.svg';
import adsearch from '../../assets/images/adsearch.svg';
import Dashboard from '../../assets/images/Dashboard.svg';
import widget from '../../assets/images/widget.svg';

const menuItems = [
  { imgIcon: Dashboard, label: 'Dashboard', badge: '+4' },
  { imgIcon: widget, iconClass: 'fas fa-th', label: 'Data Reader Widgets' },
  'section',
  { section: 'ADVANCED' },
  { iconClass: 'fas fa-copy', label: 'Payment', badge: '6', badgeClass: 'info', arrowIcon: more },

];
const Sidebar = ({ activeItem, onChangeActive }) => {

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={arlanta} alt="Logo" className="sidebar-logo__img" />
        <span className="sidebar-logo__text">Admin AMS v1.0</span>
      </div>

      <div className="sidebar-user">
        <img src="https://placehold.co/34x34" alt="User" className="sidebar-user__img" />
        <span className="sidebar-user__name">Alexander Pierce</span>
      </div>

      <div className="sidebar-search">
        <input type="text" placeholder="Search" className="sidebar-search__input" />
        <button className="sidebar-search__btn">
          <img src={adsearch} alt="search" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => {
          if (item === 'section') return <hr key={idx} className="sidebar-divider" />;
          if (item.section) return <div key={idx} className="sidebar-section">{item.section}</div>;

          return (
            <div
              key={idx}
              className={`sidebar-item${item.label === activeItem ? ' sidebar-item--active' : ''}`}
              onClick={() => onChangeActive(item.label)}
            >
              {item.imgIcon && <img src={item.imgIcon} alt="icon" className="sidebar-item__img" />}
              {item.iconClass && <i className={item.iconClass}></i>}
              <span className="sidebar-item__label">{item.label}</span>
              {item.badge && (
                <span className={`sidebar-item__badge sidebar-item__badge--${item.badgeClass || 'default'}`}>{item.badge}</span>
              )}
              {item.arrowIcon && <img src={item.arrowIcon} alt="expand" className="sidebar-item__arrow-img" />}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
