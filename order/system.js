var all_dish_info_json_obj = null;
const elem_per_row = 2;
var allergen = [];
const data_allergen_list = [
	"gl", "cr", "hv", "ps", "cc", "sj", "lt",
	"fc", "ap", "mo", "gs", "da", "ml", "al"
];

window.onload = window_sections_init;

function window_sections_init() {
	var all_sections = document.getElementsByClassName("section");
	for (var i = 0; i < all_sections.length; ++i)
		all_sections[i].style.display = "none";
	
	var if_allow_cookies = Cookies.get("nak_allow_cookies");
	document.getElementById("loading_animation").style.display = "none";

	if (if_allow_cookies == undefined || if_allow_cookies == null) {
		document.getElementById("asking_for_cookies").style.display = "block";
	} else {
		document.getElementById("page_1_asking").style.display = "block";
	}
}

function cookies_accept() {
	Cookies.set("nak_allow_cookies", "true");
}

function page_of_dish_menu_request() {
	if (all_dish_info_json_obj == null) {
		$.get(
			"https://nuevoaromakaori.com/database/dish_info_min.json",
			function (callback, status) {
				console.log(status);
				all_dish_info_json_obj = callback;
				page_of_dish_menu_msg_proc();
			}
		);
	} else {
		page_of_dish_menu_msg_proc();
	}
}

function page_of_dish_menu_msg_proc() {
	create_dish_cnt_element();
}

function create_dish_cnt_element() {
	const all_dishes_quantity = all_dish_info_json_obj.dish_info.all_dishes.length;

	var table_element = document.getElementById("main_all_dishes_table");
	table_element.innerHTML = "";

	for (var proc_index = 0; proc_index < all_dishes_quantity; ) {
		var new_tr_elem = document.createElement("tr");

		for (var proc_limit_count = 0; proc_limit_count < elem_per_row; ++proc_limit_count, ++proc_index) {
			const allergen_array = all_dish_info_json_obj.dish_info.all_dishes[proc_index].allergen;
			var allergic_for_user = false;

			var elem_td_container = document.createElement("td");
			elem_td_container.setAttribute("id", "main_all_dishes_dish_" + proc_index.toString());
			elem_td_container.style.width = (100.0 / elem_per_row).toString() + "%";

			var elem_div_everything_container = document.createElement("div");
			elem_div_everything_container.setAttribute("class", "main_all_dishes_dish_container");
			for (var i_allergen_list = 0; i_allergen_list < allergen.length; ++i_allergen_list) {
				if (allergen_array.indexOf(allergen[i_allergen_list]) != -1) {
					allergic_for_user = true;
					break;
				}
			}

			if (allergic_for_user) {
				elem_div_everything_container.style.background = "rgb(58, 8, 8)";
				elem_div_everything_container.style.border = "1px solid #D51B19";
			}

			var elem_preview_image = document.createElement("img");
			elem_preview_image.setAttribute("class", "main_dish_image");
			elem_preview_image.setAttribute("src", "https://nuevoaromakaori.com/resources/dish_img/" + all_dish_info_json_obj.dish_info.all_dishes[proc_index].number.toString() + ".png");

			var elem_dish_number = document.createElement("div");
			elem_dish_number.setAttribute("class", "main_dish_number");
			elem_dish_number.innerText = "n. " + all_dish_info_json_obj.dish_info.all_dishes[proc_index].number.toString();

			var elem_dish_description = document.createElement("div");
			elem_dish_description.setAttribute("class", "main_dish_desc");

			var elem_dish_description_name = document.createElement("span");
			elem_dish_description_name.setAttribute("class", "main_dish_desc_title");
			elem_dish_description_name.innerText = all_dish_info_json_obj.dish_info.all_dishes[proc_index].name.es;

			var elem_dish_options = document.createElement("div");
			elem_dish_options.setAttribute("class", "main_dish_options");

			var elem_dish_options_order = document.createElement("button");
			elem_dish_options_order.setAttribute("class", "main_dish_order");
			elem_dish_options_order.innerText = "Lo quiero uno";

			var elem_dish_options_info = document.createElement("button");
			elem_dish_options_info.setAttribute("class", "main_dish_info");
			elem_dish_options_info.innerText = "¿Qué lo es?";
			elem_dish_options_info.setAttribute("onclick", "dish_description_floating_window_Show(" + proc_index.toString() + ");");
			//elem_dish_options_info.addEventListener("click", function(){ dish_description_floating_window_Show(proc_index); });

			/* APPEND CHILD */
			elem_dish_options.appendChild(elem_dish_options_order);
			elem_dish_options.appendChild(elem_dish_options_info);

			elem_dish_description.appendChild(elem_dish_description_name);

			elem_div_everything_container.appendChild(elem_preview_image);
			elem_div_everything_container.appendChild(elem_dish_number);
			elem_div_everything_container.appendChild(elem_dish_description);
			elem_div_everything_container.appendChild(elem_dish_options);

			elem_td_container.appendChild(elem_div_everything_container);

			/* APPEAR */
			new_tr_elem.appendChild(elem_td_container);
		}

		table_element.appendChild(new_tr_elem);
	}
}

function dish_description_floating_window_Show(dishIndex) {
	var elem = document.getElementById("dish_description_floating_window");
	elem.style.display = "block";
	setTimeout(function() { elem.style.opacity = "1"; document.getElementById("dish_description_floating_window_container").style.transform = "scale(100%)"; }, 50);

	document.getElementById("dish_description_floating_window_container").scrollTop = 0;

	document.getElementById("dish_description_floating_window_cnt_img_img").setAttribute("src", "https://nuevoaromakaori.com/resources/dish_img/" + all_dish_info_json_obj.dish_info.all_dishes[dishIndex].number.toString() + ".png");

	document.getElementById("dish_description_floating_window_cnt_title_number").innerText = "Número de plato: " + all_dish_info_json_obj.dish_info.all_dishes[dishIndex].number;
	document.getElementById("dish_description_floating_window_cnt_title_name").innerText = all_dish_info_json_obj.dish_info.all_dishes[dishIndex].name.es;
	document.getElementById("dish_description_floating_window_cnt_text").innerText = all_dish_info_json_obj.dish_info.all_dishes[dishIndex].desc.es;

	var allergen_show_list = document.getElementsByClassName("dish_description_floating_window_cnt_allergen_list_elem");
	for (var i = 0; i < allergen_show_list.length; ++i)
		allergen_show_list[i].style.display = "none";

	var allergen_list = all_dish_info_json_obj.dish_info.all_dishes[dishIndex].allergen;
	var user_allergic_dish_count = 0;
	for (var i = 0, i_data_allergen_index; i < allergen_list.length; ++i) {
		if ((i_data_allergen_index = data_allergen_list.indexOf(allergen_list[i])) != -1) {
			allergen_show_list[i_data_allergen_index].style.display = "list-item";
			allergen_show_list[i_data_allergen_index].setAttribute("class", "dish_description_floating_window_cnt_allergen_list_elem non_usr_allergic");
			++user_allergic_dish_count;

			if (allergen.indexOf(allergen_list[i]) != -1) {
				allergen_show_list[i_data_allergen_index].setAttribute("class", "dish_description_floating_window_cnt_allergen_list_elem usr_allergic");
			}
		}
	}

	if (user_allergic_dish_count == 0) {
		allergen_show_list[allergen_show_list.length - 1].style.display = "list-item";
	}
}

function dish_description_floating_window_Hide() {
	var elem = document.getElementById("dish_description_floating_window");
	elem.style.opacity = "0";
	document.getElementById("dish_description_floating_window_container").style.transform = "scale(88%)";

	/*document.getElementById("dish_description_floating_window_cnt_img_img").setAttribute("src", "");*/

	setTimeout(function() { elem.style.display = "none"; }, 80);
}

function allergen_add(index) {
	var in_arr_index;

	if ((in_arr_index = allergen.indexOf(data_allergen_list[index])) != -1) {
		allergen.splice(in_arr_index, 1);
		document.getElementsByClassName("allergen_option")[index].setAttribute("class", "allergen_option no_chosen");
	} else {
		allergen.push(data_allergen_list[index]);
		document.getElementsByClassName("allergen_option")[index].setAttribute("class", "allergen_option chosen");
	}
}