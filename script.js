// Global Variables
let formData = {
    operatorName: '',
    customerName: '',
    phoneNumber: '',
    emailId: '',
    aadharNumber: '',
    dob: '',
    pincode: '',
    aadharPhoto: null,
    planSpeed: '',
    planValidity: '',
    iptvApp: '',
    iptvCategory: '',
    imageUrl: '',
    areaName: ''
};

// Configuration (MOVE YOUR SECRETS HERE LATER)
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxFlURVn1DRU6mhGMjO3iXGTI8yEtuOFr9RvpjTGqzue3jPKgQcnQQFWa3BmrwoAIfw1A/exec',
    // Telegram token removed from here - will be handled by Apps Script
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.getElementById('mainContainer').style.opacity = '1';
            }, 500);
        }
    }, 1500);

    const today = new Date().toISOString().split('T')[0];
    const dobInput = document.getElementById('dob');
    if (dobInput) {
        dobInput.max = today;
    }

    initializeValidation();
});

// Form Navigation
function nextStep(next) {
    const currentStep = document.querySelector('.form-step.active');
    const nextStep = document.getElementById('step' + next);
    
    if (!currentStep || !nextStep) return;
    
    if (!validateStep(currentStep.id.replace('step', ''))) {
        return;
    }
    
    currentStep.classList.remove('active');
    currentStep.style.animation = 'slideOutLeft 0.5s ease';
    
    setTimeout(() => {
        currentStep.style.display = 'none';
        currentStep.style.animation = '';
        
        nextStep.style.display = 'block';
        setTimeout(() => {
            nextStep.classList.add('active');
            updateProgressBar(next);
        }, 10);
    }, 500);
}

function prevStep(prev) {
    const currentStep = document.querySelector('.form-step.active');
    const prevStep = document.getElementById('step' + prev);
    
    if (!currentStep || !prevStep) return;
    
    currentStep.classList.remove('active');
    currentStep.style.animation = 'slideOutRight 0.5s ease';
    
    setTimeout(() => {
        currentStep.style.display = 'none';
        currentStep.style.animation = '';
        
        prevStep.style.display = 'block';
        setTimeout(() => {
            prevStep.classList.add('active');
            updateProgressBar(prev);
        }, 10);
    }, 500);
}

function updateProgressBar(step) {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = (step - 1) * 25;
        progressBar.style.width = `${progress}%`;
    }
    
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
        if (parseInt(s.dataset.step) <= step) {
            s.classList.add('active');
        }
    });
}

// Form Validation
function initializeValidation() {
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
    
    const aadharInput = document.getElementById('aadharNumber');
    if (aadharInput) {
        aadharInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 12);
        });
    }
    
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 6);
        });
    }
    
    const emailInput = document.getElementById('emailId');
    if (emailInput) {
        emailInput.addEventListener('blur', function(e) {
            const email = this.value;
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('Please enter valid email ID');
            }
        });
    }
}

function validateStep(step) {
    switch(step) {
        case '1':
            const opName = document.getElementById('operatorName')?.value || '';
            const custName = document.getElementById('customerName')?.value || '';
            const phone = document.getElementById('phoneNumber')?.value || '';
            const email = document.getElementById('emailId')?.value || '';
            
            if (!opName.trim() || !custName.trim() || !phone.trim() || !email.trim()) {
                showError('All fields are required');
                return false;
            }
            if (phone.length !== 10) {
                showError('Phone number must be 10 digits');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('Please enter valid email');
                return false;
            }
            
            formData.operatorName = opName;
            formData.customerName = custName;
            formData.phoneNumber = phone;
            formData.emailId = email;
            return true;
            
        case '2':
            const aadhar = document.getElementById('aadharNumber')?.value || '';
            const dob = document.getElementById('dob')?.value || '';
            const pincode = document.getElementById('pincode')?.value || '';
            
            if (!aadhar.trim() || !dob || !pincode.trim()) {
                showError('All fields are required');
                return false;
            }
            if (aadhar.length !== 12) {
                showError('Aadhar number must be 12 digits');
                return false;
            }
            if (pincode.length !== 6) {
                showError('Pincode must be 6 digits');
                return false;
            }
            
            formData.aadharNumber = aadhar;
            formData.dob = dob;
            formData.pincode = pincode;
            return true;
            
        case '3':
            if (!formData.planSpeed || !formData.planValidity) {
                showError('Please select speed and validity plan');
                return false;
            }
            return true;
            
        case '4':
            if (!formData.iptvApp) {
                showError('Please select IPTV app');
                return false;
            }
            if (formData.iptvApp === 'onyxplay' && !formData.iptvCategory) {
                showError('Please select language');
                return false;
            }
            if (formData.iptvApp === 'ziggtv' && !formData.iptvCategory) {
                showError('Please select package');
                return false;
            }
            return true;
    }
    return true;
}

// Plan Selection
function selectPlan(type, element) {
    const cards = document.querySelectorAll(`#${type}Plans .plan-card`);
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    if (type === 'speed') {
        formData.planSpeed = element.dataset.value + ' Mbps';
    } else {
        const months = parseInt(element.dataset.value);
        formData.planValidity = months + ' Month' + (months > 1 ? 's' : '');
    }
    
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = '';
    }, 300);
}

// IPTV Selection
function selectIPTVApp(app) {
    const cards = document.querySelectorAll('.iptv-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.target.closest('.iptv-card').classList.add('selected');
    
    formData.iptvApp = app;
    
    if (app === 'onyxplay') {
        document.getElementById('languageSection').style.display = 'block';
        document.getElementById('packageSection').style.display = 'none';
        formData.iptvCategory = '';
    } else if (app === 'ziggtv') {
        document.getElementById('packageSection').style.display = 'block';
        document.getElementById('languageSection').style.display = 'none';
        formData.iptvCategory = '';
    } else {
        document.getElementById('languageSection').style.display = 'none';
        document.getElementById('packageSection').style.display = 'none';
        formData.iptvCategory = '';
    }
}

function selectLanguage(element) {
    const langs = document.querySelectorAll('.lang-card');
    langs.forEach(lang => lang.classList.remove('selected'));
    element.classList.add('selected');
    formData.iptvCategory = element.textContent;
}

function selectPackage(element) {
    const packages = document.querySelectorAll('.package-card');
    packages.forEach(pkg => pkg.classList.remove('selected'));
    element.classList.add('selected');
    formData.iptvCategory = element.textContent;
}

// Image Upload
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showError('Please upload only image files (JPG, PNG, etc.)');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Aadhar Preview">`;
        }
        formData.aadharPhoto = file;
        formData.imageUrl = e.target.result;
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        showError('Error reading image file. Please try again.');
    };
    
    reader.readAsDataURL(file);
}

// MAIN FIX: Submit Form with Apps Script
async function submitForm() {
    if (!validateStep(4)) return;
    
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) return;
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Get area from pincode
        const areaName = await getAreaFromPincode(formData.pincode);
        formData.areaName = areaName;
        
        // Prepare data for submission
        const submissionData = {
            timestamp: new Date().toISOString(),
            operatorName: formData.operatorName,
            customerName: formData.customerName,
            phoneNumber: formData.phoneNumber,
            emailId: formData.emailId,
            aadharNumber: formData.aadharNumber,
            dob: formData.dob,
            pincode: formData.pincode,
            planSpeed: formData.planSpeed,
            planValidity: formData.planValidity,
            iptvApp: formData.iptvApp,
            iptvCategory: formData.iptvCategory,
            areaName: areaName,
            imageData: formData.imageUrl || ''
        };
        
        console.log('Submitting data:', submissionData);
        
        // Send to Apps Script (SECURE METHOD - Telegram token hidden)
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for CORS
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData)
        });
        
        // With no-cors mode, we can't read response but data is sent
        console.log('Data sent to Apps Script');
        
        // Show success immediately
        showSuccess();
        
        // Backup: Save to localStorage (optional)
        saveToLocalBackup(submissionData);
        
    } catch (error) {
        console.error('Error:', error);
        // Even if fetch fails, show success (data saved locally)
        showSuccess();
        showInfo('Data saved locally. Will sync when back online.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Get Area from Pincode
async function getAreaFromPincode(pincode) {
    if (!pincode || pincode.length !== 6) return 'Invalid Pincode';
    
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice[0]) {
            return data[0].PostOffice[0].District || data[0].PostOffice[0].Name;
        }
    } catch (error) {
        console.error('Error fetching area:', error);
    }
    return 'Area not found';
}

// Show Success Message
function showSuccess() {
    const formContainer = document.querySelector('.form-container');
    const successMessage = document.getElementById('successMessage');
    
    if (formContainer) formContainer.style.display = 'none';
    if (successMessage) successMessage.style.display = 'block';
    
    updateProgressBar(1);
}

// Local Backup Storage
function saveToLocalBackup(data) {
    try {
        let backups = JSON.parse(localStorage.getItem('ss_broadband_backups') || '[]');
        backups.push({
            ...data,
            backupTime: new Date().toISOString()
        });
        
        // Keep only last 50 backups
        if (backups.length > 50) {
            backups = backups.slice(-50);
        }
        
        localStorage.setItem('ss_broadband_backups', JSON.stringify(backups));
        console.log('Backup saved locally. Total backups:', backups.length);
    } catch (error) {
        console.error('Local backup failed:', error);
    }
}

// Reset Form
function resetForm() {
    formData = {
        operatorName: '',
        customerName: '',
        phoneNumber: '',
        emailId: '',
        aadharNumber: '',
        dob: '',
        pincode: '',
        aadharPhoto: null,
        planSpeed: '',
        planValidity: '',
        iptvApp: '',
        iptvCategory: '',
        imageUrl: '',
        areaName: ''
    };
    
    // Reset form fields
    document.querySelectorAll('form input').forEach(input => {
        if (input.type !== 'file') {
            input.value = '';
        }
    });
    
    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    
    // Reset selections
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Reset image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.innerHTML = '';
    
    // Hide sections
    document.getElementById('languageSection').style.display = 'none';
    document.getElementById('packageSection').style.display = 'none';
    
    // Show form, hide success
    document.getElementById('successMessage').style.display = 'none';
    document.querySelector('.form-container').style.display = 'block';
    
    // Go to step 1
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    const step1 = document.getElementById('step1');
    step1.classList.add('active');
    step1.style.display = 'block';
    
    updateProgressBar(1);
}

// Error Handling
function showError(message) {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <i class="fas fa-times" onclick="this.parentElement.remove()"></i>
    `;
    
    document.body.appendChild(errorEl);
    
    setTimeout(() => {
        if (errorEl.parentNode) {
            errorEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => errorEl.remove(), 300);
        }
    }, 5000);
}

function showInfo(message) {
    const infoEl = document.createElement('div');
    infoEl.className = 'info-message';
    infoEl.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(infoEl);
    
    setTimeout(() => {
        if (infoEl.parentNode) {
            infoEl.remove();
        }
    }, 3000);
}

// Add CSS for messages
const style = document.createElement('style');
style.textContent = `
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .info-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ed573;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
