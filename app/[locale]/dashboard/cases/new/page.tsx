'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewCasePage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    category: 'CRYPTO_EXCHANGE_COMPLIANCE',
    description: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to cases list
    router.push(`/${locale}/dashboard/cases`);
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/dashboard/cases`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t('cases.newCase')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create a new legal case for cryptocurrency compliance
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6"
        >
          {/* Case Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Case Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Crypto Exchange ABC Compliance Review"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('cases.clientName')} *
            </label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              placeholder="Enter client or company name"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('cases.category')} *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="CRYPTO_EXCHANGE_COMPLIANCE">
                {t('cases.categories.CRYPTO_EXCHANGE_COMPLIANCE')}
              </option>
              <option value="ICO_LEGAL_OPINION">
                {t('cases.categories.ICO_LEGAL_OPINION')}
              </option>
              <option value="AML_COMPLIANCE">
                {t('cases.categories.AML_COMPLIANCE')}
              </option>
              <option value="USER_AGREEMENT">
                {t('cases.categories.USER_AGREEMENT')}
              </option>
              <option value="REGULATORY_FILING">
                {t('cases.categories.REGULATORY_FILING')}
              </option>
              <option value="LICENSING">
                {t('cases.categories.LICENSING')}
              </option>
              <option value="TOKEN_CLASSIFICATION">
                {t('cases.categories.TOKEN_CLASSIFICATION')}
              </option>
              <option value="SMART_CONTRACT_AUDIT">
                {t('cases.categories.SMART_CONTRACT_AUDIT')}
              </option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('cases.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide details about the case, requirements, and objectives..."
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This information will help in generating relevant legal documents
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors"
            >
              <Save className="h-5 w-5" />
              {isSaving ? 'Creating...' : 'Create Case'}
            </button>
            <Link
              href={`/${locale}/dashboard/cases`}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
