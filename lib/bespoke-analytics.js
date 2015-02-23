/*global module:true, require:true, window:true, document:true */

"use strict";

var pluginName = "analytics",
    // Hack to get around having to write all browser code with require().
    browserGlobal = (function(f) {
        return f("return this")();
    }(Function)),
    convenient = ((browserGlobal.bespoke && browserGlobal.bespoke.plugins && browserGlobal.bespoke.plugins.convenient) || require("bespoke-convenient")),
    cv = convenient.builder(pluginName),

    isTrackingEnabled = function() {
        // This code has been duplicated elsewhere in this project.
        // http://stackoverflow.com/questions/23933650/javascript-only-detection-of-do-not-track-settings-in-ie11
        // http://stackoverflow.com/questions/16947459/is-it-possible-to-check-the-value-of-firefox-dnt-with-javascript/16947583#16947583
        // http://www.w3.org/TR/tracking-dnt/#js-dom
        // http://www.w3.org/TR/tracking-dnt/#dnt-header-field
        var isDNT = window.doNotTrack === "yes" || window.doNotTrack === "1" ||
            window.msDoNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.doNotTrack === "1" ||
            navigator.msDoNotTrack === "1" || false;

        return !isDNT;
    },

    plugin = function(options) {
        var decker = function(deck) {
            var cvBoundToDeck = cv.activateDeck(deck),

                off = {},

                slideActivations = 0,

                unboundDeckMethods = {
                    // Plugin functions expect to be executed in a deck context
                    tracker: function() {
                        var args = Array.prototype.slice.call(arguments, 0),
                            trackerFunction = window.ga || function() {
                                cvBoundToDeck.log("Tracking disabled", args);
                            };

                        trackerFunction.apply(null, args);
                    },

                    trackActiveSlide: function() {
                        if (!isTrackingEnabled()) {
                            return;
                        }

                        // Explicitly include the hash, as bespoke-hash might be in use.
                        var page = document.location.pathname + document.location.search + document.location.hash;

                        // Doesn't handle multiple presentations on a single page.
                        // Then again, the tracker probably doesn't either.
                        // TODO: should a "screenview" be used instead of "pageview"?
                        // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
                        this.tracker("send", "pageview", page);
                    }
                },

                publicDeckMethods = ["tracker", "trackActiveSlide"],

                original = {},

                registerDeckExtensions = function() {
                    // Bind fire to the deck instance, so it doesn't have to be passed all the time.
                    // Works in the browser, but doesn't pass jasmine tests.
                    // Could be another problem with phantom-polyfill.js.
                    // TODO: re-test bound fire in the future.
                    //original.fire = cv.fire;
                    //cv.fire = cv.fire.bind(cv, deck);

                    publicDeckMethods.forEach(function(methodName) {
                        original[methodName] = deck[methodName];
                        deck[methodName] = unboundDeckMethods[methodName].bind(deck);
                    });
                },

                aslideActivateListener = function(e) {
                    if (slideActivations > 0) {
                        deck.trackActiveSlide();
                    }

                    slideActivations++;
                },

                enable = function() {
                    off["activate"] = deck.on("activate", aslideActivateListener);
                },

                init = function() {
                    registerDeckExtensions();
                    enable();
                };

            init();
        };

        return decker;
    };

module.exports = plugin;
