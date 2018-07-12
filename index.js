function EventType(name) {
    this.name = name;
}

function Event(name, magnitude) {
    this.name = name;
    this.magnitude = magnitude;
    this.toString = function() {
        return JSON.stringify(this);
    };
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

function EventAdder(div, container) {
    var addDiv = $(div).find('#event-adder');
    var form = $(div).find('#adder');
    var input = form.find('input');
    var cancelButton = form.find('.cancel');
    var self = this;

    this.show = function() {
        addDiv.show();
        input.select();
    };

    this.hide = function() {
        addDiv.hide();
    };

    this.addEvent = function() {
        var name = input.val();
        var event = new Event(name);
        container.addEvent(event);
        self.hide();
        input.val('');
    };

    (function init() {
        form.submit(onSubmit);
        cancelButton.click(onCancel);
    }());

    function onCancel(clickEvent) {
        clickEvent.preventDefault();
        self.hide();
        return false;
    };

    function onSubmit(submitEvent) {
        submitEvent.preventDefault();
        self.addEvent();
        return false;
    };
}

function DataStore() {
    var types = [new EventType('derp')];

    this.getEventTypes = function() {
        return types;
    };

    this.createEventType = function(type) {
        console.log("createing type: " + type);
        types.push(type);
    };

    this.createEvent = function(event) {
        console.log("creating event: " + event);
    };
}

function EventContainer(container) {
    var store = new DataStore();
    var adder = new EventAdder(container, this);
    var magSelector = new MagnitudeSelector(container, this);
    var addButton = $(container).find("#add-button");
    var list = $(container).find('#events-list');
    
    this.addEvent = function(type) {
        store.createEventType(type);
        render();
    };
    
    (function init() {
        addButton.click(adder.show);
        render();
    }());
    
    function render() {
        list.html('');
        store.getEventTypes().forEach(function(type) {
            console.log('rendering event type: ' + type);
            list.append($('<div>')
                        .addClass('event-type')
                        .html(type.name)
                        .click(function() {
                            magSelector.select(type.name, function(mag) {
                                var event = new Event(type.name, mag);
                                store.createEvent(event);
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
