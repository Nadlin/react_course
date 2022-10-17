var ProductsTable = React.createClass({
    displayName: 'ProductsBlock',

    propTypes: {
        products: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                code: React.PropTypes.number.isRequired,
                qty: React.PropTypes.number.isRequired,
                price: React.PropTypes.number.isRequired
            })
        ),
        columns: React.PropTypes.array.isRequired
    },

    render: function () {
        return React.DOM.table({className: 'ProductsTable'},
            React.createElement(ProductsHead, {columns: this.props.columns}),
            React.createElement(ProductsBody, {products: this.props.products})
        );
    },
});