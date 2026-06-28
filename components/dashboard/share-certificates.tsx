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
  Share2,
  Loader2,
  Eye,
  Search,
  Filter,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ShareModal } from './share-modal';

interface Certificate {
  id: string;
  certificateName: string;
  category: string;
  issuer: string;
  fileType: string;
  publicId: string;
  createdAt?: any;
}

export function ShareCertificates() {
  const { user } = useAuth();

  const [certificates, setCertificates] =
    React.useState<Certificate[]>([]);

  const [selected, setSelected] =
    React.useState<Set<string>>(
      new Set()
    );

  const [loading, setLoading] =
    React.useState(true);

  const [shareOpen, setShareOpen] =
    React.useState(false);

  const [search, setSearch] =
    React.useState('');

  const [category, setCategory] =
    React.useState('all');

  React.useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  // FETCH CERTIFICATES
  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, 'certificates'),
        where('userId', '==', user?.uid)
      );

      const querySnapshot =
        await getDocs(q);

      const certs: Certificate[] = [];

      querySnapshot.forEach((docSnap) => {
        certs.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<
            Certificate,
            'id'
          >),
        });
      });

      // SORT NEWEST FIRST
      certs.sort((a, b) => {
        const aTime =
          a.createdAt?.seconds || 0;

        const bTime =
          b.createdAt?.seconds || 0;

        return bTime - aTime;
      });

      setCertificates(certs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // TOGGLE SINGLE
  const toggleSelection = (
    id: string
  ) => {
    const updated = new Set(selected);

    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }

    setSelected(updated);
  };

  // SELECT ALL
  const toggleSelectAll = () => {
    if (
      selected.size ===
      filteredCertificates.length
    ) {
      setSelected(new Set());
    } else {
      const allIds = new Set(
        filteredCertificates.map(
          (cert) => cert.id
        )
      );

      setSelected(allIds);
    }
  };

  // OPEN CERTIFICATE
  const openCertificate = async (
    publicId: string
  ) => {
    try {
      const response = await fetch(
        `/api/view-certificate?publicId=${encodeURIComponent(
          publicId
        )}`
      );

      const data =
        await response.json();

      if (data.url) {
        window.open(
          data.url,
          '_blank'
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // DATE FORMAT
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  // FILTERED DATA
  const filteredCertificates =
    certificates.filter((cert) => {
      const matchesSearch =
        cert.certificateName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        cert.issuer
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === 'all' ||
        cert.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Share Certificates
          </h1>

          <p className="text-muted-foreground">
            Select certificates and
            generate secure share links
          </p>
        </div>

        <Button
          disabled={selected.size === 0}
          onClick={() =>
            setShareOpen(true)
          }
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Selected (
          {selected.size})
        </Button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search certificates..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* FILTER */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">
              All Categories
            </option>

            <option value="Academic">
              Academic
            </option>

            <option value="Professional">
              Professional
            </option>

            <option value="Technical">
              Technical
            </option>

            <option value="Personal">
              Personal
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600" />
          </div>
        ) : filteredCertificates.length ===
          0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No certificates found
          </div>
        ) : (
          <>
            {/* HEADER ROW */}
            <div className="flex items-center gap-3 px-5 py-4 border-b bg-muted/40">
              <input
                type="checkbox"
                checked={
                  filteredCertificates.length >
                    0 &&
                  selected.size ===
                    filteredCertificates.length
                }
                onChange={
                  toggleSelectAll
                }
              />

              <p className="text-sm text-foreground">
                Select all (
                {
                  filteredCertificates.length
                }{' '}
                certificates)
              </p>
            </div>

            {/* CERTIFICATE ROWS */}
            <div>
              {filteredCertificates.map(
                (cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between px-5 py-4 border-b hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                >
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selected.has(
                          cert.id
                        )}
                        onChange={() =>
                          toggleSelection(
                            cert.id
                          )
                        }
                      />

                      <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-violet-600" />
                      </div>

                      <div>
                        <h3 className="font-medium text-violet-500 dark:text-violet-400">
                          {cert.certificateName}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {
                            cert.category
                          }{' '}
                          •{' '}
                          {formatDate(
                            cert.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-3 py-1 rounded-full bg-violet-100 text-violet-600">
                        {cert.fileType
                          ?.split('/')
                          ?.pop()
                          ?.toUpperCase()}
                      </span>

                      <button
                        onClick={() =>
                          openCertificate(
                            cert.publicId
                          )
                        }
                        className="w-8 h-8 rounded-lg hover:bg-violet-50 flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 text-gray-500 hover:text-violet-600" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* SHARE MODAL */}
      <ShareModal
        open={shareOpen}
        onClose={() =>
          setShareOpen(false)
        }
        userId={user?.uid || ''}
        certificates={certificates.filter(
          (cert) =>
            selected.has(cert.id)
        )}
      />
    </div>
  );
}