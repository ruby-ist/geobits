import {Controller} from "@hotwired/stimulus"
import $ from "jquery"
import Hammer from "hammerjs"

export default class extends Controller {
	static values = { level: Number, top: Number, left: Number, pinned: Boolean};
	zoomlevel = this.levelValue;
	floors = [];
	
	initialize(){
		setTimeout(() => {
			$('.instruction').css({
				"opacity": "0",
				"visibility": "hidden",
				"transition": "visibility 0s 7s, opacity 7s linear"
			})
		}, 8000);
		setTimeout(()=>{
			$('.instruction').css({
				"display": "none"
			})
		}, 8500);
	}
	
	connect() {
		this.setZoom(this.levelValue);
		document.querySelector('.bg-map').scrollTop = this.topValue  - screen.height / 2 + 150;
		document.querySelector('.bg-map').scrollLeft = this.leftValue - screen.width / 2;
		let pin = $('#pin');
		if(this.pinnedValue){
			pin.css({
				"left": `${this.leftValue - 16}px`,
				"top": `${this.topValue - 36}px`,
			});
			pin.show();
		}
		else {
			pin.hide();
		}
		document.addEventListener('mousemove', (event) => {
			const {
				clientX,
				clientY
			} = event
			console.log(document.querySelector('.bg-map').scrollTop + clientY - 20, document.querySelector('.bg-map').scrollLeft + clientX - 20);
		});
		
		let that = this;
		let maps = document.querySelectorAll('.bg-map .the-map');
		let newlevel = 4;
		for (let map of maps) {
			let hammertime = new Hammer(map, {touchAction: "auto"});
			// hammertime.get('pinch').set({ enable: true });
			//
			// let pinchstarted = false;
			// hammertime.on('pinchin pinchmove pinchend', (ev) => {
			// 	if (ev.type === 'pinchmove' && !pinchstarted) {
			// 		pinchstarted = true;
			// 		if(ev.additionalEvent === "pinchin")
			// 			console.log(ev);
			// 		if(ev.additionalEvent === "pinchout")
			// 			console.log(ev.scale);
			// 		setTimeout(()=>{
			// 			pinchstarted = false;
			// 		}, 2500);
			// 	}
			// });
			
			hammertime.on("doubletap", function () {
				if (that.zoomlevel === 4) {
					if((map.width / 3.375 > screen.width) && (map.height / 3.375 > screen.height)) {
						newlevel = 1;
					}
					else if((map.width / 2.25 > screen.width) && (map.height / 2.25 > screen.height)){
						newlevel = 2;
					}
					else if((map.width / 1.5 > screen.width) && (map.height / 1.5 > screen.height)){
						newlevel = 3;
					}
					else{
						return;
					}
					that.setZoom(newlevel);
					let element = $('#pin');
					if(element[0].style.display !== "none") {
						element.css({
							"left": `${parseInt(element[0].style.left.slice(0, -2)) / 3.375}px`,
							"top": `${parseInt(element[0].style.top.slice(0, -2)) / 3.375}px`
						});
					}
				} else {
					that.zoomin();
				}
			});
			hammertime.get('press').set({ time: 1000 } );
			hammertime.on("press", function(event){
				let X = event.srcEvent.offsetX;
				let Y = event.srcEvent.offsetY;
				let element = $('#pin');
				let urlBox = $('.url-box');
				let url = $('.pin-url');
				url[0].value = `https://geobits.herokuapp.com?pin=true&level=${that.zoomlevel}&left=${X}&top=${Y}`;
				element.css({
					"left": `${X - 16}px`,
					"top": `${Y - 36}px`,
				});
				element.show();
				urlBox.css({
					"left": `${X}px`,
					"top": `${Y + 2}px`,
					"transform": "translateX(-50%)"
				});
				urlBox.show();
				$(".copy-btn")[0].innerHTML = "Copy";
			});
			
			hammertime.on('tap', function (){
				$('#pin').hide();
				$('.url-box').hide();
			});
			
			let isDown = false;
			let startX;
			let scrollLeft;
			map.addEventListener('mousedown', (e) => {
				isDown = true;
				startX = e.pageX - document.querySelector('.bg-map').offsetLeft;
				scrollLeft = document.querySelector('.bg-map').scrollLeft;
			});
			map.addEventListener('mouseleave', () => {
				isDown = false;
			});
			map.addEventListener('mouseup', () => {
				isDown = false;
			});
			map.addEventListener('mousemove', (e) => {
				if(!isDown) return;
				e.preventDefault();
				const x = e.pageX - document.querySelector('.bg-map').offsetLeft;
				const walk = (x - startX); //scroll-fast
				document.querySelector('.bg-map').scrollLeft = scrollLeft - walk;
			});
		}
		
		let details = document.querySelector('.place-details');
		let hammertime = new Hammer(details);
		hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		hammertime.on("swipedown", function(){
			that.hide();
		});
	}
	
	close(){
		$('.instruction').hide();
	}
	
	setZoom(level){
		let height = 3876;
		let width = 3420;
		let i = 4;
		while(i > level){
			height /= 1.5;
			width /= 1.5;
			i -= 1;
		}
		let elements = document.querySelectorAll(".bg-map .the-map");
		for (let element of elements) {
			element.height = height;
			element.width = width;
		}
		this.zoomlevel = level;
		this.setTags(level);
		this.setLegends(level);
	}
	
	setTags(num) {
		let element = document.querySelector(".tags");
		element.innerHTML = "";
		$.ajax({
			type: "GET",
			url: `/map/tags/${num}`,
			dataType: "json",
			success: function (result) {
				let tags = result["tags"];
				for (let tag of tags) {
					element.innerHTML += `<div class='tag' data-action='click->hello#display' id='${tag["id"]}' style='top: ${tag["top"]} ; left: ${tag["left"]};'> ${tag["name"]} </div>`;
				}
			}
		});
	}
	
	setLegends(num){
		let element = document.querySelector(".legends");
		element.innerHTML = "";
		$.ajax({
			type: "GET",
			url: `/map/legends/${num}`,
			dataType: "json",
			success: function (result) {
				for(let legend of result){
					element.innerHTML += `<img src=${legend["link"]} class='legend' id='${legend["id"]}' style='top: ${legend["top"]} ; left: ${legend["left"]};' alt="legend" loading="lazy">`;
				}
			}
		});
	}
	
	mycallback(result) {
		$('.place-title')[0].innerHTML = result["name"];
		$('.place-main')[0].innerHTML = result["main"];
		this.floors = result["floors"];
		let element1 = $('.floors')[0];
		let element2 = $('.classes');
		element1.innerHTML = `<div class="underline"></div>`;
		for (let element of element2) {
			element.innerHTML = "";
		}
		let num = 0;
		for (let floor of this.floors) {
			element1.innerHTML += `<div class="floor" data-action="click->hello#slide" data-hello-num-param=${num} >${floor["name"]}</div>`;
			num += 1;
		}
		num = 0;
		for (let floor of this.floors) {
			for (let room of floor["rooms"]) {
				element2[num].innerHTML += `<li>${room}</li>`;
			}
			num += 1;
		}
		if($('.classes.visible')[0] !== undefined) {
			$('.classes.visible')[0].classList.remove('visible');
		}
		element2[0].classList.add('visible');
		$('.floor')[0].classList.add('active');
	}
	
	display() {
		$('.place-details').css({
			"visibility": "visible",
			"height": "40vh"
		});
		$('.get-down-btn').css({
			"visibility": "visible",
			"bottom": "42vh"
		});
		$('.layer-button, .zoom-buttons').css({
			"bottom": "42vh"
		});
		
		$.ajax({
			type: "GET",
			url: `map/details/${event.target.id}?level=${this.zoomlevel}`,
			dataType: "json",
			success: this.mycallback
		})
	}
	
	slide(event) {
		let id = parseInt(event.params["num"]);
		$('.underline').css("transform", `translateX(${id * 100}px)`);
		$('.floors')[0].scrollLeft = id * 100;
		$('.classes.visible')[0].classList.remove('visible');
		$('.floor.active')[0].classList.remove('active');
		$('.classes')[id].classList.add('visible');
		$('.floor')[id].classList.add('active');
	}
	
	hide() {
		$('.place-details').css({
			"visibility": "hidden",
			"height": "0px",
		});
		$('.get-down-btn').css({
			"visibility": "hidden",
			"bottom": "0px"
		});
		$('.layer-button, .zoom-buttons').css({
			"bottom": "40px"
		});
		$('.classes.visible')[0].classList.remove('visible');
		$('.floor.active')[0].classList.remove('active');
		$('#pin').hide();
		globalThis.floors = [];
		$('.place-title')[0].innerHTML = "";
		$('.place-main')[0].innerHTML = "";
		$('.floors')[0].innerHTML = `<div class="underline"></div>`;
		$('.classes')[0].innerHTML = "";
	}
	
	zoomin() {
		let elements = document.querySelectorAll(".bg-map .the-map");
		let flag = 0;
		for (let element of elements) {
			if (element.height < 3800 && element.width < 3400) {
				flag = 1;
				element.width *= 1.5;
				element.height *= 1.5;
			}
		}
		if (flag === 1) {
			let element = $('#pin');
			if(element[0].style.display !== "none") {
				element.css({
					"left": `${parseInt(element[0].style.left.slice(0, -2)) * 1.5}px`,
					"top": `${parseInt(element[0].style.top.slice(0, -2)) * 1.5}px`
				});
			}
			document.querySelector('.bg-map').scrollTop *= 1.5;
			document.querySelector('.bg-map').scrollLeft *= 1.5;
			this.zoomlevel += 1;
			setTimeout(() => {
				this.setTags(this.zoomlevel);
				this.setLegends(this.zoomlevel);
			}, 1000);
			
		}
	}
	
	zoomout() {
		let elements = document.querySelectorAll(".bg-map .the-map");
		if((elements[0].width / 1.5 < screen.width) || (elements[0].height / 1.5 < screen.height))
			return;
		let flag = 0;
		for (let element of elements) {
			if (element.height > 1148.4444444444446 && element.width > 1013.3333333333334) {
				flag = 1;
				element.width /= 1.5;
				element.height /= 1.5;
			}
		}
		if (flag === 1) {
			let element = $('#pin');
			if(element[0].style.display !== "none") {
				element.css({
					"left": `${parseInt(element[0].style.left.slice(0, -2)) / 1.5}px`,
					"top": `${parseInt(element[0].style.top.slice(0, -2)) / 1.5}px`
				});
			}
			document.querySelector('.bg-map').scrollTop /= 1.5;
			document.querySelector('.bg-map').scrollLeft /= 1.5;
			this.zoomlevel -= 1;
			setTimeout(() => {
				this.setTags(this.zoomlevel);
				this.setLegends(this.zoomlevel);
			}, 1000);
		}
	}
	
	layer() {
		$('.bg-map .the-map').toggle();
		$('.layer-button span').toggle();
	}
	
	goto(event) {
		this.setZoom(4);
		let id = event.params["id"];
		$.ajax({
			type: "GET",
			url: `/map/location/${id}`,
			dataType: "json",
			success: function (result) {
				document.querySelector('.suggestion-list').style.display = "none";
				document.querySelector('.bg-map').scrollTop = parseInt(result["top"].slice(0, -2)) - screen.height / 2 + 150;
				document.querySelector('.bg-map').scrollLeft = parseInt(result["left"].slice(0, -2)) - screen.width / 2;
				let element = $('#pin');
				element.show();
				element.css({
					"left": `${result["left"].slice(0,-2) -32}px`,
					"top": result["top"]
				});
				setTimeout(() => $(`#${id}`).click(), 1000);
			}
		});
	}
}
