import {Controller} from "@hotwired/stimulus"
import $ from "jquery"


export default class extends Controller {
	static targets = [ "url" ];
	
	copy(){
		navigator.clipboard.writeText(this.urlTarget.value).then(r => {});
		$(".copy-btn")[0].innerHTML = "Copied!";
	}
}