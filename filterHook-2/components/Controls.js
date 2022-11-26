import React, { useState, useEffect } from 'react';

export default function Controls ({cbApplyFilterSort}) {
    console.log("render Controls");

    const [isAlphabeticalOrder,setAlphaOrder]=useState(false);
    const [searchValue,setSearchValue]=useState('');
    const [isSearch, setIsSearch]=useState(false);

    useEffect(
        ()=>{
            console.log('filter render - Controls');
            cbApplyFilterSort(isSearch, searchValue, isAlphabeticalOrder);
            return ()=>{
                console.log('Controls размонтирован');
            };
        },
        [isSearch, searchValue, isAlphabeticalOrder, cbApplyFilterSort]
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
        <div>
            <input type="checkbox" name="switch" checked={isAlphabeticalOrder} onChange={changeAlphabeticalOrder} />
            <input type="text" name="search" value={searchValue} onChange={(eo) => applyFilter(eo.target.value)} />
            <input type="button" value="Сброс" onClick={resetFilter} />
        </div>
    );
};
