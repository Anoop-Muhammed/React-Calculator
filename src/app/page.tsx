import React from 'react'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css';


const Home = () => {
  return (
    <div style={{textAlign: 'center',marginTop: '50px'}}>
      <h2>CLICK FOR SEARCH PAGE</h2>
      <Link href="/list"><button className='btn btn-primary mr-3'>TODO</button></Link>
       <Link href="/counter"><button className='btn btn-danger mr-3'>COUNT</button></Link>
      <Link href="/search"><button className='btn btn-warning mr-3'>SEARCH</button></Link>
      <Link href="/calculator"><button className='btn btn-success mr-3'>CALCULATOR</button></Link>
      <Link href="/sudoku"><button className="btn btn-secondary me-3">SUDOKU</button></Link>
      <Link href="/puzzle"><button className="btn btn-dark me-3">PUZZLE</button></Link>
    </div>
  );
};

export default Home;