/*global document:true, jasmine:true, bespoke:true, describe:true, it:true, expect:true, beforeEach:true */

Function.prototype.bind = Function.prototype.bind || require("function-bind");

var bespoke = require("bespoke"),
    analytics = require("../../lib-instrumented/bespoke-analytics.js");

(function(document, jasmine, bespoke, describe, it, expect, beforeEach) {
    "use strict";

    describe("bespoke-analytics", function() {

        var deck,

            createDeck = function() {
                var parent = document.createElement("article");
                for (var i = 0; i < 10; i++) {
                    parent.appendChild(document.createElement("section"));
                }

                deck = bespoke.from(parent, [
                    analytics()
                ]);
            },

            expectToBeActive = function(index) {
                expect(deck.slides[index].classList.contains("bespoke-active")).toBe(true);
            },

            expectToBeInactive = function(index) {
                expect(deck.slides[index].classList.contains("bespoke-inactive")).toBe(true);
            };

        beforeEach(createDeck);

        describe("deck.trackActiveSlide on next", function() {
            it("should call window.ga", function() {
                var originalGoogleAnalytics = window.ga,
                    gaSpy = jasmine.createSpy("window.ga");

                window.ga = gaSpy;
                deck.next();
                window.ga = originalGoogleAnalytics;

                expect(gaSpy).toHaveBeenCalled();
            });
        });
    });
}(document, jasmine, bespoke, describe, it, expect, beforeEach));
