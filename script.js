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
			let minVal = ui.values[0];
			let maxVal = ui.values[1];
			let filteredProducts = getSelectedItems();
			updateList(minVal, maxVal, filteredProducts);
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
		let minPrice = $('#slider-range').slider('values', 0);
		let maxPrice = $('#slider-range').slider('values', 1);
		// if (this.value == 'all') {
		// 	selectedProducts = fullProductList;
		// } else if (this.checked) {
		// 	selectedProducts.push(this.value);
		// } else {
		// 	selectedProducts.splice(selectedProducts.indexOf(this.value), 1);
		// }
		let filteredList = getSelectedItems();
		updateList(minPrice, maxPrice, filteredList);
		// console.log(selectedProducts);
	});
	function updateList(min, max, selected) {
		productList
			.hide()
			.filter((el, ui) => {
				let data = ui.dataset;

				return (
					Number(data.price) > min &&
					Number(data.price) < max &&
					selected.includes(data.brand)
				);
			})
			.show();
	}

	// CHECKBOX LOGIC

	masterCheck.change(() => {
		console.log;
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
		console.log(getCheckedValues);
		return getCheckedValues;
	}

	// COLOR FILTER LOGIC

	chooseColor();

	function chooseColor() {
		$('.color-pick').each(function () {
			$(this).on('click', () => {
				let chosenColor = $(this);
				if ($('.' + $(this).attr('data-colour')).length === 0) {
					$('#selected-colors').append(
						'<div class="d-flex align-content-center picked-colors ' +
							$(this).attr('data-colour') +
							'"><i class="fas fa-times"></i><p class="ms-4"> ' +
							$(this).attr('data-colour') +
							'</p></div>'
					);
					$(this).children().show();
					console.log($(this).attr('data-colour'));
				} else {
					// console.log('this exist', $(this).attr('data-colour'));
					// console.log('this exist', $(this).children().show());
					// // console.log($(this.children()));
					// $(this).children().hide();
				}
				removePickedColor(chosenColor);
			});
		});
	}

	function removePickedColor(color) {
		// console.log($('.picked-colors'));
		// console.log($('.picked-colors'));
		$('.picked-colors').on('click', function () {
			$(this).remove();
			console.log($(this));
			color.children().hide();
		});
	}

	function hideCheckedColors() {}
});

// function filterProductsByPrice() {
// 	$('.single-product').each(function () {
// 		let product = $(this).attr('data-price');
// 		console.log(product);
// 		// if (product > maxVal || product < minVal) {
// 		// 	$(this).hide();
// 		// } else {
// 		// 	$(this).show();
// 		// }
// 	});
// }

function dropDownCategories() {
	$('.categories').each(function () {
		$(this).click(function () {
			$(this).siblings('.price-range').stop().slideToggle(400);
		});
	});
}

dropDownCategories();
