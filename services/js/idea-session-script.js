        // FAQ アコーディオン機能
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const isActive = item.classList.contains('active');
                
                // 他のアイテムを閉じる
                document.querySelectorAll('.faq-item').forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // クリックしたアイテムをトグル
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });