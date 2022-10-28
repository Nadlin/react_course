var FilterBlock = React.createClass({

    displayName: 'FilterBlock',

    propTypes: {
        wordList: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
        return {
            wordList: this.props.wordList,
            isAlphabeticalOrder: false,
            searchValue: '',
            isReset: true,
            isSearch: false
        }
    },

    changeAlphabeticalOrder: function () {
        this.setState({isAlphabeticalOrder: !this.state.isAlphabeticalOrder, isReset: false});
    },

    applyFilter: function (eo) {
        this.setState({searchValue: eo.target.value, isSearch: true, isReset: false});
    },

    resetFilter: function () {
        this.setState({isReset: true, isAlphabeticalOrder: false, isSearch: false, searchValue: ''});
    },

    getProcessedArr: function() {
        var self = this,
            wordsArr = this.state.wordList.map(item => item);

        if (!this.state.isReset && this.state.isAlphabeticalOrder) {
            wordsArr.sort();
        }
        if (!this.state.isReset && this.state.isSearch) {
            wordsArr = wordsArr.filter(function (elem) {return elem.indexOf(self.state.searchValue) != -1});
        }

        return wordsArr;
    },

    render: function () {
        words = this.getProcessedArr().map( (word, index) =>
            React.DOM.div({key: index}, word)
        );

        return React.DOM.div({className: 'FilterBlock'},
            React.DOM.input({
                type: 'checkbox', name: 'switch',
                checked: this.state.isAlphabeticalOrder,
                onClick: this.changeAlphabeticalOrder
            }),
            React.DOM.input({
                type: 'text', name: 'search', value: this.state.searchValue,
                onChange: this.applyFilter
            }),
            React.DOM.input({
                type: 'button', value: 'Сброс',
                onClick: this.resetFilter
            }),
            React.DOM.div({className: 'list'}, words)
        );
    },
});