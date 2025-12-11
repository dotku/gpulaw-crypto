'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Filter, FileText, Sparkles, Download } from 'lucide-react';
import { useState } from 'react';

// Mock data
const mockDocuments = [
  {
    id: '1',
    title: 'Crypto Exchange ABC - Compliance Opinion',
    type: 'LEGAL_OPINION',
    status: 'APPROVED',
    language: 'en',
    caseTitle: 'Crypto Exchange ABC Compliance Review',
    createdAt: new Date('2024-12-08'),
    isAiGenerated: true,
  },
  {
    id: '2',
    title: 'TokenCo ICO Legal Analysis',
    type: 'LEGAL_OPINION',
    status: 'UNDER_REVIEW',
    language: 'en',
    caseTitle: 'TokenCo ICO Legal Opinion',
    createdAt: new Date('2024-12-07'),
    isAiGenerated: true,
  },
  {
    id: '3',
    title: 'DeFi Platform User Agreement',
    type: 'USER_AGREEMENT',
    status: 'FINALIZED',
    language: 'zh-TW',
    caseTitle: 'DeFi Platform User Agreement',
    createdAt: new Date('2024-11-20'),
    isAiGenerated: false,
  },
  {
    id: '4',
    title: 'NFT Marketplace AML Policy',
    type: 'COMPLIANCE_REPORT',
    status: 'DRAFT',
    language: 'en',
    caseTitle: 'NFT Marketplace AML Compliance',
    createdAt: new Date('2024-12-05'),
    isAiGenerated: true,
  },
];

export default function DocumentsPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.caseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      AI_GENERATED:
        'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      UNDER_REVIEW:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      APPROVED:
        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      FINALIZED:
        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t('documents.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              All legal documents and AI-generated content
            </p>
          </div>
          <Link
            href={`/${locale}/dashboard/documents/generate`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            {t('documents.generateWithAI')}
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('common.search') + ' documents...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="LEGAL_OPINION">
                  {t('documents.types.LEGAL_OPINION')}
                </option>
                <option value="COMPLIANCE_REPORT">
                  {t('documents.types.COMPLIANCE_REPORT')}
                </option>
                <option value="USER_AGREEMENT">
                  {t('documents.types.USER_AGREEMENT')}
                </option>
                <option value="PRIVACY_POLICY">
                  {t('documents.types.PRIVACY_POLICY')}
                </option>
                <option value="REGULATORY_FILING">
                  {t('documents.types.REGULATORY_FILING')}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDocuments.length === 0 ? (
            <div className="col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No documents found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {searchQuery || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Generate your first document with AI'}
              </p>
              {!searchQuery && typeFilter === 'all' && (
                <Link
                  href={`/${locale}/dashboard/documents/generate`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Sparkles className="h-5 w-5" />
                  {t('documents.generateWithAI')}
                </Link>
              )}
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 truncate">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {doc.caseTitle}
                      </p>
                    </div>
                  </div>
                  {doc.isAiGenerated && (
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      doc.status
                    )}`}
                  >
                    {t(`documents.statuses.${doc.status}`)}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                    {t(`documents.types.${doc.type}`)}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs uppercase">
                    {doc.language}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {doc.createdAt.toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
