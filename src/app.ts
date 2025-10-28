import express from 'express';

import { apiRouter } from '@routes/index';

export const createApp = () => {
    const app = express();

        app.use(express.json());
        app.use('/api', apiRouter);

            app.get('/', (_req, res) => {
                const menuHtml = `<!doctype html>
        <html lang="ja">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>脳波分析メニュー</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 2rem; background: #f5f5f5; }
                    header { margin-bottom: 1.5rem; }
                    h1 { margin-bottom: 0.5rem; }
                    p { color: #555; }
                    ul { list-style: none; padding: 0; }
                    li { background: #fff; margin-bottom: 0.75rem; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                    a { color: #0066cc; text-decoration: none; font-weight: bold; }
                </style>
            </head>
            <body>
                <header>
                    <h1>脳波分析メニュー</h1>
                    <p>解析したい周波数帯を選択してください。初心者の方はアルファ波から始めるのがおすすめです。</p>
                </header>
                <main>
                    <ul>
                        <li>
                            <h2>アルファ波解析</h2>
                            <p>リラックス状態を示す 8〜13Hz の周波数帯を中心に確認します。初めてでも扱いやすい分析です。</p>
                                    <button id="alpha-start">アルファ波解析を開始</button>
                        </li>
                        <li>
                            <h2>その他のバンド（近日公開）</h2>
                            <p>ベータ波、デルタ波、ガンマ波などの分析機能は段階的に追加予定です。</p>
                        </li>
                    </ul>
                </main>
                    <script>
                        const alphaButton = document.getElementById('alpha-start');
                        if (alphaButton) {
                            alphaButton.addEventListener('click', async () => {
                                alphaButton.disabled = true;
                                alphaButton.textContent = '解析リクエスト送信中...';
                                try {
                                    const response = await fetch('/api/analysis/alpha', { method: 'POST' });
                                    const result = await response.json();
                                    alert(result.message ?? '解析リクエストを受け付けました。');
                                } catch (error) {
                                    console.error(error);
                                    alert('解析リクエストの送信に失敗しました。時間をおいて再度お試しください。');
                                } finally {
                                    alphaButton.disabled = false;
                                    alphaButton.textContent = 'アルファ波解析を開始';
                                }
                            });
                        }
                    </script>
                </body>
        </html>`;

                res.type('html').send(menuHtml);
            });

    return app;

};
