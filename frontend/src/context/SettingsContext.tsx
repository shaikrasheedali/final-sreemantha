import React, { createContext, useContext, useState, useEffect } from 'react';
import { HospitalSettings } from '../types';
import { api } from '../utils/api';

interface SettingsContextType {
  settings: HospitalSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateFaviconInHead: (url: string) => void;
}

const defaultSettings: HospitalSettings = {
  favicon_url: '/favicon.svg',
  hospital_info: {
    hospital_name: 'Sreemantha IVF and Child Care Hospital',
    tagline: 'Bringing the Joy of Parenthood to Your Life',
    subtitle: 'World-class IVF technology, compassionate maternity care, and expert pediatric services in Khammam.',
    location: 'Khammam, Telangana',
    address: 'Priyadarshini Degree/College Road, Nehru Nagar, Khammam, Telangana 507001',
    phone: '+91 96667 81779',
    whatsapp: '+91 96667 81779',
    email: 'care@sreemanthahospital.com',
    display_hotline: '+91 96667 81779',
    emergency_hotline: '+91 88007 73362',
    favicon_url: '/favicon.svg',
    stats: [
      { label: 'IVF Success Rate', value: '98%' },
      { label: 'Happy Families', value: '15,000+' },
      { label: 'Specialist Doctors', value: '12+' },
      { label: 'Emergency Care', value: '24/7' },
    ],
    working_hours: {
      opd: 'Monday - Saturday: 09:00 AM - 08:00 PM',
      emergency: '24/7 Emergency & Critical Care Available',
      visiting_hours: '04:00 PM - 07:00 PM',
    },
  },
  contact_buttons: {
    phone_button: {
      enabled: true,
      label: 'Call Hospital',
      number: '+91 96667 81779',
      position: 'bottom-left',
    },
    whatsapp_button: {
      enabled: true,
      label: 'WhatsApp Care',
      number: '+91 96667 81779',
      default_message: 'Hello Sreemantha Hospital, I would like to book a consultation.',
      position: 'bottom-left',
    },
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<HospitalSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get<{ settings: HospitalSettings }>('/settings');
      if (res && res.settings) {
        setSettings(prev => ({
          ...prev,
          ...res.settings,
          hospital_info: {
            ...prev.hospital_info,
            ...(res.settings.hospital_info || {}),
          },
          contact_buttons: {
            ...prev.contact_buttons,
            ...(res.settings.contact_buttons || {}),
          },
        }));
      }
    } catch (err) {
      console.warn('Failed to load dynamic settings, using defaults:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFaviconInHead = (url: string) => {
    if (!url) return;
    const isSvg = url.endsWith('.svg') || url.includes('.svg');
    const svgIcon = document.getElementById('dynamic-favicon-svg') as HTMLLinkElement | null;
    if (svgIcon) {
      svgIcon.href = url;
    }
    const icon32 = document.getElementById('dynamic-favicon-32') as HTMLLinkElement | null;
    if (icon32) {
      icon32.href = isSvg ? url : url;
    }
    const icon16 = document.getElementById('dynamic-favicon-16') as HTMLLinkElement | null;
    if (icon16) {
      icon16.href = isSvg ? url : url;
    }
    const shortcut = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (shortcut) {
      shortcut.href = url;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const customFavicon = settings.hospital_info?.favicon_url || settings.favicon_url;
    if (customFavicon) {
      updateFaviconInHead(customFavicon);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
        updateFaviconInHead,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
