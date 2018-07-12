function Event(name, magnitude) {
    this.name = name;
    this.magnitude = magnitude;
    this.toString = function() {
        return JSON.stringify(this);
    };
}

function EventAdder(div, container) {
    var form = $(div).find('form')
    var input = form.find('input');
    form.submit(function(e) {
        console.log('adding: ' + input.val());
        container.addEvent(new Event(input.val()));
        e.preventDefault();
        return false;
    });
}

function MagnitudeSelector(div, container) {
    var k = null;
    var selectorDiv = $(div).find("#magnitude-selector");

    this.select = function(name, callback) {
        k = callback;
        selectorDiv.find('.event-name').html(name);
        selectorDiv.show();
    };
    
    (function init() {
        selectorDiv.find(".magnitude").click(function() {
            var magnitude = $(this).html();
            selectorDiv.hide();
            k(magnitude);
            k = null;
        });
        selectorDiv.find(".cancel").click(function() {
            selectorDiv.hide();
            k = null;
        });
    }());
}

function EventContainer(container) {
    var events = [new Event('derp')];
    var adder = new EventAdder(container, this);
    var magSelector = new MagnitudeSelector(container, this);
    var list = $(container).find('#events-list');
    
    this.addEvent = function(event) {
        console.log("pushing: " + event);
        events.push(event);
        render();
    };
    
    (function init() {
        render();
    }());
    
    function render() {
        list.html('');
        events.forEach(function(event) {
            console.log('event: ' + event);
            list.append($('<div>')
                        .addClass('event-type')
                        .html(event.name)
                        .click(function() {
                            magSelector.select(event.name, function(mag) {
                                var logged = new Event(event.name, mag);
                                console.log(logged);
                            })
                        })
                       );
        });
    }
}

$(document).ready(function() {
    console.log('ready');
    new EventContainer("#root");
});
