import React, { useState, useCallback, useEffect } from 'react';

import List from "./List";

import "./Filter.css";

export default function Filter (props) {  //ananimus name in console?
    console.log("render Filter");

    const [isAlphabeticalOrder,setAlphaOrder]=useState(false);
    const [searchValue,setSearchValue]=useState('');
    const [isSearch, setIsSearch]=useState(false);
    const [displayedWords, setDisplayedWords]=useState(props.wordList);

    useEffect(
        ()=>{
            console.log('filter render - useEffect');
            let words = props.wordList.slice();
            if (isSearch && searchValue!= '') {
                words = words.filter(word => word.includes(searchValue));
            }
            if (isAlphabeticalOrder) {
                words.sort();
            }
            setDisplayedWords(words);
            return ()=>{
                console.log('размонтирован');
            };
        },
        [isSearch, searchValue, isAlphabeticalOrder]
    );

    function changeAlphabeticalOrder() {
        setAlphaOrder(!isAlphabeticalOrder);
    };

    function applyFilter (value) {
        setIsSearch(true);
        setSearchValue(value);
    };

    function resetFilter () {
        setIsSearch(false);
        setSearchValue('');
        setAlphaOrder(false);
    };

    return (
        <div className="Filter">
            <input type="checkbox" name="switch" checked={isAlphabeticalOrder} onChange={changeAlphabeticalOrder} />
            <input type="text" name="search" value={searchValue} onChange={(eo) => applyFilter(eo.target.value)} />
            <input type="button" value="Сброс" onClick={resetFilter} />
            <List words={displayedWords}  />
        </div>
    );
};