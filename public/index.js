const track = document.querySelector(".carousel-track");

let position = 0;

function moverCarousel(){

position += 270;

if(position > track.scrollWidth - 800){
position = 0;
}

track.style.transform = `translateX(-${position}px)`;

}

setInterval(moverCarousel, 8000);
