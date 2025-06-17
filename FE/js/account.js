document.addEventListener('DOMContentLoaded', function() {
    const name = sessionStorage.getItem('userName') || 'Неизвестен';
    const email = sessionStorage.getItem('userEmail') || 'Няма имейл';
    const userId = sessionStorage.getItem('userId');


    document.getElementById('userInfo').innerHTML = `
        <div class="profile-icon">💀</div>
        <div class="user-info-title">Потребителска информация</div>
        <div class="user-info-fields">
            <div class="user-info-field">
                
                <span class="user-info-label">Име:</span>
                <span class="user-info-value">${name}</span>
            </div>
            <div class="user-info-field">
                
                <span class="user-info-label">Имейл:</span>
                <span class="user-info-value">${email}</span>
            </div>
        </div>
        <div class="action-buttons">
            <button id="sendSummaryBtn" class="action-btn summary-btn">
                <span class="btn-icon"></span>
                Изпрати обобщение
            </button>
            <button id="logoutBtn" class="action-btn logout-btn">
                <span class="btn-icon"></span>
                Изход
            </button>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = 'login.html';
    });

    async function sendEmailSummary(email, userId) {
    try {
            const response = await fetch(`https://localhost:7121/api/email/send?email=${email}&userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                return true;
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    document.getElementById('sendSummaryBtn').addEventListener('click', async function() {
        console.log(userId)
        const success = await sendEmailSummary(email, 2);
        if (success) {
            alert('Обобщението беше изпратено успешно!');
        } else {
            alert('Възникна грешка при изпращането на обобщението.');
        }
        });
    
});

