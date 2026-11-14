import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const APP_TITLE = 'ClinicFlow Appointment System';
const PAGE_TITLES = {
  '/login': 'Login',
  '/register': 'Register',
  '/book-appointment': 'Book Appointment',
  '/book-appointment/review': 'Review Appointment',
  '/my-appointments': 'My Appointments',
  '/admin-dashboard': 'Admin Dashboard',
  '/settings': 'Settings',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
  '/contact-support': 'Contact Support',
  '/help-center': 'Help Center',
};

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = PAGE_TITLES[pathname];
    document.title = pageTitle ? `${pageTitle} | ClinicFlow` : APP_TITLE;
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navigation />
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-surface-container dark:bg-surface-container-highest w-full py-xl px-lg mt-auto flex flex-col md:flex-row justify-between items-center gap-md border-t border-outline-variant dark:border-outline">
        <div className="font-label-md text-label-md font-bold text-on-surface dark:text-on-surface-variant">
          <span>
            © 2026 ClinicFlow Management Systems. All rights reserved.
          </span>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-md">
          <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/privacy-policy">Privacy Policy</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/terms-of-service">Terms of Service</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/contact-support">Contact Support</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-on-surface hover:text-primary dark:hover:text-inverse-primary hover:underline transition-opacity duration-200" to="/help-center">Help Center</Link>
        </div>
      </footer>
    </div>
  );
}
