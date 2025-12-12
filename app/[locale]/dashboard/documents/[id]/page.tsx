'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Sparkles,
} from 'lucide-react';

type DocumentDetail = {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  case?: {
    title: string;
    category: string;
    clientName?: string | null;
  };
  template?: {
    name: string;
  } | null;
};

export default function DocumentDetailPage() {
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;
  const id = params.id as string;

  const [documentData, setDocumentData] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [aiFormatEnabled, setAiFormatEnabled] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'ai'; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [chatError, setChatError] = useState('');

  const insertIntoEditor = (text: string) => {
    setIsEditing(true);
    setEditedContent((prev) => {
      if (!prev) return text;
      return `${prev}\n\n${text}`;
    });
  };

  const markdownComponents = useMemo(
    () => ({
      h1: ({ children }: any) => (
        <h1 className="text-2xl font-bold mt-6 mb-3 leading-tight">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-xl font-semibold mt-5 mb-2 leading-tight">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-lg font-semibold mt-4 mb-2 leading-snug">
          {children}
        </h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-base font-semibold mt-3 mb-1 leading-snug">
          {children}
        </h4>
      ),
      ol: ({ children }: any) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
      ul: ({ children }: any) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
      li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
      p: ({ children }: any) => <p className="mb-3 leading-relaxed">{children}</p>,
    }),
    []
  );

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/documents/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(t('documents.errors.notFound'));
          }
          throw new Error('Failed to fetch document');
        }

        const data = await response.json();
        setDocumentData(data.document);
        setEditedTitle(data.document?.title || '');
        setEditedContent(data.document?.content || '');
      } catch (err: any) {
        console.error('Error fetching document:', err);
        setError(err.message || 'Failed to load document');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [id, t]);

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

  const formattedDate = useMemo(() => {
    if (!documentData) return '';
    return new Date(documentData.createdAt).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [documentData, locale]);

  const handleDownload = () => {
    if (!documentData?.content) return;
    if (typeof window === 'undefined') return;

    const blob = new Blob([documentData.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${documentData.title || 'document'}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  // Improve markdown readability by inserting blank lines before list blocks
  const normalizedContent = useMemo(() => {
    if (!documentData?.content) return '';
    const lines = documentData.content.split('\n');
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      // Split inline list markers (a. / b. / 1.) onto new lines after punctuation
      line = line.replace(
        /([.:;])\s+([0-9]+\.|[a-zA-Z]\.)\s+/g,
        '$1\n$2 '
      );

      const trimmed = line.trim();
      const prev = result[result.length - 1] || '';
      const isListItem =
        /^[-*+]\s+/.test(trimmed) ||
        /^[0-9]+\.\s+/.test(trimmed) ||
        /^[a-zA-Z]\.\s+/.test(trimmed);
      const prevIsList =
        /^[-*+]\s+/.test(prev.trim()) ||
        /^[0-9]+\.\s+/.test(prev.trim()) ||
        /^[a-zA-Z]\.\s+/.test(prev.trim());
      const isHeading = /^#{1,6}\s+/.test(trimmed);

      if (isListItem && prev.trim() !== '' && !prevIsList) {
        result.push('');
      }

      if (isHeading && prev.trim() !== '') {
        result.push('');
      }

      if (isHeading) {
        line = trimmed; // remove accidental leading spaces before headings
      }

      result.push(line);
    }

    return result.join('\n');
  }, [documentData?.content]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || !documentData) return;
    setIsChatting(true);
    setChatError('');

    const userMessage = { role: 'user' as const, text: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await fetch(`/api/documents/${documentData.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiReply =
        data.reply ||
        'No response generated. Please try asking your question differently.';

      setChatMessages((prev) => [...prev, { role: 'ai', text: aiReply }]);
    } catch (err: any) {
      console.error('Chat failed:', err);
      setChatError(err.message || 'Failed to get AI response');
    } finally {
      setIsChatting(false);
    }
  };

  const handleSave = async () => {
    if (!documentData) return;

    setIsSaving(true);
    setError('');

    const formattedContent = aiFormatEnabled
      ? editedContent
          .split('\n')
          .map((line) => (line.endsWith('  ') || line === '' ? line : `${line}  `))
          .join('\n')
      : editedContent;

    try {
      const response = await fetch(`/api/documents/${documentData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          content: formattedContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const data = await response.json();
      setDocumentData(data.document);
      setIsEditing(false);
      setEditedContent(data.document?.content || '');
    } catch (err: any) {
      console.error('Failed to update document:', err);
      setError(err.message || 'Failed to update document');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start lg:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/${locale}/dashboard/documents`}
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Link>

            {documentData?.status === 'AI_GENERATED' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200 text-sm">
                <Sparkles className="h-4 w-4" />
                {t('documents.statuses.AI_GENERATED')}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
              <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-slate-600 dark:text-slate-300">
                {t('common.loading')}
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-800 dark:text-red-200">
              {error}
            </div>
          ) : documentData ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 mb-2 items-start">
                      {isEditing ? (
                        <input
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full text-2xl font-semibold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-700 focus:outline-none"
                        />
                      ) : (
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                          {documentData.title}
                        </h1>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            documentData.status
                          )}`}
                        >
                          {t(`documents.statuses.${documentData.status}`)}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                          {t(`documents.types.${documentData.type}`)}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs uppercase">
                          {documentData.language}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t('documents.detail.createdOn')}: {formattedDate}
                    </p>
                    {documentData.case && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {t('cases.title')}: {documentData.case.title} &bull;{' '}
                        {t('cases.category')}: {documentData.case.category}
                        {documentData.case.clientName
                          ? ` • ${documentData.case.clientName}`
                          : ''}
                      </p>
                    )}
                    {documentData.template?.name && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Template: {documentData.template.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-60"
                    disabled={isSaving}
                  >
                    <Download className="h-4 w-4" />
                    {t('documents.actions.download')}
                  </button>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors"
                    >
                      {t('common.edit')}
                    </button>
                  ) : (
                    <>
                      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <input
                          type="checkbox"
                          checked={aiFormatEnabled}
                          onChange={(e) => setAiFormatEnabled(e.target.checked)}
                          className="h-4 w-4"
                        />
                        {t('documents.formatting.aiAssist')}
                      </label>
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-60"
                        disabled={isSaving}
                      >
                        {isSaving ? t('common.loading') : t('common.save')}
                      </button>
                      <button
                        onClick={() => {
                          setEditedTitle(documentData.title);
                          setEditedContent(documentData.content);
                          setIsEditing(false);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors"
                        disabled={isSaving}
                      >
                        {t('common.cancel')}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[400px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {normalizedContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="w-full lg:w-96 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col h-full lg:sticky lg:top-8 lg:max-h-[calc(100vh-140px)]">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {t('documents.assistant.title')}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('documents.assistant.subtitle')}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 min-h-0">
            {chatMessages.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t('documents.assistant.empty')}
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.role === 'ai' && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => insertIntoEditor(msg.text)}
                        className="text-xs inline-flex items-center gap-1 px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white transition-colors"
                      >
                        {t('documents.assistant.insert')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
            {chatError && (
              <div className="text-sm text-red-600 dark:text-red-300">
                {chatError}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t('documents.assistant.placeholder')}
              className="w-full h-24 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleChatSend}
                disabled={isChatting || !chatInput.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                {isChatting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {t('documents.assistant.send')}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
