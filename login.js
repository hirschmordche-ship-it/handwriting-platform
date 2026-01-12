const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const registrationForm = document.getElementById('registrationForm');
const emailVerification = document.getElementById('emailVerification');

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    let strength = 0;

    if (/[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;
    if (/[!@#£%^&*()_+=[\]{};':"\\|,.<>?`~]/.test(value)) strength++;
    if (value.length >= 6) strength++;

    strengthBar.style.width = `${strength * 25}%`;
    strengthBar.style.background = strength === 4 ? 'green' : strength === 3 ? 'yellow' : 'red';
});

registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    emailVerification.classList.remove('hidden');
});

document.getElementById('verifyEmail').addEventListener('click', () => {
    // Verification logic here
});
