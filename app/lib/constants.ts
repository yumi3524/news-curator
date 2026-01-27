/**
 * アプリケーション全体で使用される定数定義
 */

// API関連
export const QIITA_API_BASE_URL = "https://qiita.com/api/v2";
export const HN_API_BASE_URL = "https://hacker-news.firebaseio.com/v0";
export const GITHUB_API_BASE_URL = "https://api.github.com";
export const CACHE_REVALIDATE_SECONDS = 300; // 5分

// 記事取得設定
export const DEFAULT_FETCH_LIMIT = 50;
export const DEFAULT_DAYS_AGO = 7;
export const MIN_STOCKS_COUNT = 5;

// UI表示関連
export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_TAGS_TO_DISPLAY = 3;
export const MAX_TAGS_TO_DISPLAY_MOBILE = 5;
export const DEFAULT_DESCRIPTION = '詳細はリンク先をご覧ください';

// 翻訳関連
export const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
export const TRANSLATION_TARGET_LANG = 'ja';
export const TRANSLATION_SOURCE_LANG = 'en';
export const TRANSLATION_BATCH_SIZE = 10; // バッチ翻訳の最大件数
export const TRANSLATION_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60; // 30日間
