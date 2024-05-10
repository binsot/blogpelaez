import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DataForm() {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState(null);
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        axios
            .get('mongodb+srv://vincepelaez05:vince123456789@cluster0.zqjxhwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0') // Replace with your actual API endpoint
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !age) {
            setError('Name and age are required');
            return;
        }
        const url = editItem ? `mongodb+srv://vincepelaez05:vince123456789@cluster0.zqjxhwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/${editItem._id}` : 'mongodb+srv://vincepelaez05:vince123456789@cluster0.zqjxhwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Adjust this line
        const method = editItem ? 'put' : 'post';
        axios[method](url, { name, age })
            .then((response) => {
                console.log(response.data); // Log the response data
                if (editItem) {
                    setData(
                        data.map((item) =>
                            item._id === editItem._id ? response.data : item
                        )
                    );
                } else {
                    setData([...data, response.data.author]);
                }
                setName('');
                setAge('');
                setEditItem(null);
                setError(null);
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    const handleEdit = (_id) => {
        const itemToEdit = data.find((item) => item._id === _id);
        setEditItem(itemToEdit);
        setName(itemToEdit.name);
        setAge(itemToEdit.age);
    };

    const handleDelete = (_id) => {
        axios
            .delete(`mongodb+srv://vincepelaez05:vince123456789@cluster0.zqjxhwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/${_id}`) // Adjust this line
            .then(() => {
                setData(data.filter((item) => item._id !== _id));
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                />
                <button type="submit">{editItem ? 'Update Data' : 'Add Data'}</button>
            </form>
            {error && <p>{error}</p>}
            <ul>
                {data.map((item) => (
                    <li key={item._id}>
                        {item.name} - {item.age}
                        <button onClick={() => handleEdit(item._id)}>Edit</button>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DataForm;
