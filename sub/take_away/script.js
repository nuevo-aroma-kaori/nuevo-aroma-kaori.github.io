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