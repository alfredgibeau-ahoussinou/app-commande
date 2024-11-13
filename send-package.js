document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('packageForm');
    const steps = document.querySelectorAll('.step-content');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let currentStep = 0;

    function validateCurrentStep() {
        const currentInputs = steps[currentStep].querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        currentInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
            }
        });

        return isValid;
    }

    function updateButtons() {
        prevButton.style.display = currentStep === 0 ? 'none' : 'block';
        nextButton.textContent = currentStep === steps.length - 1 ? 'Valider' : 'Suivant';
    }

    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        updateButtons();
        updateProgressBar();
    }

    nextButton.addEventListener('click', function() {
        if (!validateCurrentStep()) {
            steps[currentStep].classList.add('shake');
            setTimeout(() => {
                steps[currentStep].classList.remove('shake');
            }, 500);
            return;
        }

        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        } else {
            handleSubmit();
        }
    });

    prevButton.addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    function handleSubmit() {
        nextButton.textContent = 'Envoi en cours...';
        nextButton.disabled = true;

        setTimeout(() => {
            window.location.href = 'package-confirmation.html';
        }, 1500);
    }

    showStep(currentStep);

    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('input', () => {
            nextButton.disabled = !validateCurrentStep();
        });
    });
}); 