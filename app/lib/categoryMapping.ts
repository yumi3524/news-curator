/**
 * カテゴリ定義とタグマッピング
 *
 * 各カテゴリに関連するタグを定義し、
 * ユーザーが選択したカテゴリから記事をフィルタリングする際に使用
 */

import {
  Layout,
  Server,
  Brain,
  Cloud,
  Smartphone,
  Shield,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type CategoryId =
  | 'frontend'
  | 'backend'
  | 'ai-ml'
  | 'infra-devops'
  | 'mobile'
  | 'security'
  | 'trending';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'frontend',
    name: 'フロントエンド',
    description: 'React, Vue, CSS, UI/UX',
    icon: Layout,
    color: '#3B82F6', // blue
    tags: [
      'react', 'vue', 'angular', 'svelte', 'nextjs', 'next.js', 'nuxt',
      'javascript', 'typescript', 'css', 'tailwind', 'tailwindcss',
      'html', 'frontend', 'ui', 'ux', 'web', 'browser', 'dom',
      'webpack', 'vite', 'esbuild', 'babel', 'storybook',
    ],
  },
  {
    id: 'backend',
    name: 'バックエンド',
    description: 'API, DB, サーバー',
    icon: Server,
    color: '#10B981', // green
    tags: [
      'node', 'nodejs', 'express', 'fastify', 'nestjs',
      'python', 'django', 'flask', 'fastapi',
      'ruby', 'rails', 'go', 'golang', 'rust',
      'java', 'spring', 'kotlin', 'scala',
      'api', 'rest', 'graphql', 'grpc', 'backend',
      'database', 'postgresql', 'mysql', 'mongodb', 'redis', 'sql',
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI / ML',
    description: '機械学習、LLM、データサイエンス',
    icon: Brain,
    color: '#8B5CF6', // purple
    tags: [
      'ai', 'ml', 'machine-learning', 'machinelearning',
      'deep-learning', 'deeplearning', 'neural-network',
      'llm', 'gpt', 'openai', 'chatgpt', 'claude', 'langchain',
      'tensorflow', 'pytorch', 'keras', 'scikit-learn',
      'nlp', 'computer-vision', 'data-science', 'datascience',
      'pandas', 'numpy', 'jupyter',
    ],
  },
  {
    id: 'infra-devops',
    name: 'インフラ / DevOps',
    description: 'クラウド、CI/CD、コンテナ',
    icon: Cloud,
    color: '#F59E0B', // amber
    tags: [
      'aws', 'gcp', 'azure', 'cloud', 'vercel', 'netlify',
      'docker', 'kubernetes', 'k8s', 'container',
      'terraform', 'ansible', 'pulumi',
      'ci', 'cd', 'cicd', 'github-actions', 'jenkins', 'circleci',
      'devops', 'sre', 'infrastructure', 'linux', 'nginx',
      'monitoring', 'observability', 'prometheus', 'grafana',
    ],
  },
  {
    id: 'mobile',
    name: 'モバイル',
    description: 'iOS, Android, クロスプラットフォーム',
    icon: Smartphone,
    color: '#EC4899', // pink
    tags: [
      'ios', 'android', 'mobile', 'swift', 'swiftui', 'kotlin',
      'react-native', 'reactnative', 'flutter', 'dart',
      'expo', 'capacitor', 'ionic', 'xamarin',
      'app', 'native', 'cross-platform',
    ],
  },
  {
    id: 'security',
    name: 'セキュリティ',
    description: '認証、暗号化、脆弱性対策',
    icon: Shield,
    color: '#EF4444', // red
    tags: [
      'security', 'cybersecurity', 'infosec',
      'authentication', 'auth', 'oauth', 'jwt', 'passkey',
      'encryption', 'cryptography', 'ssl', 'tls', 'https',
      'vulnerability', 'penetration-testing', 'ctf',
      'xss', 'csrf', 'injection', 'owasp',
    ],
  },
  {
    id: 'trending',
    name: 'トレンド',
    description: '話題の技術、新しいツール',
    icon: TrendingUp,
    color: '#06B6D4', // cyan
    tags: [
      'trending', 'new', 'release', 'announcement',
      'cursor', 'copilot', 'devin', 'v0',
      'web3', 'blockchain', 'crypto',
      'wasm', 'webassembly', 'edge', 'serverless',
      'bun', 'deno', 'htmx', 'astro', 'qwik',
    ],
  },
];

/**
 * カテゴリIDからカテゴリを取得
 */
export function getCategoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

/**
 * 選択されたカテゴリからタグセットを生成
 */
export function getTagsFromCategories(categoryIds: CategoryId[]): Set<string> {
  const tags = new Set<string>();
  categoryIds.forEach((id) => {
    const category = getCategoryById(id);
    category?.tags.forEach((tag) => tags.add(tag.toLowerCase()));
  });
  return tags;
}
