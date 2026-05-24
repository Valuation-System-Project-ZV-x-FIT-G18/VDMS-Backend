import { Injectable } from '@nestjs/common';

/* Menu item shape — matches the frontend MenuItem interface */
export interface MenuItem {
  label: string;
  path: string;
  icon: string;
  position?: 'bottom'; // if 'bottom', rendered near logout at sidebar bottom
}

/* Centralized role→menu mapping — single source of truth on the server */
const menus: Record<string, MenuItem[]> = {
  coordinator: [
    { label: 'Dashboard', path: '/coordinator/dashboard', icon: '📊' },
    { label: 'New Valuation', path: '/coordinator/search', icon: '📝' },
    {
      label: 'Fleet Management',
      path: '/coordinator/fleet-management',
      icon: '🚗',
    },
  ],
  technical_officer: [
    { label: 'Dashboard', path: '/technical-officer/dashboard', icon: '📊' },
    {
      label: 'Projects',
      path: '/technical-officer/projects',
      icon: '📋',
    },
    { label: 'Reports', path: '/technical-officer/reports', icon: '📝' },
    {
      label: 'Documents',
      path: '/technical-officer/documents',
      icon: '📄',
    },
    {
      label: 'Attendance',
      path: '/technical-officer/attendance',
      icon: '🕒',
    },
    {
      label: 'Settings',
      path: '/technical-officer/settings',
      icon: '⚙️',
      position: 'bottom',
    },
  ],
  bank: [
    { label: 'Dashboard', path: '/bank/dashboard', icon: '📊' },
    { label: 'Projects', path: '/bank/projects', icon: '📝' },
    {
      label: 'Settings',
      path: '/bank/settings',
      icon: '⚙️',
      position: 'bottom',
    },
  ],
  owner: [
    { label: 'Dashboard', path: '/owner/dashboard', icon: '📊' },
    {
      label: 'Projects',
      path: '/owner/projects',
      icon: '📄',
    },
    { label: 'Payment', path: '/owner/payment', icon: '💳' },
    {
      label: 'Settings',
      path: '/owner/settings',
      icon: '⚙️',
      position: 'bottom',
    },
  ],
};

@Injectable()
export class LayoutService {
  /* Return the menu items for a given role */
  getMenu(role: string): MenuItem[] {
    return menus[role] || []; // empty array if role not found
  }
}
