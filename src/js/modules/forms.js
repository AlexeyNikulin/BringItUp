export default class Form {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.mesage = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
        this.path = 'assets/question.php';
    }

    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');
    
        mailInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/./gi, function(a) {
                    return /[a-z @ \. 0-9]/.test(a) ? a : '';
                });
            });
        });
    }

    initMask() {
        function createMask(event) {
            let matrix = '+1 (___) ___-____',
                i = 0,
                def = matrix.replace(/\D/g, ''),
                val = this.value.replace(/\D/g, '');
    
            if (def.length >= val.length || +val[0] !== 1) {
                val = def;
            }
    
            this.value = matrix.replace(/./g ,function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });
    
            if (event.type === 'blur') {
                if (this.value.length === 2) {
                    this.value = '';
                }
            }
        }
    
        const inputs = document.querySelectorAll('[name="phone"]');
    
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('blur', createMask);
            input.addEventListener('focus', createMask);
        });
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }
    
        return await res.text();
    }

    init() {
        this.checkMailInputs();
        this.initMask();
        this.forms.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                const statusMessage = document.createElement('div');
                statusMessage.style.cssText = `
                    margin-top: 15px;
                    font-size: 18px;
                    color: grey;
                `;
                statusMessage.textContent = this.mesage.loading;
                item.parentNode.append(statusMessage);

                const formData = new FormData(item);

                this.postData(this.path, formData)
                    .then(res => {
                        console.log(res);
                        statusMessage.textContent = this.mesage.success;
                    })
                    .catch(e => {
                        statusMessage.textContent = this.mesage.failure;
                    })
                    .finally(() => {
                        item.reset();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 2000);
                    });
            });
        });
    }
}