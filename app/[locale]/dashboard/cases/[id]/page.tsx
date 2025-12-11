'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Edit,
  Trash2,
  Clock,
  User,
  FolderOpen,
} from 'lucide-react';

// Mock data - will be replaced with real API call
const mockCase = {
  id: '1',
  title: 'Crypto Exchange ABC Compliance Review',
  clientName: 'Crypto Exchange ABC',
  category: 'CRYPTO_EXCHANGE_COMPLIANCE',
  status: 'IN_PROGRESS',
  description:
    'Comprehensive compliance review for a cryptocurrency exchange operating in multiple jurisdictions. Need to assess AML/KYC procedures, regulatory reporting requirements, and licensing status.',
  createdAt: new Date('2024-12-01'),
  updatedAt: new Date('2024-12-10'),
};

const mockDocuments = [
  {
    id: '1',
    title: 'Compliance Opinion Letter',
    type: 'LEGAL_OPINION',
    status: 'APPROVED',
    createdAt: new Date('2024-12-08'),
    isAiGenerated: true,
  },
  {
    id: '2',
    title: 'AML Policy Review',
    type: 'COMPLIANCE_REPORT',
    status: 'DRAFT',
    createdAt: new Date('2024-12-05'),
    isAiGenerated: true,
  },
];

export default function CaseDetailsPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const caseId = params.id as string;

  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      IN_PROGRESS:
        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      REVIEW:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      COMPLETED:
        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      ARCHIVED:
        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/dashboard/cases`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {mockCase.title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    mockCase.status
                  )}`}
                >
                  {t(`cases.statuses.${mockCase.status}`)}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {t(`cases.categories.${mockCase.category}`)}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Information */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Case Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {t('cases.clientName')}
                  </label>
                  <p className="text-slate-900 dark:text-white mt-1">
                    {mockCase.clientName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {t('cases.description')}
                  </label>
                  <p className="text-slate-900 dark:text-white mt-1 whitespace-pre-wrap">
                    {mockCase.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Documents ({mockDocuments.length})
                </h2>
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate with AI
                </button>
              </div>

              <div className="space-y-3">
                {mockDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No documents yet
                    </p>
                    <button
                      onClick={() => setShowGenerateModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                      Generate First Document
                    </button>
                  </div>
                ) : (
                  mockDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {doc.title}
                            </p>
                            {doc.isAiGenerated && (
                              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {t(`documents.types.${doc.type}`)} •{' '}
                            {doc.createdAt.toLocaleDateString(locale, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/${locale}/dashboard/documents/${doc.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Document
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <FileText className="h-4 w-4" />
                  Upload Document
                </button>
              </div>
            </div>

            {/* Case Details */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Client:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {mockCase.clientName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FolderOpen className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Category:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {t(`cases.categories.${mockCase.category}`)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Created:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {mockCase.createdAt.toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Updated:
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {mockCase.updatedAt.toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Document Modal */}
      {showGenerateModal && (
        <GenerateDocumentModal
          caseData={mockCase}
          onClose={() => setShowGenerateModal(false)}
          locale={locale}
        />
      )}
    </div>
  );
}

function GenerateDocumentModal({
  caseData,
  onClose,
  locale,
}: {
  caseData: typeof mockCase;
  onClose: () => void;
  locale: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [formData, setFormData] = useState({
    userPrompt: '',
    additionalContext: caseData.description,
    language: locale === 'zh-TW' ? 'zh-TW' : locale === 'zh-CN' ? 'zh-CN' : 'en',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Redirect to document generator with pre-filled data
      const queryParams = new URLSearchParams({
        caseId: caseData.id,
        category: caseData.category,
        clientName: caseData.clientName,
        prompt: formData.userPrompt,
        context: formData.additionalContext,
        language: formData.language,
      });

      router.push(
        `/${locale}/dashboard/documents/generate?${queryParams.toString()}`
      );
    } catch (error) {
      console.error('Error:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Generate Document with AI
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            For case: {caseData.title}
          </p>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              What document do you need? *
            </label>
            <textarea
              required
              value={formData.userPrompt}
              onChange={(e) =>
                setFormData({ ...formData, userPrompt: e.target.value })
              }
              placeholder="E.g., Generate a legal opinion letter regarding AML compliance requirements..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Additional Context
            </label>
            <textarea
              value={formData.additionalContext}
              onChange={(e) =>
                setFormData({ ...formData, additionalContext: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="zh-TW">繁體中文</option>
              <option value="zh-CN">简体中文</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-lg transition-colors"
            >
              <Sparkles className="h-5 w-5" />
              {isGenerating ? 'Generating...' : 'Generate Document'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
