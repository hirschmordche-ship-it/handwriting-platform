// Initialize Supabase client
const SUPABASE_URL = 'https://fohzmnvqgtbwglapojuo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Password validation
const regPassword = document.getElementById('regPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthBarFill = document.getElementById('strengthBarFill');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const passwordError = document.getElementById('passwordError');

regPassword.addEventListener('input', function() {
    const password = this.value;
    strengthBar.style.display = 'block';
    
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[+×÷=\/_<>\[\]!@#£%^&*()\-'":;,?`~\\|{}€$¥₪¤《》¡¿]/.test(password);
    const hasLength = password.length >= 4;
    
    let strength = 0;
    if (hasLength) strength += 25;
    if (hasCapital) strength += 25;
    if (hasNumber) strength += 25;
    if (hasSpecial) strength += 25;
    
    strengthBarFill.style.width = strength + '%';
    
    if (strength <= 25) {
        strengthBarFill.className = 'strength-bar-fill weak';
    } else if (strength <= 50) {
        strengthBarFill.className = 'strength-bar-fill medium';
    } else if (strength <= 75) {
        strengthBarFill.className = 'strength-bar-fill good';
    } else {
        strengthBarFill.className = 'strength-bar-fill strong';
    }
    
    if (strength === 100) {
        confirmPasswordGroup.classList.remove('hidden');
        passwordError.style.display = 'none';
    } else {
        confirmPasswordGroup.classList.add('hidden');
        if (password.length > 0) {
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }
    }
});

// Confirm password validation
const confirmPassword = document.getElementById('confirmPassword');
const confirmError = document.getElementById('confirmError');

confirmPassword.addEventListener('input', function() {
    if (this.value !== regPassword.value) {
        confirmError.style.display = 'block';
    } else {
        confirmError.style.display = 'none';
    }
});

// Registration form submission
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = regPassword.value;
    const confirm = confirmPassword.value;
    const registerBtn = document.getElementById('registerBtn');
    const registerError = document.getElementById('registerError');
    
    if (password !== confirm) {
        confirmError.style.display = 'block';
        return;
    }
    
    // Disable button during registration
    registerBtn.disabled = true;
    registerBtn.textContent = 'Registering...';
    registe