// Ürün bilgilerini temsil etmek için Product interface'i
interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description?: string; // Opsiyonel alan
}

// Product interface'ini implemente eden ProductClass sınıfı
class ProductClass implements Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description?: string; // Opsiyonel alan

    constructor(id: number, title: string, price: number, image: string, description?: string) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.image = image;
        this.description = description;
    }
}

// Ürün detaylarını göstermek için fonksiyon
function showProductDetails(product: Product) {
    // Ürün bilgilerini içeren bir query string oluştur
    const queryString = `?id=${product.id}&title=${encodeURIComponent(product.title)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}`;
    // Detay sayfasına yönlendir, query string'i parametre olarak ekleyerek
    window.location.href = `product-details.html${queryString}`;
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then((data: any[]) => {
            console.log(data); // Veriyi konsola yazdır

            // Aşağıdaki kısım sadece bir HTML belgesinde çalışır.
            let productsContainer = document.getElementById('products');

            if (productsContainer) {
                data.forEach(productData => {
                    const product: Product = new ProductClass(
                        productData.id,
                        productData.title,
                        productData.price,
                        productData.image,
                        productData.description
                    );

                    console.log(product); // Ürün bilgilerini konsola yazdır

                    // Ürün kartını oluştur ve ekrana ekle
                    const productCard = document.createElement('div');
                    productCard.classList.add('col-md-4', 'col-lg-4', 'col-xl-4', 'mt-4');

                    productCard.innerHTML = `
                        <div class="card">
                            <img src="${product.image}" class="card-img-top product-img" alt="${product.title}">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.description || ''}</p>
                                <div class="price"><strong>Fiyat: </strong>${product.price} TL</div>
                                <div class="mt-auto">
                                    <button class="btn btn-primary btn-block add-to-cart" data-id="${product.id}">Sepete Ekle</button>
                                </div>
                            </div>
                        </div>
                    `;

                    productsContainer.appendChild(productCard);

                    // Resme tıklanıldığında ürün detaylarını göster
                    const productImg = productCard.querySelector('.product-img');
                    if (productImg) {
                        productImg.addEventListener('click', function() {
                            showProductDetails(product);
                        });
                    }
                });
            }
        });


    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    let itemCount = 0;
    const productList: Product[] = [];

    document.addEventListener('click', function(event) {
        if ((event.target as HTMLElement).classList.contains('add-to-cart')) {
            const button = event.target as HTMLElement;

            const productCard = button.closest('.card');
            const productTitle = productCard.querySelector('.card-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('Fiyat: ', '').replace(' TL', ''));
            const productImage = productCard.querySelector('.card-img-top').getAttribute('src');
            const productId = parseInt(button.getAttribute('data-id') || '0');
            const productDescription = productCard.querySelector('.card-text').textContent.trim();

            const product: Product = { id: productId, title: productTitle, price: productPrice, image: productImage, description: productDescription };
            productList.push(product);

            itemCount++;
            if (cartCount) cartCount.textContent = itemCount.toString();

            localStorage.setItem('cartItems', JSON.stringify(productList));
        }
    });

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    const cartItemsContainer = document.getElementById('cart-items');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItemsContainer) {
        cartItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('card', 'mb-3');

            itemCard.innerHTML = `
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${item.image}" class="card-img" alt="${item.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.description || ''}</p> <!-- Açıklama buraya ekleniyor -->
                            <p class="card-text">Fiyat: ${item.price} TL</p>
                        </div>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(itemCard);
        });
    }
});
