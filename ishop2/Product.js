var Product = React.createClass({

    displayName: 'Product',

    propTypes: {
        name: React.PropTypes.string.isRequired,
        code: React.PropTypes.number.isRequired,
        qty: React.PropTypes.number.isRequired,
        price: React.PropTypes.number.isRequired,
        url: React.PropTypes.string.isRequired,
        cbSelectedProduct: React.PropTypes.func.isRequired,
        selectedProduct: React.PropTypes.number,
        cbDeleteProduct: React.PropTypes.func.isRequired,
        deletedProduct: React.PropTypes.number
    },

    selectProduct: function (eo) {
        if (eo.target.value != 'Delete') {
            this.props.cbSelectedProduct(this.props.code);
        }
    },

    deleteProduct: function (eo) {
        var answer = window.confirm("Do you really want to delete the product?");
        if (answer) {
            this.props.cbDeleteProduct(this.props.code);
        }
    },

    render: function() {
        return React.DOM.tr({className: 'item', 'data-selected': this.props.code == this.props.selectedProduct,
                onClick: this.selectProduct},
            React.DOM.td(null, this.props.name),
            React.DOM.td(null, this.props.price),
            React.DOM.td(null, this.props.url),
            React.DOM.td(null, this.props.qty),
            React.DOM.td(null,
                React.DOM.input({type: 'button', value: 'Delete',
                    onClick: this.deleteProduct
                })
            )
        )
    }
});