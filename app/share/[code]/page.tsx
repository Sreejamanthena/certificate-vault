'use client';

import * as React from 'react';

import {
  collection,
  query,
  where,
  getDocs,
  documentId,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import {
  Lock,
  Loader2,
  Eye,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface Certificate {
  id: string;
  certificateName: string;
  category: string;
  issuer: string;
  fileType: string;
  publicId: string;
  createdAt?: any;
  previewUrl?: string;
}

export default function SharePage({
  params,
}: {
  params: { code: string };
}) {
  const [loading, setLoading] =
    React.useState(true);

  const [accessKey, setAccessKey] =
    React.useState('');

  const [validating, setValidating] =
    React.useState(false);

  const [error, setError] =
    React.useState('');

  const [authorized, setAuthorized] =
    React.useState(false);

  const [certificates, setCertificates] =
    React.useState<Certificate[]>([]);

  // FORMAT DATE
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

  // VALIDATE ACCESS
  const validateAccess = async () => {
    try {
      setValidating(true);
      setError('');

      const shareQuery = query(
        collection(db, 'shared_links'),
        where(
          'shareCode',
          '==',
          params.code
        )
      );

      const shareSnapshot =
        await getDocs(shareQuery);

      if (shareSnapshot.empty) {
        setError(
          'Invalid share link'
        );
        return;
      }

      const shareDoc =
        shareSnapshot.docs[0];

      const shareData =
        shareDoc.data();

      // CHECK EXPIRY
      const expiresAt =
        shareData.expiresAt.toDate();

      if (
        new Date() > expiresAt
      ) {
        setError(
          'This link has expired'
        );
        return;
      }

      // CHECK ACCESS KEY
      if (
        accessKey.trim().toUpperCase() !==
        shareData.accessKey
      ) {
        setError(
          'Invalid access key'
        );
        return;
      }

      // FETCH CERTIFICATES
      const certIds =
        shareData.certificateIds;

      const certQuery = query(
        collection(
          db,
          'certificates'
        ),
        where(
          documentId(),
          'in',
          certIds
        )
      );

      const certSnapshot =
        await getDocs(certQuery);

      const certs: Certificate[] =
        [];

      for (const docSnap of certSnapshot.docs) {
        const data =
          docSnap.data();

        let previewUrl = '';

        try {
          const response = await fetch(
            `/api/view-certificate?publicId=${encodeURIComponent(
              data.publicId
            )}`
          );

          const result =
            await response.json();

          previewUrl = result.url;
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
        });
      }

      setCertificates(certs);

      setAuthorized(true);
    } catch (error) {
      console.error(error);

      setError(
        'Something went wrong'
      );
    } finally {
      setLoading(false);
      setValidating(false);
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

  React.useEffect(() => {
    setLoading(false);
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // ACCESS SCREEN
  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-10 h-10 text-violet-600" />
            </div>

            <h1 className="text-3xl font-bold">
              Secure Access
            </h1>

            <p className="text-gray-500 mt-3">
              Enter the access key to
              view shared certificates
            </p>
          </div>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Enter Access Key"
              value={accessKey}
              onChange={(e) =>
                setAccessKey(
                  e.target.value.toUpperCase()
                )
              }
              className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-2xl px-5 py-4 text-center tracking-[4px] uppercase outline-none"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <button
              onClick={
                validateAccess
              }
              disabled={validating}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-2xl py-4 font-semibold transition"
            >
              {validating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Access Certificates'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CERTIFICATES PAGE
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Shared Certificates
          </h1>

          <p className="text-gray-500 mt-2">
            Securely shared documents
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                {cert.fileType.includes(
                  'image'
                ) ? (
                  <img
                    src={
                      cert.previewUrl
                    }
                    alt={
                      cert.certificateName
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-violet-50">
                    <Eye className="w-12 h-12 text-violet-600" />
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <h3 className="font-semibold text-lg truncate">
                  {
                    cert.certificateName
                  }
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {cert.category}
                </p>

                <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />

                  <span>
                    {formatDate(
                      cert.createdAt
                    )}
                  </span>
                </div>

                <button
                  onClick={() =>
                    openCertificate(
                      cert.publicId
                    )
                  }
                  className="mt-5 w-full bg-violet-600 hover:bg-violet-700 text-white rounded-2xl py-3 flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}