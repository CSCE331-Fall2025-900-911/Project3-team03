const wikiMap = {
    'Puchong Green Tea': 'Green_tea',
    'Lugu Oolong Tea': 'Oolong',
    'Sun Moon Lake Black Tea': 'Black_tea',
    'Songboling Mountain Tea': 'Oolong', // Songboling is a Taiwanese oolong region
    'Yi Fang Fruit Tea': 'Fruit_tea', // brand-specific but fruit tea is correct
    'Mango Fruit Tea': 'Mango',
    'Lemon Green Tea': 'Lemon_tea',
    'Passion Fruit Green Tea': 'Passion_fruit',
    'Lychee Fruit Tea': 'Lychee',
    'Brown Sugar Pearl Latte': 'Bubble_tea',
    'Kyoto Uji Matcha Latte': 'Matcha',
    'Brown Sugar Pearl Matcha Latte': 'Bubble_tea',
    'Red Bean Matcha Latte': 'Red_bean_paste', // closest relevant page
    'Brown Sugar Pearl Coco Latte': 'Bubble_tea',
    'Red Bean Purple Rice Coconut Latte': 'Bubble_tea', // no specific page
    'Grass Jelly Milk Tea': 'Grass_jelly',
    'Winter Melon Tea': 'Winter_melon_punch',
    'Grass Tea': 'Herbal_tea',
    'Tradtional Milk Tea': 'Bubble_tea',
    'Longan Ginger Tea': 'Longan',
    'Ginger Tea': 'Ginger_tea',
    'Pearl Ginger Milk Tea': 'Bubble_tea',
};

const drinkToDesc = {};

async function fetchDescriptions() {
    for (const [drink, page] of Object.entries(wikiMap)) {
        try {
            const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`,
                {
                    headers: { 'User-Agent': 'MyBobaApp/1.0 (example@example.com)' },
                }
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const firstTwoSentences = data.extract.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
            drinkToDesc[drink] = firstTwoSentences;
            console.log(drink, data.extract);
            console.log("\n");
        } catch (err) {
            console.error(`Error fetching ${drink}:`, err);
        }
    }
}

fetchDescriptions();
