var best_strike = 0;

var today_strike = 0;
var shuffled_kanji_list = Object.keys(kanji).sort(() => 0.5 - Math.random());

var kanji_scroll_title_left;
var kanji_scroll_frecuency_left;

var kanji_scroll_title_right;
var kanji_scroll_frecuency_right;

var current_choosed_side = -1; // -1 = none, 0 = left, 1 = right

document.addEventListener("DOMContentLoaded", (event) => {
    // Remove kanjis without frequency data
    for (var i = 0; i < shuffled_kanji_list.length; i++) {
        if (kanji[shuffled_kanji_list[i]].freq == undefined) {
            shuffled_kanji_list.splice(i, 1);
            i--;
        }
    }

    document.getElementById("total_kanji").innerHTML = shuffled_kanji_list.length;
    best_strike = localStorage.getItem("best_strike");
    best_strike = best_strike == null ? 0 : best_strike;
    document.getElementById("best_strike").innerHTML = best_strike;

    kanji_scroll_title_left = document.getElementById("kanji_scroll_title_left");
    kanji_scroll_frecuency_left = document.getElementById("kanji_scroll_frecuency_left");

    kanji_scroll_title_right = document.getElementById("kanji_scroll_title_right");
    kanji_scroll_frecuency_right = document.getElementById("kanji_scroll_frecuency_right");

    printKanjis();
});

window.addEventListener('beforeunload', (event) => {
    saveUserData();
});

function printKanjis() {
    // Print left kanji
    kanji_scroll_title_left.innerHTML = shuffled_kanji_list[0];
    kanji_scroll_frecuency_left.innerHTML = kanji[shuffled_kanji_list[0]].freq;

    // Print right kanji
    kanji_scroll_title_right.innerHTML = shuffled_kanji_list[1];
    kanji_scroll_frecuency_right.innerHTML = "?";
}

// 0 = left, 1 = right
function chooseKanji(choosed_side) {
    current_choosed_side = choosed_side;

    // Choosed left
    if (current_choosed_side == 0 && kanji[shuffled_kanji_list[0]].freq < kanji[shuffled_kanji_list[1]].freq) {

        // Update strikes
        today_strike++;
        document.getElementById("today_strike").innerHTML = today_strike;
        document.getElementById("best_strike").innerHTML = Math.max(best_strike, today_strike);

        // Reveal frequencies
        kanji_scroll_frecuency_right.innerHTML = kanji[shuffled_kanji_list[1]].freq;

        // Remove second kanji in list (right kanji)
        shuffled_kanji_list.splice(1, 1);

        waitForNextKanji();
    }
    // Choosed right
    else if (current_choosed_side == 1 && kanji[shuffled_kanji_list[1]].freq < kanji[shuffled_kanji_list[0]].freq) {

        // Update strikes
        today_strike++;
        document.getElementById("today_strike").innerHTML = today_strike;
        document.getElementById("best_strike").innerHTML = Math.max(best_strike, today_strike);

        // Reveal frequencies
        kanji_scroll_frecuency_right.innerHTML = kanji[shuffled_kanji_list[1]].freq;

        // Remove first kanji in list (left kanji)
        shuffled_kanji_list.splice(0, 1);

        waitForNextKanji();
    } else {

        document.getElementById("next_button").classList.add("hidden");
        document.getElementById("left_button").disabled = true;
        document.getElementById("right_button").disabled = true;

        document.getElementById("restart_button").classList.remove("hidden");

        // Reveal frequencies
        kanji_scroll_frecuency_right.innerHTML = kanji[shuffled_kanji_list[1]].freq;
    }
}

function waitForNextKanji() {
    document.getElementById("next_button").disabled = false;
    document.getElementById("left_button").disabled = true;
    document.getElementById("right_button").disabled = true;
}

function nextKanji() {
    printKanjis();

    document.getElementById("next_button").disabled = true;
    document.getElementById("left_button").disabled = false;
    document.getElementById("right_button").disabled = false;
}

function saveUserData() {
    localStorage.setItem("best_strike", Math.max(best_strike, today_strike));
}

function restart() {
    best_strike = Math.max(best_strike, today_strike);

    saveUserData();

    window.location.reload();
}