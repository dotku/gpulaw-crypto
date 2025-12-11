'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Scale,
  Sparkles,
  Globe,
  FolderOpen,
  Shield,
  FileText,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {t('common.appName')}
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {t('common.dashboard')}
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.login')}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('home.hero.cta')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
            >
              {t('home.hero.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('home.features.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title={t('home.features.ai.title')}
            description={t('home.features.ai.description')}
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title={t('home.features.compliance.title')}
            description={t('home.features.compliance.description')}
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6" />}
            title={t('home.features.multilingual.title')}
            description={t('home.features.multilingual.description')}
          />
          <FeatureCard
            icon={<FolderOpen className="h-6 w-6" />}
            title={t('home.features.management.title')}
            description={t('home.features.management.description')}
          />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Specialized Legal Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UseCaseItem icon={<FileText className="h-5 w-5" />} text="Crypto Exchange Compliance" />
            <UseCaseItem icon={<FileText className="h-5 w-5" />} text="ICO Legal Opinions" />
            <UseCaseItem icon={<FileText className="h-5 w-5" />} text="AML Compliance Reports" />
            <UseCaseItem icon={<FileText className="h-5 w-5" />} text="Token Classification" />
            <UseCaseItem icon={<FileText className="h-5 w-5" />} text="Smart Contract Audits" />
            <UseCaseItem icon={<FileText className="h-5 w-5" />} text="Regulatory Filings" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
            &copy; 2024 GPULaw AI Legal Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        {description}
      </p>
    </div>
  );
}

function UseCaseItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
      <div className="text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}
