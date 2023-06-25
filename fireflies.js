var cw = 500;
var ch = 333;
canvas = document.getElementById('portrait');
ctx = canvas.getContext('2d');
var fattr;
var firefly = new Array();
var rint = 50;
var music = new Audio();
var img = new Image();
img.src = "https://archive.org/download/index-media-cover-art-play-button-overlay-5/index-media-cover-art-play-button-overlay-5.png";
music.src = "https://ia601505.us.archive.org/26/items/aeriths_theme/aeriths_theme.ogg";
img.onload = function(){
    ctx.drawImage(img,110,45,80,60);
}

canvas.addEventListener("click",function(){
    canvas.style.display = "none";
    canvas.style.backgroundImage = "url(https://archive.org/download/firefly_woods/firefly_woods.jpg)";
    play();
});

function play(){
    $(document).ready(function(){
        $("#portrait").css("maxWidth","500px");
        $("#portrait").height("333px");
        $("#portrait").fadeIn(2000);
        music.play();
        $(canvas).attr('width', cw).attr('height',ch);
        for(var i = 0; i < 50; i++) {
            firefly[i] = new Circle();
            firefly[i].reset();
        }
        setInterval(draw,rint);
        setTimeout(fadeOut,240000);
        function fadeOut(){
            $("#portrait").fadeOut(2000);
        }
    });
}

function draw() {
	ctx.clearRect(0,0,cw,ch);
	for(var i = 0; i < firefly.length; i++) {
		firefly[i].fade();
		firefly[i].move();
		firefly[i].draw();
	}
}

function Circle() {
	this.s = {ttl:8000, xmax:5, ymax:2, rmax:4, rt:1, xdef:960, ydef:540, xdrift:4, ydrift: 4, random:true, blink:true};
    
	this.reset = function() {
		this.x = (this.s.random ? cw*Math.random() : this.s.xdef);
		this.y = (this.s.random ? ch*Math.random() : this.s.ydef);
		this.r = ((this.s.rmax-1)*Math.random()) + 1;
		this.dx = (Math.random()*this.s.xmax) * (Math.random() < .5 ? -1 : 1);
		this.dy = (Math.random()*this.s.ymax) * (Math.random() < .5 ? -1 : 1);
		this.hl = (this.s.ttl/rint)*(this.r/this.s.rmax);
		this.rt = Math.random()*this.hl;
		this.s.rt = Math.random()+1;
		this.stop = Math.random()*.2+.4;
		this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
		this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
	}

	this.fade = function() {
		this.rt += this.s.rt;
	}

	this.draw = function() {
		if(this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) this.s.rt = this.s.rt*-1;
		else if(this.rt >= this.hl) this.reset();
		var newo = 1-(this.rt/this.hl);
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
		ctx.closePath();
		var cr = this.r*newo;
		fattr = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,(cr <= 0 ? 1 : cr));
		fattr.addColorStop(0.0, 'rgba(253,219,163,'+newo+')');
		fattr.addColorStop(this.stop, 'rgba(238,180,28,'+(newo*.2)+')');
		fattr.addColorStop(1.0, 'rgba(253,219,163,0)');
		ctx.fillStyle = fattr;
		ctx.fill();
	}

	this.move = function() {
		this.x += (this.rt/this.hl)*this.dx;
		this.y += (this.rt/this.hl)*this.dy;
		if(this.x > cw || this.x < 0) this.dx *= -1;
		if(this.y > ch || this.y < 0) this.dy *= -1;
	}

	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
}