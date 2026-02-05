document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('purchase-form');
    const dateInput = document.getElementById('data');
    const sectorSelect = document.getElementById('setor');

    // Function to fetch sectors from your database via an API
    async function loadSectors() {
        let sectors = [];
        try {
            // --- INTEGRAÇÃO COM SEU BANCO ---
            const response = await fetch('http://localhost:3000/api/setores');
            if (response.ok) {
                sectors = await response.json();
            }
            // --- FIM DA INTEGRAÇÃO ---
        } catch (error) {
            console.warn('Servidor offline ou erro na API. Usando setores padrão.', error);
        }

        // Se a API falhou ou não retornou nada, usamos os dados de backup:
        if (sectors.length === 0) {
            sectors = [
                "Tecnologia da Informação",
                "Suprimentos",
                "Farmácia",
                "Engenharia"
            ];
        }

        // Limpa o combo e adiciona as opções
        sectorSelect.innerHTML = '<option value="">Selecione o setor...</option>';
        sectors.forEach(sectorName => {
            const option = document.createElement('option');
            option.value = sectorName;
            option.textContent = sectorName;
            sectorSelect.appendChild(option);
        });
    }

    // Chama a função para carregar os setores
    loadSectors();

    // Set current date as default
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    dateInput.value = `${day}/${month}/${year}`;

    // Simple date mask (DD/MM/YYYY)
    dateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);

        let formatted = '';
        if (value.length > 0) {
            formatted += value.slice(0, 2);
            if (value.length > 2) {
                formatted += '/' + value.slice(2, 4);
                if (value.length > 4) {
                    formatted += '/' + value.slice(4, 8);
                }
            }
        }
        e.target.value = formatted;
    });

    // Force validarEnvio to be global so onclick can find it
    window.validarEnvio = function () {
        const form = document.getElementById('purchase-form');
        const locationGroup = document.getElementById('location-group');
        const locationError = document.getElementById('location-error');
        const locationSelected = form.querySelector('input[name="location"]:checked');

        // Reset states
        locationGroup.classList.remove('error-state');
        locationError.style.display = 'none';

        // 1. Validate Location (Radio)
        if (!locationSelected) {
            locationGroup.classList.add('error-state');
            locationError.style.display = 'block';
            locationGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alert('⚠️ Selecione um Local (Santa Casa, UPH ou UPA).');
            return;
        }

        // 2. Validate other fields (HTML5 required check)
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // 3. All good
        alert('Solicitação enviada com sucesso! (Simulação)');
        form.reset();

        // Keep the date set to today
        const resetToday = new Date();
        document.getElementById('data').value =
            `${String(resetToday.getDate()).padStart(2, '0')}/${String(resetToday.getMonth() + 1).padStart(2, '0')}/${resetToday.getFullYear()}`;
    };

    // Keep the old submit listener just in case someone presses Enter
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.validarEnvio();
    });

    // Micro-animations: add class on focus
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
});
