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
  { imgIcon: widget, iconClass: 'fas fa-th', label: 'Widgets' },
  'section',
  { section: 'EXAMPLES' },
  { iconClass: 'fas fa-copy', label: 'Layout Options', badge: '6', badgeClass: 'info', arrowIcon: more },
  { iconClass: 'fas fa-chart-pie', label: 'Charts', arrowIcon: more },
  { iconClass: 'fas fa-tree', label: 'UI Elements', arrowIcon: more },
  { iconClass: 'fas fa-edit', label: 'Forms', arrowIcon: more },
  { iconClass: 'fas fa-table', label: 'Tables', arrowIcon: more },
  'section',
  { section: 'MISCELLANEOUS' },
  { iconClass: 'fas fa-calendar-alt', label: 'Calendar', badge: '2' },
  { iconClass: 'fas fa-image', label: 'Gallery' },
  { iconClass: 'fas fa-th-large', label: 'Kanban Board' },
  { iconClass: 'fas fa-envelope', label: 'Mailbox', arrowIcon: more },
  { iconClass: 'fas fa-book', label: 'Pages', arrowIcon: more },
  { iconClass: 'fas fa-check-square', label: 'Extras', arrowIcon: more },
  { iconClass: 'fas fa-search', label: 'Search', arrowIcon: more },
  'section',
  { section: 'LABELS' },
  { iconClass: 'fas fa-circle text-danger', label: 'Important' },
  { iconClass: 'fas fa-circle text-warning', label: 'Warning' },
  { iconClass: 'fas fa-circle text-info', label: 'Informational' },
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
