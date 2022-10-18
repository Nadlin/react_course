var ProductsHead = React.createClass({
    displayName: 'ProductsBlock',

    propTypes: {
        columns: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    render: function () {
        var productsHead = this.props.columns.map(function (column, index) {
            return React.DOM.th(null, column) // нужно ли для такого массива задавать key?? columns = ['#', 'Product Image', 'Product Name', 'Quantity', 'Price, $']
        });

        return React.DOM.thead( {className:'ProductsHead'},
            React.DOM.tr({}, productsHead)
        );
    }
});