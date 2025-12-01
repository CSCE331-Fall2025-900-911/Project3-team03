let rewardApplied = false;

async function checkRewards() {
    const phone = document.getElementById('phone').value;

    try {
        const res = await fetch('/api/rewards/' + phone);
        if (!res.ok) {
            document.getElementById('reward-message').textContent = 'Phone number not found';
            return;
        }

        const data = await res.json();
        const count = data.order_count;
        const totalNode = document.querySelector('.cart-total-price');

        const cart = getCart();

        let total = cart.reduce((sum, item) => sum + computePrice(item.basePrice, item), 0);

        if (count % 5 === 0 && count !== 0) {
            total -= 5;
            total = Math.max(total, 0);
            rewardApplied = true;
            document.getElementById('reward-message').textContent = 'Congrats! $5 reward applied!';
        } else {
            document.getElementById('reward-message').textContent = 'No reward this time.';
        }

        totalNode.textContent = `$${total.toFixed(2)}`;
    } catch (err) {
        console.error('Error checking rewards:', err);
        document.getElementById('reward-message').textContent = 'Error checking rewards';
    }
}

async function createOrder() {
    const drinkOrder = JSON.parse(localStorage.getItem('yf_cart_v1'));
    const phone = document.getElementById('phone').value;

    // if (!drinkOrder) {
    //     return alert('Nothing to order!');
    // }

    const jwtInfo = await (
        await fetch('/api/jwt', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getCookie('authToken')}`,
            },
        })
    ).json();

    const employeeId = jwtInfo.employeeId;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let data = {
        drinksInfo: await cleanDrinkOrder(drinkOrder),
        rewardApplied: rewardApplied,
        phoneNumber: phone,
    };

    const endpoint = employeeId ? '/api/cashierOrder' : '/api/kioskOrder';

    await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    const referrer = document.referrer;
    console.log(referrer);

    if (referrer && referrer.includes('/cashier')) {
        window.location.href = '/employee';
    } else if (referrer && referrer.includes('/menu')) {
        window.location.href = '/';
    } else {
        if (jwtInfo) {
            window.location.href = '/employee';
        } else {
            window.location.href = '/';
        }
    }
}

async function cleanDrinkOrder(drinkOrder) {
    for (let drink of drinkOrder) {
        drink.drink_id = drink.drinkId;
        drink.ice = Number.parseInt(drink.ice);
        drink.sugar = Number.parseInt(drink.sugar);

        const toppings = drink.toppings;
        let transformedToppings = {};

        for (const t of toppings) {
            let topping_name = t.replace('-', '_');
            transformedToppings[topping_name] = true;
        }

        drink.toppings = transformedToppings;
    }

    return drinkOrder;
}

function getCookie(name) {
    return document.cookie
        .split('; ')
        .find((row) => row.startsWith(name + '='))
        ?.split('=')[1];
}
