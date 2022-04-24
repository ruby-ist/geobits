import {Controller} from "@hotwired/stimulus"
import $ from "jquery"
import Hammer from "hammerjs"

export default class extends Controller {
	zoomlevel = 4;
	floors = [];
	rand = 0;
	
	connect() {
		document.querySelector('.bg-map').scrollTop = 1100;
		document.querySelector('.bg-map').scrollLeft = 1600;
		this.setTags(4);
		this.setLegends(4);
		
		document.addEventListener('mousemove', (event) => {
			const {
				clientX,
				clientY
			} = event
			console.log(document.querySelector('.bg-map').scrollTop + clientY - 20, document.querySelector('.bg-map').scrollLeft + clientX - 20);
		});
		
		let that = this;
		let maps = document.querySelectorAll('.bg-map .the-map');
		for (let map of maps) {
			let hammertime = new Hammer(map, {touchAction: "auto"});
			hammertime.on("doubletap", function () {
				if (that.zoomlevel === 4) {
					let elements = document.querySelectorAll(".bg-map .the-map");
					for (let element of elements) {
						element.height = 1148.4444444444446;
						element.width = 1013.3333333333334;
					}
					that.zoomlevel = 1;
					that.setTags(1);
					that.setLegends(1);
				} else {
					that.zoomin();
				}
			});
		}
		
		let details = document.querySelector('.place-details');
		let hammertime = new Hammer(details);
		hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		hammertime.on("swipedown", function(){
			that.hide();
		});
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
					element.innerHTML += `<img src=${legend["link"]} class='legend' id='${legend["id"]}' style='top: ${legend["top"]} ; left: ${legend["left"]};'>`;
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
		
		$.ajax({
			type: "GET",
			url: `map/details/${event.target.id}`,
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
		$('.classes.visible')[0].classList.remove('visible');
		$('.floor.active')[0].classList.remove('active');
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
			this.zoomlevel += 1;
			this.setTags(this.zoomlevel);
			this.setLegends(this.zoomlevel);
		}
	}
	
	zoomout() {
		let elements = document.querySelectorAll(".bg-map .the-map");
		let flag = 0;
		for (let element of elements) {
			if (element.height > 1148.4444444444446 && element.width > 1013.3333333333334) {
				flag = 1;
				element.width /= 1.5;
				element.height /= 1.5;
			}
		}
		if (flag === 1) {
			this.zoomlevel -= 1;
			this.setTags(this.zoomlevel);
			this.setLegends(this.zoomlevel);
		}
	}
	
	layer() {
		$('.bg-map .the-map').toggle();
		$('.layer-button span').toggle();
	}
	
	goto(event) {
		let elements = document.querySelectorAll(".bg-map .the-map");
		for (let element of elements) {
			element.height = 3876;
			element.width = 3420;
		}
		this.zoomlevel = 4;
		this.setTags(4);
		this.setLegends(4);
		let id = event.params["id"];
		$.ajax({
			type: "GET",
			url: `/map/location/${id}`,
			dataType: "json",
			success: function (result) {
				document.querySelector('.suggestion-list').style.display = "none";
				document.querySelector('.bg-map').scrollTop = parseInt(result["top"].slice(0, -2)) - screen.height / 2 + 150;
				document.querySelector('.bg-map').scrollLeft = parseInt(result["left"].slice(0, -2)) - screen.width / 2;
				$(`#${id}`).click();
			}
		});
	}
}
