import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    plugins: ["import"],
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // 1. node 내장 모듈 (path, fs 등)
            "external", // 2. 외부 라이브러리 (react, axios 등)
            "internal", // 3. 프로젝트 내부 alias (@/...)
            ["parent", "sibling"], // 4. 부모/형제 경로 (../, ./)
            "index", // 5. 현재 디렉토리 index 파일
            "object",
            "type", // 6. typescript 타입 import
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always", // 그룹 간에 한 줄 띄우기
          alphabetize: {
            order: "asc", // 알파벳 오름차순 정렬
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]);
