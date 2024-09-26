'use client';
import React, { useState, useEffect } from 'react';

interface Product {
    id: number;
    price: number;
    description: string;
    category: string;
    image: string;
}

function Search() {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchedData, setFetchedData] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products');
                const result = await response.json();
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFetchedData(data);
        } else {
            const fetched = data.filter(item => 
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFetchedData(fetched);
        }
    }, [searchTerm, data]);

    return (
        <div className='text-center'>
            <h2>Product List</h2>
            <div className='mt-5'>
                <label>SEARCH: </label>
                <input 
                    type='text' 
                    className='text-black border-white border-1' 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search by category or title"
                />
            </div>
            {loading ? (
                <p>Loading data, please wait...</p>
            ) : fetchedData.length > 0 ? (
                <table className='mt-10 mx-auto border-collapse border border-gray-300'>
                    <thead>
    <tr>
        <th className='border border-gray-300 px-4 py-2'>Category</th>
        <th className='border border-gray-300 px-4 py-2'>Price</th>
        <th className='border border-gray-300 px-4 py-2'>Description</th>
        <th className='border border-gray-300 px-4 py-2'>Image</th>
    </tr>
</thead>
<tbody>
    {fetchedData.map(item => (
        <tr key={item.id}>
            <td className='border border-gray-300 px-4 py-2'>{item.category}</td>
            <td className='border border-gray-300 px-4 py-2'>${item.price}</td>
            <td className='border border-gray-300 px-4 py-2 w-96'>{item.description}</td>
            <td className='border border-gray-300 px-4 py-2'><img className='w-36 h-36' src={item.image} alt={item.category} /></td> 
        </tr>
    ))}
</tbody>
                </table>
            ) : (
                <p>No products found matching your search.</p>
            )}
        </div>
    );
}

export default Search;