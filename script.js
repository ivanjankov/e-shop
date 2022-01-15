$(function () {
	let fullProductList = ['lg', 'sony', 'samsung'];
	let productList = $('.single-product');

	let selectedProducts = [];
	let slideOptions = {
		range: true,
		min: 300,
		max: 1500,
		values: [300, 1500],
		slide: function (event, ui) {
			$('#amount').val('€' + ui.values[0] + ' - €' + ui.values[1]);
		},
		change: function (event, ui) {
			helperFunction();
			// filterProductsByPrice(minVal, maxVal);
		},
	};

	let slider = $('#slider-range').slider(slideOptions);
	let masterCheck = $('#all');
	let listCheckedItems = $('.checkbox-init');

	$('#amount').val(
		'€' +
			$('#slider-range').slider('values', 0) +
			' - €' +
			$('#slider-range').slider('values', 1)
	);

	$('.checkbox-init').on('change', function () {
		helperFunction();
		// console.log(selectedProducts);
	});
	function updateList(min, max, selectedBrands, selectedColors) {
		productList
			.hide()
			.filter((el, ui) => {
				let data = ui.dataset;

				return (
					Number(data.price) > min &&
					Number(data.price) < max &&
					selectedBrands.includes(data.brand) &&
					selectedColors.includes(data.colour)
				);
			})
			.show();
	}

	// CHECKBOX LOGIC

	masterCheck.change(() => {
		let isCheboxAllChecked = $('#all').is(':checked');
		listCheckedItems.prop('checked', isCheboxAllChecked);
		getSelectedItems();
	});

	listCheckedItems.on('change', () => {
		let totalItems = listCheckedItems.length;
		let checkedItems = listCheckedItems.filter(':checked').length;

		if (totalItems == checkedItems) {
			masterCheck.prop('indeterminate', false);
			masterCheck.prop('checked', true);
		} else if (checkedItems > 0 && checkedItems < totalItems) {
			// masterCheck.prop('indeterminate', true);
			masterCheck.prop('checked', false);
		} else {
			masterCheck.prop('indeterminate', true);
			masterCheck.prop('checked', true);
		}
		getSelectedItems();
	});

	function getSelectedItems() {
		let getCheckedValues = [];
		listCheckedItems.filter(':checked').each(function () {
			getCheckedValues.push($(this).val());
		});

		if (getCheckedValues.length == 0) {
			getCheckedValues = fullProductList;
			masterCheck.prop('checked', true);
		}

		return getCheckedValues;
	}

	// COLOR FILTER LOGIC

	chooseColor();

	function chooseColor() {
		$('.color-pick').each(function () {
			$(this).on('click', () => {
				let chosenColor = $(this);
				let divAttribute = $(this).attr('data-colour');
				if ($('.' + divAttribute).length === 0) {
					$('#selected-colors').append(
						'<div data-colour="' +
							divAttribute +
							'" class="d-flex align-content-center picked-colors ' +
							divAttribute +
							'"><i class="fas fa-times"></i><p class="ms-4"> ' +
							divAttribute +
							'</p></div>'
					);
					$(this).children().show();
				} else {
				}
				removePickedColor(chosenColor);
				helperFunction();
			});
		});
	}

	function removePickedColor(color) {
		$('.picked-colors').on('click', function () {
			$(this).remove();
			console.log($(this));
			color.children().hide();
			helperFunction();
		});
	}

	function getPickedColorsList() {
		let arrayOfColors = [];
		$('.picked-colors').each((i, ui) => {
			arrayOfColors.push(ui.dataset.colour);
		});

		if (arrayOfColors.length === 0) {
			arrayOfColors = ['black', 'red', 'green', 'yellow'];
		}

		return arrayOfColors;
	}

	function helperFunction() {
		let listOfColors = getPickedColorsList();
		let getCheckedValues = getSelectedItems();
		let minPrice = $('#slider-range').slider('values', 0);
		let maxPrice = $('#slider-range').slider('values', 1);

		updateList(minPrice, maxPrice, getCheckedValues, listOfColors);
	}
});

function dropDownCategories() {
	$('.categories').each(function () {
		$(this).click(function () {
			$(this).siblings('.price-range').stop().slideToggle(400);
		});
	});
}

dropDownCategories();
