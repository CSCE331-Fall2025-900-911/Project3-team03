async function createOrder() {
    const drinkOrder = JSON.parse(localStorage.getItem('yf_cart_v1'));

    if (!drinkOrder) {
        return alert('Nothing to order!');
    }

    const jwtInfo = await fetch('/api/jwt', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getCookie('authToken')}`,
        },
    });

    const employeeId = jwtInfo.json().employeeId;

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let data = {
        drinksInfo: await cleanDrinkOrder(drinkOrder),
    };

    if (employeeId) {
        jwtInfo.employeeId = employeeId;
    }

    const endpoint = employeeId ? '/api/cashierOrder' : '/api/kioskOrder';

    await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    if (jwtInfo) {
        window.location.href = '/employee';
    } else {
        window.location.href = '/';
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
