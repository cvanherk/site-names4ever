/// <reference path="../../definition/jquery.d.ts" />

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$.getJSON('/data/order/' + getParameterByName('order') + '/' + getParameterByName('hash')).done(function (data) {
    ga('require', 'ecommerce', 'ecommerce.js');

    ga('ecommerce:addTransaction', {
        id: data.orderNumber,
        affiliation: 'Names4Ever',
        revenue: data.totalExcludingVat.toFixed(2),
        shipping: '0',
        tax: data.totalVat.toFixed(2)
    });

    var orderdata = [];
    for (var x = 0; x < data.orderLines.length; x++) {
        var orderLine = data.orderLines[x];
        ga('ecommerce:addItem', {
            id: data.orderNumber,
            sku: orderLine.productCode,
            name: orderLine.description,
            category: '',
            price: orderLine.priceIncludingVat.toFixed(2),
            quantity: orderLine.amount
        });

        orderdata.push([orderLine.productCode, orderLine.amount, orderLine.priceIncludingVat]);
    }
    ga('ecommerce:send');

    // Conversiepixels per land
    beslistQueue = [];
    switch (WebPage.Data.country) {
        case 'nl':
            //beslist NL
            beslistQueue.push(['setShopId', '3JHCC39SN']);
            beslistQueue.push(['cps', 'setTestmode', false]);
            beslistQueue.push(['cps', 'setTransactionId', data.orderNumber]);
            beslistQueue.push(['cps', 'setOrdersum', data.totalIncludingVat]);
            beslistQueue.push(['cps', 'setOrderCosts', 0.00]);
            beslistQueue.push(['cps', 'setOrderProducts', orderdata]);
            beslistQueue.push(['cps', 'trackSale']);
            (function () {
                var ba = document.createElement('script');
                ba.async = true;
                ba.src = '//pt1.beslist.nl/pt.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ba, s);
            })();
            break;
        case 'be':
            //beslist BE
            beslistQueue.push(['setShopId', '3JHCCD2SI']);
            beslistQueue.push(['cps', 'setTestmode', false]);
            beslistQueue.push(['cps', 'setTransactionId', data.orderNumber]);
            beslistQueue.push(['cps', 'setOrdersum', data.totalIncludingVat]);
            beslistQueue.push(['cps', 'setOrderCosts', 0.00]);
            beslistQueue.push(['cps', 'setOrderProducts', orderdata]);
            beslistQueue.push(['cps', 'trackSale']);
            (function () {
                var ba = document.createElement('script');
                ba.async = true;
                ba.src = '//pt1.beslist.nl/pt.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ba, s);
            })();
            break;
        case 'gb':
            // become UK
            var pg_pangora_merchant_id = '107147';
            var pg_order_id = data.orderNumber;
            var pg_cart_value = data.totalIncludingVat;
            var pg_currency = 'GBP';
            break;
    }
});
