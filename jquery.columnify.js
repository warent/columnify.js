jQuery.fn.extend({
	/*
		Options:
			columnWidth
			item
			evenHeight = true
	*/
	columnify: function(options) {

		var _col_adding_elements = false;

		var _col_keep_scroll = $(window).scrollTop();

		// Grab our initial content
		var _col_content = $(this).html();
		// Our column code
		var _col_new_column = "<div class='_col_column'></div>";
		// The column container, which is the jQuery object that this is being applied to
		var _col_container = this;
		// If evenHeight = false, use this to cycle indices instead of height
		var _col_column_index = -1;
		// Figure out how many columns we'll need
		var _col_number_of_columns = Math.floor($(this).width() / options.columnWidth);
		if (_col_number_of_columns < 1) _col_number_of_columns = 1;
		// Do we want the height to level out, or iterate through indices?
		var _col_even_height = options.evenHeight ? options.evenHeight : true;

		var _col_unwrapped_content = "";

		// Check to see if we've already been columnified. If so, redo it!
		if ($(_col_content).filter("._col_column").length > 0) {
			$($(_col_content).filter("._col_column")).each(function(i, obj) {
				_col_unwrapped_content += $(obj).html();
			});
			_col_content = _col_unwrapped_content;
		} else {
			// Make sure our columns are correctly styled
			$("body").prepend(
				  "<style>"
				+ "._col_column {"
				+ "width: " + options.columnWidth + "px;"
				+ "display: inline-block;"
				+ "vertical-align: top;"
				+ "}"
				+ "</style>"
				);
		}

		// Wipe out the old content
		$(this).html("");

		// Set up our new columns
		for (var i = 0; i < _col_number_of_columns; i++) {
			$(this).append(_col_new_column);
		}
		
		// Maintain the order of our divs
		/*$($(_col_content).filter(options.item)).each(function(i, obj) {
			$(this).data("sort", i);
			console.log($(this).data("sort"));
		});*/

		// Lets go ahead and iterate our items to columnify
		$($(_col_content).filter(options.item)).each(function(i, obj) {
			if (!_col_even_height) {
				if (_col_column_index++ > _col_number_of_columns) _col_column_index = 0;
				$(_col_container).children("._col_column:eq(" + _col_column_index + ")").append(obj);
			} else {
				columnHeights = $(_col_container).children("._col_column").map(function() {
					return {
						column: this,
						height: $(this).outerHeight()
					}
				});

				// Sort by height
				columnHeightsSorted = columnHeights.sort(function(a, b) {
			        var x = a["height"]; var y = b["height"];
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });

			   $(columnHeightsSorted[0]["column"]).append($(obj));
			}
		});

		$(window).scrollTop(_col_keep_scroll);
	},

	columnifyClear: function() {
		$("._col_column").each(function() {
			$(this).remove();
		});
	},

	columnifyAdd: function(options) {

		var _col_content = options.items;

		var _col_container = this;
		// If evenHeight = false, use this to cycle indices instead of height
		var _col_column_index = -1;
		// Figure out how many columns we'll need
		var _col_number_of_columns = $(_col_content).filter("._col_column").length;
		// Do we want the height to level out, or iterate through indices?
		var _col_even_height = options.evenHeight ? options.evenHeight : true;

		// Lets go ahead and iterate our items to columnify
		$($(_col_content).filter(options.item)).each(function(i, obj) {
			if (!_col_even_height) {
				if (_col_column_index++ > _col_number_of_columns) _col_column_index = 0;
				$(_col_container).children("._col_column:eq(" + _col_column_index + ")").append(obj);
			} else {
				columnHeights = $(_col_container).children("._col_column").map(function() {
					return {
						column: this,
						height: parseInt($(this).outerHeight(), 10)
					}
				});

				// Sort by height
				var columnHeightsSorted = null;
				columnHeightsSorted = columnHeights.sort(function(a, b) {
			        var x = a["height"]; var y = b["height"];
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });

			    if (options.prepend == true) $(columnHeightsSorted[0]["column"]).prepend($(obj));
			    else if (!options.prepend) $(columnHeightsSorted[0]["column"]).append($(obj));
			}
		});
	}
});