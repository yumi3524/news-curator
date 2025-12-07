import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  "stories": [
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../app/**/*.mdx"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  async viteFinal(config) {
    // パスエイリアスの設定
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../"),
      };
    }

    // CSS処理の設定（Tailwind CSS v4対応）
    config.css = {
      ...config.css,
      postcss: path.resolve(__dirname, "../postcss.config.mjs"),
    };

    return config;
  },
};
export default config;