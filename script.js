let minVal, maxVal;

$(function () {
	let productList = $('.single-product');
	let selectedItems = [];

	$('#slider-range').slider({
		range: true,
		min: 300,
		max: 1500,
		values: [300, 1500],
		slide: function (event, ui) {
			$('#amount').val('€' + ui.values[0] + ' - €' + ui.values[1]);
			minVal = ui.values[0];
			maxVal = ui.values[1];
			filterProductsByPrice(minVal, maxVal);
		},
		change: function (event, ui) {
			console.log(ui.values[0]);
		},
	});

	$('#amount').val(
		'€' +
			$('#slider-range').slider('values', 0) +
			' - €' +
			$('#slider-range').slider('values', 1)
	);
	let price = $('#slider-range').slider('values', 0);
	console.log(price);
});

function filterProductsByPrice(minVal, maxVal) {
	$('.single-product').each(function () {
		let product = parseInt($(this).attr('data-price'));
		if (product > maxVal || product < minVal) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
}

function dropDownCategories() {
	$('.categories').each(function () {
		$(this).click(function () {
			$(this).siblings('.price-range').stop().slideToggle(400);
		});
	});
}

dropDownCategories();
