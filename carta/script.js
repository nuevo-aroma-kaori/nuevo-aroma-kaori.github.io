window.onload = function() {
	request_necessary_information();
};

const user_allergen_data_list = [
	"gl", "cr", "hv", "ps", "cc", "sj", "lt",
	"fc", "ap", "mo", "gs", "da", "ml", "al"
];

var all_dish_info = null;
var user_allergen_info = [];
var current_chosen_menu_index = 1;
var current_time_info = { day : 0, hour : 0 };

/* opens a page */
function goto_page(url) {
	window.location = url;
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

function page_change_to(pageIndex) {
	var elems = document.getElementsByClassName("selection_table_elem");
	var elems_fixed = document.getElementsByClassName("selection_table_elem_f");
	
	for (var i = 0; i < elems.length; ++i) {
		elems[i].setAttribute("class", "selection_table_elem");
		elems_fixed[i].setAttribute("class", "selection_table_elem_f");
	}

	elems[pageIndex].setAttribute("class", "selection_table_elem chosen");
	elems_fixed[pageIndex].setAttribute("class", "selection_table_elem_f chosen");

	switch (pageIndex) {
	case 0:
		document.getElementById("main_all_dishes_drink").style.display = "block";
		document.getElementById("main_all_dishes").style.display = "none";
		document.getElementById("main_all_dishes_dessert").style.display = "none";
		break;
	case 1:
		document.getElementById("main_all_dishes_drink").style.display = "none";
		document.getElementById("main_all_dishes").style.display = "block";
		document.getElementById("main_all_dishes_dessert").style.display = "none";
		break;
	case 2:
		document.getElementById("main_all_dishes_drink").style.display = "none";
		document.getElementById("main_all_dishes").style.display = "none";
		document.getElementById("main_all_dishes_dessert").style.display = "block";
		break;
	}
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

			set_chosen_menu(1);
			page_change_to(1);

			show_drinks();
			init_menu_current_time();
		}
	);
}

function show_dishes(menu_plan_index = 1) {
	const all_dishes_quantity = all_dish_info.dish_info.all_dishes.length;

	var original_table_element = document.getElementById("main_all_dishes_table");
	var no_included_table_element = document.getElementById("main_all_dishes_no_included_table");
	original_table_element.innerHTML = "";
	no_included_table_element.innerHTML = "";

	var original_table_row_count = 0,
		no_included_table_row_count = 0;
	var original_table_tr_elem = document.createElement("tr"),
		no_included_table_tr_elem = document.createElement("tr");

	var exist_no_included_dishes = false;

	for (var proc_index = 0; proc_index < all_dishes_quantity; ++proc_index) {
		if (original_table_row_count == 2) {
			original_table_row_count = 0;
			original_table_element.appendChild(original_table_tr_elem);
			original_table_tr_elem = document.createElement("tr");
		}
		if (no_included_table_row_count == 2) {
			no_included_table_row_count = 0;
			no_included_table_element.appendChild(no_included_table_tr_elem);
			no_included_table_tr_elem = document.createElement("tr");
		}

		var elem = create_dish_cnt_element_dishes(proc_index);
		// IF THE DISH IS INCLUDED
		if (all_dish_info.menu_info.all_menus[menu_plan_index].included_dishes.indexOf(all_dish_info.dish_info.all_dishes[proc_index].number) != -1) {
			original_table_tr_elem.appendChild(elem);
			++original_table_row_count;
		} else {
			no_included_table_tr_elem.appendChild(elem);
			++no_included_table_row_count;
			exist_no_included_dishes = true;
		}
	}

	if (original_table_row_count > 0) { original_table_element.appendChild(original_table_tr_elem); }
	if (no_included_table_row_count > 0) { no_included_table_element.appendChild(no_included_table_tr_elem); }

	if (!exist_no_included_dishes) {
		document.getElementById("main_all_dishes_no_included").style.display = "none";
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

	
	for (var i_allergen_list = 0; i_allergen_list < user_allergen_info.length; ++i_allergen_list) {
		if (allergen_array.indexOf(user_allergen_info[i_allergen_list]) != -1) {
			allergic_for_user = true;
			break;
		}
	}

	if (allergic_for_user) {
		elem_div_everything_container.style.background = "linear-gradient(180deg, #FFFFFF, #FFE0E0)";
		elem_div_everything_container.style.border = "1px solid #FFE0E0";
	}

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
	elem_dish_options_info.innerText = "Ver detalles";
	elem_dish_options_info.setAttribute("onclick", "dish_description_floating_window_Show(" + proc_index.toString() + ");");

	/* APPEND CHILD */
	elem_dish_options.appendChild(elem_dish_options_info);

	elem_dish_description.appendChild(elem_dish_description_name);
	if (all_dish_info.dish_info.all_dishes[proc_index].units > 1) {
		var elem_dish_description_units = document.createElement("span");
		elem_dish_description_units.setAttribute("class", "main_dish_desc_units");
		elem_dish_description_units.innerText = all_dish_info.dish_info.all_dishes[proc_index].units.toString() + " uds.";

		elem_dish_description.appendChild(elem_dish_description_units);
	}

	elem_div_everything_container.appendChild(elem_preview_image);
	elem_div_everything_container.appendChild(elem_dish_number);
	elem_div_everything_container.appendChild(elem_dish_description);
	elem_div_everything_container.appendChild(elem_dish_options);

	elem_td_container.appendChild(elem_div_everything_container);

	/* FINAL ELEMENT */
	return elem_td_container;
}

function show_drinks() {
	const all_drinks_sections = all_dish_info.drink_info.all_drinks;

	var container_element = document.getElementById("main_all_dishes_drink_container");

	for (var section_index = 0; section_index < all_drinks_sections.length; ++section_index) {
		var new_table_element = document.createElement("table");
		new_table_element.setAttribute("class", "main_all_table_div_table");

		var new_section_title = document.createElement("span");
		new_section_title.setAttribute("class", "main_all_dishes_drink_container_section_title");
		new_section_title.innerText = all_drinks_sections[section_index].type_name.es;
		if (all_drinks_sections[section_index].type_notes.indexOf("age_18") != -1) {
			new_section_title.innerHTML += "<span class='age_18'>18+</span>";
		}

		for (var proc_index = 0; proc_index < all_drinks_sections[section_index].child_list.length; ) {
			var new_tr_elem = document.createElement("tr");
	
			for (var proc_limit_count = 0; proc_limit_count < 2; ++proc_limit_count, ++proc_index) {
				if (all_drinks_sections[section_index].child_list[proc_index] != undefined) {
					var elem = create_drink_cnt_element_drinks(
						all_drinks_sections[section_index].child_list[proc_index],
						all_drinks_sections[section_index].type_notes.indexOf("age_18") != -1
					);

					/* APPEAR */
					new_tr_elem.appendChild(elem);
				}
			}
	
			new_table_element.appendChild(new_tr_elem);
		}

		container_element.appendChild(new_section_title);
		container_element.appendChild(new_table_element);
	}
}

function create_drink_cnt_element_drinks(proc_element, alcohol) {
	var elem_td_container = document.createElement("td");
	try {
		elem_td_container.setAttribute("id", "main_all_drinks_drink_" + proc_element.id.toString());
	} catch (msg) {
		console.log("ERROR: " + proc_element);
	}

	elem_td_container.style.width = (100.0 / 2).toString() + "%";

	var elem_div_everything_container = document.createElement("div");
	elem_div_everything_container.setAttribute("class", "main_all_dishes_dish_container");

	var elem_preview_image = document.createElement("img");
	elem_preview_image.setAttribute("class", "main_dish_image");
	elem_preview_image.setAttribute("src", "https://nuevoaromakaori.com/resources/drink_img/" + proc_element.id.toString() + ".png");

	var elem_dish_description = document.createElement("div");
	elem_dish_description.setAttribute("class", "main_dish_desc");

	var elem_dish_description_name = document.createElement("span");
	elem_dish_description_name.setAttribute("class", "main_dish_desc_title");
	elem_dish_description_name.innerText = proc_element.name;

	var elem_dish_description_alcohol = document.createElement("span");
	elem_dish_description_alcohol.setAttribute("class", "main_drink_desc_alcohol");
	if (alcohol) {
		if (proc_element.desc.grade != 0 && proc_element.desc.grade != undefined)
			elem_dish_description_alcohol.innerText = "Vol. " + proc_element.desc.grade + "%";
		else
			elem_dish_description_alcohol.innerText = "Falta info.";
	}

	var elem_dish_description_capacity = document.createElement("span");
	elem_dish_description_capacity.setAttribute("class", "main_drink_desc_capacity");
	elem_dish_description_capacity.innerText = proc_element.desc.capacity.number.toString() + proc_element.desc.capacity.unit;

	var elem_dish_description_price = document.createElement("span");
	elem_dish_description_price.setAttribute("class", "main_drink_desc_price");
	elem_dish_description_price.innerText = proc_element.price.toFixed(2) + "€";

	/* APPEND CHILD */

	elem_dish_description.appendChild(elem_dish_description_name);
	if (alcohol) elem_dish_description.appendChild(elem_dish_description_alcohol);
	elem_dish_description.appendChild(elem_dish_description_capacity);
	elem_dish_description.appendChild(elem_dish_description_price);

	elem_div_everything_container.appendChild(elem_preview_image);
	elem_div_everything_container.appendChild(elem_dish_description);

	elem_td_container.appendChild(elem_div_everything_container);

	/* FINAL ELEMENT */
	return elem_td_container;
}

function show_desserts(menu_plan_index = 1) {
	const all_desserts_quantity = all_dish_info.dessert_info.all_desserts.length;

	var table_element = document.getElementById("main_all_dishes_dessert_table");
	table_element.innerHTML = "";

	document.getElementById("main_all_dishes_dessert_no_included").style.display = "none";

	var proc_index, trigger_getout = false;
	for (proc_index = 0; proc_index < all_desserts_quantity; ) {
		var new_tr_elem = document.createElement("tr");

		for (var proc_limit_count = 0; proc_limit_count < 2; ++proc_limit_count, ++proc_index) {
			if (all_dish_info.menu_info.all_menus[menu_plan_index].included_desserts.indexOf(all_dish_info.dessert_info.all_desserts[proc_index].number) != -1) {
				var elem = create_dessert_cnt_element_desserts(all_dish_info.dessert_info.all_desserts[proc_index], proc_index);

				/* APPEAR */
				new_tr_elem.appendChild(elem);
				table_element.appendChild(new_tr_elem);
			} else {
				table_element.appendChild(new_tr_elem);
				trigger_getout = true;
				break;
			}
		}

		if (trigger_getout) { break; }
	}

	if (
		all_dish_info.menu_info.all_menus[menu_plan_index].included_desserts[all_dish_info.menu_info.all_menus[menu_plan_index].included_desserts.length - 1]
		!= all_dish_info.dessert_info.all_desserts[all_desserts_quantity - 1].number) {
		document.getElementById("main_all_dishes_dessert_no_included").style.display = "block";

		table_element = document.getElementById("main_all_dishes_dessert_no_included_table");
		table_element.innerHTML = "";

		for (; proc_index < all_desserts_quantity; ) {
			var new_tr_elem = document.createElement("tr");
	
			for (var proc_limit_count = 0; proc_limit_count < 2; ++proc_limit_count, ++proc_index) {
				var elem = create_dessert_cnt_element_desserts(all_dish_info.dessert_info.all_desserts[proc_index], proc_index);
	
				/* APPEAR */
				new_tr_elem.appendChild(elem);
			}
	
			table_element.appendChild(new_tr_elem);
		}
	}
}

function create_dessert_cnt_element_desserts(proc_element, proc_index) {
	var elem_td_container = document.createElement("td");
	elem_td_container.setAttribute("id", "main_all_desserts_dessert_" + proc_index.toString());
	elem_td_container.style.width = (100.0 / 2).toString() + "%";

	var elem_div_everything_container = document.createElement("div");
	elem_div_everything_container.setAttribute("class", "main_all_dishes_dish_container");

	var elem_preview_image = document.createElement("img");
	elem_preview_image.setAttribute("class", "main_dish_image");
	elem_preview_image.setAttribute("src", "https://nuevoaromakaori.com/resources/dish_img/" + proc_element.number.toString() + ".png");

	var elem_dish_number = document.createElement("div");
	elem_dish_number.setAttribute("class", "main_dish_number");
	elem_dish_number.innerText = "n. " + proc_element.number.toString();

	var elem_dish_description = document.createElement("div");
	elem_dish_description.setAttribute("class", "main_dish_desc");

	var elem_dish_description_name = document.createElement("span");
	elem_dish_description_name.setAttribute("class", "main_dish_desc_title");
	elem_dish_description_name.innerText = proc_element.name.es;

	var elem_dessert_description = document.createElement("div");
	elem_dessert_description.setAttribute("class", "main_dessert_desc");

	var elem_dessert_description_units = document.createElement("span");
	elem_dessert_description_units.setAttribute("class", "main_dessert_desc_units");
	elem_dessert_description_units.innerText = proc_element.units + " uds.";

	var elem_dessert_description_price = document.createElement("span");
	elem_dessert_description_price.setAttribute("class", "main_dessert_desc_price");
	elem_dessert_description_price.innerText = proc_element.price.toFixed(2) + "€";
	if (proc_element.price == 0.0) {
		elem_dessert_description_price.innerText = "Depende";
	}
	
	/* APPEND CHILD */
	elem_dessert_description.appendChild(elem_dessert_description_units);
	elem_dessert_description.appendChild(elem_dessert_description_price);

	elem_dish_description.appendChild(elem_dish_description_name);

	elem_div_everything_container.appendChild(elem_preview_image);
	elem_div_everything_container.appendChild(elem_dish_number);
	elem_div_everything_container.appendChild(elem_dish_description);
	elem_div_everything_container.appendChild(elem_dessert_description);
	if (proc_element.varieties) {
		var elem_dish_options = document.createElement("div");
		elem_dish_options.setAttribute("class", "main_dish_options");
	
		var elem_dish_options_info = document.createElement("button");
		elem_dish_options_info.setAttribute("class", "main_dish_info");
		elem_dish_options_info.innerText = "Ver variedades";
		elem_dish_options_info.setAttribute("onclick", "show_dish_varieties(" + proc_index.toString() + ");");

		elem_dish_options.appendChild(elem_dish_options_info);

		elem_div_everything_container.appendChild(elem_dish_options);
	}

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

function set_chosen_menu(index) {
	var elems_parent = document.getElementsByClassName("option_page_option");
	var elems_title = document.getElementsByClassName("option_page_option_title");
	var elems_child = document.getElementsByClassName("option_page_option_container");
	
	var elems_show = document.getElementsByClassName("user_choice_show_menu");

	for (var i = 0; i < elems_parent.length; ++i) {
		if (i == index) {
			elems_parent[i].style.background = "#D51B19";
			elems_parent[i].style.padding = "4px";
		} else {
			elems_parent[i].style.background = "#E8E8E8";
			elems_parent[i].style.padding = "2px";
		}
	}

	for (var i = 0; i < elems_title.length; ++i) {
		if (i == index) {
			elems_title[i].style.height = "1.2em";
		} else {
			elems_title[i].style.height = "0em";
		}
	}

	for (var i = 0; i < elems_child.length; ++i) {
		if (i == index) {
			elems_child[i].style.borderRadius = "16px";
		} else {
			elems_child[i].style.borderRadius = "18px";
		}
	}

	for (var i = 0; i < elems_show.length; ++i) {
		if (i == index) {
			elems_show[i].style.display = "block";
		} else {
			elems_show[i].style.display = "none";
		}
	}

	change_plan_menu_hide(true);
	document.getElementById("main_all_dishes_no_included").style.display = "block";
	show_dishes(index);
	show_desserts(index);
	current_chosen_menu_index = index;
}

function change_plan_menu_show() {
	var bg_elem = document.getElementById("whatever_wnd_bg");
	bg_elem.style.display = "block";
	setTimeout(function() { bg_elem.style.opacity = "1"; }, 50);

	var option_page_elem = document.getElementById("plan_menu_option_page");
	option_page_elem.style.display = "block";
	setTimeout(function() { option_page_elem.style.top = "0%"; }, 50);
}

function change_plan_menu_hide(wait) {
	if (wait) {
		setTimeout(function() {
			var bg_elem = document.getElementById("whatever_wnd_bg");
			bg_elem.style.opacity = "0";
			setTimeout(function() { bg_elem.style.display = "none"; }, 200);

			var option_page_elem = document.getElementById("plan_menu_option_page");
			option_page_elem.style.top = "100%";
			setTimeout(function() { option_page_elem.style.display = "none"; }, 200);
		}, 200);
	} else {
		var bg_elem = document.getElementById("whatever_wnd_bg");
		bg_elem.style.opacity = "0";
		setTimeout(function() { bg_elem.style.display = "none"; }, 200);

		var option_page_elem = document.getElementById("plan_menu_option_page");
		option_page_elem.style.top = "100%";
		setTimeout(function() { option_page_elem.style.display = "none"; }, 200);
	}
}

function show_dish_varieties(proc_elem_index) {
	var bg_elem = document.getElementById("whatever_wnd_bg");
	bg_elem.style.display = "block";
	setTimeout(function() { bg_elem.style.opacity = "1"; }, 50);

	var varieties_page_elem = document.getElementById("dish_varieties_option_page");
	varieties_page_elem.style.display = "block";
	setTimeout(function() { varieties_page_elem.style.top = "0%"; }, 50);

	/* SET CONTENTS */
	var proc_infos = all_dish_info.dessert_info.all_desserts[proc_elem_index];

	document.getElementById("dish_varieties_option_title").innerText = proc_infos.name.es;

	var container_elem = document.getElementById("dish_varieties_option_page_container");
	container_elem.innerHTML = "";
	
	const varieties_length = proc_infos.varieties_array.length;
	const varieties_info = proc_infos.varieties_array;
	for (var variety_index = 0; variety_index < varieties_length; ++variety_index) {
		var option_elem = document.createElement("div");
		option_elem.setAttribute("class", "option_page_option");
		option_elem.setAttribute("style", "border-radius:18px;padding:2px;background:#f0f0f0;");

		var option_container_elem = document.createElement("div");
		option_container_elem.setAttribute("class", "option_page_option_container");

		var option_variety_name_elem = document.createElement("span");
		option_variety_name_elem.setAttribute("class", "option_page_option_variety_name");
		option_variety_name_elem.innerText = varieties_info[variety_index].name.es;

		var option_variety_info_container_elem = document.createElement("div");
		option_variety_info_container_elem.setAttribute("class", "option_page_option_variety_info_container");

		var option_variety_info_table_elem = document.createElement("table");
		var option_variety_info_table_tr_elem = document.createElement("tr");

		var option_variety_info_td_left_elem = document.createElement("td");
		option_variety_info_td_left_elem.setAttribute("class", "align_left");
		var option_variety_info_td_right_elem = document.createElement("td");
		option_variety_info_td_right_elem.setAttribute("class", "align_right");

		var option_variety_info_number_elem = document.createElement("div");
		option_variety_info_number_elem.setAttribute("class", "option_page_option_variety_info_number");
		option_variety_info_number_elem.innerText = "n. " + varieties_info[variety_index].number;

		var option_variety_info_price_elem = document.createElement("div");
		option_variety_info_price_elem.setAttribute("class", "option_page_option_variety_info_price");
		option_variety_info_price_elem.innerText = varieties_info[variety_index].price.toFixed(2) + "€";

		// PUT THEM INSIDE OTHERS
		option_variety_info_td_left_elem.appendChild(option_variety_info_number_elem);
		option_variety_info_td_right_elem.appendChild(option_variety_info_price_elem);

		option_variety_info_table_tr_elem.appendChild(option_variety_info_td_left_elem);
		option_variety_info_table_tr_elem.appendChild(option_variety_info_td_right_elem);

		option_variety_info_table_elem.appendChild(option_variety_info_table_tr_elem);

		option_variety_info_container_elem.appendChild(option_variety_info_table_elem);

		option_container_elem.appendChild(option_variety_name_elem);
		option_container_elem.appendChild(option_variety_info_container_elem);

		option_elem.appendChild(option_container_elem);

		// APPEND
		container_elem.appendChild(option_elem);
	}
}

function hide_dish_varieties() {
	var bg_elem = document.getElementById("whatever_wnd_bg");
	bg_elem.style.opacity = "0";
	setTimeout(function() { bg_elem.style.display = "none"; }, 200);

	var option_page_elem = document.getElementById("dish_varieties_option_page");
	option_page_elem.style.top = "100%";
	setTimeout(function() { option_page_elem.style.display = "none"; }, 200);
}

function set_chosen_allergen(index) {
	var elems_parent = document.getElementsByClassName("option_page_allergen_option");
	var elems_title = document.getElementsByClassName("option_page_allergen_option_title");
	var elems_child = document.getElementsByClassName("option_page_allergen_option_container");
	
	var elems_show = document.getElementsByClassName("user_choice_show_allergen");

	var allergen_id_str = user_allergen_data_list[index];
	var if_existing_index;
	// IF THE ALLERGEN ALREADY EXISTS IN THE LIST
	if ((if_existing_index = user_allergen_info.indexOf(allergen_id_str)) != -1) {
		user_allergen_info.splice(if_existing_index, 1);
	} else {
		user_allergen_info.push(allergen_id_str);
	}

	for (var i = 0; i < elems_parent.length; ++i) {
		if (user_allergen_info.indexOf(user_allergen_data_list[i]) != -1) {
			elems_parent[i].style.background = "#D51B19";
			elems_parent[i].style.padding = "4px";
		} else {
			elems_parent[i].style.background = "#E8E8E8";
			elems_parent[i].style.padding = "2px";
		}
	}

	for (var i = 0; i < elems_title.length; ++i) {
		if (user_allergen_info.indexOf(user_allergen_data_list[i]) != -1) {
			elems_title[i].style.height = "1.2em";
		} else {
			elems_title[i].style.height = "0em";
		}
	}

	for (var i = 0; i < elems_child.length; ++i) {
		if (user_allergen_info.indexOf(user_allergen_data_list[i]) != -1) {
			elems_child[i].style.borderRadius = "16px";
		} else {
			elems_child[i].style.borderRadius = "18px";
		}
	}

	if (user_allergen_info.length == 0) {
		elems_show[0].innerText = "Ningún alergénico seleccionado";
	} else if (user_allergen_info.length == 1) {
		elems_show[0].innerText = "Hay 1 alergénico seleccionado";
	} else {
		elems_show[0].innerText = "Hay" + user_allergen_info.length + "alergénicos seleccionados";
	}
}

function modify_user_allergen_show() {
	var bg_elem = document.getElementById("whatever_wnd_bg");
	bg_elem.style.display = "block";
	setTimeout(function() { bg_elem.style.opacity = "1"; }, 50);

	var option_page_elem = document.getElementById("user_allergen_options");
	option_page_elem.style.display = "block";
	setTimeout(function() { option_page_elem.style.top = "0%"; }, 50);
}

function modify_user_allergen_hide(wait) {
	if (wait) {
		setTimeout(function() {
			var bg_elem = document.getElementById("whatever_wnd_bg");
			bg_elem.style.opacity = "0";
			setTimeout(function() { bg_elem.style.display = "none"; }, 200);

			var option_page_elem = document.getElementById("user_allergen_options");
			option_page_elem.style.top = "100%";
			setTimeout(function() { option_page_elem.style.display = "none"; }, 200);
		}, 200);
	} else {
		var bg_elem = document.getElementById("whatever_wnd_bg");
		bg_elem.style.opacity = "0";
		setTimeout(function() { bg_elem.style.display = "none"; }, 200);

		var option_page_elem = document.getElementById("user_allergen_options");
		option_page_elem.style.top = "100%";
		setTimeout(function() { option_page_elem.style.display = "none"; }, 200);
	}

	document.getElementById("main_all_dishes_no_included").style.display = "block";
	show_dishes(current_chosen_menu_index);
}


function init_menu_current_time() {
	var elem = document.getElementById("opt_desc_time");
	var out_str = "";
	var date_obj = new Date();

	current_time_info.day = date_obj.getDay();
	switch (date_obj.getDay()) {
	case 1:	out_str += "Lunes";		break;
	case 2:	out_str += "Martes";	break;
	case 3:	out_str += "Miércoles";	break;
	case 4:	out_str += "Jueves";	break;
	case 5:	out_str += "Viernes";	break;
	case 6:	out_str += "Sábado";	break;
	case 7:	out_str += "Domingo";	break;
	}

	out_str += ", ";

	var current_hour = date_obj.getHours();
	if (current_hour >= 12 && current_hour <= 17) {
		out_str += "Mediodía";
		current_time_info.hour = 0;
	} else if (current_hour >= 20 && current_hour <= 24) {
		out_str += "Noche";
		current_time_info.hour = 1;
	} else {
		out_str += "No abierto";
		current_time_info.hour = 2;
	}

	elem.innerText = out_str;

	// SET NO AVAILABLE ONES
	// CHECK IF CURRENT TIME IS IN MENU TIME
	for (var index = 0; index < all_dish_info.menu_info.all_menus.length; ++index) {
		var time_is_allowed = false;
		var time_info = all_dish_info.menu_info.all_menus[index].menu_time_info;
		for (var i = 0; i < time_info.length; ++i) {
			if (time_info[i].day == current_time_info.day) {
				if (time_info[i].hour == current_time_info.hour) {
					time_is_allowed = true;
					break;
				}
			}
		}

		if (time_is_allowed) {
			document.getElementsByClassName("option_page_option_menu_available")[index].style.display = "none";
		} else {
			document.getElementsByClassName("option_page_option_menu_available")[index].style.display = "block";
		}
	}
}