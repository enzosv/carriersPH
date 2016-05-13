"use strict";

var ImportButtonComponent = React.createClass({
    propTypes: {
        contacts: React.PropTypes.array,
        cards: React.PropTypes.array,
        callback: React.PropTypes.func
    },
    handleClick: function(event) {
        var cards = "";
        var self = this;
        this.props.contacts.map(function(contact) {
            var card = "BEGIN:VCARD\nVERSION:3.0\nFN:" + contact.name + "\n";
            if (self.props.cards.indexOf(contact.id) > -1) {
                for (var i = 0; i < contact.numbers.length; i++) {
                    var number = contact.numbers[i];
                    card += "item" + (i + 1) + ".TEL:" + number.number + "\nitem" + (i + 1) + ".X-ABLabel:" + number.carrier + "\n";
                }
            }
            card += "END:VCARD\n";
            cards += card;
        });
        if (cards !== "") {
            mixpanel.track(
                "web-export", {
                    "contacts_count": this.props.contacts.length,
                    "export_count": this.props.cards.length
                }
            );
            mixpanel.people.increment("exports", this.props.cards.length);
            download(cards, "carriersph.vcard", "text/plain");
            this.props.callback();
        }
    },
    render: function() {
        var length = this.props.cards.length;
        if (length > 0) {
            return button({
                onClick: this.handleClick,
                className: "pull-right btn",
                style: {
                    backgroundColor: "#4d90fe",
                    color: "#fff"
                }
            }, "Step 4. Export as vcard (" + length + ")");
        } else {
            return button({
                onClick: this.handleClick,
                className: "pull-right btn btn-raised",
                disabled: true
            }, "Step 4. Export as vcard");
        }

    }
});
