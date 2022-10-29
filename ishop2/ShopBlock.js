var ShopBlock = React.createClass({

    displayName: 'ShopBlock',

    propTypes: {
        shopName: React.PropTypes.string.isRequired,
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

    getInitialState: function () {
        return {
            products: this.props.products,
            selectedProduct: null,
            lastDeletedProduct: null
        }
    },

    getSelectedProduct: function (code) {
        this.setState({selectedProduct: code})
    },

    deleteProduct: function (code) {
        var productArr = this.state.products.map((v) => v);
        this.setState({products: productArr.filter((item) => item.code != code)});
    },
    
    render: function () {
        var columns = this.props.columns.map((v, i) =>
            React.DOM.td({key: i}, v)
        );
        var products = this.state.products.map((v) =>
            React.createElement(Product, {
                key: v.code, name: v.name, price: v.price, qty: v.qty, url: v.url, code: v.code,
                cbSelectedProduct: this.getSelectedProduct,
                selectedProduct: this.state.selectedProduct,
                cbDeleteProduct: this.deleteProduct,
                deletedProduct: this.state.lastDeletedProduct
            })
        );
        return React.DOM.table({className: 'ShopBlock'},
            React.DOM.caption(null, this.props.shopName),
            React.DOM.thead(null,
                React.DOM.tr(null, columns)),
            React.DOM.tbody(null, products)
        );
    },
});