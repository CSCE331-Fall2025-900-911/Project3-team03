const wikiMap = {
    'Puchong Green Tea': 'Green_tea',
    'Lugu Oolong Tea': 'Oolong',
    'Sun Moon Lake Black Tea': 'Black_tea',
    'Songboling Mountain Tea': 'Oolong', 
    'Yi Fang Fruit Tea': 'Herbal_tea', //look
    'Mango Fruit Tea': 'Mango', //look
    'Lemon Green Tea': 'Green_tea',
    'Passion Fruit Green Tea': 'Passion_fruit',
    'Lychee Fruit Tea': 'Lychee',
    'Brown Sugar Pearl Latte': 'Bubble_tea',
    'Kyoto Uji Matcha Latte': 'Matcha',
    'Brown Sugar Pearl Matcha Latte': 'Bubble_tea',
    'Red Bean Matcha Latte': 'Red_bean_rice', // closest relevant page
    'Brown Sugar Pearl Coco Latte': 'Bubble_tea',
    'Red Bean Purple Rice Coconut Latte': 'Red_bean_rice', // no specific page
    'Grass Jelly Milk Tea': 'Grass_jelly',
    'Winter Melon Tea': 'Winter_melon_punch',
    'Grass Tea': 'Grass_jelly',
    'Traditional Milk Tea': 'Bubble_tea',
    'Longan Ginger Tea': 'Longan',
    'Ginger Tea': 'Ginger_tea',
    'Pearl Ginger Milk Tea': 'Bubble_tea',
    'Sugar Cane Mountain Tea' : 'Sugarcane', //new onward
    'Black Tea Latte' : 'Black_tea',
    'Fresh Taro Latte' : 'Taro',
    'Taro Milk Tea' : 'Taro',
    'Matcha Milk Tea' : 'Matcha',
    'Brown Sugar Milk Tea' : 'Bubble_tea',
    'Jasmine Milk Tea' : 'Jasmine_tea',
    'Earl Grey Milk Tea' : 'Earl_Grey_tea',
    'Mango Pomelo Sago' : 'Mango_pomelo_sago',
    'Almond Milk Grass Jelly' : 'Almond_milk',
    'Strawberry Smoothie' : 'Strawberry',
    'Yakult Mountain Tea' : 'Yakult',
    'Yakult Passion Fruit Green Tea' : 'Yakult',
    'Vietnamese Coffee' : 'Vietnamese_iced_coffee',
    'Brew' : 'Coffee',
    'Chocolate Cream Brew' : 'Chocolate' 
};

const nutritionMap = {
  "Puchong Green Tea": [
    "Calories: 40 → 1,050",
    "Allergens: None major."
  ],
  "Lugu Oolong Tea": [
    "Calories: 40 → 1,050",
    "Allergens: None major."
  ],
  "Sun Moon Lake Black Tea": [
    "Calories: 50 → 1,060",
    "Allergens: None major."
  ],
  "Songboling Mountain Tea": [
    "Calories: 40 → 1,050",
    "Allergens: None major."
  ],
  "Yi Fang Fruit Tea": [
    "Calories: 150 → 1,160",
    "Allergens: Fruit allergens, possible sulfite traces."
  ],
  "Mango Fruit Tea": [
    "Calories: 300 → 1,310",
    "Allergens: Mango, fruit allergens."
  ],
  "Lemon Green Tea": [
    "Calories: 70 → 1,080",
    "Allergens: Lemon (citrus)."
  ],
  "Passion Fruit Green Tea": [
    "Calories: 90 → 1,100",
    "Allergens: Passion fruit."
  ],
  "Lychee Fruit Tea": [
    "Calories: 200 → 1,210",
    "Allergens: Lychee."
  ],
  "Brown Sugar Pearl Latte": [
    "Calories: 550 → 1,620",
    "Allergens: Milk, tapioca pearls (not a major allergen)."
  ],
  "Kyoto Uji Matcha Latte": [
    "Calories: 450 → 1,520",
    "Allergens: Milk."
  ],
  "Brown Sugar Pearl Matcha Latte": [
    "Calories: 600 → 1,670",
    "Allergens: Milk, tapioca pearls."
  ],
  "Red Bean Matcha Latte": [
    "Calories: 400 → 1,470",
    "Allergens: Milk, red bean (legume)."
  ],
  "Brown Sugar Pearl Coco Latte": [
    "Calories: 520 → 1,590",
    "Allergens: Milk, coconut (tree-nut category for some labels)."
  ],
  "Red Bean Purple Rice Coconut Latte": [
    "Calories: 480 → 1,550",
    "Allergens: Coconut (tree-nut for some), milk, red bean (legume)."
  ],
  "Grass Jelly Milk Tea": [
    "Calories: 380 → 1,450",
    "Allergens: Milk."
  ],
  "Winter Melon Tea": [
    "Calories: 100 → 1,130",
    "Allergens: Milk if milk is added."
  ],
  "Grass Tea": [
    "Calories: 40 → 1,050",
    "Allergens: None unless milk added."
  ],
  "Traditional Milk Tea": [
    "Calories: 450 → 1,520",
    "Allergens: Milk (creamer or dairy)."
  ],
  "Longan Ginger Tea": [
    "Calories: 120 → 1,130",
    "Allergens: Longan (fruit)."
  ],
  "Ginger Tea": [
    "Calories: 20 → 1,030",
    "Allergens: None major."
  ],
  "Pearl Ginger Milk Tea": [
    "Calories: 500 → 1,570",
    "Allergens: Milk, tapioca pearls."
  ],
    "Sugar Cane Mountain Tea": [
    "Calories: 90 → 1,120",
    "Allergens: None major."
  ],
  "Black Tea Latte": [
    "Calories: 350 → 1,420",
    "Allergens: Milk."
  ],
  "Fresh Taro Latte": [
    "Calories: 420 → 1,490",
    "Allergens: Milk, taro (root vegetable)."
  ],
  "Taro Milk Tea": [
    "Calories: 380 → 1,450",
    "Allergens: Milk, taro."
  ],
  "Matcha Milk Tea": [
    "Calories: 350 → 1,420",
    "Allergens: Milk."
  ],
  "Brown Sugar Milk Tea": [
    "Calories: 480 → 1,550",
    "Allergens: Milk."
  ],
  "Jasmine Milk Tea": [
    "Calories: 350 → 1,420",
    "Allergens: Milk."
  ],
  "Earl Grey Milk Tea": [
    "Calories: 360 → 1,430",
    "Allergens: Milk, bergamot (citrus-derived aroma)."
  ],
  "Mango Pomelo Sago": [
    "Calories: 420 → 1,490",
    "Allergens: Mango, coconut milk (tree-nut category for some), pomelo (citrus)."
  ],
  "Almond Milk Grass Jelly": [
    "Calories: 200 → 1,270",
    "Allergens: Almond (major allergen)."
  ],
  "Strawberry Smoothie": [
    "Calories: 320 → 1,390",
    "Allergens: Strawberry."
  ],
  "Yakult Mountain Tea": [
    "Calories: 180 → 1,250",
    "Allergens: Milk (Yakult contains skim milk)."
  ],
  "Yakult Passion Fruit Green Tea": [
    "Calories: 200 → 1,270",
    "Allergens: Milk (Yakult), passion fruit."
  ],
  "Vietnamese Coffee": [
    "Calories: 220 → 1,290",
    "Allergens: Milk (condensed milk)."
  ],
  "Brew": [
    "Calories: 5 → 1,020",
    "Allergens: None major."
  ],
  "Chocolate Cream Brew": [
    "Calories: 250 → 1,320",
    "Allergens: Milk, cocoa (possible trace allergens)."
  ]
};


const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const drinkToDesc = {};
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
            const firstSentence = data.extract.split(/(?<=[.!?])\s+/).slice(0, 1).join(' ');
            let fullDesc = firstSentence;
            if (nutritionMap[drink]) {
                fullDesc += `\n${nutritionMap[drink][0]}\n${nutritionMap[drink][1]}`;
            }
            drinkToDesc[drink] = fullDesc;
        } catch (err) {
            console.error(`Error fetching ${drink}:`, err);
        }
    }

    res.json(drinkToDesc);
});

module.exports = router;
