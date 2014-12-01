/// <reference path="../../definition/jquery.d.ts"/>
/// <reference path="../../../../../Hybrid SaaS/Hybrid SaaS Software (Aspekto)/Hybrid SaaS Software/Website/Core/Website/Script/Product-detail.ts" />

//--------------------------------------------------------
module WebPage {
    export module References {
        export var $ringName: JQuery;
        export var $maxChars: JQuery;
        export var $ringType: JQuery;
        export var $ringWidth: JQuery;
        export var $ringFont: JQuery;
        export var $ringSize: JQuery;

        export var $imageBig: JQuery;

        export var ringInfo: RingInfo;

        export var $productCode: JQuery;
        export var $productDescription: JQuery;
        export var $productDetails: JQuery;
        export var $productPrice: JQuery;
    }

    export module Data {
        export var material: string = "Silver";
    }

    export module RingConfigurator {

        export function SetRingInfo() {

            //todo: aanpassen voor Steel:!!!
            

            var type = WebPage.References.$ringType.val().substring(0, 1).toUpperCase();
            var width = WebPage.References.$ringWidth.val();
            var font = WebPage.References.$ringFont.val();
            var size = WebPage.References.$ringSize.val();

            var lastProduct = WebPage.References.ringInfo ? WebPage.References.ringInfo.productCode : null;
            WebPage.References.ringInfo = ringData[Data.material][width][type][font][size];

            if (lastProduct != WebPage.References.ringInfo.productCode) {
                UpdateProduct(WebPage.References.ringInfo);
            }
        }

        // product aanpassen
        export function UpdateProduct(ringInfo: RingInfo) {

            //set max size
            References.$ringName.attr('maxlength', ringInfo.maxSize);

            //truncate value if needed
            var value = WebPage.References.$ringName.val();
            if (value.length > WebPage.References.ringInfo.maxSize) {
                value = value.substring(0, WebPage.References.ringInfo.maxSize);
                WebPage.References.$ringName.val(value);
            }

            //update productcode:

            //update image
            WebPage.References.$imageBig.attr('src', '/image/product/' + encodeURIComponent(ringInfo.interactionCode) + '?width=400&height=280')

            //load new info
            $.getJSON('/data/product/' + encodeURIComponent(ringInfo.interactionCode) + '/description/details/price/guid')

                .done((data) => {

                    WebPage.Data.productGuid = data.guid;
                    WebPage.References.$productCode.text(ringInfo.productCode);
                    WebPage.References.$productDescription.text(data.description);
                    WebPage.References.$productDetails.text(data.details);
                    WebPage.References.$productPrice.text(data.price.toStringFormat(2));
            });


            



            WebPage.RingConfigurator.CheckTextSize();
        }

        export function CheckTextSize() {

           
            var rest = WebPage.References.ringInfo.maxSize - WebPage.References.$ringName.val().length

            var displayText = '';
            switch (WebPage.Data.language) {
                case 'nl':
                {
                    displayText = 'Maximaal <span>' + WebPage.References.ringInfo.maxSize + '</span> tekens, <span>' + rest + '</span> ' + (rest == 1 ? 'teken' : 'tekens') + ' resterend';
                    break;
                }
                case 'de':
                {
                    displayText = 'Max. <span>' + WebPage.References.ringInfo.maxSize + '</span> zeichen <span>' + rest + '</span> restliche zeichen';
                    break;
                }
                case 'en':
                {
                    displayText = 'Maximum of <span>' + WebPage.References.ringInfo.maxSize + '</span> character, <span>' + rest + '</span> ' + (rest == 1 ? 'character' : 'characters') + ' remaining';
                    break;
                }
            }

            var word = (rest == 1) ? 'teken' : 'tekens';

            WebPage.References.$maxChars.html('Maximaal <span>' + WebPage.References.ringInfo.maxSize + '</span> tekens, <span>' + rest + '</span> ' + word + ' resterend');
        }
    }
}

WebPage.Events.on(WebPage.EventType.Load, () => {

    init();

    WebPage.References.$ringName = $('#ringname');
    WebPage.References.$maxChars = $('<div class="max-letters"></div>');

    WebPage.References.$ringType = $('#ringtype');
    WebPage.References.$ringWidth = $('#ringwidth');
    WebPage.References.$ringFont = $('#ringfont');
    WebPage.References.$ringSize = $('#ringsize');


    WebPage.References.$productCode = $('.productcode');
    WebPage.References.$productDescription = $('.description');
    WebPage.References.$productDetails = $('.details');
    WebPage.References.$productPrice = $('.price-value');
    WebPage.References.$imageBig = $('#imagebig');

    //load ring config
    WebPage.RingConfigurator.SetRingInfo();


    //handle onchange op selectboxes
    $('.product-options select').on('change', () => {
        WebPage.RingConfigurator.SetRingInfo();
    });

    WebPage.References.$ringName.after(WebPage.References.$maxChars);
    WebPage.References.$ringName
        .on('keyup change', () => {
            WebPage.RingConfigurator.CheckTextSize();
        })
        .on('cut paste', () => {
            setTimeout(WebPage.RingConfigurator.CheckTextSize, 100);
        });
});

class RingInfo {
    public productCode;
    public interactionCode;
    public maxSize;
}

var ringData = {};
function ring(material, width, type, font, size, max) {

    var productCode = '';

    switch (material) {
        case 'Silver':
            productCode += 'ZTR';
            break;
        case 'Steel':
            productCode += 'STR';
            break;
    }

    productCode += width;
    productCode += type;
    productCode += '-';
    productCode += font;
    productCode += '.';
    productCode += size;

    var interactionCode = productCode.replace(/\./g, '-');

    ringData[material] = ringData[material] || {};
    ringData[material][width] = ringData[material][width] || {};
    ringData[material][width][type] = ringData[material][width][type] || {};
    ringData[material][width][type][font] = ringData[material][width][type][font] || {};
    ringData[material][width][type][font][size] = ringData[material][width][type][font][size] || new RingInfo();

    ringData[material][width][type][font][size].productCode = productCode;
    ringData[material][width][type][font][size].maxSize = max;
    ringData[material][width][type][font][size].interactionCode = interactionCode.replace(/\./g, '-');
}

function init() {

    ring('Silver', 4, 'B', 'Kristen', 16, 33);
    ring('Silver', 4, 'B', 'Kristen', 16.5, 33);
    ring('Silver', 4, 'B', 'Kristen', 17, 34);
    ring('Silver', 4, 'B', 'Kristen', 17.5, 34);
    ring('Silver', 4, 'B', 'Kristen', 18, 36);
    ring('Silver', 4, 'B', 'Kristen', 18.5, 36);
    ring('Silver', 4, 'B', 'Kristen', 19, 38);
    ring('Silver', 4, 'B', 'Kristen', 19.5, 38);
    ring('Silver', 4, 'B', 'Kristen', 20, 40);
    ring('Silver', 4, 'B', 'Kristen', 20.5, 40);
    ring('Silver', 4, 'B', 'Kristen', 21, 42);
    ring('Silver', 4, 'B', 'Kristen', 21.5, 42);
    ring('Silver', 4, 'B', 'Digital', 16, 31);
    ring('Silver', 4, 'B', 'Digital', 16.5, 31);
    ring('Silver', 4, 'B', 'Digital', 17, 32);
    ring('Silver', 4, 'B', 'Digital', 17.5, 32);
    ring('Silver', 4, 'B', 'Digital', 18, 34);
    ring('Silver', 4, 'B', 'Digital', 18.5, 34);
    ring('Silver', 4, 'B', 'Digital', 19, 35);
    ring('Silver', 4, 'B', 'Digital', 19.5, 35);
    ring('Silver', 4, 'B', 'Digital', 20, 37);
    ring('Silver', 4, 'B', 'Digital', 20.5, 37);
    ring('Silver', 4, 'B', 'Digital', 21, 38);
    ring('Silver', 4, 'B', 'Digital', 21.5, 38);
    ring('Silver', 4, 'B', 'Palazzo', 16, 37);
    ring('Silver', 4, 'B', 'Palazzo', 16.5, 37);
    ring('Silver', 4, 'B', 'Palazzo', 17, 38);
    ring('Silver', 4, 'B', 'Palazzo', 17.5, 38);
    ring('Silver', 4, 'B', 'Palazzo', 18, 39);
    ring('Silver', 4, 'B', 'Palazzo', 18.5, 39);
    ring('Silver', 4, 'B', 'Palazzo', 19, 42);
    ring('Silver', 4, 'B', 'Palazzo', 19.5, 42);
    ring('Silver', 4, 'B', 'Palazzo', 20, 44);
    ring('Silver', 4, 'B', 'Palazzo', 20.5, 44);
    ring('Silver', 4, 'B', 'Palazzo', 21, 46);
    ring('Silver', 4, 'B', 'Palazzo', 21.5, 46);
    ring('Silver', 4, 'B', 'Stencil', 16, 33);
    ring('Silver', 4, 'B', 'Stencil', 16.5, 33);
    ring('Silver', 4, 'B', 'Stencil', 17, 35);
    ring('Silver', 4, 'B', 'Stencil', 17.5, 35);
    ring('Silver', 4, 'B', 'Stencil', 18, 36);
    ring('Silver', 4, 'B', 'Stencil', 18.5, 36);
    ring('Silver', 4, 'B', 'Stencil', 19, 38);
    ring('Silver', 4, 'B', 'Stencil', 19.5, 38);
    ring('Silver', 4, 'B', 'Stencil', 20, 40);
    ring('Silver', 4, 'B', 'Stencil', 20.5, 40);
    ring('Silver', 4, 'B', 'Stencil', 21, 42);
    ring('Silver', 4, 'B', 'Stencil', 21.5, 42);
    ring('Silver', 4, 'B', 'Typewriter', 16, 33);
    ring('Silver', 4, 'B', 'Typewriter', 16.5, 33);
    ring('Silver', 4, 'B', 'Typewriter', 17, 34);
    ring('Silver', 4, 'B', 'Typewriter', 17.5, 34);
    ring('Silver', 4, 'B', 'Typewriter', 18, 36);
    ring('Silver', 4, 'B', 'Typewriter', 18.5, 36);
    ring('Silver', 4, 'B', 'Typewriter', 19, 38);
    ring('Silver', 4, 'B', 'Typewriter', 19.5, 38);
    ring('Silver', 4, 'B', 'Typewriter', 20, 40);
    ring('Silver', 4, 'B', 'Typewriter', 20.5, 40);
    ring('Silver', 4, 'B', 'Typewriter', 21, 42);
    ring('Silver', 4, 'B', 'Typewriter', 21.5, 42);
    ring('Silver', 4, 'B', 'Viva', 16, 22);
    ring('Silver', 4, 'B', 'Viva', 16.5, 22);
    ring('Silver', 4, 'B', 'Viva', 17, 22);
    ring('Silver', 4, 'B', 'Viva', 17.5, 22);
    ring('Silver', 4, 'B', 'Viva', 18, 23);
    ring('Silver', 4, 'B', 'Viva', 18.5, 23);
    ring('Silver', 4, 'B', 'Viva', 19, 24);
    ring('Silver', 4, 'B', 'Viva', 19.5, 24);
    ring('Silver', 4, 'B', 'Viva', 20, 26);
    ring('Silver', 4, 'B', 'Viva', 20.5, 26);
    ring('Silver', 4, 'B', 'Viva', 21, 27);
    ring('Silver', 4, 'B', 'Viva', 21.5, 27);
    ring('Silver', 4, 'V', 'Kristen', 16, 33);
    ring('Silver', 4, 'V', 'Kristen', 16.5, 33);
    ring('Silver', 4, 'V', 'Kristen', 17, 34);
    ring('Silver', 4, 'V', 'Kristen', 17.5, 34);
    ring('Silver', 4, 'V', 'Kristen', 18, 36);
    ring('Silver', 4, 'V', 'Kristen', 18.5, 36);
    ring('Silver', 4, 'V', 'Kristen', 19, 38);
    ring('Silver', 4, 'V', 'Kristen', 19.5, 38);
    ring('Silver', 4, 'V', 'Kristen', 20, 40);
    ring('Silver', 4, 'V', 'Kristen', 20.5, 40);
    ring('Silver', 4, 'V', 'Kristen', 21, 42);
    ring('Silver', 4, 'V', 'Kristen', 21.5, 42);
    ring('Silver', 4, 'V', 'Digital', 16, 31);
    ring('Silver', 4, 'V', 'Digital', 16.5, 31);
    ring('Silver', 4, 'V', 'Digital', 17, 32);
    ring('Silver', 4, 'V', 'Digital', 17.5, 32);
    ring('Silver', 4, 'V', 'Digital', 18, 34);
    ring('Silver', 4, 'V', 'Digital', 18.5, 34);
    ring('Silver', 4, 'V', 'Digital', 19, 35);
    ring('Silver', 4, 'V', 'Digital', 19.5, 35);
    ring('Silver', 4, 'V', 'Digital', 20, 37);
    ring('Silver', 4, 'V', 'Digital', 20.5, 37);
    ring('Silver', 4, 'V', 'Digital', 21, 38);
    ring('Silver', 4, 'V', 'Digital', 21.5, 38);
    ring('Silver', 4, 'V', 'Palazzo', 16, 37);
    ring('Silver', 4, 'V', 'Palazzo', 16.5, 37);
    ring('Silver', 4, 'V', 'Palazzo', 17, 38);
    ring('Silver', 4, 'V', 'Palazzo', 17.5, 38);
    ring('Silver', 4, 'V', 'Palazzo', 18, 39);
    ring('Silver', 4, 'V', 'Palazzo', 18.5, 39);
    ring('Silver', 4, 'V', 'Palazzo', 19, 42);
    ring('Silver', 4, 'V', 'Palazzo', 19.5, 42);
    ring('Silver', 4, 'V', 'Palazzo', 20, 44);
    ring('Silver', 4, 'V', 'Palazzo', 20.5, 44);
    ring('Silver', 4, 'V', 'Palazzo', 21, 46);
    ring('Silver', 4, 'V', 'Palazzo', 21.5, 46);
    ring('Silver', 4, 'V', 'Stencil', 16, 33);
    ring('Silver', 4, 'V', 'Stencil', 16.5, 33);
    ring('Silver', 4, 'V', 'Stencil', 17, 35);
    ring('Silver', 4, 'V', 'Stencil', 17.5, 35);
    ring('Silver', 4, 'V', 'Stencil', 18, 36);
    ring('Silver', 4, 'V', 'Stencil', 18.5, 36);
    ring('Silver', 4, 'V', 'Stencil', 19, 38);
    ring('Silver', 4, 'V', 'Stencil', 19.5, 38);
    ring('Silver', 4, 'V', 'Stencil', 20, 40);
    ring('Silver', 4, 'V', 'Stencil', 20.5, 40);
    ring('Silver', 4, 'V', 'Stencil', 21, 42);
    ring('Silver', 4, 'V', 'Stencil', 21.5, 42);
    ring('Silver', 4, 'V', 'Typewriter', 16, 33);
    ring('Silver', 4, 'V', 'Typewriter', 16.5, 33);
    ring('Silver', 4, 'V', 'Typewriter', 17, 34);
    ring('Silver', 4, 'V', 'Typewriter', 17.5, 34);
    ring('Silver', 4, 'V', 'Typewriter', 18, 36);
    ring('Silver', 4, 'V', 'Typewriter', 18.5, 36);
    ring('Silver', 4, 'V', 'Typewriter', 19, 38);
    ring('Silver', 4, 'V', 'Typewriter', 19.5, 38);
    ring('Silver', 4, 'V', 'Typewriter', 20, 40);
    ring('Silver', 4, 'V', 'Typewriter', 20.5, 40);
    ring('Silver', 4, 'V', 'Typewriter', 21, 42);
    ring('Silver', 4, 'V', 'Typewriter', 21.5, 42);
    ring('Silver', 4, 'V', 'Viva', 16, 22);
    ring('Silver', 4, 'V', 'Viva', 16.5, 22);
    ring('Silver', 4, 'V', 'Viva', 17, 22);
    ring('Silver', 4, 'V', 'Viva', 17.5, 22);
    ring('Silver', 4, 'V', 'Viva', 18, 23);
    ring('Silver', 4, 'V', 'Viva', 18.5, 23);
    ring('Silver', 4, 'V', 'Viva', 19, 24);
    ring('Silver', 4, 'V', 'Viva', 19.5, 24);
    ring('Silver', 4, 'V', 'Viva', 20, 26);
    ring('Silver', 4, 'V', 'Viva', 20.5, 26);
    ring('Silver', 4, 'V', 'Viva', 21, 27);
    ring('Silver', 4, 'V', 'Viva', 21.5, 27);
    ring('Silver', 6, 'B', 'Kristen', 16, 26);
    ring('Silver', 6, 'B', 'Kristen', 16.5, 26);
    ring('Silver', 6, 'B', 'Kristen', 17, 28);
    ring('Silver', 6, 'B', 'Kristen', 17.5, 28);
    ring('Silver', 6, 'B', 'Kristen', 18, 29);
    ring('Silver', 6, 'B', 'Kristen', 18.5, 29);
    ring('Silver', 6, 'B', 'Kristen', 19, 31);
    ring('Silver', 6, 'B', 'Kristen', 19.5, 32);
    ring('Silver', 6, 'B', 'Kristen', 20, 32);
    ring('Silver', 6, 'B', 'Kristen', 20.5, 32);
    ring('Silver', 6, 'B', 'Kristen', 21, 33);
    ring('Silver', 6, 'B', 'Kristen', 21.5, 33);
    ring('Silver', 6, 'B', 'Digital', 16, 22);
    ring('Silver', 6, 'B', 'Digital', 16.5, 22);
    ring('Silver', 6, 'B', 'Digital', 17, 23);
    ring('Silver', 6, 'B', 'Digital', 17.5, 23);
    ring('Silver', 6, 'B', 'Digital', 18, 24);
    ring('Silver', 6, 'B', 'Digital', 18.5, 24);
    ring('Silver', 6, 'B', 'Digital', 19, 27);
    ring('Silver', 6, 'B', 'Digital', 19.5, 27);
    ring('Silver', 6, 'B', 'Digital', 20, 28);
    ring('Silver', 6, 'B', 'Digital', 20.5, 28);
    ring('Silver', 6, 'B', 'Digital', 21, 29);
    ring('Silver', 6, 'B', 'Digital', 21.5, 29);
    ring('Silver', 6, 'B', 'Palazzo', 16, 22);
    ring('Silver', 6, 'B', 'Palazzo', 16.5, 22);
    ring('Silver', 6, 'B', 'Palazzo', 17, 23);
    ring('Silver', 6, 'B', 'Palazzo', 17.5, 23);
    ring('Silver', 6, 'B', 'Palazzo', 18, 25);
    ring('Silver', 6, 'B', 'Palazzo', 18.5, 25);
    ring('Silver', 6, 'B', 'Palazzo', 19, 26);
    ring('Silver', 6, 'B', 'Palazzo', 19.5, 26);
    ring('Silver', 6, 'B', 'Palazzo', 20, 27);
    ring('Silver', 6, 'B', 'Palazzo', 20.5, 27);
    ring('Silver', 6, 'B', 'Palazzo', 21, 29);
    ring('Silver', 6, 'B', 'Palazzo', 21.5, 29);
    ring('Silver', 6, 'B', 'Stencil', 16, 24);
    ring('Silver', 6, 'B', 'Stencil', 16.5, 24);
    ring('Silver', 6, 'B', 'Stencil', 17, 26);
    ring('Silver', 6, 'B', 'Stencil', 17.5, 26);
    ring('Silver', 6, 'B', 'Stencil', 18, 27);
    ring('Silver', 6, 'B', 'Stencil', 18.5, 27);
    ring('Silver', 6, 'B', 'Stencil', 19, 29);
    ring('Silver', 6, 'B', 'Stencil', 19.5, 29);
    ring('Silver', 6, 'B', 'Stencil', 20, 30);
    ring('Silver', 6, 'B', 'Stencil', 20.5, 30);
    ring('Silver', 6, 'B', 'Stencil', 21, 31);
    ring('Silver', 6, 'B', 'Stencil', 21.5, 31);
    ring('Silver', 6, 'B', 'Typewriter', 16, 25);
    ring('Silver', 6, 'B', 'Typewriter', 16.5, 25);
    ring('Silver', 6, 'B', 'Typewriter', 17, 27);
    ring('Silver', 6, 'B', 'Typewriter', 17.5, 27);
    ring('Silver', 6, 'B', 'Typewriter', 18, 28);
    ring('Silver', 6, 'B', 'Typewriter', 18.5, 28);
    ring('Silver', 6, 'B', 'Typewriter', 19, 30);
    ring('Silver', 6, 'B', 'Typewriter', 19.5, 30);
    ring('Silver', 6, 'B', 'Typewriter', 20, 31);
    ring('Silver', 6, 'B', 'Typewriter', 20.5, 31);
    ring('Silver', 6, 'B', 'Typewriter', 21, 33);
    ring('Silver', 6, 'B', 'Typewriter', 21.5, 33);
    ring('Silver', 6, 'B', 'Viva', 16, 15);
    ring('Silver', 6, 'B', 'Viva', 16.5, 15);
    ring('Silver', 6, 'B', 'Viva', 17, 15);
    ring('Silver', 6, 'B', 'Viva', 17.5, 15);
    ring('Silver', 6, 'B', 'Viva', 18, 16);
    ring('Silver', 6, 'B', 'Viva', 18.5, 16);
    ring('Silver', 6, 'B', 'Viva', 19, 17);
    ring('Silver', 6, 'B', 'Viva', 19.5, 17);
    ring('Silver', 6, 'B', 'Viva', 20, 18);
    ring('Silver', 6, 'B', 'Viva', 20.5, 18);
    ring('Silver', 6, 'B', 'Viva', 21, 19);
    ring('Silver', 6, 'B', 'Viva', 21.5, 19);
    ring('Silver', 6, 'V', 'Kristen', 16, 26);
    ring('Silver', 6, 'V', 'Kristen', 16.5, 26);
    ring('Silver', 6, 'V', 'Kristen', 17, 28);
    ring('Silver', 6, 'V', 'Kristen', 17.5, 28);
    ring('Silver', 6, 'V', 'Kristen', 18, 29);
    ring('Silver', 6, 'V', 'Kristen', 18.5, 29);
    ring('Silver', 6, 'V', 'Kristen', 19, 31);
    ring('Silver', 6, 'V', 'Kristen', 19.5, 32);
    ring('Silver', 6, 'V', 'Kristen', 20, 32);
    ring('Silver', 6, 'V', 'Kristen', 20.5, 32);
    ring('Silver', 6, 'V', 'Kristen', 21, 33);
    ring('Silver', 6, 'V', 'Kristen', 21.5, 33);
    ring('Silver', 6, 'V', 'Digital', 16, 22);
    ring('Silver', 6, 'V', 'Digital', 16.5, 22);
    ring('Silver', 6, 'V', 'Digital', 17, 23);
    ring('Silver', 6, 'V', 'Digital', 17.5, 23);
    ring('Silver', 6, 'V', 'Digital', 18, 24);
    ring('Silver', 6, 'V', 'Digital', 18.5, 24);
    ring('Silver', 6, 'V', 'Digital', 19, 27);
    ring('Silver', 6, 'V', 'Digital', 19.5, 27);
    ring('Silver', 6, 'V', 'Digital', 20, 28);
    ring('Silver', 6, 'V', 'Digital', 20.5, 28);
    ring('Silver', 6, 'V', 'Digital', 21, 29);
    ring('Silver', 6, 'V', 'Digital', 21.5, 29);
    ring('Silver', 6, 'V', 'Palazzo', 16, 22);
    ring('Silver', 6, 'V', 'Palazzo', 16.5, 22);
    ring('Silver', 6, 'V', 'Palazzo', 17, 23);
    ring('Silver', 6, 'V', 'Palazzo', 17.5, 23);
    ring('Silver', 6, 'V', 'Palazzo', 18, 25);
    ring('Silver', 6, 'V', 'Palazzo', 18.5, 25);
    ring('Silver', 6, 'V', 'Palazzo', 19, 26);
    ring('Silver', 6, 'V', 'Palazzo', 19.5, 26);
    ring('Silver', 6, 'V', 'Palazzo', 20, 27);
    ring('Silver', 6, 'V', 'Palazzo', 20.5, 27);
    ring('Silver', 6, 'V', 'Palazzo', 21, 29);
    ring('Silver', 6, 'V', 'Palazzo', 21.5, 29);
    ring('Silver', 6, 'V', 'Stencil', 16, 24);
    ring('Silver', 6, 'V', 'Stencil', 16.5, 24);
    ring('Silver', 6, 'V', 'Stencil', 17, 26);
    ring('Silver', 6, 'V', 'Stencil', 17.5, 26);
    ring('Silver', 6, 'V', 'Stencil', 18, 27);
    ring('Silver', 6, 'V', 'Stencil', 18.5, 27);
    ring('Silver', 6, 'V', 'Stencil', 19, 29);
    ring('Silver', 6, 'V', 'Stencil', 19.5, 29);
    ring('Silver', 6, 'V', 'Stencil', 20, 30);
    ring('Silver', 6, 'V', 'Stencil', 20.5, 30);
    ring('Silver', 6, 'V', 'Stencil', 21, 31);
    ring('Silver', 6, 'V', 'Stencil', 21.5, 31);
    ring('Silver', 6, 'V', 'Typewriter', 16, 25);
    ring('Silver', 6, 'V', 'Typewriter', 16.5, 25);
    ring('Silver', 6, 'V', 'Typewriter', 17, 27);
    ring('Silver', 6, 'V', 'Typewriter', 17.5, 27);
    ring('Silver', 6, 'V', 'Typewriter', 18, 28);
    ring('Silver', 6, 'V', 'Typewriter', 18.5, 28);
    ring('Silver', 6, 'V', 'Typewriter', 19, 30);
    ring('Silver', 6, 'V', 'Typewriter', 19.5, 30);
    ring('Silver', 6, 'V', 'Typewriter', 20, 31);
    ring('Silver', 6, 'V', 'Typewriter', 20.5, 31);
    ring('Silver', 6, 'V', 'Typewriter', 21, 33);
    ring('Silver', 6, 'V', 'Typewriter', 21.5, 33);
    ring('Silver', 6, 'V', 'Viva', 16, 15);
    ring('Silver', 6, 'V', 'Viva', 16.5, 15);
    ring('Silver', 6, 'V', 'Viva', 17, 15);
    ring('Silver', 6, 'V', 'Viva', 17.5, 15);
    ring('Silver', 6, 'V', 'Viva', 18, 16);
    ring('Silver', 6, 'V', 'Viva', 18.5, 16);
    ring('Silver', 6, 'V', 'Viva', 19, 17);
    ring('Silver', 6, 'V', 'Viva', 19.5, 17);
    ring('Silver', 6, 'V', 'Viva', 20, 18);
    ring('Silver', 6, 'V', 'Viva', 20.5, 18);
    ring('Silver', 6, 'V', 'Viva', 21, 19);
    ring('Silver', 6, 'V', 'Viva', 21.5, 19);
    ring('Silver', 8, 'B', 'Kristen', 16, 18);
    ring('Silver', 8, 'B', 'Kristen', 16.5, 18);
    ring('Silver', 8, 'B', 'Kristen', 17, 20);
    ring('Silver', 8, 'B', 'Kristen', 17.5, 20);
    ring('Silver', 8, 'B', 'Kristen', 18, 20);
    ring('Silver', 8, 'B', 'Kristen', 18.5, 20);
    ring('Silver', 8, 'B', 'Kristen', 19, 21);
    ring('Silver', 8, 'B', 'Kristen', 19.5, 21);
    ring('Silver', 8, 'B', 'Kristen', 20, 23);
    ring('Silver', 8, 'B', 'Kristen', 20.5, 23);
    ring('Silver', 8, 'B', 'Kristen', 21, 24);
    ring('Silver', 8, 'B', 'Kristen', 21.5, 24);
    ring('Silver', 8, 'B', 'Digital', 16, 14);
    ring('Silver', 8, 'B', 'Digital', 16.5, 14);
    ring('Silver', 8, 'B', 'Digital', 17, 15);
    ring('Silver', 8, 'B', 'Digital', 17.5, 15);
    ring('Silver', 8, 'B', 'Digital', 18, 16);
    ring('Silver', 8, 'B', 'Digital', 18.5, 16);
    ring('Silver', 8, 'B', 'Digital', 19, 17);
    ring('Silver', 8, 'B', 'Digital', 19.5, 17);
    ring('Silver', 8, 'B', 'Digital', 20, 18);
    ring('Silver', 8, 'B', 'Digital', 20.5, 18);
    ring('Silver', 8, 'B', 'Digital', 21, 18);
    ring('Silver', 8, 'B', 'Digital', 21.5, 18);
    ring('Silver', 8, 'B', 'Palazzo', 16, 17);
    ring('Silver', 8, 'B', 'Palazzo', 16.5, 17);
    ring('Silver', 8, 'B', 'Palazzo', 17, 18);
    ring('Silver', 8, 'B', 'Palazzo', 17.5, 18);
    ring('Silver', 8, 'B', 'Palazzo', 18, 19);
    ring('Silver', 8, 'B', 'Palazzo', 18.5, 19);
    ring('Silver', 8, 'B', 'Palazzo', 19, 20);
    ring('Silver', 8, 'B', 'Palazzo', 19.5, 20);
    ring('Silver', 8, 'B', 'Palazzo', 20, 21);
    ring('Silver', 8, 'B', 'Palazzo', 20.5, 21);
    ring('Silver', 8, 'B', 'Palazzo', 21, 22);
    ring('Silver', 8, 'B', 'Palazzo', 21.5, 22);
    ring('Silver', 8, 'B', 'Stencil', 16, 17);
    ring('Silver', 8, 'B', 'Stencil', 16.5, 17);
    ring('Silver', 8, 'B', 'Stencil', 17, 19);
    ring('Silver', 8, 'B', 'Stencil', 17.5, 19);
    ring('Silver', 8, 'B', 'Stencil', 18, 20);
    ring('Silver', 8, 'B', 'Stencil', 18.5, 20);
    ring('Silver', 8, 'B', 'Stencil', 19, 20);
    ring('Silver', 8, 'B', 'Stencil', 19.5, 20);
    ring('Silver', 8, 'B', 'Stencil', 20, 21);
    ring('Silver', 8, 'B', 'Stencil', 20.5, 21);
    ring('Silver', 8, 'B', 'Stencil', 21, 22);
    ring('Silver', 8, 'B', 'Stencil', 21.5, 22);
    ring('Silver', 8, 'B', 'Typewriter', 16, 22);
    ring('Silver', 8, 'B', 'Typewriter', 16.5, 22);
    ring('Silver', 8, 'B', 'Typewriter', 17, 23);
    ring('Silver', 8, 'B', 'Typewriter', 17.5, 23);
    ring('Silver', 8, 'B', 'Typewriter', 18, 25);
    ring('Silver', 8, 'B', 'Typewriter', 18.5, 25);
    ring('Silver', 8, 'B', 'Typewriter', 19, 26);
    ring('Silver', 8, 'B', 'Typewriter', 19.5, 26);
    ring('Silver', 8, 'B', 'Typewriter', 20, 27);
    ring('Silver', 8, 'B', 'Typewriter', 20.5, 27);
    ring('Silver', 8, 'B', 'Typewriter', 21, 29);
    ring('Silver', 8, 'B', 'Typewriter', 21.5, 29);
    ring('Silver', 8, 'B', 'Viva', 16, 10);
    ring('Silver', 8, 'B', 'Viva', 16.5, 10);
    ring('Silver', 8, 'B', 'Viva', 17, 11);
    ring('Silver', 8, 'B', 'Viva', 17.5, 11);
    ring('Silver', 8, 'B', 'Viva', 18, 11);
    ring('Silver', 8, 'B', 'Viva', 18.5, 11);
    ring('Silver', 8, 'B', 'Viva', 19, 12);
    ring('Silver', 8, 'B', 'Viva', 19.5, 12);
    ring('Silver', 8, 'B', 'Viva', 20, 12);
    ring('Silver', 8, 'B', 'Viva', 20.5, 12);
    ring('Silver', 8, 'B', 'Viva', 21, 13);
    ring('Silver', 8, 'B', 'Viva', 21.5, 13);
    ring('Silver', 8, 'V', 'Kristen', 16, 18);
    ring('Silver', 8, 'V', 'Kristen', 16.5, 18);
    ring('Silver', 8, 'V', 'Kristen', 17, 20);
    ring('Silver', 8, 'V', 'Kristen', 17.5, 20);
    ring('Silver', 8, 'V', 'Kristen', 18, 20);
    ring('Silver', 8, 'V', 'Kristen', 18.5, 20);
    ring('Silver', 8, 'V', 'Kristen', 19, 21);
    ring('Silver', 8, 'V', 'Kristen', 19.5, 21);
    ring('Silver', 8, 'V', 'Kristen', 20, 23);
    ring('Silver', 8, 'V', 'Kristen', 20.5, 23);
    ring('Silver', 8, 'V', 'Kristen', 21, 24);
    ring('Silver', 8, 'V', 'Kristen', 21.5, 24);
    ring('Silver', 8, 'V', 'Digital', 16, 14);
    ring('Silver', 8, 'V', 'Digital', 16.5, 14);
    ring('Silver', 8, 'V', 'Digital', 17, 15);
    ring('Silver', 8, 'V', 'Digital', 17.5, 15);
    ring('Silver', 8, 'V', 'Digital', 18, 16);
    ring('Silver', 8, 'V', 'Digital', 18.5, 16);
    ring('Silver', 8, 'V', 'Digital', 19, 17);
    ring('Silver', 8, 'V', 'Digital', 19.5, 17);
    ring('Silver', 8, 'V', 'Digital', 20, 18);
    ring('Silver', 8, 'V', 'Digital', 20.5, 18);
    ring('Silver', 8, 'V', 'Digital', 21, 18);
    ring('Silver', 8, 'V', 'Digital', 21.5, 18);
    ring('Silver', 8, 'V', 'Palazzo', 16, 17);
    ring('Silver', 8, 'V', 'Palazzo', 16.5, 17);
    ring('Silver', 8, 'V', 'Palazzo', 17, 18);
    ring('Silver', 8, 'V', 'Palazzo', 17.5, 18);
    ring('Silver', 8, 'V', 'Palazzo', 18, 19);
    ring('Silver', 8, 'V', 'Palazzo', 18.5, 19);
    ring('Silver', 8, 'V', 'Palazzo', 19, 20);
    ring('Silver', 8, 'V', 'Palazzo', 19.5, 20);
    ring('Silver', 8, 'V', 'Palazzo', 20, 21);
    ring('Silver', 8, 'V', 'Palazzo', 20.5, 21);
    ring('Silver', 8, 'V', 'Palazzo', 21, 22);
    ring('Silver', 8, 'V', 'Palazzo', 21.5, 22);
    ring('Silver', 8, 'V', 'Stencil', 16, 17);
    ring('Silver', 8, 'V', 'Stencil', 16.5, 17);
    ring('Silver', 8, 'V', 'Stencil', 17, 19);
    ring('Silver', 8, 'V', 'Stencil', 17.5, 19);
    ring('Silver', 8, 'V', 'Stencil', 18, 20);
    ring('Silver', 8, 'V', 'Stencil', 18.5, 20);
    ring('Silver', 8, 'V', 'Stencil', 19, 20);
    ring('Silver', 8, 'V', 'Stencil', 19.5, 20);
    ring('Silver', 8, 'V', 'Stencil', 20, 21);
    ring('Silver', 8, 'V', 'Stencil', 20.5, 21);
    ring('Silver', 8, 'V', 'Stencil', 21, 22);
    ring('Silver', 8, 'V', 'Stencil', 21.5, 22);
    ring('Silver', 8, 'V', 'Typewriter', 16, 22);
    ring('Silver', 8, 'V', 'Typewriter', 16.5, 22);
    ring('Silver', 8, 'V', 'Typewriter', 17, 23);
    ring('Silver', 8, 'V', 'Typewriter', 17.5, 23);
    ring('Silver', 8, 'V', 'Typewriter', 18, 25);
    ring('Silver', 8, 'V', 'Typewriter', 18.5, 25);
    ring('Silver', 8, 'V', 'Typewriter', 19, 26);
    ring('Silver', 8, 'V', 'Typewriter', 19.5, 26);
    ring('Silver', 8, 'V', 'Typewriter', 20, 27);
    ring('Silver', 8, 'V', 'Typewriter', 20.5, 27);
    ring('Silver', 8, 'V', 'Typewriter', 21, 29);
    ring('Silver', 8, 'V', 'Typewriter', 21.5, 29);
    ring('Silver', 8, 'V', 'Viva', 16, 10);
    ring('Silver', 8, 'V', 'Viva', 16.5, 10);
    ring('Silver', 8, 'V', 'Viva', 17, 11);
    ring('Silver', 8, 'V', 'Viva', 17.5, 11);
    ring('Silver', 8, 'V', 'Viva', 18, 11);
    ring('Silver', 8, 'V', 'Viva', 18.5, 11);
    ring('Silver', 8, 'V', 'Viva', 19, 12);
    ring('Silver', 8, 'V', 'Viva', 19.5, 12);
    ring('Silver', 8, 'V', 'Viva', 20, 12);
    ring('Silver', 8, 'V', 'Viva', 20.5, 12);
    ring('Silver', 8, 'V', 'Viva', 21, 13);
    ring('Silver', 8, 'V', 'Viva', 21.5, 13);
    ring('Steel', 4, 'Z', 'Kristen', 16, 33);
    ring('Steel', 4, 'Z', 'Kristen', 16.5, 33);
    ring('Steel', 4, 'Z', 'Kristen', 17, 34);
    ring('Steel', 4, 'Z', 'Kristen', 17.5, 34);
    ring('Steel', 4, 'Z', 'Kristen', 18, 36);
    ring('Steel', 4, 'Z', 'Kristen', 18.5, 36);
    ring('Steel', 4, 'Z', 'Kristen', 19, 38);
    ring('Steel', 4, 'Z', 'Kristen', 19.5, 38);
    ring('Steel', 4, 'Z', 'Kristen', 20, 40);
    ring('Steel', 4, 'Z', 'Kristen', 20.5, 40);
    ring('Steel', 4, 'Z', 'Kristen', 21, 42);
    ring('Steel', 4, 'Z', 'Kristen', 21.5, 42);
    ring('Steel', 4, 'Z', 'Digital', 16, 31);
    ring('Steel', 4, 'Z', 'Digital', 16.5, 31);
    ring('Steel', 4, 'Z', 'Digital', 17, 32);
    ring('Steel', 4, 'Z', 'Digital', 17.5, 32);
    ring('Steel', 4, 'Z', 'Digital', 18, 34);
    ring('Steel', 4, 'Z', 'Digital', 18.5, 34);
    ring('Steel', 4, 'Z', 'Digital', 19, 35);
    ring('Steel', 4, 'Z', 'Digital', 19.5, 35);
    ring('Steel', 4, 'Z', 'Digital', 20, 37);
    ring('Steel', 4, 'Z', 'Digital', 20.5, 37);
    ring('Steel', 4, 'Z', 'Digital', 21, 38);
    ring('Steel', 4, 'Z', 'Digital', 21.5, 38);
    ring('Steel', 4, 'Z', 'Palazzo', 16, 37);
    ring('Steel', 4, 'Z', 'Palazzo', 16.5, 37);
    ring('Steel', 4, 'Z', 'Palazzo', 17, 38);
    ring('Steel', 4, 'Z', 'Palazzo', 17.5, 38);
    ring('Steel', 4, 'Z', 'Palazzo', 18, 39);
    ring('Steel', 4, 'Z', 'Palazzo', 18.5, 39);
    ring('Steel', 4, 'Z', 'Palazzo', 19, 42);
    ring('Steel', 4, 'Z', 'Palazzo', 19.5, 42);
    ring('Steel', 4, 'Z', 'Palazzo', 20, 44);
    ring('Steel', 4, 'Z', 'Palazzo', 20.5, 44);
    ring('Steel', 4, 'Z', 'Palazzo', 21, 46);
    ring('Steel', 4, 'Z', 'Palazzo', 21.5, 46);
    ring('Steel', 4, 'Z', 'Stencil', 16, 33);
    ring('Steel', 4, 'Z', 'Stencil', 16.5, 33);
    ring('Steel', 4, 'Z', 'Stencil', 17, 35);
    ring('Steel', 4, 'Z', 'Stencil', 17.5, 35);
    ring('Steel', 4, 'Z', 'Stencil', 18, 36);
    ring('Steel', 4, 'Z', 'Stencil', 18.5, 36);
    ring('Steel', 4, 'Z', 'Stencil', 19, 38);
    ring('Steel', 4, 'Z', 'Stencil', 19.5, 38);
    ring('Steel', 4, 'Z', 'Stencil', 20, 40);
    ring('Steel', 4, 'Z', 'Stencil', 20.5, 40);
    ring('Steel', 4, 'Z', 'Stencil', 21, 42);
    ring('Steel', 4, 'Z', 'Stencil', 21.5, 42);
    ring('Steel', 4, 'Z', 'Typewriter', 16, 33);
    ring('Steel', 4, 'Z', 'Typewriter', 16.5, 33);
    ring('Steel', 4, 'Z', 'Typewriter', 17, 34);
    ring('Steel', 4, 'Z', 'Typewriter', 17.5, 34);
    ring('Steel', 4, 'Z', 'Typewriter', 18, 36);
    ring('Steel', 4, 'Z', 'Typewriter', 18.5, 36);
    ring('Steel', 4, 'Z', 'Typewriter', 19, 38);
    ring('Steel', 4, 'Z', 'Typewriter', 19.5, 38);
    ring('Steel', 4, 'Z', 'Typewriter', 20, 40);
    ring('Steel', 4, 'Z', 'Typewriter', 20.5, 40);
    ring('Steel', 4, 'Z', 'Typewriter', 21, 42);
    ring('Steel', 4, 'Z', 'Typewriter', 21.5, 42);
    ring('Steel', 4, 'Z', 'Viva', 16, 22);
    ring('Steel', 4, 'Z', 'Viva', 16.5, 22);
    ring('Steel', 4, 'Z', 'Viva', 17, 22);
    ring('Steel', 4, 'Z', 'Viva', 17.5, 22);
    ring('Steel', 4, 'Z', 'Viva', 18, 23);
    ring('Steel', 4, 'Z', 'Viva', 18.5, 23);
    ring('Steel', 4, 'Z', 'Viva', 19, 24);
    ring('Steel', 4, 'Z', 'Viva', 19.5, 24);
    ring('Steel', 4, 'Z', 'Viva', 20, 26);
    ring('Steel', 4, 'Z', 'Viva', 20.5, 26);
    ring('Steel', 4, 'Z', 'Viva', 21, 27);
    ring('Steel', 4, 'Z', 'Viva', 21.5, 27);
    ring('Steel', 4, 'W', 'Kristen', 16, 33);
    ring('Steel', 4, 'W', 'Kristen', 16.5, 33);
    ring('Steel', 4, 'W', 'Kristen', 17, 34);
    ring('Steel', 4, 'W', 'Kristen', 17.5, 34);
    ring('Steel', 4, 'W', 'Kristen', 18, 36);
    ring('Steel', 4, 'W', 'Kristen', 18.5, 36);
    ring('Steel', 4, 'W', 'Kristen', 19, 38);
    ring('Steel', 4, 'W', 'Kristen', 19.5, 38);
    ring('Steel', 4, 'W', 'Kristen', 20, 40);
    ring('Steel', 4, 'W', 'Kristen', 20.5, 40);
    ring('Steel', 4, 'W', 'Kristen', 21, 42);
    ring('Steel', 4, 'W', 'Kristen', 21.5, 42);
    ring('Steel', 4, 'W', 'Digital', 16, 31);
    ring('Steel', 4, 'W', 'Digital', 16.5, 31);
    ring('Steel', 4, 'W', 'Digital', 17, 32);
    ring('Steel', 4, 'W', 'Digital', 17.5, 32);
    ring('Steel', 4, 'W', 'Digital', 18, 34);
    ring('Steel', 4, 'W', 'Digital', 18.5, 34);
    ring('Steel', 4, 'W', 'Digital', 19, 35);
    ring('Steel', 4, 'W', 'Digital', 19.5, 35);
    ring('Steel', 4, 'W', 'Digital', 20, 37);
    ring('Steel', 4, 'W', 'Digital', 20.5, 37);
    ring('Steel', 4, 'W', 'Digital', 21, 38);
    ring('Steel', 4, 'W', 'Digital', 21.5, 38);
    ring('Steel', 4, 'W', 'Palazzo', 16, 37);
    ring('Steel', 4, 'W', 'Palazzo', 16.5, 37);
    ring('Steel', 4, 'W', 'Palazzo', 17, 38);
    ring('Steel', 4, 'W', 'Palazzo', 17.5, 38);
    ring('Steel', 4, 'W', 'Palazzo', 18, 39);
    ring('Steel', 4, 'W', 'Palazzo', 18.5, 39);
    ring('Steel', 4, 'W', 'Palazzo', 19, 42);
    ring('Steel', 4, 'W', 'Palazzo', 19.5, 42);
    ring('Steel', 4, 'W', 'Palazzo', 20, 44);
    ring('Steel', 4, 'W', 'Palazzo', 20.5, 44);
    ring('Steel', 4, 'W', 'Palazzo', 21, 46);
    ring('Steel', 4, 'W', 'Palazzo', 21.5, 46);
    ring('Steel', 4, 'W', 'Stencil', 16, 33);
    ring('Steel', 4, 'W', 'Stencil', 16.5, 33);
    ring('Steel', 4, 'W', 'Stencil', 17, 35);
    ring('Steel', 4, 'W', 'Stencil', 17.5, 35);
    ring('Steel', 4, 'W', 'Stencil', 18, 36);
    ring('Steel', 4, 'W', 'Stencil', 18.5, 36);
    ring('Steel', 4, 'W', 'Stencil', 19, 38);
    ring('Steel', 4, 'W', 'Stencil', 19.5, 38);
    ring('Steel', 4, 'W', 'Stencil', 20, 40);
    ring('Steel', 4, 'W', 'Stencil', 20.5, 40);
    ring('Steel', 4, 'W', 'Stencil', 21, 42);
    ring('Steel', 4, 'W', 'Stencil', 21.5, 42);
    ring('Steel', 4, 'W', 'Typewriter', 16, 33);
    ring('Steel', 4, 'W', 'Typewriter', 16.5, 33);
    ring('Steel', 4, 'W', 'Typewriter', 17, 34);
    ring('Steel', 4, 'W', 'Typewriter', 17.5, 34);
    ring('Steel', 4, 'W', 'Typewriter', 18, 36);
    ring('Steel', 4, 'W', 'Typewriter', 18.5, 36);
    ring('Steel', 4, 'W', 'Typewriter', 19, 38);
    ring('Steel', 4, 'W', 'Typewriter', 19.5, 38);
    ring('Steel', 4, 'W', 'Typewriter', 20, 40);
    ring('Steel', 4, 'W', 'Typewriter', 20.5, 40);
    ring('Steel', 4, 'W', 'Typewriter', 21, 42);
    ring('Steel', 4, 'W', 'Typewriter', 21.5, 42);
    ring('Steel', 4, 'W', 'Viva', 16, 22);
    ring('Steel', 4, 'W', 'Viva', 16.5, 22);
    ring('Steel', 4, 'W', 'Viva', 17, 22);
    ring('Steel', 4, 'W', 'Viva', 17.5, 22);
    ring('Steel', 4, 'W', 'Viva', 18, 23);
    ring('Steel', 4, 'W', 'Viva', 18.5, 23);
    ring('Steel', 4, 'W', 'Viva', 19, 24);
    ring('Steel', 4, 'W', 'Viva', 19.5, 24);
    ring('Steel', 4, 'W', 'Viva', 20, 26);
    ring('Steel', 4, 'W', 'Viva', 20.5, 26);
    ring('Steel', 4, 'W', 'Viva', 21, 27);
    ring('Steel', 4, 'W', 'Viva', 21.5, 27);
    ring('Steel', 6, 'Z', 'Kristen', 16, 26);
    ring('Steel', 6, 'Z', 'Kristen', 16.5, 26);
    ring('Steel', 6, 'Z', 'Kristen', 17, 28);
    ring('Steel', 6, 'Z', 'Kristen', 17.5, 28);
    ring('Steel', 6, 'Z', 'Kristen', 18, 29);
    ring('Steel', 6, 'Z', 'Kristen', 18.5, 29);
    ring('Steel', 6, 'Z', 'Kristen', 19, 31);
    ring('Steel', 6, 'Z', 'Kristen', 19.5, 32);
    ring('Steel', 6, 'Z', 'Kristen', 20, 32);
    ring('Steel', 6, 'Z', 'Kristen', 20.5, 32);
    ring('Steel', 6, 'Z', 'Kristen', 21, 33);
    ring('Steel', 6, 'Z', 'Kristen', 21.5, 33);
    ring('Steel', 6, 'Z', 'Digital', 16, 22);
    ring('Steel', 6, 'Z', 'Digital', 16.5, 22);
    ring('Steel', 6, 'Z', 'Digital', 17, 23);
    ring('Steel', 6, 'Z', 'Digital', 17.5, 23);
    ring('Steel', 6, 'Z', 'Digital', 18, 24);
    ring('Steel', 6, 'Z', 'Digital', 18.5, 24);
    ring('Steel', 6, 'Z', 'Digital', 19, 27);
    ring('Steel', 6, 'Z', 'Digital', 19.5, 27);
    ring('Steel', 6, 'Z', 'Digital', 20, 28);
    ring('Steel', 6, 'Z', 'Digital', 20.5, 28);
    ring('Steel', 6, 'Z', 'Digital', 21, 29);
    ring('Steel', 6, 'Z', 'Digital', 21.5, 29);
    ring('Steel', 6, 'Z', 'Palazzo', 16, 22);
    ring('Steel', 6, 'Z', 'Palazzo', 16.5, 22);
    ring('Steel', 6, 'Z', 'Palazzo', 17, 23);
    ring('Steel', 6, 'Z', 'Palazzo', 17.5, 23);
    ring('Steel', 6, 'Z', 'Palazzo', 18, 25);
    ring('Steel', 6, 'Z', 'Palazzo', 18.5, 25);
    ring('Steel', 6, 'Z', 'Palazzo', 19, 26);
    ring('Steel', 6, 'Z', 'Palazzo', 19.5, 26);
    ring('Steel', 6, 'Z', 'Palazzo', 20, 27);
    ring('Steel', 6, 'Z', 'Palazzo', 20.5, 27);
    ring('Steel', 6, 'Z', 'Palazzo', 21, 29);
    ring('Steel', 6, 'Z', 'Palazzo', 21.5, 29);
    ring('Steel', 6, 'Z', 'Stencil', 16, 24);
    ring('Steel', 6, 'Z', 'Stencil', 16.5, 24);
    ring('Steel', 6, 'Z', 'Stencil', 17, 26);
    ring('Steel', 6, 'Z', 'Stencil', 17.5, 26);
    ring('Steel', 6, 'Z', 'Stencil', 18, 27);
    ring('Steel', 6, 'Z', 'Stencil', 18.5, 27);
    ring('Steel', 6, 'Z', 'Stencil', 19, 29);
    ring('Steel', 6, 'Z', 'Stencil', 19.5, 29);
    ring('Steel', 6, 'Z', 'Stencil', 20, 30);
    ring('Steel', 6, 'Z', 'Stencil', 20.5, 30);
    ring('Steel', 6, 'Z', 'Stencil', 21, 31);
    ring('Steel', 6, 'Z', 'Stencil', 21.5, 31);
    ring('Steel', 6, 'Z', 'Typewriter', 16, 25);
    ring('Steel', 6, 'Z', 'Typewriter', 16.5, 25);
    ring('Steel', 6, 'Z', 'Typewriter', 17, 27);
    ring('Steel', 6, 'Z', 'Typewriter', 17.5, 27);
    ring('Steel', 6, 'Z', 'Typewriter', 18, 28);
    ring('Steel', 6, 'Z', 'Typewriter', 18.5, 28);
    ring('Steel', 6, 'Z', 'Typewriter', 19, 30);
    ring('Steel', 6, 'Z', 'Typewriter', 19.5, 30);
    ring('Steel', 6, 'Z', 'Typewriter', 20, 31);
    ring('Steel', 6, 'Z', 'Typewriter', 20.5, 31);
    ring('Steel', 6, 'Z', 'Typewriter', 21, 33);
    ring('Steel', 6, 'Z', 'Typewriter', 21.5, 33);
    ring('Steel', 6, 'Z', 'Viva', 16, 15);
    ring('Steel', 6, 'Z', 'Viva', 16.5, 15);
    ring('Steel', 6, 'Z', 'Viva', 17, 15);
    ring('Steel', 6, 'Z', 'Viva', 17.5, 15);
    ring('Steel', 6, 'Z', 'Viva', 18, 16);
    ring('Steel', 6, 'Z', 'Viva', 18.5, 16);
    ring('Steel', 6, 'Z', 'Viva', 19, 17);
    ring('Steel', 6, 'Z', 'Viva', 19.5, 17);
    ring('Steel', 6, 'Z', 'Viva', 20, 18);
    ring('Steel', 6, 'Z', 'Viva', 20.5, 18);
    ring('Steel', 6, 'Z', 'Viva', 21, 19);
    ring('Steel', 6, 'Z', 'Viva', 21.5, 19);
    ring('Steel', 6, 'W', 'Kristen', 16, 26);
    ring('Steel', 6, 'W', 'Kristen', 16.5, 26);
    ring('Steel', 6, 'W', 'Kristen', 17, 28);
    ring('Steel', 6, 'W', 'Kristen', 17.5, 28);
    ring('Steel', 6, 'W', 'Kristen', 18, 29);
    ring('Steel', 6, 'W', 'Kristen', 18.5, 29);
    ring('Steel', 6, 'W', 'Kristen', 19, 31);
    ring('Steel', 6, 'W', 'Kristen', 19.5, 32);
    ring('Steel', 6, 'W', 'Kristen', 20, 32);
    ring('Steel', 6, 'W', 'Kristen', 20.5, 32);
    ring('Steel', 6, 'W', 'Kristen', 21, 33);
    ring('Steel', 6, 'W', 'Kristen', 21.5, 33);
    ring('Steel', 6, 'W', 'Digital', 16, 22);
    ring('Steel', 6, 'W', 'Digital', 16.5, 22);
    ring('Steel', 6, 'W', 'Digital', 17, 23);
    ring('Steel', 6, 'W', 'Digital', 17.5, 23);
    ring('Steel', 6, 'W', 'Digital', 18, 24);
    ring('Steel', 6, 'W', 'Digital', 18.5, 24);
    ring('Steel', 6, 'W', 'Digital', 19, 27);
    ring('Steel', 6, 'W', 'Digital', 19.5, 27);
    ring('Steel', 6, 'W', 'Digital', 20, 28);
    ring('Steel', 6, 'W', 'Digital', 20.5, 28);
    ring('Steel', 6, 'W', 'Digital', 21, 29);
    ring('Steel', 6, 'W', 'Digital', 21.5, 29);
    ring('Steel', 6, 'W', 'Palazzo', 16, 22);
    ring('Steel', 6, 'W', 'Palazzo', 16.5, 22);
    ring('Steel', 6, 'W', 'Palazzo', 17, 23);
    ring('Steel', 6, 'W', 'Palazzo', 17.5, 23);
    ring('Steel', 6, 'W', 'Palazzo', 18, 25);
    ring('Steel', 6, 'W', 'Palazzo', 18.5, 25);
    ring('Steel', 6, 'W', 'Palazzo', 19, 26);
    ring('Steel', 6, 'W', 'Palazzo', 19.5, 26);
    ring('Steel', 6, 'W', 'Palazzo', 20, 27);
    ring('Steel', 6, 'W', 'Palazzo', 20.5, 27);
    ring('Steel', 6, 'W', 'Palazzo', 21, 29);
    ring('Steel', 6, 'W', 'Palazzo', 21.5, 29);
    ring('Steel', 6, 'W', 'Stencil', 16, 24);
    ring('Steel', 6, 'W', 'Stencil', 16.5, 24);
    ring('Steel', 6, 'W', 'Stencil', 17, 26);
    ring('Steel', 6, 'W', 'Stencil', 17.5, 26);
    ring('Steel', 6, 'W', 'Stencil', 18, 27);
    ring('Steel', 6, 'W', 'Stencil', 18.5, 27);
    ring('Steel', 6, 'W', 'Stencil', 19, 29);
    ring('Steel', 6, 'W', 'Stencil', 19.5, 29);
    ring('Steel', 6, 'W', 'Stencil', 20, 30);
    ring('Steel', 6, 'W', 'Stencil', 20.5, 30);
    ring('Steel', 6, 'W', 'Stencil', 21, 31);
    ring('Steel', 6, 'W', 'Stencil', 21.5, 31);
    ring('Steel', 6, 'W', 'Typewriter', 16, 25);
    ring('Steel', 6, 'W', 'Typewriter', 16.5, 25);
    ring('Steel', 6, 'W', 'Typewriter', 17, 27);
    ring('Steel', 6, 'W', 'Typewriter', 17.5, 27);
    ring('Steel', 6, 'W', 'Typewriter', 18, 28);
    ring('Steel', 6, 'W', 'Typewriter', 18.5, 28);
    ring('Steel', 6, 'W', 'Typewriter', 19, 30);
    ring('Steel', 6, 'W', 'Typewriter', 19.5, 30);
    ring('Steel', 6, 'W', 'Typewriter', 20, 31);
    ring('Steel', 6, 'W', 'Typewriter', 20.5, 31);
    ring('Steel', 6, 'W', 'Typewriter', 21, 33);
    ring('Steel', 6, 'W', 'Typewriter', 21.5, 33);
    ring('Steel', 6, 'W', 'Viva', 16, 15);
    ring('Steel', 6, 'W', 'Viva', 16.5, 15);
    ring('Steel', 6, 'W', 'Viva', 17, 15);
    ring('Steel', 6, 'W', 'Viva', 17.5, 15);
    ring('Steel', 6, 'W', 'Viva', 18, 16);
    ring('Steel', 6, 'W', 'Viva', 18.5, 16);
    ring('Steel', 6, 'W', 'Viva', 19, 17);
    ring('Steel', 6, 'W', 'Viva', 19.5, 17);
    ring('Steel', 6, 'W', 'Viva', 20, 18);
    ring('Steel', 6, 'W', 'Viva', 20.5, 18);
    ring('Steel', 6, 'W', 'Viva', 21, 19);
    ring('Steel', 6, 'W', 'Viva', 21.5, 19);
    ring('Steel', 8, 'Z', 'Kristen', 16, 18);
    ring('Steel', 8, 'Z', 'Kristen', 16.5, 18);
    ring('Steel', 8, 'Z', 'Kristen', 17, 20);
    ring('Steel', 8, 'Z', 'Kristen', 17.5, 20);
    ring('Steel', 8, 'Z', 'Kristen', 18, 20);
    ring('Steel', 8, 'Z', 'Kristen', 18.5, 20);
    ring('Steel', 8, 'Z', 'Kristen', 19, 21);
    ring('Steel', 8, 'Z', 'Kristen', 19.5, 21);
    ring('Steel', 8, 'Z', 'Kristen', 20, 23);
    ring('Steel', 8, 'Z', 'Kristen', 20.5, 23);
    ring('Steel', 8, 'Z', 'Kristen', 21, 24);
    ring('Steel', 8, 'Z', 'Kristen', 21.5, 24);
    ring('Steel', 8, 'Z', 'Digital', 16, 14);
    ring('Steel', 8, 'Z', 'Digital', 16.5, 14);
    ring('Steel', 8, 'Z', 'Digital', 17, 15);
    ring('Steel', 8, 'Z', 'Digital', 17.5, 15);
    ring('Steel', 8, 'Z', 'Digital', 18, 16);
    ring('Steel', 8, 'Z', 'Digital', 18.5, 16);
    ring('Steel', 8, 'Z', 'Digital', 19, 17);
    ring('Steel', 8, 'Z', 'Digital', 19.5, 17);
    ring('Steel', 8, 'Z', 'Digital', 20, 18);
    ring('Steel', 8, 'Z', 'Digital', 20.5, 18);
    ring('Steel', 8, 'Z', 'Digital', 21, 18);
    ring('Steel', 8, 'Z', 'Digital', 21.5, 18);
    ring('Steel', 8, 'Z', 'Palazzo', 16, 17);
    ring('Steel', 8, 'Z', 'Palazzo', 16.5, 17);
    ring('Steel', 8, 'Z', 'Palazzo', 17, 18);
    ring('Steel', 8, 'Z', 'Palazzo', 17.5, 18);
    ring('Steel', 8, 'Z', 'Palazzo', 18, 19);
    ring('Steel', 8, 'Z', 'Palazzo', 18.5, 19);
    ring('Steel', 8, 'Z', 'Palazzo', 19, 20);
    ring('Steel', 8, 'Z', 'Palazzo', 19.5, 20);
    ring('Steel', 8, 'Z', 'Palazzo', 20, 21);
    ring('Steel', 8, 'Z', 'Palazzo', 20.5, 21);
    ring('Steel', 8, 'Z', 'Palazzo', 21, 22);
    ring('Steel', 8, 'Z', 'Palazzo', 21.5, 22);
    ring('Steel', 8, 'Z', 'Stencil', 16, 17);
    ring('Steel', 8, 'Z', 'Stencil', 16.5, 17);
    ring('Steel', 8, 'Z', 'Stencil', 17, 19);
    ring('Steel', 8, 'Z', 'Stencil', 17.5, 19);
    ring('Steel', 8, 'Z', 'Stencil', 18, 20);
    ring('Steel', 8, 'Z', 'Stencil', 18.5, 20);
    ring('Steel', 8, 'Z', 'Stencil', 19, 20);
    ring('Steel', 8, 'Z', 'Stencil', 19.5, 20);
    ring('Steel', 8, 'Z', 'Stencil', 20, 21);
    ring('Steel', 8, 'Z', 'Stencil', 20.5, 21);
    ring('Steel', 8, 'Z', 'Stencil', 21, 22);
    ring('Steel', 8, 'Z', 'Stencil', 21.5, 22);
    ring('Steel', 8, 'Z', 'Typewriter', 16, 22);
    ring('Steel', 8, 'Z', 'Typewriter', 16.5, 22);
    ring('Steel', 8, 'Z', 'Typewriter', 17, 23);
    ring('Steel', 8, 'Z', 'Typewriter', 17.5, 23);
    ring('Steel', 8, 'Z', 'Typewriter', 18, 25);
    ring('Steel', 8, 'Z', 'Typewriter', 18.5, 25);
    ring('Steel', 8, 'Z', 'Typewriter', 19, 26);
    ring('Steel', 8, 'Z', 'Typewriter', 19.5, 26);
    ring('Steel', 8, 'Z', 'Typewriter', 20, 27);
    ring('Steel', 8, 'Z', 'Typewriter', 20.5, 27);
    ring('Steel', 8, 'Z', 'Typewriter', 21, 29);
    ring('Steel', 8, 'Z', 'Typewriter', 21.5, 29);
    ring('Steel', 8, 'Z', 'Viva', 16, 10);
    ring('Steel', 8, 'Z', 'Viva', 16.5, 10);
    ring('Steel', 8, 'Z', 'Viva', 17, 11);
    ring('Steel', 8, 'Z', 'Viva', 17.5, 11);
    ring('Steel', 8, 'Z', 'Viva', 18, 11);
    ring('Steel', 8, 'Z', 'Viva', 18.5, 11);
    ring('Steel', 8, 'Z', 'Viva', 19, 12);
    ring('Steel', 8, 'Z', 'Viva', 19.5, 12);
    ring('Steel', 8, 'Z', 'Viva', 20, 12);
    ring('Steel', 8, 'Z', 'Viva', 20.5, 12);
    ring('Steel', 8, 'Z', 'Viva', 21, 13);
    ring('Steel', 8, 'Z', 'Viva', 21.5, 13);
    ring('Steel', 8, 'W', 'Kristen', 16, 18);
    ring('Steel', 8, 'W', 'Kristen', 16.5, 18);
    ring('Steel', 8, 'W', 'Kristen', 17, 20);
    ring('Steel', 8, 'W', 'Kristen', 17.5, 20);
    ring('Steel', 8, 'W', 'Kristen', 18, 20);
    ring('Steel', 8, 'W', 'Kristen', 18.5, 20);
    ring('Steel', 8, 'W', 'Kristen', 19, 21);
    ring('Steel', 8, 'W', 'Kristen', 19.5, 21);
    ring('Steel', 8, 'W', 'Kristen', 20, 23);
    ring('Steel', 8, 'W', 'Kristen', 20.5, 23);
    ring('Steel', 8, 'W', 'Kristen', 21, 24);
    ring('Steel', 8, 'W', 'Kristen', 21.5, 24);
    ring('Steel', 8, 'W', 'Digital', 16, 14);
    ring('Steel', 8, 'W', 'Digital', 16.5, 14);
    ring('Steel', 8, 'W', 'Digital', 17, 15);
    ring('Steel', 8, 'W', 'Digital', 17.5, 15);
    ring('Steel', 8, 'W', 'Digital', 18, 16);
    ring('Steel', 8, 'W', 'Digital', 18.5, 16);
    ring('Steel', 8, 'W', 'Digital', 19, 17);
    ring('Steel', 8, 'W', 'Digital', 19.5, 17);
    ring('Steel', 8, 'W', 'Digital', 20, 18);
    ring('Steel', 8, 'W', 'Digital', 20.5, 18);
    ring('Steel', 8, 'W', 'Digital', 21, 18);
    ring('Steel', 8, 'W', 'Digital', 21.5, 18);
    ring('Steel', 8, 'W', 'Palazzo', 16, 17);
    ring('Steel', 8, 'W', 'Palazzo', 16.5, 17);
    ring('Steel', 8, 'W', 'Palazzo', 17, 18);
    ring('Steel', 8, 'W', 'Palazzo', 17.5, 18);
    ring('Steel', 8, 'W', 'Palazzo', 18, 19);
    ring('Steel', 8, 'W', 'Palazzo', 18.5, 19);
    ring('Steel', 8, 'W', 'Palazzo', 19, 20);
    ring('Steel', 8, 'W', 'Palazzo', 19.5, 20);
    ring('Steel', 8, 'W', 'Palazzo', 20, 21);
    ring('Steel', 8, 'W', 'Palazzo', 20.5, 21);
    ring('Steel', 8, 'W', 'Palazzo', 21, 22);
    ring('Steel', 8, 'W', 'Palazzo', 21.5, 22);
    ring('Steel', 8, 'W', 'Stencil', 16, 17);
    ring('Steel', 8, 'W', 'Stencil', 16.5, 17);
    ring('Steel', 8, 'W', 'Stencil', 17, 19);
    ring('Steel', 8, 'W', 'Stencil', 17.5, 19);
    ring('Steel', 8, 'W', 'Stencil', 18, 20);
    ring('Steel', 8, 'W', 'Stencil', 18.5, 20);
    ring('Steel', 8, 'W', 'Stencil', 19, 20);
    ring('Steel', 8, 'W', 'Stencil', 19.5, 20);
    ring('Steel', 8, 'W', 'Stencil', 20, 21);
    ring('Steel', 8, 'W', 'Stencil', 20.5, 21);
    ring('Steel', 8, 'W', 'Stencil', 21, 22);
    ring('Steel', 8, 'W', 'Stencil', 21.5, 22);
    ring('Steel', 8, 'W', 'Typewriter', 16, 22);
    ring('Steel', 8, 'W', 'Typewriter', 16.5, 22);
    ring('Steel', 8, 'W', 'Typewriter', 17, 23);
    ring('Steel', 8, 'W', 'Typewriter', 17.5, 23);
    ring('Steel', 8, 'W', 'Typewriter', 18, 25);
    ring('Steel', 8, 'W', 'Typewriter', 18.5, 25);
    ring('Steel', 8, 'W', 'Typewriter', 19, 26);
    ring('Steel', 8, 'W', 'Typewriter', 19.5, 26);
    ring('Steel', 8, 'W', 'Typewriter', 20, 27);
    ring('Steel', 8, 'W', 'Typewriter', 20.5, 27);
    ring('Steel', 8, 'W', 'Typewriter', 21, 29);
    ring('Steel', 8, 'W', 'Typewriter', 21.5, 29);
    ring('Steel', 8, 'W', 'Viva', 16, 10);
    ring('Steel', 8, 'W', 'Viva', 16.5, 10);
    ring('Steel', 8, 'W', 'Viva', 17, 11);
    ring('Steel', 8, 'W', 'Viva', 17.5, 11);
    ring('Steel', 8, 'W', 'Viva', 18, 11);
    ring('Steel', 8, 'W', 'Viva', 18.5, 11);
    ring('Steel', 8, 'W', 'Viva', 19, 12);
    ring('Steel', 8, 'W', 'Viva', 19.5, 12);
    ring('Steel', 8, 'W', 'Viva', 20, 12);
    ring('Steel', 8, 'W', 'Viva', 20.5, 12);
    ring('Steel', 8, 'W', 'Viva', 21, 13);
    ring('Steel', 8, 'W', 'Viva', 21.5, 13);
}
