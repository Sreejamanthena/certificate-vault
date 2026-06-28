'use client';

import * as React from 'react';

import { useAuth } from '@/components/auth-provider';

import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import {
  FileText,
  Upload,
  TrendingUp,
  Share2,
  Trash2,
  Loader2,
} from 'lucide-react';

interface Stats {
  total: number;
  shared: number;
  deleted: number;
  activeLinks: number;
}

export function DashboardHome() {
  const { profile, user } = useAuth();

  const [stats, setStats] =
    React.useState<Stats>({
      total: 0,
      shared: 0,
      deleted: 0,
      activeLinks: 0,
    });

  const [loading, setLoading] =
    React.useState(true);

  React.useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // FETCH CERTIFICATES
      const certificatesQuery = query(
        collection(db, 'certificates'),
        where('userId', '==', user?.uid)
      );

      const certificatesSnapshot =
        await getDocs(certificatesQuery);

      const certificates =
        certificatesSnapshot.docs.map(
          (doc) => doc.data()
        );

      // TOTAL CERTIFICATES
      const total =
        certificates.length;

      // SHARED CERTIFICATES
      const shared =
        certificates.filter(
          (cert: any) =>
            (cert.share_count || 0) > 0
        ).length;

      // TOTAL ACTIVE SHARE LINKS
      const activeLinks =
        certificates.reduce(
          (
            total: number,
            cert: any
          ) =>
            total +
            (cert.share_count || 0),
          0
        );

      // FETCH DELETED COUNT
      let deleted = 0;

      try {
        const deletedQuery = query(
          collection(
            db,
            'deletedCertificates'
          ),
          where(
            'userId',
            '==',
            user?.uid
          )
        );

        const deletedSnapshot =
          await getDocs(deletedQuery);

        deleted =
          deletedSnapshot.size;
      } catch {
        deleted = 0;
      }

      setStats({
        total,
        shared,
        deleted,
        activeLinks,
      });
    } catch (error) {
      console.error(
        'Error fetching stats:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl p-8 text-white shadow-xl shadow-violet-500/20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome Back,{' '}
          {profile?.full_name?.split(
            ' '
          )[0] || 'User'}{' '}
          👋
        </h1>

        <p className="text-violet-200">
          What would you like to
          manage today?
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label:
              'Total Certificates',
            value: stats.total,
            icon: FileText,
            gradient:
              'from-violet-500 to-purple-600',
          },
          {
            label:
              'Shared Certificates',
            value: stats.shared,
            icon: Share2,
            gradient:
              'from-purple-500 to-indigo-600',
          },
          {
            label:
              'Deleted Certificates',
            value: stats.deleted,
            icon: Trash2,
            gradient:
              'from-red-500 to-pink-600',
          },
          {
            label:
              'Active Share Links',
            value:
              stats.activeLinks,
            icon: TrendingUp,
            gradient:
              'from-emerald-500 to-teal-600',
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
                ) : (
                  <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {stats.total === 0 && (
        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl shadow-lg p-10 text-center">
          <Upload className="w-14 h-14 mx-auto mb-4 text-violet-500" />

          <h2 className="text-xl font-semibold mb-2">
            No Certificates Uploaded
            Yet
          </h2>

          <p className="text-muted-foreground">
            Start uploading your
            certificates securely.
          </p>
        </div>
      )}
    </div>
  );
}