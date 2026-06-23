document.addEventListener('DOMContentLoaded', () => {
    // Forms & Inputs
    const otpForm = document.getElementById('otp-form');
    const otpBoxes = document.querySelectorAll('.otp-box');
    const verifyBtn = document.getElementById('verify-btn');
    
    // Buttons
    const resendBtn = document.getElementById('resend-btn');

    let timerInterval;

    // Start timer on load
    startTimer(30);
    setTimeout(() => otpBoxes[0].focus(), 100);

    // OTP Input Logic
    otpBoxes.forEach((box, index) => {
        // Handle input
        box.addEventListener('input', (e) => {
            // Allow only numbers
            box.value = box.value.replace(/[^0-9]/g, '');

            // Move to next box if filled
            if (box.value !== '') {
                if (index < otpBoxes.length - 1) {
                    otpBoxes[index + 1].focus();
                }
            }

            checkOtpFilled();
        });

        // Handle Backspace
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && box.value === '') {
                if (index > 0) {
                    otpBoxes[index - 1].focus();
                }
            }
        });
        
        // Handle Paste (e.g. copying 6 digits)
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
            if(pasteData) {
                for(let i=0; i < pasteData.length; i++) {
                    if(i < otpBoxes.length) {
                        otpBoxes[i].value = pasteData[i];
                    }
                }
                const focusIndex = Math.min(pasteData.length, otpBoxes.length - 1);
                otpBoxes[focusIndex].focus();
                checkOtpFilled();
            }
        });
    });

    const checkOtpFilled = () => {
        const isFilled = Array.from(otpBoxes).every(box => box.value !== '');
        verifyBtn.disabled = !isFilled;
    };

    // OTP Form Submit
    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const otp = Array.from(otpBoxes).map(box => box.value).join('');
        
        // Mock verification (e.g., loading state)
        verifyBtn.textContent = 'Verifying...';
        verifyBtn.disabled = true;

        setTimeout(() => {
            // For demo purposes, any 6-digit code works
            if (otp.length === 6) {
                clearInterval(timerInterval);
                alert('Verification Successful! (You can connect your backend here)');
                verifyBtn.textContent = 'Verified ✓';
            } else {
                alert('Invalid OTP. Please try again.');
                verifyBtn.textContent = 'Verify Code';
                verifyBtn.disabled = false;
            }
        }, 1000);
    });

    // Resend Timer Logic
    function startTimer(seconds) {
        let timeLeft = seconds;
        resendBtn.disabled = true;
        resendBtn.innerHTML = `Resend in <span id="timer">${timeLeft}</span>s`;

        timerInterval = setInterval(() => {
            timeLeft--;
            const timerEl = document.getElementById('timer');
            if(timerEl) timerEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                resendBtn.disabled = false;
                resendBtn.innerHTML = 'Resend Code';
            }
        }, 1000);
    }

    // Resend Button Click
    resendBtn.addEventListener('click', () => {
        // Clear inputs
        otpBoxes.forEach(box => box.value = '');
        verifyBtn.disabled = true;
        otpBoxes[0].focus();
        
        // Restart timer
        startTimer(30);
    });
});
