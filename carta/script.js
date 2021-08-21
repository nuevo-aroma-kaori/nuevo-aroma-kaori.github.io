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
		}
	);
}

function show_dishes(menu_plan_index = 1) {
	const all_dishes_quantity = all_dish_info.dish_info.all_dishes.length;

	var table_element = document.getElementById("main_all_dishes_table");
	table_element.innerHTML = "";

	document.getElementById("main_all_dishes_no_included").style.display = "none";

	var proc_index, trigger_getout = false;
	for (proc_index = 0; proc_index < all_dishes_quantity; ) {
		var new_tr_elem = document.createElement("tr");

		for (var proc_limit_count = 0; proc_limit_count < 2; ++proc_limit_count, ++proc_index) {
			if (all_dish_info.menu_info.all_menus[menu_plan_index].included_dishes.indexOf(all_dish_info.dish_info.all_dishes[proc_index].number) != -1) {
				var elem = create_dish_cnt_element_dishes(proc_index);

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
		all_dish_info.menu_info.all_menus[menu_plan_index].included_dishes[all_dish_info.menu_info.all_menus[menu_plan_index].included_dishes.length - 1]
		!= all_dish_info.dish_info.all_dishes[all_dish_info.dish_info.all_dishes.length - 1].number) {
		document.getElementById("main_all_dishes_no_included").style.display = "block";

		table_element = document.getElementById("main_all_dishes_no_included_table");
		table_element.innerHTML = "";

		for (; proc_index < all_dishes_quantity; ) {
			var new_tr_elem = document.createElement("tr");
	
			for (var proc_limit_count = 0; proc_limit_count < 2; ++proc_limit_count, ++proc_index) {
				var elem = create_dish_cnt_element_dishes(proc_index);
	
				/* APPEAR */
				new_tr_elem.appendChild(elem);
			}
	
			table_element.appendChild(new_tr_elem);
		}
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

	var elem_dish_options = document.createElement("div");
	elem_dish_options.setAttribute("class", "main_dish_options");
	
	var elem_dish_options_info = document.createElement("button");
	elem_dish_options_info.setAttribute("class", "main_dish_info");
	elem_dish_options_info.innerText = "Ver variedades";
	elem_dish_options_info.setAttribute("onclick", "dish_description_floating_window_Show(" + proc_index.toString() + ");");
	
	/* APPEND CHILD */
	elem_dish_options.appendChild(elem_dish_options_info);

	elem_dessert_description.appendChild(elem_dessert_description_units);
	elem_dessert_description.appendChild(elem_dessert_description_price);

	elem_dish_description.appendChild(elem_dish_description_name);

	elem_div_everything_container.appendChild(elem_preview_image);
	elem_div_everything_container.appendChild(elem_dish_number);
	elem_div_everything_container.appendChild(elem_dish_description);
	elem_div_everything_container.appendChild(elem_dessert_description);

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
	show_dishes(index);
	show_desserts(index);
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