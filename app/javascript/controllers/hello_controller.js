import {Controller} from "@hotwired/stimulus"
import $ from "jquery"

export default class extends Controller {
	zoomlevel = 4;
	connect() {
		document.querySelector('.bg-map').scrollTop = 1100;
		document.querySelector('.bg-map').scrollLeft = 1600;
	}
	
	setTags(num){
		let element = document.querySelector(".tags");
		element.innerHTML = "";
		$.ajax({
			type:"GET",
			url:`/map/tags/${num}`,
			dataType:"json",
			success: function(result){
				let tags = result["tags"];
				for(let tag of tags){
					element.innerHTML += `<div class='tag' id='${tag["id"]}' style='top: ${tag["top"]} ; left: ${tag["left"]};'> ${tag["name"]} </div>`;
				}
			}
		});
	}
	
	zoomin(){
		let elements  = document.querySelectorAll(".bg-map img");
		let flag = 0;
		for (let element of elements) {
			if (element.width < 3876 && element.height < 3420) {
				flag = 1;
				element.width *= 1.5;
				element.height *= 1.5;
			}
		}
		if(flag === 1){
			this.zoomlevel += 1;
			this.setTags(this.zoomlevel);
		}
	}
	
	zoomout(){
		let elements = document.querySelectorAll(".bg-map img");
		let flag = 0;
		for (let element of elements) {
			if (element.width > 1148.4444444444446 && element.height > 1013.3333333333334) {
				flag = 1;
				element.width /= 1.5;
				element.height /= 1.5;
			}
		}
		if(flag === 1){
			this.zoomlevel -= 1;
			this.setTags(this.zoomlevel);
		}
	}
	
	layer(){
		$('.bg-map img').toggle();
		$('.layer-button span').toggle();
	}
}
