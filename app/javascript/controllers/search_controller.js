import {Controller} from "@hotwired/stimulus"
import $ from "jquery"

export default class extends Controller {
	connect() {
		let element = $('#search-bar');
		$('.bg-map').on("click scroll", function () {
			document.querySelector('.suggestion-list').style.display = "none";
		});
		element.on("focus", function(){
			if(document.querySelector('#search-bar').value !== ""){
				document.querySelector('.suggestion-list').style.display = "block";
			}
		});
		element.on("keydown", function(){
			document.querySelector('.suggestion-list').style.display = "none";
		});
	}
	
	
	find() {
		let value = document.querySelector('#search-bar').value;
		if (value === "") {
			document.querySelector('.suggestion-list').style.display = "none";
		} else {
			var element = document.querySelector('.suggestion-list');
			element.innerHTML = "";
			$.ajax({
				type: "GET",
				url: `/map/search?query=${value}`,
				dataType: "json",
				success: function (result) {
					document.querySelector('.suggestion-list').style.display = "block";
					if (result.length === 0) {
						element.innerHTML = "<li>No results found</li>";
					} else {
						for (let building of result) {
							element.innerHTML += `<li data-action="click->hello#goto" data-hello-id-param="${building['id']}" ><div class="match"> ${building["match"]} </div><div class="building-place">${building["floor"]}, ${building["name"]}</div></li>`
						}
					}
				}
			});
		}
	}
}
