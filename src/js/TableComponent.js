"use strict";

var TableComponent = React.createClass({
    propTypes: {
        contacts: React.PropTypes.array,
        stats: React.PropTypes.object
    },
    getInitialState: function() {
        var cards = [];
        this.props.contacts.map(function(contact) {
            cards.push(contact.id);
        });
        return {
            checked: true,
            cards: cards,
            downloaded: false
        };
    },
    onChange: function(event) {
        if (this.state.checked) {
            this.setState({
                checked: false,
                cards: []
            });
        } else {
            var cards = [];
            this.props.contacts.map(function(contact) {
                cards.push(contact.id);
            });
            this.setState({
                checked: true,
                cards: cards
            });
        }
    },
    downloadCallback: function() {
        this.setState({
            downloaded: true
        });
    },
    handleChildClick: function(id, checked) {
        var cards = this.state.cards;
        if (checked) {
            if (cards.indexOf(id) === -1) {
                cards.push(id);
                this.setState({
                    cards: cards
                });
            }
        } else {
            var index = cards.indexOf(id);
            if (index > -1) {
                cards.splice(index, 1);
                this.setState({
                    cards: cards
                });
            }
        }
    },
    contactsAction: function() {
        window.location = "https://www.google.com/contacts/u/0/?cplus=0";
    },
    render: function() {
        var self = this;
        var handleChildClick = this.handleChildClick;
        var contactsButton;
        if (this.state.downloaded) {
            contactsButton = button({
                key: "contacts-button",
                onClick: this.contactsAction,
                hidden: {
                    display: "none"
                },
                className: "pull-right btn",
                style: {
                    backgroundColor: "#f00",
                    color: "#fff",
                    marginLeft: "8px"
                }
            }, "Step 5. Import to Google Contacts");
        }

        return div({}, [
            h3({
                key: "h3-step3"
            }, [
                "Step 3. Review Changes",
                contactsButton,
                React.createElement(ImportButtonComponent, {
                    key: "import-button",
                    cards: this.state.cards,
                    contacts: this.props.contacts,
                    callback: this.downloadCallback
                })
            ]),
            p({
                    key: "stats"
                },
                "Statistics: All (" + this.props.stats.all + "), Unprocessed (" + this.props.stats.unprocessed + "), Other (" + this.props.stats.other + "), Globe (" + this.props.stats.globe + "), Smart (" + this.props.stats.smart + "), Sun (" + this.props.stats.sun + ")"
            ),
            table({
                key: "contact-table",
                className: "table table-bordered"
            }, [
                thead({
                    key: "table-head"
                }, [
                    tr({
                        key: "head-row"
                    }, [
                        td({
                            key: "td-name"
                        }, "Name"),
                        td({
                            key: "td-number"
                        }, "Number"),
                        td({
                            key: "td-label"
                        }, "Label"),
                        td({
                            key: "td-check"
                        }, label({}, input({
                            type: "checkbox",
                            checked: this.state.checked,
                            onChange: this.onChange
                        })))
                    ]),
                ]),
                tbody({
                    key: "table-body"
                }, this.props.contacts.map(function(contact) {
                    return contact.numbers.map(function(number) {
                        return React.createElement(ContactRowComponent, {
                            key: contact.id + "-" + number.number + "-" + number.label,
                            name: contact.name,
                            number: number,
                            id: contact.id,
                            checked: self.state.cards.indexOf(contact.id) > -1,
                            checkChange: handleChildClick
                        });
                    });
                }))
            ])
        ]);
    }
});
