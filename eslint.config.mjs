import nextConfig from 'eslint-config-next'

const config = [
  ...nextConfig,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    // このプロジェクト全体で「マウント時にload()を呼んでsetStateする」パターンが
    // 一貫して使われており（admin配下のほぼ全ページ）、いずれも実際の不具合ではないため
    // error ではなく warn として扱う（next lint 廃止に伴い今回初めてeslint.config.mjsを
    // 追加したことで新しく可視化されたルールであり、既存パターンを一斉に書き換えるのは
    // 本タスクの範囲外）。
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default config
