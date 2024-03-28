// Product interface'ini implemente eden ProductClass sınıfı
var ProductClass = /** @class */ (function () {
    function ProductClass(id, title, price, image, description) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.image = image;
        this.description = description;
    }
    return ProductClass;
}());
// Ürün detaylarını göstermek için fonksiyon
function showProductDetails(product) {
    // Ürün bilgilerini içeren bir query string oluştur
    var queryString = "?id=".concat(product.id, "&title=").concat(encodeURIComponent(product.title), "&price=").concat(product.price, "&image=").concat(encodeURIComponent(product.image), "&description=").concat(encodeURIComponent(product.description || ''));
    // Detay sayfasına yönlendir, query string'i parametre olarak ekleyerek
    window.location.href = "product-details.html".concat(queryString);
}
document.addEventListener('DOMContentLoaded', function () {
    fetch('https://fakestoreapi.com/products')
        .then(function (res) { return res.json(); })
        .then(function (data) {
        console.log(data); // Veriyi konsola yazdır
        // Aşağıdaki kısım sadece bir HTML belgesinde çalışır.
        var productsContainer = document.getElementById('products');
        if (productsContainer) {
            data.forEach(function (productData) {
                var product = new ProductClass(productData.id, productData.title, productData.price, productData.image, productData.description);
                console.log(product); // Ürün bilgilerini konsola yazdır
                // Ürün kartını oluştur ve ekrana ekle
                var productCard = document.createElement('div');
                productCard.classList.add('col-md-4', 'col-lg-4', 'col-xl-4', 'mt-4');
                productCard.innerHTML = "\n                        <div class=\"card\">\n                            <img src=\"".concat(product.image, "\" class=\"card-img-top product-img\" alt=\"").concat(product.title, "\">\n                            <div class=\"card-body\">\n                                <h5 class=\"card-title\">").concat(product.title, "</h5>\n                                <p class=\"card-text\">").concat(product.description || '', "</p>\n                                <div class=\"price\"><strong>Fiyat: </strong>").concat(product.price, " TL</div>\n                                <div class=\"mt-auto\">\n                                    <button class=\"btn btn-primary btn-block add-to-cart\" data-id=\"").concat(product.id, "\">Sepete Ekle</button>\n                                </div>\n                            </div>\n                        </div>\n                    ");
                productsContainer.appendChild(productCard);
                // Resme tıklanıldığında ürün detaylarını göster
                var productImg = productCard.querySelector('.product-img');
                if (productImg) {
                    productImg.addEventListener('click', function () {
                        showProductDetails(product);
                    });
                }
            });
        }
    });
    var cartIcon = document.querySelector('.cart-icon');
    var cartCount = document.querySelector('.cart-count');
    var itemCount = 0;
    var productList = [];
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-to-cart')) {
            var button = event.target;
            var productCard = button.closest('.card');
            var productTitle = productCard.querySelector('.card-title').textContent;
            var productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('Fiyat: ', '').replace(' TL', ''));
            var productImage = productCard.querySelector('.card-img-top').getAttribute('src');
            var productId = parseInt(button.getAttribute('data-id') || '0');
            var productDescription = productCard.querySelector('.card-text').textContent.trim();
            var product = { id: productId, title: productTitle, price: productPrice, image: productImage, description: productDescription };
            productList.push(product);
            itemCount++;
            if (cartCount)
                cartCount.textContent = itemCount.toString();
            localStorage.setItem('cartItems', JSON.stringify(productList));
        }
    });
    if (cartIcon) {
        cartIcon.addEventListener('click', function () {
            window.location.href = 'cart.html';
        });
    }
    var cartItemsContainer = document.getElementById('cart-items');
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItemsContainer) {
        cartItems.forEach(function (item) {
            var itemCard = document.createElement('div');
            itemCard.classList.add('card', 'mb-3');
            itemCard.innerHTML = "\n                <div class=\"row no-gutters\">\n                    <div class=\"col-md-4\">\n                        <img src=\"".concat(item.image, "\" class=\"card-img\" alt=\"").concat(item.title, "\">\n                    </div>\n                    <div class=\"col-md-8\">\n                        <div class=\"card-body\">\n                            <h5 class=\"card-title\">").concat(item.title, "</h5>\n                            <p class=\"card-text\">").concat(item.description || '', "</p> <!-- A\u00E7\u0131klama buraya ekleniyor -->\n                            <p class=\"card-text\">Fiyat: ").concat(item.price, " TL</p>\n                        </div>\n                    </div>\n                </div>\n            ");
            cartItemsContainer.appendChild(itemCard);
        });
    }
});
