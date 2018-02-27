var modal = document.getElementById('simpleModal');
var modalContent = document.getElementsByClassName('modal-content')[0];
var svg = document.getElementsByClassName('svgMap')[0];

var startSound = new Audio('sound/christmas-spirit.mp3');
var winSound = new Audio('sound/taDa.mp3');
var failSound = new Audio('sound/failSound.mp3');

/*Loops through all elements with same class and prompts function if mouseover*/
var map = document.getElementsByClassName('cls-1');

for (var i = 0; i < map.length; i++){
    var item = map[i];
    item.addEventListener('mouseover', openModalLose);
}

/*When button is clicked reloads the current page*/
var playAgainBtn = document.getElementById('playAgainBtn');
var quitBtn = document.getElementById('quitBtn');

playAgainBtn.addEventListener('click', closeModal);
quitBtn.addEventListener('click', closeModal);


/*Open modal function if cursor touches SVG*/
function openModalLose(){
    modalContent.style.background = 'red';
    document.getElementById('winOrLose').innerHTML = "YOU LOSE";
    document.getElementById('SadGinger').src="images/gingerbread-sad.png";
    document.getElementById("SadGinger").style.display = 'block';
    document.getElementById("HappyGinger").style.display = 'none';
    modal.style.display = 'flex';
    svg.style.animationPlayState = "paused";

    startSound.pause();
    failSound.play();
}

/*Close modal function*/
function closeModal() {
    modal.style.display = 'none';
    location.reload();
}
/*Check for animation end and executes openModalWin function*/
svg.addEventListener('webkitAnimationEnd', openModalWin);

/*Opens modal function when css animation ends*/
function openModalWin() {
    modalContent.style.background = 'green';
    document.getElementById('winOrLose').innerHTML = "YOU WIN";
    document.getElementById('SadGinger').src="images/happygingerbread_man";
    document.getElementById("SadGinger").style.display = 'none';
    document.getElementById("HappyGinger").style.display = 'block';
    modal.style.display = 'flex';

    startSound.pause();
    winSound.play();
}

/*Snowflakes*/
var Snowflake = (function() {

    var flakes;
    var flakesTotal = 250;
    var wind = 0;
    var mouseX;
    var mouseY;

    function Snowflake(size, x, y, vx, vy) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.hit = false;
        this.melt = false;
        this.div = document.createElement('div');
        this.div.classList.add('snowflake');
        this.div.style.width = this.size + 'px';
        this.div.style.height = this.size + 'px';
    }

    Snowflake.prototype.move = function() {
        if (this.hit) {
            if (Math.random() > 0.995) this.melt = true;
        } else {
            this.x += this.vx + Math.min(Math.max(wind, -10), 10);
            this.y += this.vy;
        }

        /*Wrap the snowflake to within the bounds of the page*/
        if (this.x > window.innerWidth + this.size) {
            this.x -= window.innerWidth + this.size;
        }

        if (this.x < -this.size) {
            this.x += window.innerWidth + this.size;
        }

        if (this.y > window.innerHeight + this.size) {
            this.x = Math.random() * window.innerWidth;
            this.y -= window.innerHeight + this.size * 2;
            this.melt = false;
        }

        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        this.hit = !this.melt && this.y < mouseY && dx * dx + dy * dy < 2400;
    };

    Snowflake.prototype.draw = function() {
        this.div.style.transform =
            this.div.style.MozTransform =
                this.div.style.webkitTransform =
                    'translate3d(' + this.x + 'px' + ',' + this.y + 'px,0)';
    };

    function update() {
        for (var i = flakes.length; i--; ) {
            var flake = flakes[i];
            flake.move();
            flake.draw();
        }
        requestAnimationFrame(update);
    }

    Snowflake.init = function(container) {
        flakes = [];

        for (var i = flakesTotal; i--; ) {
            var size = (Math.random() + 0.2) * 12 + 1;
            var flake = new Snowflake(
                size,
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                Math.random() - 0.5,
                size * 0.3
            );
            container.appendChild(flake.div);
            flakes.push(flake);
        }

        container.onmousemove = function(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
            wind = (mouseX - window.innerWidth / 2) / window.innerWidth * 6;
        };

        container.ontouchstart = function(event) {
            mouseX = event.targetTouches[0].clientX;
            mouseY = event.targetTouches[0].clientY;
            event.preventDefault();
        };

        window.ondeviceorientation = function(event) {
            if (event) {
                wind = event.gamma / 10;
            }
        };

        update();
    };

    return Snowflake;

}());

window.onload = function() {
    setTimeout(function() {
        Snowflake.init(document.getElementById('snow'));
    }, 500);
};

document.getElementById('countDown').addEventListener('click', startGame);

function delay(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, ms);
    });
}

function startGame() {
    var count = 3;
    function counter() {
        if (count > 0) {
            document.getElementById('countDown').innerHTML = count;
            count--;
            setTimeout(counter, 1000);
        }
        else {
            svg.style.animationPlayState = "running";
            document.getElementById('countDown').style.display = 'none';
            document.getElementById('startOverlay').style.display ='none';

            startSound.play();
        }
    }
    counter();
}
