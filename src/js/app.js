// (function() {
"use strict";

var MainComponent = React.createClass({
    getInitialState: function() {
        return {
            "loggedIn": false,
            "contacts": []
        };
    },
    handleClick: function(event) {
        var config = {
            'client_id': '723413737382-rgtis725rvne01mh37nqb3r7skohj3fd.apps.googleusercontent.com',
            'scope': 'https://www.google.com/m8/feeds'
        };
        var self = this;
        gapi.auth.authorize(config, function() {
            self.fetch(gapi.auth.getToken());
        });
    },
    fetch: function(token) {
        var self = this;
        mixpanel.identify(token.access_token);
        $.ajax({
            url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&showdeleted=false&max-results=9999',
            dataType: 'jsonp',
            data: token
        }).done(function(data) {
            var contacts = data.feed.entry;
            var people = [];
            var globe = 0;
            var smart = 0;
            var sun = 0;
            var abs = 0;
            var other = 0;
            for (var i = 0; i < contacts.length; i++) {
                var contact = contacts[i];
                if (contact.gd$phoneNumber) {
                    var numbers = [];
                    for (var j = 0; j < contact.gd$phoneNumber.length; j++) {
                        
                        try {
                            var n = parseInt(phoneUtils.formatNational(contact.gd$phoneNumber[j].$t, "PH").split(" ").join(""));
                            if (n > 8000000000) {
                                var prefix = parseInt(n * 0.0000001).toString();
                                var carrier = carriers[prefix];
                                if (carrier) {
                                    if (carrier === "Globe") {
                                        globe++;
                                    } else if (carrier === "Smart") {
                                        smart++;
                                    } else if (carrier === "Sun") {
                                        sun++;
                                    } else if (carrier === "ABS-CBN") {
                                        abs++;
                                    }
                                    if (contact.gd$phoneNumber[j].label !== carrier) {
                                        numbers.push({
                                            "label": contact.gd$phoneNumber[j].label,
                                            "number": "+63" + n,
                                            "carrier": carrier,
                                        });
                                    }
                                }
                            }
                        } catch(err){
                            console.error(err);
                            console.error(contact.gd$phoneNumber[j].$t);
                        }

                    }
                    if (numbers.length > 0) {
                        people.push({
                            "id": i,
                            "name": contact.title.$t,
                            "numbers": numbers,
                        });
                    }
                }
            }

            mixpanel.people.increment("web-logins");
            var stats = {
                "globe": globe,
                "smart": smart,
                "sun": sun,
                "abs-cbn": abs,
                "other": contacts.length - globe - smart - sun - abs,
                "all": contacts.length,
                "unprocessed": people.length
            };
            mixpanel.people.set(stats);
            mixpanel.track(
                "web-login", { "processed": people.length }
            );
            self.setState({
                "stats": stats,
                "loggedIn": true,
                "contacts": people
            });
        });

    },
    render: function() {
        if (!this.state.loggedIn) {
            return center({
                key: "main-center"
            }, [
                h3({
                    key: "main-step1"
                }, [
                    "Step 1. Backup your ",
                    link({
                        key: "link-step1",
                        href: "https://www.google.com/contacts/u/0/?cplus=0"
                    }, "Google Contacts")

                ]),
                p({
                    key: "step1-disclaimer"
                }, [
                    'You can do this by selecting "More" then "Export" in the link above',
                    br({
                        key: "br-step1"
                    }),
                    'This is also where you will import the updated contacts which you will generate in Step 3.',
                    br({
                        key: "br-step1-2"
                    }),
                    br({
                        key: "br-step1-3"
                    }),
                    'I will not be liable for lost/corrupted contacts. Please backup and use this at your own risk.'
                ]),
                h3({
                    key: "main-step2"
                }, [
                    "Step 2.",
                    br({
                        key: "br-step2"
                    }),
                    button({
                        key: "login-button",
                        onClick: this.handleClick,
                        className: "btn btn-raised",
                        style: {
                            backgroundColor: "#4d90fe",
                            color: "#fff"
                        }
                    }, "Login")
                ]),
            ]);
        } else {
            return div({}, [
                React.createElement(TableComponent, {
                    key: "table",
                    contacts: this.state.contacts,
                    stats: this.state.stats
                })
            ]);
        }
    }
});

ReactDOM.render(React.createElement(MainComponent, {}), document.getElementById("root"));
