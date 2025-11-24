import { describe, it, expect } from "vitest";
import {
  filterArticles,
  extractUniqueSources,
  extractUniqueTags,
  type FilterOptions,
} from "../filterArticles";
import { Article } from "@/app/types/types";

// contextはdescribeのエイリアス
const context = describe;

/**
 * filterArticles関数のテスト
 */

// テストヘルパー: モック記事データ
const mockArticles: Article[] = [
  {
    id: "1",
    title: "React 19の新機能",
    description: "React 19について",
    url: "https://example.com/1",
    publishedAt: "2024-11-20T10:00:00Z",
    source: { id: "tech-blog", name: "Tech Blog" },
    tags: ["React", "JavaScript", "Frontend"],
    isFavorite: false,
  },
  {
    id: "2",
    title: "Next.js 15のパフォーマンス最適化",
    description: "Next.jsについて",
    url: "https://example.com/2",
    publishedAt: "2024-11-19T14:30:00Z",
    source: { id: "dev-community", name: "Dev Community" },
    tags: ["Next.js", "Performance", "React"],
    isFavorite: true,
  },
  {
    id: "3",
    title: "TypeScript 5.3の新機能",
    description: "TypeScriptについて",
    url: "https://example.com/3",
    publishedAt: "2024-11-18T09:15:00Z",
    source: { id: "typescript-weekly", name: "TypeScript Weekly" },
    tags: ["TypeScript", "JavaScript"],
    isFavorite: false,
  },
  {
    id: "4",
    title: "Reactパフォーマンスチューニング",
    description: "Reactのパフォーマンス最適化",
    url: "https://example.com/4",
    publishedAt: "2024-11-17T08:00:00Z",
    source: { id: "tech-blog", name: "Tech Blog" },
    tags: ["React", "Performance"],
    isFavorite: false,
  },
];

describe("filterArticles", () => {
  describe("フィルタなし", () => {
    context("すべてのフィルタが空の場合", () => {
      it("すべての記事が返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(4);
        expect(result).toEqual(mockArticles);
      });
    });
  });

  describe("ソースフィルタ", () => {
    context("1つのソースが選択されている場合", () => {
      it("選択されたソースの記事のみが返されること", () => {
        const options: FilterOptions = {
          selectedSources: ["tech-blog"],
          selectedTags: [],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(2);
        expect(result.every((a) => a.source.id === "tech-blog")).toBe(true);
        expect(result.map((a) => a.id)).toEqual(["1", "4"]);
      });
    });

    context("複数のソースが選択されている場合", () => {
      it("選択されたいずれかのソースの記事が返されること", () => {
        const options: FilterOptions = {
          selectedSources: ["tech-blog", "dev-community"],
          selectedTags: [],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(3);
        expect(result.map((a) => a.id)).toEqual(["1", "2", "4"]);
      });
    });

    context("存在しないソースが選択されている場合", () => {
      it("空の配列が返されること", () => {
        const options: FilterOptions = {
          selectedSources: ["non-existent"],
          selectedTags: [],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(0);
      });
    });
  });

  describe("タグフィルタ", () => {
    context("1つのタグが選択されている場合", () => {
      it("選択されたタグを含む記事のみが返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: ["React"],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(3);
        expect(result.every((a) => a.tags.includes("React"))).toBe(true);
        expect(result.map((a) => a.id)).toEqual(["1", "2", "4"]);
      });
    });

    context("複数のタグが選択されている場合", () => {
      it("選択されたすべてのタグを含む記事のみが返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: ["React", "Performance"],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(2);
        expect(
          result.every(
            (a) => a.tags.includes("React") && a.tags.includes("Performance")
          )
        ).toBe(true);
        expect(result.map((a) => a.id)).toEqual(["2", "4"]);
      });
    });

    context("存在しないタグが選択されている場合", () => {
      it("空の配列が返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: ["NonExistentTag"],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(0);
      });
    });
  });

  describe("キーワード検索", () => {
    context("タイトルにキーワードが含まれる場合", () => {
      it("該当する記事が返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "パフォーマンス",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(2);
        expect(result.map((a) => a.id)).toEqual(["2", "4"]);
      });
    });

    context("タグにキーワードが含まれる場合", () => {
      it("該当する記事が返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "JavaScript",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(2);
        expect(result.map((a) => a.id)).toEqual(["1", "3"]);
      });
    });

    context("大文字小文字が異なるキーワードの場合", () => {
      it("大文字小文字を区別せずに検索されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "REACT",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(3);
        expect(result.map((a) => a.id)).toEqual(["1", "2", "4"]);
      });
    });

    context("空白のみのキーワードの場合", () => {
      it("すべての記事が返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "   ",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(4);
      });
    });

    context("該当しないキーワードの場合", () => {
      it("空の配列が返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: [],
          searchKeyword: "Vue",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(0);
      });
    });
  });

  describe("複合フィルタ", () => {
    context("ソース + タグの場合", () => {
      it("両方の条件を満たす記事のみが返されること", () => {
        const options: FilterOptions = {
          selectedSources: ["tech-blog"],
          selectedTags: ["React"],
          searchKeyword: "",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(2);
        expect(result.map((a) => a.id)).toEqual(["1", "4"]);
      });
    });

    context("ソース + キーワードの場合", () => {
      it("両方の条件を満たす記事のみが返されること", () => {
        const options: FilterOptions = {
          selectedSources: ["tech-blog"],
          selectedTags: [],
          searchKeyword: "React",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(2);
        expect(result.map((a) => a.id)).toEqual(["1", "4"]);
      });
    });

    context("タグ + キーワードの場合", () => {
      it("両方の条件を満たす記事のみが返されること", () => {
        const options: FilterOptions = {
          selectedSources: [],
          selectedTags: ["React"],
          searchKeyword: "パフォーマンス",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(2);
        expect(result.map((a) => a.id)).toEqual(["2", "4"]);
      });
    });

    context("ソース + タグ + キーワードの場合", () => {
      it("すべての条件を満たす記事のみが返されること", () => {
        const options: FilterOptions = {
          selectedSources: ["tech-blog"],
          selectedTags: ["React"],
          searchKeyword: "19",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("1");
      });
    });

    context("厳しい条件で該当記事がない場合", () => {
      it("空の配列が返されること", () => {
        const options: FilterOptions = {
          selectedSources: ["typescript-weekly"],
          selectedTags: ["React"],
          searchKeyword: "Next.js",
        };

        const result = filterArticles(mockArticles, options);

        expect(result).toHaveLength(0);
      });
    });
  });
});

describe("extractUniqueSources", () => {
  context("複数のソースが存在する場合", () => {
    it("一意なソースがID順にソートされて返されること", () => {
      const result = extractUniqueSources(mockArticles);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: "dev-community", name: "Dev Community" },
        { id: "tech-blog", name: "Tech Blog" },
        { id: "typescript-weekly", name: "TypeScript Weekly" },
      ]);
    });
  });

  context("重複するソースが存在する場合", () => {
    it("重複が除外されて返されること", () => {
      const result = extractUniqueSources(mockArticles);

      // mockArticlesには "tech-blog" が2つあるが、結果は1つのみ
      const techBlogCount = result.filter((s) => s.id === "tech-blog").length;
      expect(techBlogCount).toBe(1);
    });
  });

  context("空の配列の場合", () => {
    it("空の配列が返されること", () => {
      const result = extractUniqueSources([]);

      expect(result).toHaveLength(0);
    });
  });
});

describe("extractUniqueTags", () => {
  context("複数のタグが存在する場合", () => {
    it("一意なタグがアルファベット順にソートされて返されること", () => {
      const result = extractUniqueTags(mockArticles);

      expect(result).toEqual([
        "Frontend",
        "JavaScript",
        "Next.js",
        "Performance",
        "React",
        "TypeScript",
      ]);
    });
  });

  context("重複するタグが存在する場合", () => {
    it("重複が除外されて返されること", () => {
      const result = extractUniqueTags(mockArticles);

      // "React" や "JavaScript" は複数の記事に登場するが、結果は1つずつ
      const reactCount = result.filter((t) => t === "React").length;
      const jsCount = result.filter((t) => t === "JavaScript").length;

      expect(reactCount).toBe(1);
      expect(jsCount).toBe(1);
    });
  });

  context("空の配列の場合", () => {
    it("空の配列が返されること", () => {
      const result = extractUniqueTags([]);

      expect(result).toHaveLength(0);
    });
  });
});
