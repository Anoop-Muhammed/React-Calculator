'use client';
import React, { useState } from "react";
import './calculator.css';

const Calculator = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const handleButtonClick = (value: string) => {
        if (value === '=') {
            calculateResult();
        } else if (value === 'C') {
            setInput('');
            setResult('');
        } else if (value === 'x²') {
            setInput((prev) => prev + '**2');
        } else if (value === '←') {
            setInput((prev) => prev.slice(0, -1));
        } else {
            setInput((prev) => prev + value);
        }
    };

    const calculateResult = () => {
        try {
            setResult(eval(input));
        } catch (error) {
            setResult('Error');
        }
    };

    return (
        <div className="calculator">
            <div className="display">
                <div className="input">{input}</div>
                <div className="result">{result}</div>
            </div>
            <div className="buttons">
                {['C','x²','←','%','7','8','9','+','4','5','6','-','1','2','3','*','.','0','=','/'].map((button) => (
                    <button className={`button ${button === 'C' ? 'red-button' : ''} ${button === '=' ? 'blue-button' : ''} double-width`} onClick={() => handleButtonClick(button)}>
                        {button}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
