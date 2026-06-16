let coins = 2500;
let inventory = [];

const products = [
{
    id:1,
    name:"Dragon Knife",
    price:1200,
    rarity:"Legendary",
    image:"images/knife.jpg"
},
{
    id:2,
    name:"Neon AK-47",
    price:900,
    rarity:"Epic",
    image:"images/ak47.jpg"
},
{
    id:3,
    name:"Golden Sniper",
    price:700,
    rarity:"Rare",
    image:"images/sniper.jpg"
},
{
    id:4,
    name:"Basic Pistol",
    price:300,
    rarity:"Common",
    image:"images/pistol.jpg"
}
];

function generateDiscounts() {

    products.forEach(product => {

        const chance = Math.random();

        if(chance > 0.7){

            const discount = [10,25,50][
                Math.floor(Math.random()*3)
            ];

            product.discount = discount;

        }

    });

}

generateDiscounts();

function renderProducts(list = products){

    const container =
    document.getElementById("products");

    container.innerHTML = "";

    list.forEach(product => {

        const finalPrice = product.discount
        ? Math.floor(
            product.price *
            (1-product.discount/100)
        )
        : product.price;

        container.innerHTML += `
        <div class="card">

            <img src="${product.image}">

            <h3>${product.name}</h3>

            <div class="rarity ${product.rarity.toLowerCase()}">
                ${product.rarity}
            </div>

            <div class="price">

                ${
                product.discount
                ?
                `<span style="color:red">
                    -${product.discount}%
                 </span><br>
                 <del>${product.price}</del>
                 ${finalPrice}`
                :
                finalPrice
                }

                Coins

            </div>

            <button onclick="buyItem(${product.id})">
                BUY
            </button>

        </div>
        `;
    });
}

function buyItem(id){

    const product =
    products.find(p => p.id === id);

    const price = product.discount
    ? Math.floor(
        product.price *
        (1-product.discount/100)
      )
    : product.price;

    if(coins >= price){

        coins -= price;

        inventory.push(product.name);

        updateCoins();
        renderInventory();

        showToast(
            `✅ Bought ${product.name}`
        );

    }else{

        showToast(
            "❌ Not enough coins"
        );

    }

}

function updateCoins(){

    document.getElementById("coins")
    .textContent =
    `💰 Coins: ${coins}`;

}

function renderInventory(){

    const inventoryDiv =
    document.getElementById("inventory");

    inventoryDiv.innerHTML = "";

    inventory.forEach(item => {

        inventoryDiv.innerHTML += `
        <div class="inventory-item">
            ${item}
        </div>
        `;

    });

}

function showToast(message){

    const toast =
    document.getElementById("toast");

    toast.textContent = message;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    },2000);

}

document
.getElementById("lootBtn")
.addEventListener("click", () => {

    const randomItem =
    products[
        Math.floor(
            Math.random() *
            products.length
        )
    ];

    inventory.push(
        randomItem.name
    );

    renderInventory();

    showToast(
        `🎁 Loot Box: ${randomItem.name}`
    );

});

document
.getElementById("search")
.addEventListener("input", e => {

    const value =
    e.target.value.toLowerCase();

    const filtered =
    products.filter(product =>
        product.name
        .toLowerCase()
        .includes(value)
    );

    renderProducts(filtered);

});

renderProducts();
updateCoins();
renderInventory();