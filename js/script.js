// Enhanced Water Calculator JavaScript

let currentStep = 1;
let userData = {};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    const form = document.getElementById('waterCalculatorForm');
    
    if (form) {
        // Add form submit event listener
        form.addEventListener('submit', handleFormSubmit);
        
        // Add input validation listeners
        addInputValidation();
        
        // Add smooth scrolling for better UX
        addSmoothScrolling();
        
        // Initialize weight slider
        initializeWeightSlider();
        
        // Initialize theme toggle
        initializeThemeToggle();
        
        // Initialize navigation
        initializeNavigation();
    }
    
    // Add calculate button listener (for step-based calculator)
    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const formData = getFormData();
            
            if (validateForm(formData)) {
                const result = calculateWaterIntake(formData);
                displayResult(result);
                scrollToResults();
            }
        });
    }
    
    // Trigger animations when elements come into view
    observeElements();
    
    // Initialize hydration meter
    updateHydrationMeter(0);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = getFormData();
    
    if (validateForm(formData)) {
        const result = calculateWaterIntake(formData);
        displayResult(result);
        scrollToResults();
    }
}

// Get form data
function getFormData() {
    const weightInput = document.getElementById('weight');
    const activityInput = document.querySelector('input[name="activity"]:checked');
    
    return {
        weight: weightInput ? parseFloat(weightInput.value) : null,
        activity: activityInput ? activityInput.value : null
    };
}

// Validate form data
function validateForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Validate weight
    if (!data.weight || data.weight < 1 || data.weight > 300) {
        showError('weightError', 'يرجى إدخال وزن صحيح بين 1 و 300 كيلو جرام');
        isValid = false;
    }
    
    // Validate activity level
    if (!data.activity) {
        showError('activityError', 'يرجى اختيار مستوى النشاط');
        isValid = false;
    }
    
    return isValid;
}

// Calculate water intake based on weight and activity level
function calculateWaterIntake(data) {
    const { weight, activity } = data;
    
    // Calculation formulas
    const multipliers = {
        low: 30,      // 30ml × weight
        medium: 35,   // 35ml × weight  
        high: 40      // 40ml × weight
    };
    
    const dailyIntakeML = weight * multipliers[activity];
    const dailyIntakeL = (dailyIntakeML / 1000).toFixed(1);
    
    // Activity level in Arabic
    const activityLabels = {
        low: 'النشاط المنخفض',
        medium: 'النشاط المتوسط',
        high: 'النشاط العالي'
    };
    
    return {
        amount: dailyIntakeL,
        amountML: dailyIntakeML,
        activity: activityLabels[activity],
        weight: weight,
        activityLevel: activity
    };
}

// Display calculation result
function displayResult(result) {
    const waterAmountEl = document.getElementById('waterAmount');
    const waterBreakdownEl = document.getElementById('waterBreakdown');
    const encouragementTextEl = document.getElementById('encouragementText');
    const dailyScheduleEl = document.getElementById('dailySchedule');
    const waterLevelVizEl = document.getElementById('waterLevelViz');
    const resultsSection = document.getElementById('resultsSection');
    
    // Check if required elements exist
    if (!waterAmountEl || !resultsSection) {
        console.error('Required result elements not found');
        return;
    }
    
    // Generate encouraging message based on activity level
    const encouragementMessages = {
        low: 'ممتاز! هذه الكمية ستساعدك في الحفاظ على ترطيب جسمك وصحتك العامة.',
        medium: 'رائع! مع نشاطك المتوسط، هذه الكمية ضرورية لتعويض السوائل المفقودة.',
        high: 'عظيم! مع نشاطك العالي، شرب هذه الكمية سيحافظ على أدائك وطاقتك.'
    };
    
    // Update result display
    if (waterAmountEl) {
        waterAmountEl.innerHTML = `
            <span class="amount">${result.amount}</span>
            <span class="unit">لتر</span>
        `;
    }
    
    // Add water breakdown
    if (waterBreakdownEl) {
        waterBreakdownEl.innerHTML = `
            <h5>تفصيل الحساب:</h5>
            <p><strong>الوزن:</strong> ${result.weight} كجم</p>
            <p><strong>مستوى النشاط:</strong> ${result.activity}</p>
            <p><strong>المعادلة:</strong> ${result.weight} × ${getMultiplier(result.activityLevel)} مل = ${result.amountML} مل</p>
        `;
    }
    
    if (encouragementTextEl) {
        encouragementTextEl.textContent = `تحتاج إلى ${result.amount} لتر من الماء يوميًا للحفاظ على صحتك. ${encouragementMessages[result.activityLevel]}`;
    }
    
    // Generate daily schedule
    if (dailyScheduleEl) {
        generateDailySchedule(result.amount, dailyScheduleEl);
    }
    
    // Animate water level visualization
    if (waterLevelVizEl) {
        setTimeout(() => {
            const percentage = Math.min((parseFloat(result.amount) / 4) * 100, 100);
            waterLevelVizEl.style.height = `${percentage}%`;
        }, 500);
    }
    
    // Update progress indicator
    updateProgressStep(3);
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Trigger result card animation
    const resultCard = resultsSection.querySelector('.result-card');
    resultCard.style.opacity = '0';
    resultCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultCard.style.transition = 'all 0.8s ease-out';
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Update hydration meter
    updateHydrationMeter(parseFloat(result.amount));
}

// Generate daily water schedule
function generateDailySchedule(totalLiters, container) {
    const glasses = Math.ceil(totalLiters * 4); // 250ml per glass
    const times = [
        '7:00 - الاستيقاظ',
        '9:00 - الإفطار', 
        '11:00 - منتصف الصباح',
        '13:00 - الغداء',
        '15:00 - بعد الظهر',
        '17:00 - المساء',
        '19:00 - العشاء',
        '21:00 - قبل النوم'
    ];
    
    const glassesPerTime = glasses / times.length;
    let scheduleHTML = '<div class="schedule-timeline">';
    
    times.forEach((time, index) => {
        const amount = index < times.length - 1 ? 
            Math.round(glassesPerTime * 250) : 
            Math.round((totalLiters * 1000) - (Math.round(glassesPerTime * 250) * (times.length - 1)));
        
        scheduleHTML += `
            <div class="schedule-item">
                <span class="schedule-time">${time}</span>
                <span class="schedule-amount">${amount} مل</span>
            </div>
        `;
    });
    
    scheduleHTML += '</div>';
    container.querySelector('.schedule-timeline').innerHTML = scheduleHTML;
}

// Get multiplier for activity level
function getMultiplier(activityLevel) {
    const multipliers = {
        low: 30,
        medium: 35,
        high: 40
    };
    return multipliers[activityLevel];
}

// Reset calculator
function resetCalculator() {
    const form = document.getElementById('waterCalculatorForm');
    const resultsSection = document.getElementById('resultsSection');
    
    // Reset form
    form.reset();
    
    // Hide results
    resultsSection.style.display = 'none';
    
    // Clear errors
    clearErrors();
    
    // Scroll back to calculator
    const calculatorSection = document.querySelector('.calculator-section');
    calculatorSection.scrollIntoView({ behavior: 'smooth' });
    
    // Focus on weight input
    setTimeout(() => {
        document.getElementById('weight').focus();
    }, 800);
}

// Scroll to results section
function scrollToResults() {
    setTimeout(() => {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Add error styling to input
    const inputElement = errorElement.previousElementSibling;
    inputElement.style.borderColor = '#e74c3c';
}

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
    
    // Remove error styling from inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.style.borderColor = '#e0e0e0';
    });
}

// Add input validation listeners
function addInputValidation() {
    const weightInput = document.getElementById('weight');
    const activitySelect = document.getElementById('activity');
    
    // Real-time weight validation
    weightInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        const errorElement = document.getElementById('weightError');
        
        if (this.value && (value < 1 || value > 300)) {
            showError('weightError', 'الوزن يجب أن يكون بين 1 و 300 كيلو جرام');
        } else if (errorElement.classList.contains('show')) {
            clearErrors();
        }
    });
    
    // Clear activity error on selection
    activitySelect.addEventListener('change', function() {
        const errorElement = document.getElementById('activityError');
        if (this.value && errorElement.classList.contains('show')) {
            clearErrors();
        }
    });
}

// Add smooth scrolling for better UX
function addSmoothScrolling() {
    // Add button loading state
    const calculateBtn = document.querySelector('.calculate-btn');
    const originalText = calculateBtn.innerHTML;
    
    calculateBtn.addEventListener('click', function() {
        this.classList.add('loading');
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحساب...';
        
        setTimeout(() => {
            this.classList.remove('loading');
            this.innerHTML = originalText;
        }, 1000);
    });
}

// Intersection Observer for animations
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe tip cards for staggered animation
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Utility function to format numbers in Arabic
function formatNumberArabic(number) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().replace(/[0-9]/g, function(w) {
        return arabicNumbers[+w];
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Allow Enter key to submit form when focus is on form elements
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT') {
            const form = document.getElementById('waterCalculatorForm');
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Allow Escape key to reset calculator when results are shown
    if (e.key === 'Escape') {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection.style.display !== 'none') {
            resetCalculator();
        }
    }
});

// Add PWA-like experience
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Note: Service worker would be implemented in a separate file for PWA functionality
        console.log('App loaded successfully');
    });
}

// Step Navigation Functions
function nextStep(step) {
    if (validateCurrentStep()) {
        currentStep = step;
        updateFormStep();
        updateProgressStep(step);
    }
}

function prevStep(step) {
    currentStep = step;
    updateFormStep();
    updateProgressStep(step);
}

function updateFormStep() {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
}

function updateProgressStep(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((progressStep, index) => {
        progressStep.classList.toggle('active', index + 1 <= step);
    });
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const weightInput = document.getElementById('weight');
        if (!weightInput) return true; // Skip validation if element doesn't exist
        
        const weight = weightInput.value;
        if (!weight || weight < 1 || weight > 300) {
            showError('weightError', 'يرجى إدخال وزن صحيح بين 1 و 300 كيلو جرام');
            return false;
        }
    }
    clearErrors();
    return true;
}

// Weight Slider Functions
function initializeWeightSlider() {
    const weightInput = document.getElementById('weight');
    const weightSlider = document.getElementById('weightSlider');
    
    if (weightInput && weightSlider) {
        // Sync slider with input
        weightInput.addEventListener('input', function() {
            weightSlider.value = this.value || 70;
            updateHydrationMeter(parseFloat(this.value) || 0);
        });
        
        weightSlider.addEventListener('input', function() {
            weightInput.value = this.value;
            updateHydrationMeter(parseFloat(this.value));
        });
    }
}

// Update hydration meter
function updateHydrationMeter(weight) {
    const meterLevel = document.getElementById('hydrationLevel');
    if (meterLevel && weight > 0) {
        const estimatedWater = weight * 35 / 1000; // Medium activity estimate
        const percentage = Math.min((estimatedWater / 4) * 100, 100);
        meterLevel.style.height = `${percentage}%`;
    }
}

// Theme Toggle Functions
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        updateThemeIcon(currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Navigation Functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Result Action Functions
function shareResult() {
    const result = getLastCalculationResult();
    if (result && navigator.share) {
        navigator.share({
            title: 'حاسبة شرب المياه اليومية',
            text: `تحتاج إلى ${result.amount} لتر من الماء يوميًا للحفاظ على صحتك!`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback to clipboard
        const text = `تحتاج إلى ${result?.amount || 'X'} لتر من الماء يوميًا للحفاظ على صحتك!\nاحسب احتياجك من الماء: ${window.location.href}`;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('تم نسخ النتيجة إلى الحافظة!', 'success');
        }).catch(() => {
            showNotification('حدث خطأ في المشاركة', 'error');
        });
    }
}

function saveResult() {
    const result = getLastCalculationResult();
    if (result) {
        const savedResults = JSON.parse(localStorage.getItem('waterCalculatorResults') || '[]');
        savedResults.push({
            ...result,
            date: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('waterCalculatorResults', JSON.stringify(savedResults));
        showNotification('تم حفظ النتيجة بنجاح!', 'success');
    }
}



function getLastCalculationResult() {
    return userData.lastResult || null;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Enhanced input validation
function addInputValidation() {
    const weightInput = document.getElementById('weight');
    const activityInputs = document.querySelectorAll('input[name="activity"]');
    
    if (weightInput) {
        // Real-time weight validation
        weightInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const errorElement = document.getElementById('weightError');
            
            if (this.value && (value < 1 || value > 300)) {
                showError('weightError', 'الوزن يجب أن يكون بين 1 و 300 كيلو جرام');
            } else if (errorElement && errorElement.classList.contains('show')) {
                clearErrors();
            }
        });
    }
    
    if (activityInputs.length > 0) {
        // Clear activity error on selection
        activityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const errorElement = document.getElementById('activityError');
                if (this.checked && errorElement && errorElement.classList.contains('show')) {
                    clearErrors();
                }
            });
        });
    }
}

// Store last calculation result
function storeLastResult(result) {
    userData.lastResult = result;
}

// Update the displayResult function to store the result
const originalDisplayResult = displayResult;
displayResult = function(result) {
    storeLastResult(result);
    originalDisplayResult(result);
};

// Expose functions to global scope for inline event handlers
window.resetCalculator = resetCalculator;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.shareResult = shareResult;
window.saveResult = saveResult;
window.setupReminders = setupReminders;
