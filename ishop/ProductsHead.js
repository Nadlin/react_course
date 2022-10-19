var ProductsHead = React.createClass({

    displayName: 'ProductsHead',

    propTypes: {
        columns: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    render: function () {
        var productsHead = this.props.columns.map(function (column, index) {
            return React.DOM.th({key: index}, column)
        });

        return React.DOM.thead( {className:'ProductsHead'},
            React.DOM.tr(null, productsHead)
        );
    }
});