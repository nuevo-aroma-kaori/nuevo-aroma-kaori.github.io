window.onload = function() {
	request_necessary_information();
};

var all_dish_info = null;

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

function page_change_to(pageIndex) {
	var elems = document.getElementsByClassName("selection_table_elem");
	var elems_fixed = document.getElementsByClassName("selection_table_elem_f");
	
	for (var i = 0; i < elems.length; ++i) {
		elems[i].setAttribute("class", "selection_table_elem");
		elems_fixed[i].setAttribute("class", "selection_table_elem_f");
	}

	elems[pageIndex].setAttribute("class", "selection_table_elem chosen");
	elems_fixed[pageIndex].setAttribute("class", "selection_table_elem_f chosen");
}

/* The JQuery HttpsRequest sends the request when
   the window.onload, which it doesn't wait until
   the user triggers sth.
*/
function request_necessary_information() {
	$.get(
		"https://nuevoaromakaori.com/database/dish_info_min.json",
		function (callback, status) {
			if (status != "success") {
				alert("Estado inesperado de respuesta: '" + status + "'. Recargue la página o contacte con el administrador.").
				return;
			}

			all_dish_info = callback;
			document.getElementById("loading_information").style.display = "none";

			show_dishes();
		}
	);
}

function show_dishes() {
	const all_dishes_quantity = all_dish_info.dish_info.all_dishes.length;

	var table_element = document.getElementById("main_all_dishes_table");
	table_element.innerHTML = "";

	for (var proc_index = 0; proc_index < all_dishes_quantity; ) {
		var new_tr_elem = document.createElement("tr");

		for (var proc_limit_count = 0; proc_limit_count < 2; ++proc_limit_count, ++proc_index) {
			var elem = create_dish_cnt_element_dishes(proc_index);

			/* APPEAR */
			new_tr_elem.appendChild(elem);
		}

		table_element.appendChild(new_tr_elem);
	}
}

function create_dish_cnt_element_dishes(proc_index) {
	const allergen_array = all_dish_info.dish_info.all_dishes[proc_index].allergen;
	var allergic_for_user = false;

	var elem_td_container = document.createElement("td");
	elem_td_container.setAttribute("id", "main_all_dishes_dish_" + proc_index.toString());
	elem_td_container.style.width = (100.0 / 2).toString() + "%";

	var elem_div_everything_container = document.createElement("div");
	elem_div_everything_container.setAttribute("class", "main_all_dishes_dish_container");

	/*
	for (var i_allergen_list = 0; i_allergen_list < allergen.length; ++i_allergen_list) {
		if (allergen_array.indexOf(allergen[i_allergen_list]) != -1) {
			allergic_for_user = true;
			break;
		}
	}

	if (allergic_for_user) {
		elem_div_everything_container.style.background = "rgb(58, 8, 8)";
		elem_div_everything_container.style.border = "1px solid #D51B19";
	}*/

	var elem_preview_image = document.createElement("img");
	elem_preview_image.setAttribute("class", "main_dish_image");
	elem_preview_image.setAttribute("src", "https://nuevoaromakaori.com/resources/dish_img/" + all_dish_info.dish_info.all_dishes[proc_index].number.toString() + ".png");

	var elem_dish_number = document.createElement("div");
	elem_dish_number.setAttribute("class", "main_dish_number");
	elem_dish_number.innerText = "n. " + all_dish_info.dish_info.all_dishes[proc_index].number.toString();

	var elem_dish_description = document.createElement("div");
	elem_dish_description.setAttribute("class", "main_dish_desc");

	var elem_dish_description_name = document.createElement("span");
	elem_dish_description_name.setAttribute("class", "main_dish_desc_title");
	elem_dish_description_name.innerText = all_dish_info.dish_info.all_dishes[proc_index].name.es;

	var elem_dish_options = document.createElement("div");
	elem_dish_options.setAttribute("class", "main_dish_options");

	var elem_dish_options_info = document.createElement("button");
	elem_dish_options_info.setAttribute("class", "main_dish_info");
	elem_dish_options_info.innerText = "¿Qué lo es?";
	elem_dish_options_info.setAttribute("onclick", "dish_description_floating_window_Show(" + proc_index.toString() + ");");

	/* APPEND CHILD */
	elem_dish_options.appendChild(elem_dish_options_info);

	elem_dish_description.appendChild(elem_dish_description_name);

	elem_div_everything_container.appendChild(elem_preview_image);
	elem_div_everything_container.appendChild(elem_dish_number);
	elem_div_everything_container.appendChild(elem_dish_description);
	elem_div_everything_container.appendChild(elem_dish_options);

	elem_td_container.appendChild(elem_div_everything_container);

	/* FINAL ELEMENT */
	return elem_td_container;
}

function selection_table_at_top() {
	var elem = document.getElementById("selection_table");

	var elem_rect = elem.getBoundingClientRect();
	if (elem_rect.y <= 80) {
		document.getElementById("selection_table_fixed").style.display = "block";
	} else {
		document.getElementById("selection_table_fixed").style.display = "none";
	}
}

setInterval(selection_table_at_top, 1);