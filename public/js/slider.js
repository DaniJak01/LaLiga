const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const slider = document.querySelector("#slider");
const slide = document.querySelectorAll(".slide");

btnLeft.addEventListener("click", e => moveToLeft());
btnRight.addEventListener("click", e => moveToRight());

setInterval(() => {
    moveToRight();
}, 7000)

let calc = 0;
let counter = 0;
let widthImg = 100 / slide.length;

function moveToRight() {
    if(counter >= slide.length - 1){
        counter = 0;
        calc = 0;
        slider.style.transform = `translate(-${calc}%)`
        slider.style.transition = "none";
    } else{
        counter ++;
        calc = calc + widthImg;
        slider.style.transform = `translate(-${calc}%)`
        slider.style.transition = "all ease .6s"
    }
}

function moveToLeft() {
    counter --;
    if(counter < 0){
        counter = slide.length - 1;;
        calc = widthImg * (slide.length - 1);
        slider.style.transform = `translate(-${calc}%)`
        slider.style.transition = "none";
    } else{
        calc = calc - widthImg;
        slider.style.transform = `translate(-${calc}%)`
        slider.style.transition = "all ease .6s"
    }
}
