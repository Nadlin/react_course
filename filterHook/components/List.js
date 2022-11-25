import React from 'react';

export default function List (props) {

    return (
        <div className="list">
            {
                props.words.map((word, i) => <div key={i}>{word}</div>)
            }
        </div>
    )
};
