'use client';

import * as React from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { Loader as Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardHome } from '@/components/dashboard/dashboard-home';
import { StoreCertificates } from '@/components/dashboard/store-certificates';
import { ShareCertificates } from '@/components/dashboard/share-certificates';
import { ViewCertificates } from '@/components/dashboard/view-certificates';
import { ProfileModal } from '@/components/dashboard/profile-modal';

type Section = 'dashboard' | 'store' | 'share' | 'view';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = React.useState<Section>('dashboard');
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome />;
      case 'store':
        return <StoreCertificates />;
      case 'share':
        return <ShareCertificates />;
      case 'view':
        return <ViewCertificates />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <>
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onProfileClick={() => setProfileModalOpen(true)}
      >
        {renderSection()}
      </DashboardLayout>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
