import React, { createContext, useContext, useState, useEffect } from 'react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color?: string;
  settings?: Record<string, any>;
}

interface OrganizationContextType {
  organization: Organization | null;
  setOrganization: (org: Organization | null) => void;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedOrg = localStorage.getItem('current_organization');
    if (savedOrg) {
      try {
        setOrganization(JSON.parse(savedOrg));
      } catch (e) {
        console.error('Failed to parse organization from localStorage', e);
      }
    }
    setIsLoading(false);
  }, []);

  const updateOrganization = (org: Organization | null) => {
    setOrganization(org);
    if (org) {
      localStorage.setItem('current_organization', JSON.stringify(org));
    } else {
      localStorage.removeItem('current_organization');
    }
  };

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization: updateOrganization, isLoading }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
