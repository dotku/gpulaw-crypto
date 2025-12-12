'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useParams } from 'next/navigation';
import { Sparkles, FileText, Loader2, Download, ArrowLeft, Edit3, Eye, Maximize2, Minimize2, Columns2, Rows3 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function GenerateDocumentPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [savedDocumentId, setSavedDocumentId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'split' | 'stacked'>('split');

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

      // Show detailed error message to help debug
      let errorMessage = 'Failed to generate document. ';
      if (error.message) {
        errorMessage += error.message;
      }
      if (error.response) {
        errorMessage += ` API Response: ${JSON.stringify(error.response)}`;
      }

      setError(errorMessage);

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

  const handleSave = async () => {
    if (!generatedContent) return;

    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Map case category to document type
      const documentTypeMap: Record<string, string> = {
        CRYPTO_EXCHANGE_COMPLIANCE: 'COMPLIANCE_REPORT',
        ICO_LEGAL_OPINION: 'LEGAL_OPINION',
        AML_COMPLIANCE: 'COMPLIANCE_REPORT',
        USER_AGREEMENT: 'USER_AGREEMENT',
        REGULATORY_FILING: 'REGULATORY_FILING',
        LICENSING: 'LICENSE_APPLICATION',
        TOKEN_CLASSIFICATION: 'LEGAL_OPINION',
        SMART_CONTRACT_AUDIT: 'COMPLIANCE_REPORT',
      };

      const documentType = documentTypeMap[formData.caseCategory] || 'LEGAL_OPINION';

      // Generate title from category and client name
      const documentTitle = `${formData.caseCategory.replace(/_/g, ' ')} - ${formData.clientName || 'Draft'}`;

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: documentTitle,
          content: generatedContent,
          type: documentType,
          caseId: formData.caseId || 'demo-case',
          userId: 'demo-user', // TODO: Get from auth session
          language: locale,
          status: 'AI_GENERATED',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      const data = await response.json();

      setSavedDocumentId(data.document.id);
      setSuccessMessage(data.message);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving document:', error);
      setError('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;

    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.caseCategory}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEdit = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    // Automatically enter fullscreen when entering edit mode, exit when leaving
    if (newEditMode) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to exit fullscreen and edit mode
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setIsEditMode(false);
      }
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && generatedContent) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, generatedContent]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/dashboard/documents`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            {t('documents.generateWithAI')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Use AI to generate professional legal documents
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
              {error}
            </div>
          )}
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
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      t('common.save')
                    )}
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>

                {/* Content Display */}
                {isEditMode && isFullscreen ? (
                  <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900">
                    {/* Fullscreen Edit Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Edit3 className="h-5 w-5 text-purple-600" />
                            Editing Document
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">Esc</kbd> to exit fullscreen •
                            <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded ml-1">Ctrl+S</kbd> to save
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLayoutMode(layoutMode === 'split' ? 'stacked' : 'split')}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors flex items-center gap-2"
                            title={layoutMode === 'split' ? 'Switch to stacked' : 'Switch to side-by-side'}
                          >
                            {layoutMode === 'split' ? <Rows3 className="h-4 w-4" /> : <Columns2 className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                          </button>
                          <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setIsFullscreen(false);
                              setIsEditMode(false);
                            }}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors"
                          >
                            <Minimize2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                    <div className={`${
                      layoutMode === 'split' ? 'grid lg:grid-cols-2 gap-4' : 'flex flex-col gap-4'
                    } p-4 h-[calc(100vh-80px)]`}>
                      {/* Editor */}
                      <div className={layoutMode === 'stacked' ? 'flex-1' : ''}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Markdown Source
                          </h3>
                        </div>
                        <textarea
                          value={generatedContent}
                          onChange={(e) => setGeneratedContent(e.target.value)}
                          className="w-full h-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          spellCheck={false}
                          placeholder="Edit your markdown here..."
                        />
                      </div>

                      {/* Live Preview */}
                      <div className={layoutMode === 'stacked' ? 'flex-1' : ''}>
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Live Preview
                        </h3>
                        <div className="h-full overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 p-6">
                          <div className="prose dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-pre:bg-slate-800 dark:prose-pre:bg-slate-950">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {generatedContent}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 max-h-150 overflow-y-auto">
                      <div className="prose dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:text-purple-600 dark:prose-code:text-purple-400">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {generatedContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
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
