import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { api } from '../api/apiClient';

/**
 * Universal file download utility that downloads directly to disk without navigating away
 */
export async function downloadDocument(resolvedUrl, fileName = 'Candidate_Resume.pdf') {
  if (!resolvedUrl) return;
  try {
    const response = await fetch(resolvedUrl);
    if (!response.ok) throw new Error('Fetch failed');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    let downloadUrl = resolvedUrl;
    if (resolvedUrl.includes('cloudinary.com') && resolvedUrl.includes('/upload/')) {
      downloadUrl = resolvedUrl.replace('/upload/', '/upload/fl_attachment/');
    }
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default function ResumeViewerModal({ isOpen, onClose, candidate }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);

  const rawUrl = candidate?.fileUrl || candidate?.resumeUrl || candidate?._url || '';
  const fileTargetUrl = candidate
    ? api.getResumeFileUrl(candidate, false)
    : (rawUrl ? api.resolveFileUrl(rawUrl) : '');
  const downloadTargetUrl = candidate
    ? api.getResumeFileUrl(candidate, true)
    : (rawUrl ? api.resolveFileUrl(rawUrl) : '');
  const fileName = candidate?.fileName || candidate?.resumeFileName || candidate?._file || 'Candidate_Resume.pdf';
  const candidateName = candidate?.candidateName || candidate?.name || 'Candidate';
  const roleOrCategory = candidate?.jobTitle || candidate?.category || candidate?._displayTitle || 'General Pool';
  const email = candidate?.email || '';
  const phone = candidate?.phone || '';
  const experience = candidate?.experience || '';

  const isDocx = fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc');
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName) || /\.(jpg|jpeg|png|webp)$/i.test(rawUrl);
  const isPdf = !isDocx && !isImage;

  React.useEffect(() => {
    if (!isOpen || !candidate || !fileTargetUrl || isImage) {
      setBlobUrl(null);
      setFileBlob(null);
      return;
    }

    let active = true;
    setIsLoadingFile(true);

    fetch(fileTargetUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (!active) return;
        setFileBlob(blob);
        const finalBlob = isPdf ? new Blob([blob], { type: 'application/pdf' }) : blob;
        const url = URL.createObjectURL(finalBlob);
        setBlobUrl(url);
        setIsLoadingFile(false);
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Could not load blob for in-panel preview:', err);
        setBlobUrl(fileTargetUrl);
        setIsLoadingFile(false);
      });

    return () => {
      active = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, candidate, fileTargetUrl, isImage, isPdf]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (fileBlob) {
        const url = URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        await downloadDocument(downloadTargetUrl, fileName);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen || !candidate) return null;

  return (
    <div
      className="adm-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 29, 58, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="adm-modal-container"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#071D3A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'rgba(221, 181, 104, 0.2)',
                color: '#DDB568',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                  {candidateName}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#E2E8F0',
                  }}
                >
                  {roleOrCategory}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#94A3B8',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flexWrap: 'wrap',
                }}
              >
                {phone && (
                  <span>
                    Phone: <strong style={{ color: '#F8FAFC' }}>{phone}</strong>
                  </span>
                )}
                {email && (
                  <span>
                    Email: <strong style={{ color: '#F8FAFC' }}>{email}</strong>
                  </span>
                )}
                {experience && <span>Exp: {experience}</span>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {fileTargetUrl && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="adm-btn-action"
                style={{
                  backgroundColor: '#DDB568',
                  color: '#071D3A',
                  fontWeight: 700,
                  border: 'none',
                  cursor: isDownloading ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  opacity: isDownloading ? 0.75 : 1,
                }}
                title="Download resume document to your computer"
              >
                <Download size={14} />
                <span>{isDownloading ? 'Downloading...' : 'Download Document'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
              title="Close Viewer"
            >
              <X size={16} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Sub-bar with Document Meta */}
        {fileTargetUrl && !isImage && (
          <div
            style={{
              padding: '8px 22px',
              backgroundColor: '#F1F5F9',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#475569',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#071D3A' }}>Document:</span>
              <span style={{ fontFamily: 'monospace', color: '#1E293B' }}>{fileName}</span>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: '#E2E8F0',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {isDocx ? 'Word Document' : 'PDF Document'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '11.5px', fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
              <span>Secure In-Panel Viewer</span>
            </div>
          </div>
        )}

        {/* Modal Body / Embedded Document Viewer */}
        <div
          style={{
            flex: 1,
            height: '75vh',
            minHeight: '480px',
            backgroundColor: '#F8FAFC',
            position: 'relative',
            overflow: 'auto',
          }}
        >
          {fileTargetUrl ? (
            isImage ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  height: '100%',
                }}
              >
                <img
                  src={fileTargetUrl}
                  alt={`Resume for ${candidateName}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '6px',
                  }}
                />
              </div>
            ) : isDocx ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '30px',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '32px',
                    maxWidth: '560px',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <FileText size={32} />
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '18px', color: '#071D3A' }}>
                    {fileName}
                  </h4>
                  <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748B' }}>
                    Microsoft Word Document submitted by <strong>{candidateName}</strong>
                  </p>

                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12.5px',
                      marginBottom: '20px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748B' }}>Candidate:</span>
                      <div style={{ fontWeight: 600, color: '#071D3A' }}>{candidateName}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Category / Role:</span>
                      <div style={{ fontWeight: 600, color: '#071D3A' }}>{roleOrCategory}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Phone:</span>
                      <div style={{ fontWeight: 600, color: '#071D3A' }}>{phone || 'N/A'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Email:</span>
                      <div style={{ fontWeight: 600, color: '#071D3A' }}>{email || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      style={{
                        backgroundColor: '#DDB568',
                        color: '#071D3A',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Download size={16} />
                      <span>{isDownloading ? 'Downloading...' : 'Download Document'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : isLoadingFile ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#64748B',
                  gap: '12px',
                }}
              >
                <RefreshCw size={24} className="adm-spin" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Loading document preview in admin panel...</span>
              </div>
            ) : (
              <iframe
                src={blobUrl || fileTargetUrl}
                title={`Resume - ${candidateName}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
              />
            )
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '40px 20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <AlertCircle size={28} />
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: '#071D3A' }}>
                Profile Submitted Without Document Attachment
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B', maxWidth: '420px' }}>
                Candidate <strong>{candidateName}</strong> provided their contact information for the talent
                pool but did not upload an external file.
              </p>
              <div
                style={{
                  marginTop: '20px',
                  background: '#FFFFFF',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'left',
                  fontSize: '13px',
                }}
              >
                <div><strong>Full Name:</strong> {candidateName}</div>
                <div><strong>Email:</strong> {email}</div>
                <div><strong>Phone:</strong> {phone}</div>
                <div><strong>Experience:</strong> {experience || 'Not specified'}</div>
                <div><strong>Category:</strong> {roleOrCategory}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
