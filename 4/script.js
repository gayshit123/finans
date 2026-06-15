let energy = 100;

let bossHealth = 200;
let maxBossHealth = 200;

function calculateDamage(cost){

    let damage = cost * 2;

    let criticalChance = Math.random();

    if(criticalChance < 0.25){

        damage *= 2;

        document.getElementById("status").innerHTML =
        "🔥 CRITICAL HIT!";
    }

    return damage;
}

function rechargeEnergy(){

    let status = document.getElementById("status");

    if(energy >= 100){

        status.innerHTML =
        "⚡ Energy is already full!";

        status.style.color = "cyan";

        return;
    }

    energy += 20;

    if(energy > 100){
        energy = 100;
    }

    document.getElementById("energyText")
    .textContent =
    energy + " / 100";

    document.getElementById("energyFill")
    .style.width =
    energy + "%";

    if(energy > 30){

        document.getElementById("energyFill")
        .style.background =
        "limegreen";
    }

    status.innerHTML =
    "🔋 Energy Recharged +20";

    status.style.color =
    "lime";
}

function usePower(name,cost,color){

    let status = document.getElementById("status");

    if(energy < cost){

        status.innerHTML =
        "❌ Not enough energy!";

        status.style.color = "red";

        return;
    }

    energy -= cost;

    let damage = calculateDamage(cost);

    bossHealth -= damage;

    if(bossHealth < 0){
        bossHealth = 0;
    }

    document.getElementById("energyText").textContent =
    energy + " / 100";

    document.getElementById("energyFill").style.width =
    energy + "%";

    document.getElementById("bossText").textContent =
    bossHealth + " / " + maxBossHealth + " HP";

    document.getElementById("bossHP").style.width =
    (bossHealth / maxBossHealth) * 100 + "%";

    status.innerHTML =
    `${name}<br>💥 Damage: ${damage}`;

    status.style.color = color;

    document.body.style.backgroundColor = color;

    document.querySelector(".container")
    .classList.add("power-effect");

    setTimeout(() => {

        document.querySelector(".container")
        .classList.remove("power-effect");

    },500);

    if(energy <= 30){

        document.getElementById("energyFill")
        .style.background = "orange";
    }

    if(energy <= 10){

        document.getElementById("energyFill")
        .style.background = "red";
    }

    if(energy === 0){

        status.innerHTML =
        "💀 HERO OUT OF ENERGY!";
    }

    if(bossHealth === 0){

        status.innerHTML =
        "🏆 DARK TITAN DEFEATED!";

        document.querySelector(".boss-box")
        .classList.add("boss-dead");

        document.getElementById("bossHP")
        .style.background =
        "gold";
    }
}