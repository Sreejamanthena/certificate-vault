'use client';

import * as React from 'react';
import { useAuth } from '@/components/auth-provider';

import {
  X,
  LogOut,
  Mail,
  Calendar,
  FileText,
  Share2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({
  open,
  onClose,
}: ProfileModalProps) {
  const router = useRouter();

  const { user, profile, signOut } = useAuth();

  const [stats] = React.useState({
    total: 0,
    shared: 0,
  });

  const handleSignOut = async () => {
    await signOut();
    onClose();
    router.push('/');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';

    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      'en-US',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/50 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Profile
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg shadow-violet-500/30">
              {getInitials(
                profile?.full_name ||
                  user?.email ||
                  ''
              )}
            </div>

            <h3 className="mt-4 text-xl font-bold text-foreground">
              {profile?.full_name || 'User'}
            </h3>
          </div>

          {/* Info */}
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
                <Mail className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Certificates */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
                <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Certificates Stored
                </p>

                <p className="text-sm font-medium text-foreground">
                  {stats.total}
                </p>
              </div>
            </div>

            {/* Shared */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Certificates Shared
                </p>

                <p className="text-sm font-medium text-foreground">
                  {stats.shared}
                </p>
              </div>
            </div>

            {/* Created */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Account Created
                </p>

                <p className="text-sm font-medium text-foreground">
                  {profile?.created_at
                    ? formatDate(profile.created_at)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex-1 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>

            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white border-0"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}