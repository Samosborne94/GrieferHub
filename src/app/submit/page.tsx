'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { ReportInput, ReportSeverity } from '@/types/report';

const GAMES = [
  'Minecraft',
  'Rust',
  'ARK: Survival Evolved',
  'DayZ',
  'Counter-Strike 2',
  'GTA Online',
  'Roblox',
  'Fortnite',
  'Valorant',
  'Other',
];

const SEVERITIES: { value: ReportSeverity; label: string; description: string }[] = [
  { value: 'Low', label: 'Low', description: 'Minor annoyance or isolated incident' },
  { value: 'Medium', label: 'Medium', description: 'Repeated harassment or moderate disruption' },
  { value: 'High', label: 'High', description: 'Significant griefing or coordinated attacks' },
  { value: 'Critical', label: 'Critical', description: 'Extreme harassment, doxxing, or threats' },
];

export default function SubmitReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<ReportInput>({
    grieferName: '',
    game: '',
    description: '',
    evidenceUrl: '',
    severity: 'Medium',
    server: '',
    tags: [],
  });

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState<string>('');

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/submit');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB video, 10MB image
      if (file.size > maxSize) {
        setError(`File too large. Maximum size: ${file.type.startsWith('video/') ? '100MB' : '10MB'}`);
        return;
      }
      setEvidenceFile(file);
      setError('');
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.grieferName.trim()) {
        throw new Error('Griefer name is required');
      }
      if (!formData.game) {
        throw new Error('Please select a game');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }

      let evidenceUrl = formData.evidenceUrl;

      // Upload file if provided
      if (evidenceFile) {
        setUploadProgress('Uploading evidence...');
        const uploadFormData = new FormData();
        uploadFormData.append('file', evidenceFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json();
          throw new Error(uploadError.error || 'Failed to upload evidence');
        }

        const uploadData = await uploadRes.json();
        evidenceUrl = uploadData.url;
      }

      // Submit report
      setUploadProgress('Submitting report...');
      const reportData: ReportInput = {
        grieferName: formData.grieferName,
        game: formData.game,
        description: formData.description,
        evidenceUrl: evidenceUrl || '',
        severity: formData.severity,
        server: formData.server,
        tags: formData.tags,
      };

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }

      const result = await response.json();

      // Redirect to the created report
      router.push(`/report/${result.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Submit a Report</h1>
            <p className="text-gray-400">
              Help keep our gaming communities safe by reporting griefing incidents.
              All reports are reviewed by moderators.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Griefer Name */}
            <div>
              <label htmlFor="grieferName" className="block text-sm font-medium text-gray-300 mb-2">
                Griefer Name/Tag <span className="text-red-500">*</span>
              </label>
              <Input
                id="grieferName"
                name="grieferName"
                type="text"
                required
                value={formData.grieferName}
                onChange={handleInputChange}
                placeholder="Enter the griefer's username or gamertag"
                disabled={isSubmitting}
              />
            </div>

            {/* Game */}
            <div>
              <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-2">
                Game <span className="text-red-500">*</span>
              </label>
              <select
                id="game"
                name="game"
                required
                value={formData.game}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Select a game</option>
                {GAMES.map(game => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>

            {/* Server/Region */}
            <div>
              <label htmlFor="server" className="block text-sm font-medium text-gray-300 mb-2">
                Server/Region (Optional)
              </label>
              <Input
                id="server"
                name="server"
                type="text"
                value={formData.server}
                onChange={handleInputChange}
                placeholder="e.g., US-East-1, EU-West, server name"
                disabled={isSubmitting}
              />
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {SEVERITIES.map(({ value, label, description }) => (
                  <label
                    key={value}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.severity === value
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={value}
                      checked={formData.severity === value}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-white">{label}</div>
                      <div className="text-sm text-gray-400">{description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what happened in detail. Include dates, times, and any relevant context."
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length} characters
              </p>
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Evidence (Image or Video)
              </label>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Supported: JPG, PNG, WebP (max 10MB) | MP4, WebM, MOV (max 100MB)
                  </p>
                </div>

                {evidenceFile && (
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-300">{evidenceFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setEvidenceFile(null)}
                      disabled={isSubmitting}
                      className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="text-center text-gray-500">or</div>

                <Input
                  name="evidenceUrl"
                  type="url"
                  value={formData.evidenceUrl}
                  onChange={handleInputChange}
                  placeholder="Paste a URL to evidence (YouTube, Imgur, etc.)"
                  disabled={isSubmitting || !!evidenceFile}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tagInput" className="block text-sm font-medium text-gray-300 mb-2">
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  id="tagInput"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tags (e.g., spawn-camping, chat-abuse)"
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={isSubmitting || !tagInput.trim()}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-white disabled:opacity-50"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <Button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    {uploadProgress || 'Submitting...'}
                  </span>
                ) : (
                  'Submit Report'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Reporting Guidelines</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Be specific and provide as much detail as possible</li>
            <li>• Include evidence when available (screenshots, videos, logs)</li>
            <li>• Do not include personal information or doxxing content</li>
            <li>• Reports are reviewed within 24-48 hours</li>
            <li>• False reports may result in account suspension</li>
            <li>• You will be notified when your report status changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
