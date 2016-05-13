"use strict";

var ContactRowComponent = React.createClass({
    propTypes: {
        number: React.PropTypes.object,
        name: React.PropTypes.string,
        id: React.PropTypes.number,
        checked: React.PropTypes.bool,
        checkChange: React.PropTypes.func
    },
    handleClick: function(event) {
        this.props.checkChange(this.props.id, !this.props.checked);
    },
    render: function() {
        var number = this.props.number;
        var key = this.props.id + "-" + number.number + "-" + number.label;
        return tr({
            key:key + "-row"
        }, [
            td({
                key: key + "-name"
            }, this.props.name),
            td({
                key: key + "-number"
            }, number.number),
            td({
                key: key + "-label"
            }, number.label + " → " + number.carrier),
            td({
                key: key + "-check"
            }, label({
                key: key + "-check-label"
            }, input({
                key: key + "-check-input",
                type: "checkbox",
                checked: this.props.checked,
                onChange: this.handleClick,
            })))
        ]);
    }
});
