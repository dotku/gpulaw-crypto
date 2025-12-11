'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Filter, FolderOpen } from 'lucide-react';
import { useState } from 'react';

// Mock data - will be replaced with real database data
const mockCases = [
  {
    id: '1',
    title: 'Crypto Exchange ABC Compliance Review',
    clientName: 'Crypto Exchange ABC',
    category: 'CRYPTO_EXCHANGE_COMPLIANCE',
    status: 'IN_PROGRESS',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: '2',
    title: 'TokenCo ICO Legal Opinion',
    clientName: 'TokenCo Ltd.',
    category: 'ICO_LEGAL_OPINION',
    status: 'REVIEW',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-08'),
  },
  {
    id: '3',
    title: 'DeFi Platform User Agreement',
    clientName: 'DeFi Platform Inc.',
    category: 'USER_AGREEMENT',
    status: 'COMPLETED',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    id: '4',
    title: 'NFT Marketplace AML Compliance',
    clientName: 'NFT Marketplace',
    category: 'AML_COMPLIANCE',
    status: 'DRAFT',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
];

export default function CasesPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCases = mockCases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t('cases.title')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage all your legal cases
            </p>
          </div>
          <Link
            href={`/${locale}/dashboard/cases/new`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            {t('cases.newCase')}
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
                placeholder={t('common.search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="DRAFT">{t('cases.statuses.DRAFT')}</option>
                <option value="IN_PROGRESS">
                  {t('cases.statuses.IN_PROGRESS')}
                </option>
                <option value="REVIEW">{t('cases.statuses.REVIEW')}</option>
                <option value="COMPLETED">
                  {t('cases.statuses.COMPLETED')}
                </option>
                <option value="ARCHIVED">{t('cases.statuses.ARCHIVED')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {filteredCases.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
              <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No cases found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first case to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link
                  href={`/${locale}/dashboard/cases/new`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  {t('cases.newCase')}
                </Link>
              )}
            </div>
          ) : (
            filteredCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/${locale}/dashboard/cases/${caseItem.id}`}
                className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                      {caseItem.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {caseItem.clientName}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      caseItem.status
                    )}`}
                  >
                    {t(`cases.statuses.${caseItem.status}`)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                    {t(`cases.categories.${caseItem.category}`)}
                  </span>
                  <span>
                    Updated{' '}
                    {caseItem.updatedAt.toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
