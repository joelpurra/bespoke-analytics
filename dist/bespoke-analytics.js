/*!
 * bespoke-analytics v1.0.1
 *
 * Copyright 2015, Joel Purra
 * This content is released under the MIT license
 * https://joelpurra.mit-license.org/2015
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var o=n;o=o.bespoke||(o.bespoke={}),o=o.plugins||(o.plugins={}),o.analytics=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*global module:true, require:true, window:true, document:true */

"use strict";

var pluginName = "analytics",
    // Hack to get around having to write all browser code with require().
    browserGlobal = (function(f) {
        return f("return this")();
    }(Function)),
    convenient = ((browserGlobal.bespoke && browserGlobal.bespoke.plugins && browserGlobal.bespoke.plugins.convenient) || _dereq_("bespoke-convenient")),
    cv = convenient.builder(pluginName),

    isDNTEnabled = function() {
        // This code has been duplicated elsewhere in this project.
        // https://stackoverflow.com/questions/23933650/javascript-only-detection-of-do-not-track-settings-in-ie11
        // https://stackoverflow.com/questions/16947459/is-it-possible-to-check-the-value-of-firefox-dnt-with-javascript/16947583#16947583
        // https://www.w3.org/TR/tracking-dnt/#js-dom
        // https://www.w3.org/TR/tracking-dnt/#dnt-header-field
        var isDNT = window.doNotTrack === "yes" || window.doNotTrack === "1" ||
            window.msDoNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.doNotTrack === "1" ||
            navigator.msDoNotTrack === "1" || false;

        return isDNT;
    },

    isTestRun = function() {
        var ua = navigator.userAgent || "",
            isPhantomJs = (ua.toLowerCase().indexOf("phantomjs") !== -1);

        return isPhantomJs;
    },

    isTrackableDomain = function() {
        var hostname = document.location.hostname;

        // A test run check should not be here, but changing the default bespoke
        // plugin test setup to not use "localhost" or "127." seems harder.
        if (isTestRun()) {
            return true;
        }

        if ((hostname === "localhost" || hostname.startsWith("127."))) {
            return false;
        }

        return true;
    },

    isTrackingEnabled = function() {
        return isTrackableDomain() && !isDNTEnabled();
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

},{}]},{},[1])
(1)
});
