import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              function setVh(){document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');}
              setVh();
              // LINE等アプリ内ブラウザ（WebView）では、ページ読み込み直後は
              // 独自ツールバーの高さがまだ確定しておらず、window.innerHeightが
              // 実際の表示領域より大きい値を返すことがある。以降はwidthが
              // 変わらない限りvhを再計算しない設計（Safariのアドレスバー
              // 開閉でスクロール中に見出し位置が飛ぶのを防ぐため）なので、
              // 読み込み直後の数百msだけ複数回再計測して確定値に補正する。
              setTimeout(setVh, 100)
              setTimeout(setVh, 500)
              var w = window.innerWidth;
              window.addEventListener('resize', function(){
                if (window.innerWidth !== w) { w = window.innerWidth; setVh(); }
              });
              window.addEventListener('orientationchange', function(){ w = window.innerWidth; setVh(); });
            })();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
