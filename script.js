const menuIcon = document.querySelector('.menu-icon');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
menuIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuIcon.classList.toggle('active');
});

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuIcon.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuIcon.contains(e.target)) {
        navMenu.classList.remove('active');
        menuIcon.classList.remove('active');
    }
});

// Countdown Timer
function initCountdownTimer() {
    // Set the date we're counting down to (3 days from now)
    const countDownDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);

    // Update the countdown every 1 second
    const timerInterval = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();

        // Find the distance between now and the countdown date
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Add leading zeros
        const formatNumber = (number) => number < 10 ? `0${number}` : number;

        // Display the results
        document.getElementById("days").textContent = formatNumber(days);
        document.getElementById("hours").textContent = formatNumber(hours);
        document.getElementById("minutes").textContent = formatNumber(minutes);
        document.getElementById("seconds").textContent = formatNumber(seconds);

        // If the countdown is finished, display expired message
        if (distance < 0) {
            clearInterval(timerInterval);
            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";
        }
    }, 1000);
}

// Initialize the countdown timer
initCountdownTimer();

// Modal functionality
const modal = document.getElementById('investModal');
const modalContainer = modal.querySelector('.modal-container');
const closeBtn = modal.querySelector('.modal-close');
const investLinks = document.querySelectorAll('.invest');
const amountInput = document.getElementById('amount');
const returnAmount = document.getElementById('returnAmount');
const investButton = document.getElementById('investButton');

// Open modal
function openModal() {
    modal.classList.add('active');
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    modalContainer.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for opening modal
investLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
});

// Event listeners for closing modal
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Chain tab switching
const chainTabs = document.querySelectorAll('.chain-tab');
const chainContents = document.querySelectorAll('.chain-content');

chainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        chainTabs.forEach(t => t.classList.remove('active'));
        chainContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding content
        const chainName = tab.getAttribute('data-chain');
        document.getElementById(`${chainName}-content`).classList.add('active');
    });
});

// Calculate return amount
amountInput.addEventListener('input', () => {
    const amount = parseFloat(amountInput.value) || 0;
    const activeChain = document.querySelector('.chain-tab.active').getAttribute('data-chain');
    let symbol = 'ETH';
    
    switch(activeChain) {
        case 'solana':
            symbol = 'SOL';
            break;
        case 'polygon':
            symbol = 'MATIC';
            break;
    }
    
    returnAmount.value = `${(amount * 3).toFixed(2)} ${symbol}`;
});

// Handle investment button click
investButton.addEventListener('click', () => {
    if (!amountInput.value || parseFloat(amountInput.value) <= 0) {
        alert('Please enter a valid investment amount');
        return;
    }

    // Get active chain and amount
    const activeChain = document.querySelector('.chain-tab.active').getAttribute('data-chain');
    const amount = parseFloat(amountInput.value);
    
    // Disable the button and show processing state
    investButton.classList.add('processing');
    investButton.disabled = true;
    
    // Show transaction message
    const transactionMessage = document.getElementById('transactionMessage');
    transactionMessage.classList.add('active');
    
    // Scroll transaction message into view
    transactionMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Optional: Hide the message and reset the form after a delay (for demo purposes)
    setTimeout(() => {
        closeModal();
        // Reset states
        investButton.classList.remove('processing');
        investButton.disabled = false;
        transactionMessage.classList.remove('active');
        amountInput.value = '';
        returnAmount.value = '';
    }, 5000); // Show message for 5 seconds before closing
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Recent Activities Table
const networks = ['Ethereum', 'Solana', 'Polygon'];
const networkSymbols = {
    'Ethereum': 'ETH',
    'Solana': 'SOL',
    'Polygon': 'MATIC'
};

function generateWalletAddress() {
    const chains = {
        'Ethereum': '0x',
        'Solana': '',
        'Polygon': '0x'
    };
    const chain = networks[Math.floor(Math.random() * networks.length)];
    const prefix = chains[chain];
    const length = chain === 'Solana' ? 32 : 40;
    const chars = '0123456789abcdef';
    let address = prefix;
    for (let i = 0; i < length; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return { address, chain };
}

function formatAmount(amount, symbol) {
    return `${amount.toFixed(2)} ${symbol}`;
}

function getRandomAmount() {
    return (Math.random() * 10 + 0.1).toFixed(2);
}

function createActivityRow(isNew = true) {
    const { address, chain } = generateWalletAddress();
    const investment = getRandomAmount();
    const symbol = networkSymbols[chain];
    const status = Math.random() > 0.3 ? 'completed' : 'processing';
    
    const row = document.createElement('tr');
    if (isNew) row.classList.add('new-row');
    
    const time = new Date().toLocaleTimeString();
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    
    row.innerHTML = `
        <td data-label="Time">${time}</td>
        <td data-label="Wallet Address" class="wallet-address">${shortAddress}</td>
        <td data-label="Network">${chain}</td>
        <td data-label="Investment" class="investment">${formatAmount(parseFloat(investment), symbol)}</td>
        <td data-label="Return (3X)" class="return">${formatAmount(parseFloat(investment) * 3, symbol)}</td>
        <td data-label="Status">
            <span class="status-badge ${status}">
                ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </td>
    `;
    
    return row;
}

function updateActivitiesTable() {
    const tbody = document.getElementById('activitiesTableBody');
    if (!tbody) return;

    // Add new row at the top
    const newRow = createActivityRow();
    tbody.insertBefore(newRow, tbody.firstChild);

    // Keep only last 10 rows
    while (tbody.children.length > 10) {
        tbody.removeChild(tbody.lastChild);
    }

    // Remove new-row class after animation
    setTimeout(() => {
        newRow.classList.remove('new-row');
    }, 500);
}

// Initialize table with some data
function initializeActivitiesTable() {
    const tbody = document.getElementById('activitiesTableBody');
    if (!tbody) return;

    // Add initial rows
    for (let i = 0; i < 10; i++) {
        const row = createActivityRow(false);
        tbody.appendChild(row);
    }

    // Start live updates
    setInterval(updateActivitiesTable, 3000); // Update every 3 seconds
}

// Initialize activities table when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeActivitiesTable);
