// Contact Form JavaScript
       // Google Forms iframe loader
        document.addEventListener('DOMContentLoaded', function() {
            const formContainer = document.getElementById('formContainer');
            
            // ==========================================
            // ここにGoogle FormsのiFrame URLを設定
            // ==========================================
            const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdeQxD-A2x-R-jovCpOurK9J9Ocu9tFMoh0Bn37odupDrLeHQ/viewform?embedded=true';
            
            // URLパラメータを取得してサービスを自動選択
            const urlParams = new URLSearchParams(window.location.search);
            const serviceParam = urlParams.get('menu');
            
            // サービスパラメータとGoogle Formsのentry IDのマッピング
            // Google Formsのプリフィル機能を使用する場合
            const serviceMapping = {
                'idea-session-60': '事業アイデア壁打ちプラン（60分）',
                'idea-session-90': '事業アイデア壁打ちプラン（90分）',
                'site-check-free': 'Web診断プラン（無料）',
                'site-check-standard': 'Web診断プラン（スタンダード）',
                'site-check-roadmap': 'Web診断プラン（ロードマップ）',
                'marketing-consult': '集客スポット相談',
                'new-business-program': '新規事業立ち上げプログラム',
                'mvp-app-development': 'MVP開発支援',
                'web-design': 'HP/LP制作プラン',
                'marketing-starter': 'Web集客基盤構築',
                'pm-support': 'PMアドバイザリー'
            };
            
            // プリフィルURLを構築
            let formUrl = GOOGLE_FORM_URL;
            if (serviceParam && serviceMapping[serviceParam]) {
                // entry.XXXXXX の部分は実際のフォームのフィールドIDに置き換える
                // 例: entry.1234567890
                const ENTRY_ID = 'entry.YOUR_FIELD_ID'; // ← ここを実際のIDに変更
                const encodedService = encodeURIComponent(serviceMapping[serviceParam]);
                
                // URLにプリフィルパラメータを追加
                if (formUrl.includes('?')) {
                    formUrl += `&${ENTRY_ID}=${encodedService}`;
                } else {
                    formUrl += `?${ENTRY_ID}=${encodedService}`;
                }
            }
            
            // iframeを作成して埋め込み
            const iframe = document.createElement('iframe');
            iframe.src = formUrl;
            iframe.className = 'google-form-iframe';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('marginheight', '0');
            iframe.setAttribute('marginwidth', '0');
            iframe.setAttribute('loading', 'lazy');
            
            // iframeが読み込まれたらローディングを非表示
            iframe.onload = function() {
                formContainer.innerHTML = '';
                formContainer.appendChild(iframe);
            };
            
            // エラー処理
            iframe.onerror = function() {
                formContainer.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                            フォームの読み込みに失敗しました。
                        </p>
                        <a href="${GOOGLE_FORM_URL}" target="_blank" class="primary-button">
                            別ウィンドウでフォームを開く
                        </a>
                    </div>
                `;
            };
            
            // タイムアウト処理（10秒）
            setTimeout(function() {
                if (formContainer.querySelector('.form-loading')) {
                    formContainer.innerHTML = `
                        <div style="text-align: center; padding: 3rem;">
                            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                                フォームの読み込みに時間がかかっています。
                            </p>
                            <a href="${GOOGLE_FORM_URL}" target="_blank" class="primary-button">
                                別ウィンドウでフォームを開く
                            </a>
                        </div>
                    `;
                }
            }, 30000);
        });
