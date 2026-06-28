'use client';

import * as React from 'react';

import {
  X,
  Link2,
  Copy,
  CheckCircle,
  Loader2,
} from 'lucide-react';

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import { Button } from '@/components/ui/button';

interface Certificate {
  id: string;
  certificateName: string;
}

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  certificates: Certificate[];
  userId: string;
}

function generateCode(length: number) {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(
      Math.floor(
        Math.random() * chars.length
      )
    );
  }

  return result;
}

export function ShareModal({
  open,
  onClose,
  certificates,
  userId,
}: ShareModalProps) {
  const [loading, setLoading] =
    React.useState(false);

  const [copied, setCopied] =
    React.useState(false);

  const [result, setResult] =
    React.useState<{
      link: string;
      accessKey: string;
    } | null>(null);

  const [expiryDate, setExpiryDate] =
    React.useState('');

  const [expiryTime, setExpiryTime] =
    React.useState('');

  React.useEffect(() => {
    if (!open) return;

    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    setExpiryDate(
      tomorrow
        .toISOString()
        .split('T')[0]
    );

    setExpiryTime('12:00');
  }, [open]);

  if (!open) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);

      if (
        !expiryDate ||
        !expiryTime
      ) {
        alert(
          'Please select expiry date and time'
        );

        setLoading(false);
        return;
      }

      const expiresAt = new Date(
        `${expiryDate}T${expiryTime}`
      );

      if (
        expiresAt <= new Date()
      ) {
        alert(
          'Expiry date/time must be in the future'
        );

        setLoading(false);
        return;
      }

      const shareCode =
        generateCode(10);

      const accessKey =
        generateCode(6);

      await addDoc(
        collection(
          db,
          'shared_links'
        ),
        {
          ownerId: userId,

          certificateIds:
            certificates.map(
              (c) => c.id
            ),

          shareCode,

          accessKey,

          expiresAt,

          createdAt:
            serverTimestamp(),
        }
      );

      // Increase share count
      for (const cert of certificates) {
        await updateDoc(
          doc(
            db,
            'certificates',
            cert.id
          ),
          {
            share_count: increment(1),
          }
        );
      }
      const link = `${window.location.origin}/share/${shareCode}`;

      setResult({
        link,
        accessKey,
      });
    } catch (error) {
      console.error(error);

      alert(
        'Failed to create link'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy =
    async () => {
      if (!result) return;

      await navigator.clipboard.writeText(
        result.link
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">
            Generate Share Link
          </h2>

          <button
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {!result ? (
            <>
              <div className="text-center rounded-xl bg-violet-50 dark:bg-violet-950/30 py-5">
                <p className="text-3xl font-bold text-violet-600">
                  {
                    certificates.length
                  }
                </p>

                <p className="text-sm text-muted-foreground">
                  certificates
                  selected
                </p>
              </div>

              {/* DATE + TIME PICKER */}
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Expiry Date &
                  Time
                </label>

                <input
                  type="date"
                  value={
                    expiryDate
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split(
                        'T'
                      )[0]
                  }
                  onChange={(
                    e
                  ) =>
                    setExpiryDate(
                      e.target
                        .value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="time"
                  value={
                    expiryTime
                  }
                  onChange={(
                    e
                  ) =>
                    setExpiryTime(
                      e.target
                        .value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                {expiryDate &&
                  expiryTime && (
                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                      <p className="text-sm text-violet-600 dark:text-violet-400">
                        Link expires on
                      </p>

                      <p className="font-semibold text-foreground">
                        {new Date(
                          `${expiryDate}T${expiryTime}`
                        ).toLocaleString()}
                      </p>
                    </div>
               )}
              </div>

              <Button
                onClick={
                  handleGenerate
                }
                disabled={
                  loading
                }
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Generate Link
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center">
                <CheckCircle className="w-14 h-14 mx-auto text-green-500 mb-3" />

                <h3 className="font-semibold text-lg">
                  Link Generated
                </h3>
              </div>

              {/* LINK */}
              <div>
                <label className="text-sm font-medium">
                  Share Link
                </label>

                <div className="relative mt-2">
                  <input
                    readOnly
                    value={
                      result.link
                    }
                    className="w-full border rounded-xl px-4 py-3 pr-12 text-sm"
                  />

                  <button
                    onClick={
                      handleCopy
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ACCESS KEY */}
              <div>
                <label className="text-sm font-medium">
                  Access Key
                </label>

                <div className="mt-2 border rounded-xl px-4 py-3 text-center">
                  <p className="font-mono text-2xl font-bold text-violet-600">
                    {
                      result.accessKey
                    }
                  </p>
                </div>
              </div>

              <Button
                onClick={
                  onClose
                }
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                Done
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}