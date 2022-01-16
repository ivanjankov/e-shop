$(document).ready(function () {
	$(function () {
		let fullProductList = [
			'lg',
			'sony',
			'samsung',
			'loewe',
			'panasonic',
			'philips',
			'salora',
			'sharp',
			'tcl',
			'thompson',
		];
		let colorList = [
			'black',
			'red',
			'blue',
			'green',
			'orange',
			'grey',
			'white',
			'yellow',
		];
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
								'" class="d-flex ps-4 mt-3 align-content-center picked-colors ' +
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
				arrayOfColors = colorList;
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

		// SHOPPING CART
		updateCartTotal();
		ready();

		function ready() {
			let removeCartItemsButtons = Array.from(
				document.getElementsByClassName('btn-remove')
			);
			removeCartItemsButtons.forEach((element) => {
				let btn = element;
				btn.addEventListener('click', removeCartItem);
			});

			let quantityInput = Array.from(
				document.getElementsByClassName('cart-quantity-input')
			);
			quantityInput.forEach((el) => {
				let input = el;
				input.addEventListener('change', quantityChanged);
			});

			let addToCartButton = Array.from(
				document.getElementsByClassName('shop-item-button')
			);
			addToCartButton.forEach((btn) => {
				let button = btn;
				button.addEventListener('click', addToCartClicked);
			});
			toggleCartVisibility();
		}

		function addToCartClicked(e) {
			let button = e.target;
			let shopItem = button.parentElement.parentElement.parentElement;
			let title = shopItem.getElementsByClassName('product-title')[0].innerText;
			let price = shopItem.getElementsByClassName('price')[0].innerText;
			let imageSrc = shopItem.getElementsByClassName('product-image')[0].src;
			addItemToCart(title, price, imageSrc);
			updateCartTotal();
		}

		function addItemToCart(title, price, imageSrc) {
			let cartItemsWrapper = document.getElementsByClassName('cart-items')[0];
			let element = document.createElement('div');

			cartItemsNames =
				cartItemsWrapper.getElementsByClassName('cart-item-title');
			for (let i = 0; i < cartItemsNames.length; i++) {
				if (cartItemsNames[i].innerText == title) {
					console.log('Item already added to the Cart');
					return;
				}
			}
			element.classList.add('cart-row', 'd-flex');
			elementContents = `
			<div class="cart-item cart-column d-flex justify-content-around align-items-center">
				<img src="${imageSrc}" alt="Tv" class="img-fluid w-50"/>
				<span class="cart-item-title text-center">${title}</span>
			</div>
			<span class="cart-price cart-item-title cart-column d-flex align-items-center justify-content-center">
				${price}
			</span>
			<div class="cart-quantity cart-header cart-column d-flex justify-content-evenly align-items-center"	>
				<input class="cart-quantity-input" type="number" value="1"/>
				<button class="btn-remove">Remove</button>
			</div>
			`;
			element.innerHTML = elementContents;
			cartItemsWrapper.appendChild(element);
			element
				.getElementsByClassName('btn-remove')[0]
				.addEventListener('click', removeCartItem);
			element
				.getElementsByClassName('cart-quantity-input')[0]
				.addEventListener('change', quantityChanged);
			displayCartWhenAddingItem();
			updateTotalItemsInCart();
		}

		function removeCartItem(e) {
			let buttonClicked = e.target;
			buttonClicked.parentElement.parentElement.remove();
			updateCartTotal();
		}

		function quantityChanged(e) {
			let input = e.target;
			if (isNaN(input.value) || input.value <= 0) {
				input.value = 1;
			}
			console.log('yo');
			updateCartTotal();
		}

		function updateCartTotal() {
			let cartItemContainer = document.getElementsByClassName('cart-items')[0];
			let cartRows = Array.from(
				cartItemContainer.getElementsByClassName('cart-row')
			);
			let total = 0;
			cartRows.forEach((element) => {
				let cartRow = element;
				let priceElement = cartRow.getElementsByClassName('cart-price')[0];
				let quantityElement = cartRow.getElementsByClassName(
					'cart-quantity-input'
				)[0];
				let price = +priceElement.innerText.replace('$', '');
				let quantity = quantityElement.value;
				total = total + price * quantity;
			});

			document.getElementsByClassName('cart-total-price')[0].innerText =
				'$' + total;
		}
		function toggleCartVisibility() {
			let shoppingBag = document.getElementById('total-items');
			let closeWrapperBtn = document.getElementById('close-cart-wrapper');
			shoppingBag.addEventListener('click', toggleCartVisibilityClass);
			closeWrapperBtn.addEventListener('click', toggleCartVisibilityClass);
		}

		function toggleCartVisibilityClass() {
			let cartWrapper = document.getElementById('cart-items-wrapper');
			if (cartWrapper.classList.contains('visible')) {
				cartWrapper.classList.remove('visible');
			} else {
				cartWrapper.classList.add('visible');
			}
		}
		function displayCartWhenAddingItem() {
			let cartWrapper = document.getElementById('cart-items-wrapper');
			if (cartWrapper.classList.contains('visible')) {
				cartWrapper.classList.remove('visible');
			}
		}

		function updateTotalItemsInCart() {
			let totalItems = Array.from(
				document.querySelectorAll('.cart-items .cart-row')
			).length;
			console.log(totalItems);
			let items = document.getElementById('total-items');
			items.innerText = totalItems;
		}

		// FILTER RESET

		$('#reset-btn').click(resetFilter);

		function resetFilter() {
			$('#slider-range').slider('values', 0, 300);
			$('#slider-range').slider('values', 1, 1500);
			$('#selected-colors').html('');
			let icons = $('.icon-check');
			for (let i = 0; i < icons.length; i++) {
				$(icons[i]).css('display', 'none');
			}
			masterCheck.prop('checked', true);
			listCheckedItems.prop('checked', false);
			let listOfColors = colorList;
			let getCheckedValues = fullProductList;
			updateList(300, 1500, getCheckedValues, listOfColors);
		}
	});

	function dropDownCategories() {
		$('.categories').each(function () {
			$(this).click(function () {
				$(this).siblings('.price-range').stop().slideToggle(400);
			});
		});
	}

	// SLICK SLIDER
	$('.autoplay').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 1000,
		variableWidth: true,
		variableHeight: true,
	});
	document.querySelector(
		'.slick-prev'
	).innerHTML = `<i class="fas fa-chevron-left"></i>`;
	document.querySelector(
		'.slick-next'
	).innerHTML = `<i class="fas fa-chevron-right"></i>`;

	dropDownCategories();
});
