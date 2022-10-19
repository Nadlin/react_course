var ProductsBody = React.createClass({

    displayName: 'ProductsBody',

    propTypes: {
        products: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                code: React.PropTypes.number.isRequired,
                qty: React.PropTypes.number.isRequired,
                price: React.PropTypes.number.isRequired
            })
        )
    },

    render: function() {
        var productsCode = this.props.products.map(function (item, index) {
            return React.DOM.tr({key: item.code, className: 'item'},
                React.DOM.td(null, index + 1),
                React.DOM.td(null, React.DOM.img({src: item.url, alt: item.name, title: item.name, className: 'image'})),
                React.DOM.td(null, item.name),
                React.DOM.td(null, item.qty),
                React.DOM.td(null, item.price)
            )
        })

        return React.DOM.tbody({className:'ProductsBody'}, productsCode);
  }
});