import React, { useState, useCallback } from 'react';

import List from "./List";
import Controls from "./Controls";

import "./Filter.css";

export default function Filter (props) {
    console.log("render Filter");

    const [displayedWords, setDisplayedWords]=useState(props.wordList);

    function applyFilterSort (isSearch, searchValue, isAlphabeticalOrder) {
        let words = props.wordList.slice();
        if (isSearch && searchValue!= '') {
            words = words.filter(word => word.includes(searchValue));
        }
        if (isAlphabeticalOrder) {
            words.sort();
        }
        setDisplayedWords(words);
    };

    const memoizedApplyFilterSort = useCallback(applyFilterSort, []);

    return (
        <div className="Filter">
            <Controls cbApplyFilterSort={memoizedApplyFilterSort} />
            <List words={displayedWords}  />
        </div>
    );
};
