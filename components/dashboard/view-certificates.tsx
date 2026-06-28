'use client';

import * as React from 'react';

import { useAuth } from '@/components/auth-provider';

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import {
  FileText,
  Eye,
  Trash2,
  Loader2,
  Share2,
  Calendar,
  Building2,
  FolderOpen,
  Pencil,
  X,
  Check,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';

interface Certificate {
  id: string;
  certificateName: string;
  category: string;
  issuer: string;
  fileType: string;
  publicId: string;
  share_count?: number;
  createdAt?: any;
  previewUrl?: string;
  thumbnailUrl?: string;
}

export function ViewCertificates() {
  const { user } = useAuth();

  const [certificates, setCertificates] =
    React.useState<Certificate[]>([]);

  const [loading, setLoading] =
    React.useState(true);

  const [deleting, setDeleting] =
    React.useState<string | null>(null);

  const [editingId, setEditingId] =
    React.useState<string | null>(null);

  const [editName, setEditName] =
    React.useState('');

  const [saving, setSaving] =
    React.useState(false);

  // SEARCH + FILTER + SORT
  const [searchQuery, setSearchQuery] =
    React.useState('');

  const [categoryFilter, setCategoryFilter] =
    React.useState('all');

  const [sortBy, setSortBy] =
    React.useState<
      'newest' | 'oldest' | 'name'
    >('newest');

  const categories = [
    'all',
    'Academic',
    'Professional',
    'Technical',
    'Language',
    'Creative',
    'Personal',
    'Other',
  ];

  React.useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  // FETCH CERTIFICATES
  const fetchCertificates = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, 'certificates'),
        where('userId', '==', user?.uid)
      );

      const querySnapshot =
        await getDocs(q);

      const certs: Certificate[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        console.log('CERTIFICATE DATA:', data);
        let previewUrl = '';
        let thumbnailUrl = '';

        try {
          const response = await fetch(
            `/api/view-certificate?publicId=${encodeURIComponent(
              data.publicId
            )}&fileType=${encodeURIComponent(
              data.fileType
            )}`
          );

          const result =
            await response.json();

          previewUrl = result.url;
          thumbnailUrl =
            result.thumbnailUrl || '';
        } catch (err) {
          console.error(err);
        }

        certs.push({
          id: docSnap.id,
          ...(data as Omit<
            Certificate,
            'id'
          >),
          previewUrl,
          thumbnailUrl,
        });
      }

      setCertificates(certs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this certificate?'
    );

    if (!confirmDelete) return;

    setDeleting(id);

    try {
      const certificate =
        certificates.find(
          (c) => c.id === id
        );

      if (certificate) {
        await addDoc(
          collection(
            db,
            'deletedCertificates'
          ),
          {
            ...certificate,
            userId: user?.uid,
            deletedAt: new Date(),
          }
        );
      }

      await deleteDoc(
        doc(db, 'certificates', id)
      );

      setCertificates(
        certificates.filter(
          (c) => c.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  // EDIT
  const handleEdit = (
    cert: Certificate
  ) => {
    setEditingId(cert.id);
    setEditName(cert.certificateName);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleSaveEdit = async (
    id: string
  ) => {
    if (!editName.trim()) return;

    setSaving(true);

    try {
      await updateDoc(
        doc(db, 'certificates', id),
        {
          certificateName:
            editName.trim(),
        }
      );

      setCertificates(
        certificates.map((c) =>
          c.id === id
            ? {
                ...c,
                certificateName:
                  editName.trim(),
              }
            : c
        )
      );

      setEditingId(null);
      setEditName('');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // OPEN CERTIFICATE
  const openCertificate = async (
    publicId: string,
    fileType: string
  ) => {
    try {
      const response = await fetch(
        `/api/view-certificate?publicId=${encodeURIComponent(
          publicId
        )}&fileType=${encodeURIComponent(
          fileType
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

  // FILTERED + SORTED
  const filteredCertificates =
    React.useMemo(() => {
      let filtered =
        certificates.filter((cert) => {
          const matchesSearch =
            cert.certificateName
              ?.toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              ) ||
            cert.issuer
              ?.toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              );

          const matchesCategory =
            categoryFilter === 'all' ||
            cert.category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        });

      if (sortBy === 'name') {
        filtered.sort((a, b) =>
          a.certificateName.localeCompare(
            b.certificateName
          )
        );
      }

      if (sortBy === 'newest') {
        filtered.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );
      }

      if (sortBy === 'oldest') {
        filtered.sort(
          (a, b) =>
            (a.createdAt?.seconds || 0) -
            (b.createdAt?.seconds || 0)
        );
      }

      return filtered;
    }, [
      certificates,
      searchQuery,
      categoryFilter,
      sortBy,
    ]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          View Certificates
        </h1>

        <p className="text-muted-foreground mt-1">
          Browse and manage all your uploaded certificates
        </p>
      </div>

      {/* SEARCH + FILTER + SORT */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search certificates..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* CATEGORY */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="h-12 pl-11 pr-10 rounded-xl border border-border bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat === 'all'
                  ? 'All Categories'
                  : cat}
              </option>
            ))}
          </select>
        </div>

        {/* SORT */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as any
              )
            }
            className="h-12 pl-11 pr-10 rounded-xl border border-border bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="name">
              Name A-Z
            </option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        </div>
      ) : filteredCertificates.length ===
        0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 mx-auto text-violet-500 mb-4" />

          <p className="text-muted-foreground">
            No certificates found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCertificates.map(
            (cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-border bg-white dark:bg-white/5 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* PREVIEW */}
                <div className="relative h-48 bg-violet-50 dark:bg-violet-950/20 overflow-hidden">
                  {cert.thumbnailUrl ? (
                    <img
                      src={cert.thumbnailUrl}
                      alt={cert.certificateName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-14 h-14 text-violet-600" />
                    </div>
                  )}

                  {/* VIEW */}
                  <button
                    onClick={() =>
                      openCertificate(
                        cert.publicId,
                        cert.fileType
                      )
                    }
                    className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-black/60 text-white flex items-center justify-center backdrop-blur-md hover:scale-105 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
            
                {/* BODY */}
                <div className="p-4 space-y-3">
                  {/* EDIT */}
                  {editingId === cert.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editName}
                        onChange={(e) =>
                          setEditName(
                            e.target.value
                          )
                        }
                        className="flex-1 px-3 py-2 rounded-lg border border-border"
                      />

                      <button
                        onClick={() =>
                          handleSaveEdit(
                            cert.id
                          )
                        }
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </button>

                      <button
                        onClick={
                          handleCancelEdit
                        }
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-base truncate">
                        {
                          cert.certificateName
                        }
                      </h3>

                      <button
                        onClick={() =>
                          handleEdit(cert)
                        }
                      >
                        <Pencil className="w-4 h-4 text-violet-500" />
                      </button>
                    </div>
                  )}

                  {/* ISSUER */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="w-4 h-4" />

                    <span className="truncate">
                      {cert.issuer ||
                        'No issuer'}
                    </span>
                  </div>

                  {/* DATE + SHARE */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />

                      <span>
                        {formatDate(
                          cert.createdAt
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />

                      <span>
                        {cert.share_count ||
                          0}{' '}
                        shares
                      </span>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600">
                      {cert.category}
                    </span>

                    <button
                      onClick={() =>
                        handleDelete(
                          cert.id
                        )
                      }
                      disabled={
                        deleting ===
                        cert.id
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-all"
                    >
                      {deleting ===
                      cert.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}