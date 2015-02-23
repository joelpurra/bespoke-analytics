/*global bespoke:true */

(function(bespoke) {
    "use strict";

    bespoke.from('article', [
        bespoke.plugins.keys(),
        bespoke.plugins.touch(),
        bespoke.plugins.classes(),
        bespoke.plugins.hash(),
        bespoke.plugins.ga({
            // This tracking id belongs to joelpurra.com - you won't get any statistics if you don't use your own!
            trackingId: 'UA-29171100-1'
        }),
        bespoke.plugins.analytics(),
    ]);
}(bespoke));
