function cover_bg_fade() {
	var elem = document.getElementById("coverbg");
	const animationTrigger = 260;
	var scrollYOffset = window.pageYOffset | window.scrollY;

	if (scrollYOffset <= animationTrigger)
		elem.style.background = "rgba(255, 240, 240, " + (scrollYOffset / animationTrigger).toString() + ")";
	else
		elem.style.background = "rgba(255, 240, 240, 1)";
}

/* opening : bool */
function page_menu_FX(opening) {
	var main_elem = document.getElementById("nav_menu");
	var container_elem = document.getElementById("nav_menu_cnt");
	

	if (opening) {
		main_elem.style.width = "100%";
		main_elem.style.height = "100%";
		main_elem.style.borderRadius = "0% 0% 0% 0%";

		setTimeout(function() { container_elem.style.opacity = "1"; }, 200);
	} else {
		main_elem.style.width = "0.001%";
		main_elem.style.height = "0.001%";
		main_elem.style.borderRadius = "0% 0% 100% 0%";

		container_elem.style.opacity = "0";
	}
}

function news_viewer_controller() {
	var windowHeight = window.innerHeight;
	var viewer_bar_elem_height = 64;
	var viewer_iframe_elem = document.getElementById("news_viewer_iframe");

	viewer_iframe_elem.style.height = (windowHeight - viewer_bar_elem_height).toString() + "px";
}


/* opening : bool */
function news_viewer_animation(opening) {
	var elem = document.getElementById("news_viewer");

	if (opening) {
		elem.style.top = "0%";
	} else {
		elem.style.top = "125%";
	}
}

/* state : bool */
function set_viewer_state(state) {
	if (state) {
		window.aroma_kaori_viewer_handle = setInterval(news_viewer_controller, 10);
		news_viewer_animation(true);
	} else {
		news_viewer_animation(false);
		clearInterval(window.aroma_kaori_viewer_handle);
	}
}

function new_page(url) {
	window.open(url, '_blank').focus();
}



setInterval(cover_bg_fade, 1);