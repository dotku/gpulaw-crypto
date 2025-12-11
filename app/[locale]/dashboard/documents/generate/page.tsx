'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useParams } from 'next/navigation';
import { Sparkles, FileText, Loader2, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GenerateDocumentPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');

  // Initialize form data with URL params if available
  const [formData, setFormData] = useState({
    caseId: searchParams.get('caseId') || '',
    caseCategory: searchParams.get('category') || 'CRYPTO_EXCHANGE_COMPLIANCE',
    clientName: searchParams.get('clientName') || '',
    userPrompt: searchParams.get('prompt') || '',
    additionalContext: searchParams.get('context') || '',
    language: searchParams.get('language') || locale || 'en',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // Call real AI API
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: formData.caseId || 'demo',
          caseCategory: formData.caseCategory,
          clientName: formData.clientName,
          userPrompt: formData.userPrompt,
          additionalContext: formData.additionalContext,
          language: formData.language,
          userId: 'demo-user', // TODO: Get from auth session
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const data = await response.json();
      setGeneratedContent(data.content || data.document?.content);

    } catch (error: any) {
      console.error('Error generating document:', error);
      setError(error.message || 'Failed to generate document. Please try again.');

      // Fallback to mock data for demo
      const mockDocument = `# Legal Opinion - ${formData.caseCategory}

## Client Information
**Client Name:** ${formData.clientName || 'N/A'}
**Date:** ${new Date().toLocaleDateString()}
**Category:** ${formData.caseCategory}

## Executive Summary
This legal opinion addresses the following matter: ${formData.userPrompt}

## Analysis
Based on current cryptocurrency regulations and compliance requirements, we provide the following analysis:

### Regulatory Framework
The applicable regulatory framework includes...

### Compliance Requirements
Key compliance requirements for this matter include:
1. Know Your Customer (KYC) procedures
2. Anti-Money Laundering (AML) protocols
3. Transaction monitoring systems
4. Regulatory reporting obligations

### Risk Assessment
The following risks have been identified:
- Regulatory compliance risks
- Operational risks
- Legal jurisdiction considerations

## Recommendations
Based on our analysis, we recommend the following actions:
1. Implement robust KYC/AML procedures
2. Establish compliance monitoring systems
3. Maintain regular regulatory reporting
4. Consult with local regulatory authorities

## Conclusion
This opinion is provided based on the information available and current regulatory framework. Ongoing monitoring of regulatory developments is recommended.

---
*This document was generated with AI assistance and should be reviewed by qualified legal counsel.*
`;

      setGeneratedContent(mockDocument);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            {t('documents.generateWithAI')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Use AI to generate professional legal documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Document Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('cases.category')}
                </label>
                <select
                  value={formData.caseCategory}
                  onChange={(e) => setFormData({ ...formData, caseCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CRYPTO_EXCHANGE_COMPLIANCE">Crypto Exchange Compliance</option>
                  <option value="ICO_LEGAL_OPINION">ICO Legal Opinion</option>
                  <option value="AML_COMPLIANCE">AML Compliance</option>
                  <option value="USER_AGREEMENT">User Agreement</option>
                  <option value="REGULATORY_FILING">Regulatory Filing</option>
                  <option value="LICENSING">Licensing</option>
                  <option value="TOKEN_CLASSIFICATION">Token Classification</option>
                  <option value="SMART_CONTRACT_AUDIT">Smart Contract Audit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('cases.clientName')}
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Enter client name"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="zh-TW">繁體中文</option>
                  <option value="zh-CN">简体中文</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('ai.prompt')}
                </label>
                <textarea
                  value={formData.userPrompt}
                  onChange={(e) => setFormData({ ...formData, userPrompt: e.target.value })}
                  placeholder="Describe the legal document you need..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('ai.context')}
                </label>
                <textarea
                  value={formData.additionalContext}
                  onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                  placeholder="Add any additional context or requirements..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.userPrompt}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('ai.generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {t('ai.generate')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Preview
            </h2>

            {generatedContent ? (
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <pre className="whitespace-pre-wrap text-sm text-slate-900 dark:text-white font-mono">
                    {generatedContent}
                  </pre>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    {t('common.save')}
                  </button>
                  <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors">
                    {t('common.edit')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <FileText className="h-16 w-16 mb-4" />
                <p>Generated document will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
