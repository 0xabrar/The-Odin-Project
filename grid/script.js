//Keep track of the size and coloring option. 
var current_size = 16;
var current_operation = 1;

$(document).ready(function() {
	load(current_size);
	default_colors();
});

/* Option for default color changes. */
function default_colors() {
	$(".square").hover(function() {
		$(this).css('background-color', 'green');
	});
};

function random_colors() {
	$(".square").hover(function() {
		$(this).css('background-color', getRandomColor());
	});
};

function trailing_colors() {
	$(".square").hover(function() {
			$(this).css("opacity", 0);
		}, function () {
			$(this).fadeTo('fast', 1);
	});
};

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
};

/* Will create a black size by size grid. */
function load(size) {
	var square_size = $("#container").width() / size - 2; //-2 for borders
	//Create the size x size grid.
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			$("#container").append("<div class='square'></div>");
		} 
	$("#container").append("<div class='new_row'></div>");
	}

	//Adjust the square size.
	$(".square").css('width', square_size);
	$(".square").css('height',square_size);
};


/* Deals with the coloring of the individual squares. */
function set_running() {
	switch (current_option) {
		case 1:
			default_colors();
			break;
		case 2:
			random_colors();
			break;
		case 3:
			trailing_colors();
	}
};

/* Called for by the user when he/she presses buttons.*/
function operate(option) {
	if (option == 4) {
		clear();
		return;
	}
	current_option = option;
	var size = prompt("Enter a grid size (0 < x < 128).");
	//Size given must be valid.
	if ((size > 0) && (size < 128)) {
		current_size = size;
		clear();
	} else {
		operate(option);
	}
};

/* Resets the current grid. */
function clear() {
	$(".square").remove();
	load(current_size);
	set_running();
};