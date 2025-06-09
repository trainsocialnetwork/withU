// Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    let isSubmitting = false;
    
    // URLパラメータからサービスを選択
    const urlParams = new URLSearchParams(window.location.search);
    const menuParam = urlParams.get('menu');
    if (menuParam) {
        const serviceSelect = document.getElementById('service');
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
        
        if (serviceMapping[menuParam]) {
            serviceSelect.value = serviceMapping[menuParam];
        }
    }
    
    // フォーム送信処理
    form.addEventListener('submit', function(e) {
        // 既に送信中の場合は何もしない
        if (isSubmitting) {
            e.preventDefault();
            return false;
        }
        
        // バリデーション
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
        
        // 送信フラグを立てる
        isSubmitting = true;
        
        // 送信中の表示
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span><span>送信中...</span>';
        
        // エラーメッセージをクリア
        errorMessage.classList.remove('show');
        
        // 送信後の処理を予約（Google Formの処理時間を考慮）
        setTimeout(function() {
            // 成功と仮定して処理（Google FormはCORSのため、実際のレスポンスは取得できない）
            showSuccess();
        }, 2000);
        
        // フォームは通常通り送信される（Google Formへ）
        return true;
    });
    
    // バリデーション
    function validateForm() {
        let isValid = true;
        
        // エラー表示をリセット
        const allErrors = document.querySelectorAll('.field-error');
        allErrors.forEach(error => error.classList.remove('show'));
        
        const allInputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
        allInputs.forEach(input => input.classList.remove('error'));
        
        // 必須フィールドのチェック
        const requiredFields = [
            { id: 'service', errorId: 'serviceError', message: 'サービスを選択してください' },
            { id: 'name', errorId: 'nameError', message: 'お名前を入力してください' },
            { id: 'email', errorId: 'emailError', message: 'メールアドレスを入力してください' }
        ];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const error = document.getElementById(field.errorId);
            
            if (!input.value.trim()) {
                input.classList.add('error');
                error.textContent = field.message;
                error.classList.add('show');
                isValid = false;
            }
        });
        
        // メールアドレスの形式チェック
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.classList.add('error');
            emailError.textContent = '有効なメールアドレスを入力してください';
            emailError.classList.add('show');
            isValid = false;
        }
        
        // プライバシーポリシーのチェック
        const privacyCheckbox = document.getElementById('privacy');
        const privacyError = document.getElementById('privacyError');
        
        if (!privacyCheckbox.checked) {
            privacyError.classList.add('show');
            isValid = false;
        }
        
        // バリデーションエラーがある場合、最初のエラーにスクロール
        if (!isValid) {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
    
    // 成功表示
    function showSuccess() {
        // 送信フラグをリセット
        isSubmitting = false;
        
        // ボタンを元に戻す
        submitButton.disabled = false;
        submitButton.innerHTML = '<span>送信する</span><svg class="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        // 成功メッセージを表示
        successMessage.classList.add('show');
        errorMessage.classList.remove('show');
        
        // フォームをリセット
        form.reset();
        
        // エラー表示をリセット
        const allErrors = document.querySelectorAll('.field-error.show');
        allErrors.forEach(error => error.classList.remove('show'));
        
        const allInputs = form.querySelectorAll('.form-input.error, .form-select.error, .form-textarea.error');
        allInputs.forEach(input => input.classList.remove('error'));
        
        // ページトップへスクロール
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 10秒後に成功メッセージを非表示
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 10000);
    }
    
    // エラー表示（将来の拡張用）
    function showError() {
        // 送信フラグをリセット
        isSubmitting = false;
        
        submitButton.disabled = false;
        submitButton.innerHTML = '<span>送信する</span><svg class="button-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        errorMessage.classList.add('show');
        successMessage.classList.remove('show');
        
        // 5秒後にエラーメッセージを非表示
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
    
    // 入力時のエラー解除
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorId = this.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        });
        
        // セレクトボックスの場合はchangeイベントも監視
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                this.classList.remove('error');
                const errorId = this.id + 'Error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.classList.remove('show');
                }
            });
        }
    });
    
    // プライバシーポリシーチェックボックスのエラー解除
    const privacyCheckbox = document.getElementById('privacy');
    privacyCheckbox.addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('privacyError').classList.remove('show');
        }
    });
    
    // ページ離脱時の警告（フォーム入力中の場合）
    let formChanged = false;
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            formChanged = true;
        });
    });
    
    window.addEventListener('beforeunload', function(e) {
        if (formChanged && !isSubmitting) {
            const message = '入力中の内容が失われますが、よろしいですか？';
            e.returnValue = message;
            return message;
        }
    });
    
    // フォーム送信成功後はフラグをリセット
    form.addEventListener('submit', function() {
        formChanged = false;
    });
});
