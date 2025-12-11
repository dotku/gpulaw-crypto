'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FolderOpen, FileText, Sparkles, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t('common.dashboard')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your legal cases and documents
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Cases"
            value="12"
            icon={<FolderOpen className="h-6 w-6" />}
            trend="+2 this month"
            color="blue"
          />
          <StatCard
            title="Documents"
            value="48"
            icon={<FileText className="h-6 w-6" />}
            trend="+8 this week"
            color="green"
          />
          <StatCard
            title="AI Generated"
            value="24"
            icon={<Sparkles className="h-6 w-6" />}
            trend="50% of total"
            color="purple"
          />
          <StatCard
            title="Completed"
            value="36"
            icon={<TrendingUp className="h-6 w-6" />}
            trend="+12 this month"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QuickActionCard
            title={t('cases.newCase')}
            description="Start a new legal case"
            href={`/${locale}/dashboard/cases/new`}
            icon={<FolderOpen className="h-8 w-8" />}
            color="blue"
          />
          <QuickActionCard
            title={t('documents.generateWithAI')}
            description="Create a document using AI"
            href={`/${locale}/dashboard/documents/generate`}
            icon={<Sparkles className="h-8 w-8" />}
            color="purple"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <ActivityItem
              title="ICO Legal Opinion - Crypto Exchange ABC"
              description="Document generated using AI"
              time="2 hours ago"
            />
            <ActivityItem
              title="AML Compliance Report - TokenCo"
              description="Case status updated to Review"
              time="5 hours ago"
            />
            <ActivityItem
              title="User Agreement - DeFi Platform"
              description="New case created"
              time="1 day ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500">{trend}</p>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
    purple: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <Link
      href={href}
      className={`block p-6 rounded-lg border-2 transition-all ${colorClasses[color]}`}
    >
      <div className={`mb-4 ${iconColorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </Link>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
      <div className="flex-1">
        <p className="font-medium text-slate-900 dark:text-white">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
        {time}
      </p>
    </div>
  );
}
