// Contact Form JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contactForm');
            const successMessage = document.getElementById('successMessage');
            
            // URLパラメータからサービスを選択
            const urlParams = new URLSearchParams(window.location.search);
            const menuParam = urlParams.get('menu');
            if (menuParam) {
                const serviceSelect = document.getElementById('service');
                serviceSelect.value = menuParam;
            }
            
            // フォーム送信処理
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // バリデーション
                let isValid = true;
                
                // 必須フィールドのチェック
                const requiredFields = [
                    { id: 'service', errorId: 'serviceError' },
                    { id: 'name', errorId: 'nameError' },
                    { id: 'email', errorId: 'emailError' }
                ];
                
                requiredFields.forEach(field => {
                    const input = document.getElementById(field.id);
                    const error = document.getElementById(field.errorId);
                    
                    if (!input.value.trim()) {
                        input.classList.add('error');
                        error.classList.add('show');
                        isValid = false;
                    } else {
                        input.classList.remove('error');
                        error.classList.remove('show');
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
                } else {
                    privacyError.classList.remove('show');
                }
                
                if (isValid) {
                    // ここで実際の送信処理を行う
                    // 今回はデモなので、成功メッセージを表示
                    successMessage.classList.add('show');
                    form.reset();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // 成功メッセージを5秒後に非表示
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                }
            });
            
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
            });
        });
