function loadProducts(callback) {
    $.ajax({
        type: "GET",
        url: "../Xml/catalog.xml",
        dataType: "xml",
        success: function (xml) {
            var products = [];
            $(xml).find('car').each(function () {
                var brand = $(this).find('brand').text();
                var model = $(this).find('model').text();
                var photo = $(this).find('photo').text();
                var body = $(this).find('body').text();
                var doors = $(this).find('doors').text();
                var speed = $(this).find('speed').text();
                var drive = $(this).find('drive').text() || 'N/A';
                var power = $(this).find('power').text() || 'N/A';
                var cost = parseFloat($(this).find('cost').text().replace('$', '').replace(',', ''));
                var link = $(this).find('link').text() || '#';

                products.push({
                    brand: brand,
                    photo: photo,
                    model: model,
                    body: body,
                    doors: doors,
                    speed: speed,
                    drive: drive,
                    power: power,
                    cost: cost,
                    link: link
                });
            });

            if (callback) callback(products);
        }
    });
}

function displayProducts(products) {
    $('.items').empty();
    var catalogHtml = '';

    products.forEach(function (product) {
        catalogHtml += `
            <div class="cars_containers">
                <a href="${product.link}"><h3 class="cars_text_inside">${product.brand} ${product.model}</h3>
                <img src="${product.photo}" class="car_photos"></a>
                <ul class="menu">
                    <li><h4>Body Type: ${product.body}</h4></li>
                    <li><h4>${product.doors}</h4></li>
                    <li><h4>${product.speed}</h4></li>
                    <li><h4>Type Of Drive: ${product.drive}</h4></li>
                    <li><h4>Power Reserve: ${product.power}</h4></li>
                </ul>
                <h3>Cost: $${product.cost.toFixed(2)}</h3>
            </div>
        `;
    });

    $('.items').append(catalogHtml);
}

$(document).ready(function () {
    $('.filter_submit').hide();
    $('.filter_reset').hide();

    $('select, .price').change(function () {
        $('.filter_submit').show();
        $('.filter_reset').show();
    });

    $('.filter_submit').click(function () {
        var selectedBrand = $('#brandFilter').val();
        var selectedDrive = $('#driveFilter').val();
        var selectedBodyType = $('#body_type_select').val();
        var priceFrom = parseFloat($('#priceFrom').val()) || 0;
        var priceTo = parseFloat($('#priceTo').val()) || Infinity;
        console.log(selectedBrand, selectedBodyType, selectedDrive, priceFrom, priceTo)
        loadProducts(function (products) {
            var filteredProducts = products.filter(function (product) {
                var brandMatch = selectedBrand === "All" || product.brand === selectedBrand;
                var driveMatch = selectedDrive === "All" || product.drive === selectedDrive;
                var bodyTypeMatch = selectedBodyType === "All" || product.body === selectedBodyType;
                var priceMatch = product.cost >= priceFrom && product.cost <= priceTo;
                return brandMatch && driveMatch && bodyTypeMatch && priceMatch;
            });

            displayProducts(filteredProducts);
        });
    });

    $('.filter_reset').click(function () {
        $('#brandFilter').val('All');
        $('#driveFilter').val('All');
        $('#body_type_select').val('All');
        $('#priceFrom').val('');
        $('#priceTo').val('');
        $('.filter_submit').hide();
        $('.filter_reset').hide();
        loadProducts(displayProducts);
    });

    loadProducts(displayProducts);
});
