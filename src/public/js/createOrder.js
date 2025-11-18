async function createOrder() {
    const drinkOrder = JSON.parse(localStorage.getItem('yf_cart_v1'));

    if (!drinkOrder) {
        return alert('Nothing to order!');
    }

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

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const data = JSON.stringify({
        employeeId: '1',
        drinksInfo: drinkOrder,
    });

    await fetch('/api/cashierOrder', {
        method: 'POST',
        headers: myHeaders,
        body: data,
    })
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
