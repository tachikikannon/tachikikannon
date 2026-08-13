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
