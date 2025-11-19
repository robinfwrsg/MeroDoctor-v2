// ============================================
// MeroDoctor - Professional Healthcare Platform
// Main JavaScript for prototype demonstration
// ============================================

// === MOCK DATA ===
// In production, this would come from a backend API

const MEDICINES = {
    decold: { 
        key: 'decold',
        name: 'DeCold', 
        price: 45, 
        stock: 50, 
        category: 'Cold & Flu' 
    },
    sinex: { 
        key: 'sinex',
        name: 'Sinex', 
        price: 65, 
        stock: 30, 
        category: 'Nasal Decongestant' 
    },
    paracetamol: { 
        key: 'paracetamol',
        name: 'Paracetamol (Crocin)', 
        price: 25, 
        stock: 100, 
        category: 'Pain Relief' 
    },
    ibuprofen: { 
        key: 'ibuprofen',
        name: 'Ibuprofen (Brufen)', 
        price: 55, 
        stock: 45, 
        category: 'Pain Relief' 
    },
    azithromycin: { 
        key: 'azithromycin',
        name: 'Azithromycin', 
        price: 180, 
        stock: 20, 
        category: 'Antibiotic' 
    },
    cetirizine: { 
        key: 'cetirizine',
        name: 'Cetirizine', 
        price: 35, 
        stock: 60, 
        category: 'Antihistamine' 
    },
    ors: { 
        key: 'ors',
        name: 'ORS', 
        price: 15, 
        stock: 80, 
        category: 'Rehydration' 
    },
    broncho: { 
        key: 'broncho',
        name: 'Broncho Cough Syrup', 
        price: 95, 
        stock: 25, 
        category: 'Cough Relief' 
    }
};

const DOCTORS = [
    { 
        id: 1, 
        name: 'Dr. Romisha Shrestha', 
        specialty: 'General Physician', 
        rating: 4.8, 
        available: true, 
        fee: 500 
    },
    { 
        id: 2, 
        name: 'Dr. Tapasya Adhikari', 
        specialty: 'Cardiologist', 
        rating: 4.9, 
        available: true, 
        fee: 800 
    },
    { 
        id: 3, 
        name: 'Dr. Priya Gurung', 
        specialty: 'Pediatrician', 
        rating: 4.7, 
        available: false, 
        fee: 600 
    },
    { 
        id: 4, 
        name: 'Dr. Suresh KC', 
        specialty: 'General Physician', 
        rating: 4.6, 
        available: true, 
        fee: 450 
    }
];

const SUBSCRIPTION_PLANS = {
    basic: { 
        name: 'Basic', 
        price: 300, 
        discount: 0.07, 
        cap: 100, 
        appointmentDiscount: 0,
        appointmentCap: 0
    },
    premium: { 
        name: 'Premium', 
        price: 1000, 
        discount: 0.15, 
        cap: 200, 
        appointmentDiscount: 0.15, 
        appointmentCap: 150 
    }
};

const QUICK_SYMPTOMS = ['Fever', 'Headache', 'Cough', 'Cold', 'Stomach Pain', 'Diarrhea'];

const DOSAGE_OPTIONS = [
    { label: '1 tablet', quantity: 1 },
    { label: '2 tablets', quantity: 2 }
];

// === STATE MANAGEMENT ===
// Using localStorage for persistence in this prototype
// In production, this would be managed by a proper state management solution

let state = {
    cart: [],
    subscription: null,
    selectedSymptoms: [],
    history: [],
    selectedDoctor: null
};

// === INITIALIZATION ===

function init() {
    loadState();
    renderQuickSymptoms();
    renderDoctors();
    updateCartBadge();
    updateSubscriptionButton();
    
    // Set min date for appointment picker
    const today = new Date().toISOString().split('T')[0];
    const appointmentDateInput = document.getElementById('appointmentDate');
    if (appointmentDateInput) {
        appointmentDateInput.min = today;
    }
}

// === STATE PERSISTENCE ===

function loadState() {
    try {
        const savedCart = localStorage.getItem('merodoctor_cart');
        const savedSubscription = localStorage.getItem('merodoctor_subscription');
        const savedHistory = localStorage.getItem('merodoctor_history');
        
        if (savedCart) state.cart = JSON.parse(savedCart);
        if (savedSubscription) state.subscription = JSON.parse(savedSubscription);
        if (savedHistory) state.history = JSON.parse(savedHistory);
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

function saveState() {
    try {
        localStorage.setItem('merodoctor_cart', JSON.stringify(state.cart));
        localStorage.setItem('merodoctor_subscription', JSON.stringify(state.subscription));
        localStorage.setItem('merodoctor_history', JSON.stringify(state.history));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

// === SYMPTOM ANALYSIS ENGINE ===
// This is where AI/ML integration would happen in production
// INTEGRATION POINT: Replace analyzeSymptoms() with API call to ML model

function analyzeSymptoms() {
    const input = document.getElementById('symptomInput').value.trim();
    const allSymptoms = [...state.selectedSymptoms];
    
    if (input) {
        allSymptoms.push(input);
    }
    
    if (allSymptoms.length === 0) {
        alert('Please enter at least one symptom');
        return;
    }
    
    const symptomText = allSymptoms.join(' ').toLowerCase();
    
    // Check for serious/urgent conditions first
    const urgent = checkUrgentConditions(symptomText);
    
    if (urgent) {
        showUrgentConsultation(allSymptoms);
    } else {
        const recommendations = getMedicineRecommendations(symptomText);
        showMedicineRecommendations(recommendations, allSymptoms);
    }
    
    // Clear input
    document.getElementById('symptomInput').value = '';
}

// Rule engine for detecting urgent medical conditions
// IMPORTANT: This is a simplified prototype rule set
// In production, this should be replaced with proper medical AI/ML
function checkUrgentConditions(symptomText) {
    const urgentPatterns = [
        { keywords: ['chest pain', 'severe chest'], urgent: true },
        { keywords: ['breathing difficulty', 'shortness of breath', 'can\'t breathe', 'cannot breathe'], urgent: true },
        { keywords: ['severe headache', 'worst headache'], urgent: true },
        { keywords: ['blood', 'bleeding', 'vomiting blood', 'coughing blood'], urgent: true },
        { keywords: ['unconscious', 'fainting', 'fainted', 'seizure', 'convulsion'], urgent: true },
        { keywords: ['severe abdominal', 'severe stomach', 'acute abdomen'], urgent: true },
        { keywords: ['stroke', 'paralysis', 'can\'t move'], urgent: true }
    ];
    
    // Check for high fever + rash combination (potential serious infection)
    const hasFever = symptomText.includes('high fever') || symptomText.includes('very high fever');
    const hasRash = symptomText.includes('rash') || symptomText.includes('spots');
    if (hasFever && hasRash) {
        return true;
    }
    
    // Check other urgent patterns
    for (let pattern of urgentPatterns) {
        if (pattern.keywords.some(keyword => symptomText.includes(keyword))) {
            return true;
        }
    }
    
    return false;
}

// Rule engine for medicine recommendations
// INTEGRATION POINT: Replace with ML model API call
// Example: const recommendations = await fetch('/api/analyze-symptoms', { method: 'POST', body: JSON.stringify({symptoms}) })
function getMedicineRecommendations(symptomText) {
    const recommendedMeds = new Set();
    
    // Medicine recommendation rules
    // Each rule maps symptom keywords to appropriate medicines
    const rules = [
        { 
            keywords: ['fever', 'temperature', 'hot', 'high fever'], 
            medicines: ['paracetamol', 'ibuprofen'] 
        },
        { 
            keywords: ['headache', 'head pain', 'head ache', 'migraine'], 
            medicines: ['paracetamol', 'ibuprofen'] 
        },
        { 
            keywords: ['cold', 'runny nose', 'sneezing', 'sneeze'], 
            medicines: ['decold', 'cetirizine', 'sinex'] 
        },
        { 
            keywords: ['cough', 'coughing', 'throat', 'sore throat'], 
            medicines: ['broncho', 'decold'] 
        },
        { 
            keywords: ['allergy', 'allergic', 'itching', 'itch', 'hives'], 
            medicines: ['cetirizine'] 
        },
        { 
            keywords: ['diarrhea', 'loose motion', 'loose stool', 'dehydration'], 
            medicines: ['ors'] 
        },
        { 
            keywords: ['stomach pain', 'stomach ache', 'abdominal pain', 'tummy ache'], 
            medicines: ['ors'] 
        },
        { 
            keywords: ['body pain', 'body ache', 'muscle pain', 'joint pain', 'back pain'], 
            medicines: ['ibuprofen'] 
        },
        { 
            keywords: ['nasal', 'nose blocked', 'blocked nose', 'congestion', 'stuffy nose'], 
            medicines: ['sinex', 'decold'] 
        },
        { 
            keywords: ['flu', 'influenza', 'common cold'], 
            medicines: ['decold', 'paracetamol'] 
        }
    ];
    
    // Apply rules
    for (let rule of rules) {
        if (rule.keywords.some(keyword => symptomText.includes(keyword))) {
            rule.medicines.forEach(med => recommendedMeds.add(med));
        }
    }
    
    // Default recommendation if no matches (safe, common medicine)
    if (recommendedMeds.size === 0) {
        recommendedMeds.add('paracetamol');
    }
    
    // Convert to medicine objects
    return Array.from(recommendedMeds).map(key => ({
        ...MEDICINES[key],
        dosageOptions: DOSAGE_OPTIONS
    }));
}

// === UI RENDERING ===

function renderQuickSymptoms() {
    const container = document.getElementById('quickSymptoms');
    container.innerHTML = QUICK_SYMPTOMS.map(symptom => 
        `<button class="symptom-tag" onclick="addSymptomTag('${symptom}')">${symptom}</button>`
    ).join('');
}

function addSymptomTag(symptom) {
    if (!state.selectedSymptoms.includes(symptom)) {
        state.selectedSymptoms.push(symptom);
        renderSelectedSymptoms();
    }
}

function removeSymptomTag(symptom) {
    state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== symptom);
    renderSelectedSymptoms();
}

function renderSelectedSymptoms() {
    const container = document.getElementById('selectedSymptoms');
    
    if (state.selectedSymptoms.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = state.selectedSymptoms.map(symptom => `
        <span class="selected-tag">
            <span>${symptom}</span>
            <button onclick="removeSymptomTag('${symptom}')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </span>
    `).join('');
}

function showUrgentConsultation(symptoms) {
    const resultsSection = document.getElementById('resultsSection');
    const urgentAlert = document.getElementById('urgentAlert');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const urgentDoctors = document.getElementById('urgentDoctors');
    
    resultsSection.style.display = 'block';
    urgentAlert.style.display = 'block';
    recommendationsSection.style.display = 'none';
    
    // Show available doctors for urgent consultation
    const availableDoctors = DOCTORS.filter(d => d.available);
    urgentDoctors.innerHTML = availableDoctors.map(doctor => `
        <div class="doctor-card" style="margin-top: 1rem;">
            <div class="doctor-header">
                <div class="doctor-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <span class="available-badge">Available</span>
            </div>
            <h4 class="doctor-name">${doctor.name}</h4>
            <p class="doctor-specialty">${doctor.specialty}</p>
            <div class="doctor-info">
                <div class="doctor-rating">
                    <svg class="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>${doctor.rating}</span>
                </div>
                <span class="doctor-fee">Rs ${doctor.fee}</span>
            </div>
            <button class="btn-book" onclick="openAppointmentModal(${doctor.id})">Book Now</button>
        </div>
    `).join('');
    
    // Add to history
    addToHistory({
        symptoms: symptoms,
        action: 'Urgent consultation recommended',
        date: new Date().toISOString()
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showMedicineRecommendations(medicines, symptoms) {
    const resultsSection = document.getElementById('resultsSection');
    const urgentAlert = document.getElementById('urgentAlert');
    const recommendationsSection = document.getElementById('recommendationsSection');
    const medicinesGrid = document.getElementById('medicinesGrid');
    
    resultsSection.style.display = 'block';
    urgentAlert.style.display = 'none';
    recommendationsSection.style.display = 'block';
    
    medicinesGrid.innerHTML = medicines.map(medicine => `
        <div class="medicine-card">
            <div class="medicine-header">
                <h4 class="medicine-name">${medicine.name}</h4>
                <p class="medicine-category">${medicine.category}</p>
            </div>
            <div class="medicine-pricing">
                <span class="medicine-price">Rs ${medicine.price}</span>
                <span class="medicine-stock">Stock: ${medicine.stock}</span>
            </div>
            <div class="dosage-options">
                ${medicine.dosageOptions.map((dosage, idx) => `
                    <button class="btn-add-cart" onclick='addToCart(${JSON.stringify(medicine)}, ${JSON.stringify(dosage)})'>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add ${dosage.label}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    // Add to history
    addToHistory({
        symptoms: symptoms,
        medicines: medicines.map(m => m.name),
        date: new Date().toISOString()
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function renderDoctors() {
    const grid = document.getElementById('doctorsGrid');
    
    grid.innerHTML = DOCTORS.map(doctor => `
        <div class="doctor-card">
            <div class="doctor-header">
                <div class="doctor-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                ${doctor.available ? '<span class="available-badge">Available</span>' : ''}
            </div>
            <h4 class="doctor-name">${doctor.name}</h4>
            <p class="doctor-specialty">${doctor.specialty}</p>
            <div class="doctor-info">
                <div class="doctor-rating">
                    <svg class="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>${doctor.rating}</span>
                </div>
                <span class="doctor-fee">Rs ${doctor.fee}</span>
            </div>
            <button class="btn-book" ${!doctor.available ? 'disabled' : ''} onclick="openAppointmentModal(${doctor.id})">
                ${doctor.available ? 'Book Appointment' : 'Unavailable'}
            </button>
        </div>
    `).join('');
}

// === CART MANAGEMENT ===

function addToCart(medicine, dosage) {
    // Check if item already exists in cart
    const existingIndex = state.cart.findIndex(
        item => item.key === medicine.key && item.dosage.label === dosage.label
    );
    
    if (existingIndex >= 0) {
        state.cart[existingIndex].quantity += 1;
    } else {
        state.cart.push({
            ...medicine,
            dosage: dosage,
            quantity: 1
        });
    }
    
    saveState();
    updateCartBadge();
    renderCart();
    toggleCart(true);
}

function updateCartQuantity(index, delta) {
    state.cart[index].quantity += delta;
    
    if (state.cart[index].quantity <= 0) {
        state.cart.splice(index, 1);
    }
    
    saveState();
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const count = state.cart.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

function renderCart() {
    const itemsContainer = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    
    if (state.cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        footer.style.display = 'none';
        return;
    }
    
    itemsContainer.innerHTML = state.cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-dosage">${item.dosage.label}</div>
                <div class="cart-item-price">Rs ${item.price * item.dosage.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="btn-quantity btn-minus" onclick="updateCartQuantity(${index}, -1)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="btn-quantity btn-plus" onclick="updateCartQuantity(${index}, 1)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    // Calculate totals
    const { subtotal, discount, total } = calculateCartTotals();
    
    document.getElementById('subtotal').textContent = `Rs ${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `Rs ${total.toFixed(2)}`;
    
    const discountRow = document.getElementById('discountRow');
    if (discount > 0 && state.subscription) {
        discountRow.style.display = 'flex';
        document.getElementById('discountLabel').textContent = `(${SUBSCRIPTION_PLANS[state.subscription].name})`;
        document.getElementById('discount').textContent = `- Rs ${discount.toFixed(2)}`;
    } else {
        discountRow.style.display = 'none';
    }
    
    footer.style.display = 'block';
}

function calculateCartTotals() {
    const subtotal = state.cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity * item.dosage.quantity);
    }, 0);
    
    let discount = 0;
    if (state.subscription) {
        const plan = SUBSCRIPTION_PLANS[state.subscription];
        discount = Math.min(subtotal * plan.discount, plan.cap);
    }
    
    return {
        subtotal,
        discount,
        total: subtotal - discount
    };
}

function toggleCart(forceOpen) {
    const drawer = document.getElementById('cartDrawer');
    
    if (forceOpen) {
        drawer.classList.add('open');
        renderCart();
    } else {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) {
            renderCart();
        }
    }
}

// === CHECKOUT MANAGEMENT ===

function proceedToCheckout() {
    if (state.cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Close cart drawer
    toggleCart();
    
    // Open checkout modal
    openCheckoutModal();
}

function openCheckoutModal() {
    renderCheckoutItems();
    renderCheckoutSummary();
    document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('open');
}

function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    
    container.innerHTML = state.cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-details">
                    ${item.dosage.label} × ${item.quantity}
                </div>
            </div>
            <div class="checkout-item-price">
                Rs ${(item.price * item.dosage.quantity * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    const { subtotal, discount, total } = calculateCartTotals();
    
    let html = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>Rs ${subtotal.toFixed(2)}</span>
        </div>
    `;
    
    if (discount > 0 && state.subscription) {
        html += `
            <div class="summary-row discount-row">
                <span>Subscription Discount (${SUBSCRIPTION_PLANS[state.subscription].name})</span>
                <span>- Rs ${discount.toFixed(2)}</span>
            </div>
        `;
    }
    
    html += `
        <div class="summary-row">
            <span>Delivery Fee</span>
            <span>Rs 50.00</span>
        </div>
        <div class="summary-row total-row" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--gray-200);">
            <span style="font-size: 1.25rem;">Total</span>
            <span style="font-size: 1.25rem;">Rs ${(total + 50).toFixed(2)}</span>
        </div>
    `;
    
    container.innerHTML = html;
}

function confirmOrder() {
    // Validate form
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    
    if (!name || !phone || !address) {
        alert('Please fill in all required fields (Name, Phone, Address)');
        return;
    }
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if (paymentMethod !== 'cod') {
        alert('Online payment methods are coming soon! Please select Cash on Delivery.');
        return;
    }
    
    // Calculate final totals
    const { subtotal, discount, total } = calculateCartTotals();
    const deliveryFee = 50;
    const finalTotal = total + deliveryFee;
    
    // Create order object
    const order = {
        orderId: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: state.cart.map(item => ({
            name: item.name,
            dosage: item.dosage.label,
            quantity: item.quantity,
            price: item.price * item.dosage.quantity * item.quantity
        })),
        customer: {
            name: name,
            phone: phone,
            address: address,
            notes: document.getElementById('orderNotes').value.trim()
        },
        payment: {
            method: paymentMethod,
            subtotal: subtotal,
            discount: discount,
            deliveryFee: deliveryFee,
            total: finalTotal
        },
        subscription: state.subscription
    };
    
    // Add to history
    addToHistory({
        action: 'Order Placed',
        orderId: order.orderId,
        items: order.items.map(i => `${i.name} (${i.dosage}) × ${i.quantity}`),
        total: finalTotal,
        discount: discount,
        date: order.date
    });
    
    // Clear cart
    state.cart = [];
    saveState();
    updateCartBadge();
    
    // Close modal
    closeCheckoutModal();
    
    // Show success message
    showOrderConfirmation(order);
    
    // Clear form
    document.getElementById('checkoutForm').reset();
}

function showOrderConfirmation(order) {
    const message = `
🎉 Order Placed Successfully!

Order ID: ${order.orderId}
Total Amount: Rs ${order.payment.total.toFixed(2)}
${order.payment.discount > 0 ? `You saved: Rs ${order.payment.discount.toFixed(2)}\n` : ''}
Payment: ${order.payment.method === 'cod' ? 'Cash on Delivery' : order.payment.method}

Delivery to:
${order.customer.name}
${order.customer.phone}
${order.customer.address}

Your order will be delivered within 1-2 business days.
You will receive a confirmation call shortly.

Thank you for choosing MeroDoctor! 💙
    `;
    
    alert(message);
}

// === SUBSCRIPTION MANAGEMENT ===

function openSubscriptionModal() {
    document.getElementById('subscriptionModal').classList.add('open');
}

function closeSubscriptionModal() {
    document.getElementById('subscriptionModal').classList.remove('open');
}

function selectSubscription(plan) {
    state.subscription = plan;
    saveState();
    updateSubscriptionButton();
    closeSubscriptionModal();
    
    // Show confirmation
    const planName = SUBSCRIPTION_PLANS[plan].name;
    alert(`Successfully subscribed to ${planName} plan! You'll now receive discounts on purchases${plan === 'premium' ? ' and appointments' : ''}.`);
}

function updateSubscriptionButton() {
    const btn = document.getElementById('subscriptionBtnText');
    if (state.subscription) {
        btn.textContent = SUBSCRIPTION_PLANS[state.subscription].name;
    } else {
        btn.textContent = 'Subscribe';
    }
}

// === APPOINTMENT MANAGEMENT ===

function openAppointmentModal(doctorId) {
    const doctor = DOCTORS.find(d => d.id === doctorId);
    if (!doctor || !doctor.available) return;
    
    state.selectedDoctor = doctor;
    
    // Render doctor details
    const detailsContainer = document.getElementById('appointmentDetails');
    detailsContainer.innerHTML = `
        <h4 class="appointment-doctor-name">${doctor.name}</h4>
        <p class="appointment-doctor-specialty">${doctor.specialty}</p>
    `;
    
    // Calculate fees with discount
    renderAppointmentSummary();
    
    document.getElementById('appointmentModal').classList.add('open');
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').classList.remove('open');
    state.selectedDoctor = null;
}

function renderAppointmentSummary() {
    if (!state.selectedDoctor) return;
    
    const container = document.getElementById('appointmentSummary');
    let fee = state.selectedDoctor.fee;
    let discount = 0;
    
    if (state.subscription === 'premium') {
        const plan = SUBSCRIPTION_PLANS.premium;
        discount = Math.min(fee * plan.appointmentDiscount, plan.appointmentCap);
        fee -= discount;
    }
    
    let html = `
        <div class="summary-row">
            <span>Consultation Fee</span>
            <span>Rs ${state.selectedDoctor.fee}</span>
        </div>
    `;
    
    if (discount > 0) {
        html += `
            <div class="summary-row discount-row">
                <span>Premium Discount</span>
                <span>- Rs ${discount.toFixed(0)}</span>
            </div>
            <div class="summary-row total-row">
                <span>Total</span>
                <span>Rs ${fee.toFixed(0)}</span>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function confirmAppointment() {
    if (!state.selectedDoctor) return;
    
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    let fee = state.selectedDoctor.fee;
    let discount = 0;
    
    if (state.subscription === 'premium') {
        const plan = SUBSCRIPTION_PLANS.premium;
        discount = Math.min(fee * plan.appointmentDiscount, plan.appointmentCap);
        fee -= discount;
    }
    
    // Add to history
    addToHistory({
        action: `Appointment booked with ${state.selectedDoctor.name}`,
        specialty: state.selectedDoctor.specialty,
        date: date,
        time: time,
        fee: state.selectedDoctor.fee,
        discount: discount,
        finalFee: fee,
        timestamp: new Date().toISOString()
    });
    
    closeAppointmentModal();
    
    alert(`Appointment confirmed with ${state.selectedDoctor.name} on ${date} at ${time}!\n\nFinal fee: Rs ${fee}${discount > 0 ? `\nYou saved: Rs ${discount.toFixed(0)}` : ''}`);
}

// === HISTORY MANAGEMENT ===

function addToHistory(entry) {
    state.history.unshift(entry); // Add to beginning
    state.history = state.history.slice(0, 20); // Keep last 20 entries
    saveState();
}

function openHistory() {
    renderHistory();
    document.getElementById('historyModal').classList.add('open');
}

function closeHistory() {
    document.getElementById('historyModal').classList.remove('open');
}

function renderHistory() {
    const container = document.getElementById('historyContent');
    
    if (state.history.length === 0) {
        container.innerHTML = '<p class="empty-history">No history yet</p>';
        return;
    }
    
    container.innerHTML = state.history.map(entry => {
        const date = new Date(entry.date || entry.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        let html = `
            <div class="history-entry">
                <div class="history-date">${dateStr}</div>
        `;
        
        if (entry.symptoms) {
            html += `
                <div class="history-symptoms">
                    <span class="history-label">Symptoms:</span> ${entry.symptoms.join(', ')}
                </div>
            `;
        }
        
        if (entry.medicines) {
            html += `
                <div class="history-medicines">
                    <span class="history-label">Medicines:</span> ${entry.medicines.join(', ')}
                </div>
            `;
        }
        
        if (entry.action) {
            html += `<div class="history-action">${entry.action}</div>`;
        }
        
        if (entry.fee !== undefined) {
            html += `
                <div class="history-fee">
                    Fee: Rs ${entry.finalFee}${entry.discount > 0 ? ` (saved Rs ${entry.discount.toFixed(0)})` : ''}
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }).join('');
}

// === EVENT LISTENERS ===

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.closest('.modal').classList.remove('open');
    }
    
    if (e.target.classList.contains('cart-overlay')) {
        toggleCart();
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.open');
        if (openModal) {
            openModal.classList.remove('open');
        }
        
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer.classList.contains('open')) {
            toggleCart();
        }
    }
});

// === UTILITY FUNCTIONS ===

// Format currency
function formatCurrency(amount) {
    return `Rs ${amount.toFixed(2)}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// === DEVELOPER TESTING PANEL (Hidden by default) ===
// This section is for developers to easily test and modify symptom rules

const DEV_MODE = false; // Set to true to enable developer panel

if (DEV_MODE) {
    console.log('=== MeroDoctor Developer Mode ===');
    console.log('Available functions:');
    console.log('- testSymptom(symptomText) - Test symptom analysis');
    console.log('- addMedicineRule(keywords, medicines) - Add new rule');
    console.log('- viewState() - View current application state');
    console.log('- clearState() - Clear all localStorage data');
}

function testSymptom(symptomText) {
    console.log('Testing symptom:', symptomText);
    const urgent = checkUrgentConditions(symptomText);
    console.log('Urgent:', urgent);
    
    if (!urgent) {
        const recommendations = getMedicineRecommendations(symptomText);
        console.log('Recommendations:', recommendations);
    }
}

function viewState() {
    console.log('Current State:', state);
}

function clearState() {
    if (confirm('Clear all data? This cannot be undone.')) {
        localStorage.clear();
        state = {
            cart: [],
            subscription: null,
            selectedSymptoms: [],
            history: [],
            selectedDoctor: null
        };
        init();
        console.log('State cleared');
    }
}

// === PRODUCTION INTEGRATION NOTES ===
/*
 * INTEGRATION POINTS FOR PRODUCTION:
 * 
 * 1. SYMPTOM ANALYSIS AI/ML:
 *    Replace the analyzeSymptoms() function with an API call:
 *    
 *    async function analyzeSymptoms() {
 *        const symptoms = [...state.selectedSymptoms, document.getElementById('symptomInput').value];
 *        
 *        const response = await fetch('/api/analyze-symptoms', {
 *            method: 'POST',
 *            headers: { 'Content-Type': 'application/json' },
 *            body: JSON.stringify({ symptoms })
 *        });
 *        
 *        const result = await response.json();
 *        
 *        if (result.urgent) {
 *            showUrgentConsultation(symptoms);
 *        } else {
 *            showMedicineRecommendations(result.recommendations, symptoms);
 *        }
 *    }
 * 
 * 2. MEDICINE DATABASE:
 *    Replace MEDICINES object with API calls to fetch real-time medicine data:
 *    
 *    async function fetchMedicines() {
 *        const response = await fetch('/api/medicines');
 *        return await response.json();
 *    }
 * 
 * 3. DOCTOR AVAILABILITY:
 *    Fetch real-time doctor availability:
 *    
 *    async function fetchDoctors() {
 *        const response = await fetch('/api/doctors');
 *        return await response.json();
 *    }
 * 
 * 4. PAYMENT PROCESSING:
 *    Integrate payment gateway for checkout:
 *    
 *    async function processCheckout() {
 *        const response = await fetch('/api/checkout', {
 *            method: 'POST',
 *            body: JSON.stringify({ cart: state.cart, subscription: state.subscription })
 *        });
 *        // Handle payment gateway redirect
 *    }
 * 
 * 5. USER AUTHENTICATION:
 *    Add user login/registration:
 *    
 *    async function login(email, password) {
 *        const response = await fetch('/api/auth/login', {
 *            method: 'POST',
 *            body: JSON.stringify({ email, password })
 *        });
 *        const { token, user } = await response.json();
 *        localStorage.setItem('authToken', token);
 *        state.user = user;
 *    }
 * 
 * 6. APPOINTMENT BOOKING:
 *    Connect to real appointment system:
 *    
 *    async function confirmAppointment() {
 *        const response = await fetch('/api/appointments', {
 *            method: 'POST',
 *            body: JSON.stringify({
 *                doctorId: state.selectedDoctor.id,
 *                date: document.getElementById('appointmentDate').value,
 *                time: document.getElementById('appointmentTime').value
 *            })
 *        });
 *        // Handle confirmation
 *    }
 * 
 * 7. PRESCRIPTION MANAGEMENT:
 *    For prescription medicines, add verification:
 *    
 *    if (medicine.requiresPrescription) {
 *        // Request prescription upload
 *        await uploadPrescription();
 *    }
 * 
 * 8. TELEMEDICINE VIDEO:
 *    Integrate video consultation:
 *    
 *    function startVideoConsultation(appointmentId) {
 *        // Initialize WebRTC or third-party video SDK
 *    }
 * 
 * 9. NOTIFICATIONS:
 *    Add push notifications for appointment reminders:
 *    
 *    if ('Notification' in window) {
 *        Notification.requestPermission();
 *    }
 * 
 * 10. ANALYTICS:
 *     Track user behavior:
 *     
 *     function trackEvent(eventName, data) {
 *         // Send to analytics service (Google Analytics, Mixpanel, etc.)
 *     }
 */

// === ACCESSIBILITY ENHANCEMENTS ===
// Focus management for modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Apply focus trap when modals open
const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('open')) {
                trapFocus(modal);
                // Focus first focusable element
                const firstInput = modal.querySelector('input, button');
                if (firstInput) firstInput.focus();
            }
        });
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
});

// === PERFORMANCE OPTIMIZATION ===
// Debounce function for search input (if implementing real-time search)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === INITIALIZE APPLICATION ===
// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// === EXPORT FOR TESTING (if using module system) ===
// Uncomment if using ES6 modules
/*
export {
    analyzeSymptoms,
    addToCart,
    selectSubscription,
    confirmAppointment,
    testSymptom,
    clearState
};
*/

// === CONSOLE WELCOME MESSAGE ===
console.log('%cMeroDoctor Prototype', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cHealthcare simplified for Nepal', 'color: #6b7280; font-size: 14px;');
console.log('');
console.log('This is a prototype demonstration. Not for medical use.');
console.log('');
if (DEV_MODE) {
    console.log('%cDeveloper Mode Enabled', 'color: #10b981; font-weight: bold;');
    console.log('Type viewState() to see current application state');

}
