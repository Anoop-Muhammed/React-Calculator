'use client';
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{textAlign: 'center',marginTop: '50px'}}>
      <h1 className='text-3xl'>{count}</h1>
      <div>
      <button className='m-3 border-white border-2 p-2' onClick={() => setCount(count + 1)}>Increment</button>
      <button className='m-3 border-white border-2 p-2' onClick={() => setCount(0)}>Reset</button>
      <button className='m-3 border-white border-2 p-2' onClick={() => setCount(count - 1)}>Decrement</button>
      </div>
    </div>
  );
}

export default Counter;
