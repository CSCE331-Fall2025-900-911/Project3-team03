document.addEventListener('DOMContentLoaded', () => {
    const cartNotification = document.getElementById('cart-notification');
    if (!cartNotification) return;


    function showCartNotification(message) {
        cartNotification.textContent = message;
        cartNotification.hidden = false;

        cartNotification.classList.remove('show');
        void cartNotification.offsetWidth;

        cartNotification.classList.add('show');

        setTimeout(() => {
            cartNotification.classList.remove('show');
            setTimeout(() => {
                cartNotification.hidden = true;
            }, 300); 
        }, 4000);
    }

    // Check if we just completed an order on the previous page
    const completed = sessionStorage.getItem('orderCompleted');
    if (!completed) return;

    const path = window.location.pathname;

    // Landing page
    if (path === '/' && completed === 'customer') {
        showCartNotification('Successfully Completed Order');
        sessionStorage.removeItem('orderCompleted');
        return;
    }

    // Employee page
    if (path === '/employee' && completed === 'cashier') {
        showCartNotification('Successfully Completed Order');
        sessionStorage.removeItem('orderCompleted');
        return;
    }
    
    sessionStorage.removeItem('orderCompleted');
});
