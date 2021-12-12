// Sort By Filter On Collections START
if (document.getElementById('sort_by') != null) {
	var select = document.querySelector('#sort_by');
	select.addEventListener('change', function (e) {
		var url = new URL(window.location.href);
		url.searchParams.set('sort_by', e.currentTarget.value);
		window.location = url.href;
	});
}
// Sort By Filter On Collections END

// Slick Slider START
$(document).ready(function () {
	$('.product-slider-for').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		asNavFor: '.product-slider-nav',
	});
	$('.product-slider-nav').slick({
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.product-slider-for',
		dots: true,
		centerMode: true,
		focusOnSelect: true,
	});
});
// Slick Slider END

// Mobile Menu START
$(document).ready(function () {
	var vw = $(window).width();
	var viewportWidth = vw + 17;

	if (viewportWidth < 992) {
		var element = $('.has-dropdown');
		element.click(function (event) {
			event.preventDefault();
		});

		$('.nav-link').click(function () {
			var $content = $(this).next('.dropdown-menu');
			$content.slideToggle();
			$(this).toggleClass('active');
		});
	}
});
// Mobile Menu END

// Address Page Fetch Province START
var selectCountry = document.getElementById('AddressCountryNew');

if (selectCountry != null) {
	selectCountry.addEventListener('change', function (e) {
		var provinces =
			this.options[this.selectedIndex].getAttribute('data-provinces');
		var provinceSelector = document.getElementById('AddressProvinceNew');
		var provinceArray = JSON.parse(provinces);
		// console.log(provinceArray);

		if (provinceArray.length < 1) {
			provinceSelector.setAttribute('disabled', 'disabled');
		} else {
			provinceSelector.removeAttribute('disabled');
		}

		provinceSelector.innerHTML = '';
		var options = '';
		for (var i = 0; i < provinceArray.length; i++) {
			options += `<option value="${provinceArray[i][0]}">${provinceArray[i][0]}</option>`;
		}
		provinceSelector.innerHTML = options;
	});
}
// Address Page Fetch Province END

// Forgot Password Popup
var forgotPassword = document.getElementById('forgotPassword');
var forgotPasswordForm = document.getElementById('forgotPasswordForm');

if (forgotPassword != null) {
	forgotPassword.addEventListener('click', function (e) {
		setTimeout(function () {
			forgotPasswordForm.classList.toggle('is-visible');
		}, 20);
	});
}
// Forgot Password Popup

// Language Selector
var localeItems = document.querySelectorAll('#localeItem');
if (localeItems.length > 0) {
	localeItems.forEach((item) => {
		item.addEventListener('click', (event) => {
			document.getElementById('localeCode').value = item.getAttribute('lang');
			document.getElementById('localization_form_tag').submit();
		});
	});
}
// Language Selector

// Product API
var productInfoAnchors = document.querySelectorAll('#productInfoAnchor');
var productModal = new bootstrap.Modal(
	document.getElementById('productInfoModal'),
	{}
);
if (productInfoAnchors.length > 0) {
	productInfoAnchors.forEach((item) => {
		item.addEventListener('click', (event) => {
			var url = '/products/' + item.getAttribute('product-handle') + '.js';
			fetch(url)
				.then((resp) => resp.json())
				.then(function (data) {
					console.log(data);
					document.getElementById('productInfoImage').src = data.images[0];
					document.getElementById('productInfoTitle').innerHTML = data.title;
					document.getElementById('productInfoPrice').innerHTML =
						item.getAttribute('product-price');
					document.getElementById('productInfoDescription').innerHTML =
						data.description;
					// document.getElementById('modalItemID').value = data.variants[0].id;
					var variants = data.variants;
					var variantSelect = document.getElementById('modalItemID');
					variantSelect.innerHTML = '';
					variants.forEach(function (variant, index) {
						console.log(variant);
						if (variant.available == true) {
							variantSelect.options[variantSelect.options.length] = new Option(
								variant.option1,
								variant.id
							);
						}
					});
					productModal.show();
					if (data.available == false) {
						document
							.getElementById('modal_add_to_cart')
							.setAttribute('disabled', 'disabled');
						console.log('Product Not available');
					} else {
						document
							.getElementById('modal_add_to_cart')
							.removeAttribute('disabled');
						console.log('Product available');
					}
				});
		});
	});
}
// Product API

//Cart API
var modalAddToCartForm = document.querySelector('#addToCartForms');

if (modalAddToCartForm != null) {
	modalAddToCartForm.addEventListener('submit', function (e) {
		e.preventDefault();
		let formData = {
			items: [
				{
					id: document.getElementById('modalItemID').value,
					quantity: document.getElementById('modalItemQuantity').value,
				},
			],
		};

		fetch('/cart/add.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then((resp) => {
				console.log(resp.status);
				if (resp.ok) {
					return resp.json();
				} else {
					alert('Out of stock');
				}
			})
			.then((data) => update_cart())
			.then((data) => loadDrawerCart())
			.catch((err) => {
				console.log('Error:' + err);
			});
	});
}

function update_cart() {
	fetch('/cart.js')
		.then((resp) => resp.json())
		.then(
			(data) =>
				(document.getElementById('cart_items').innerHTML = data.items.length)
		)
		.catch((err) => console.log(err));
}

document.addEventListener('DOMContentLoaded', function () {
	update_cart();
});
//Cart API

//Cart Drawer

var offcanvasCartDrawer = document.getElementById('offcanvasCartDrawer');
var bsoffcanvasDrawer = new bootstrap.Offcanvas(offcanvasCartDrawer);
var cart = document.getElementById('cart');

cart.addEventListener('click', function (e) {	
	loadDrawerCart();
	e.stopPropagation();
});


function loadDrawerCart() {	
	fetch('/cart.js')
		.then((resp) => resp.json())
		.then(function (data) {
			console.log(data);
			document.getElementById('cart_drawer_body').innerHTML = '';
			if (data.items.length > 0) {
				document.getElementById('offcanvas-buttons').innerHTML = `<a href="/cart" class="btn btn-secondary w-100">View Cart</a>`;
				data.items.forEach(function (product, index) {
					var property = product.properties;

					for (var key in property) {
						console.log(property[key]);
						var value = property[key];
					}
					document.getElementById('cart_drawer_body').innerHTML += 
					`<div class="card my-3 cart-drawer-item">
						<div class="cart-drawer-image">
							<img width="200" class="lazyload blur-up" data-src="${product.image}&width=300"></img>
						</div>
						<div class="card-body cart-drawer-details">
						<h5 class="card-title">${product.title}</h5>$${product.price / 100}<br>Gift:${value}
						</div>
					</div>`;
				});
			} else {
				document.getElementById('cart_drawer_body').innerHTML = '<h3>The Cart Is Empty</h3>';
			}
		})		
		.catch((err) => console.log(err));
		bsoffcanvasDrawer.show();
}
//Cart Drawer

// Predictive Search

var predictiveSearch = document.getElementById('search');
var timer;
var offcanvasSearch = document.getElementById('offcanvasSearchResult');
var bsoffcanvas = new bootstrap.Offcanvas(offcanvasSearch);

if (predictiveSearch != null) {
	predictiveSearch.addEventListener('input', function (e) {
		clearTimeout(timer);
		if (predictiveSearch.value) {
			timer = setTimeout(fetchPredictiveSearch, 3000);
		}
	});
}

function fetchPredictiveSearch() {
	fetch(
		`/search/suggest.json?q=${predictiveSearch.value}&resources[type]=product`
	)
		.then((resp) => resp.json())
		.then((data) => {
			console.log(data);
			var products = data.resources.results.products;
			document.getElementById('search_results_body').innerHTML = '';
			products.forEach(function (product, index) {
				document.getElementById('search_results_body').innerHTML += `
				<div class="card my-3" style="width: 100%">
					<a href="${product.url}"><img width="200" data-src="${product.image}&width=300" class="lazyload blur-up"></a>
					<div class="card-body">
						<h5 class="card-title"><a href="${product.url}">${product.title}</a></h5>
						<p class="card-text">$${product.price}</p>
					</div>
				</div>
				`;
			});
			bsoffcanvas.show();
		});
}
// Predictive Search


