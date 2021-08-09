function keep_main_part_design() {
	var window_height = window.innerHeight;
	var elem = document.getElementById("main_part");
	var nav_bar_height = 80;

	elem.style.height = (window_height - nav_bar_height).toString() + "px";

	var dish_desc_window_elem = document.getElementById("dish_description_floating_window");
	dish_desc_window_elem.style.height = (window_height - nav_bar_height).toString() + "px";

	var dish_desc_window_center_elem = document.getElementById("dish_description_floating_window_container");
	dish_desc_window_center_elem.style.marginTop = ((window_height - nav_bar_height) / 100 * 10).toString() + "px";
	dish_desc_window_center_elem.style.height = ((window_height - nav_bar_height) / 100 * 80).toString() + "px";
}

setInterval(keep_main_part_design, 50);

function change_section( sectionID, buttonID ) {
	var elem = document.getElementById("main_part");
	var btnElem = document.getElementById(buttonID);

	elem.style.left = "-80px";
	elem.style.opacity = "0";
	btnElem.style.transform = "translateX(80px)";

	setTimeout(function() {
		var elem = document.getElementById("main_part");
		var btnElem = document.getElementById(buttonID);

		elem.style.left = "80px";
		elem.scrollTop = 0;
		btnElem.style.transform = "translateX(0px)";

		var all_sections = document.getElementsByClassName("section");
		for (var i = 0; i < all_sections.length; ++i)
			all_sections[i].style.display = "none";
		document.getElementById(sectionID).style.display = "block";

		setTimeout(function() {
			var elem = document.getElementById("main_part");

			elem.style.left = "0px";
			elem.style.opacity = "1";
		}, 200);
	}, 200);
}

function change_section_forward( sectionID ) {
	var elem = document.getElementById("main_part");

	elem.style.left = "80px";
	elem.style.opacity = "0";

	setTimeout(function() {
		var elem = document.getElementById("main_part");
		elem.style.left = "-80px";

		var all_sections = document.getElementsByClassName("section");
		for (var i = 0; i < all_sections.length; ++i)
			all_sections[i].style.display = "none";
		document.getElementById(sectionID).style.display = "block";

		setTimeout(function() {
			var elem = document.getElementById("main_part");

			elem.style.left = "0px";
			elem.style.opacity = "1";
		}, 200);
	}, 200);
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