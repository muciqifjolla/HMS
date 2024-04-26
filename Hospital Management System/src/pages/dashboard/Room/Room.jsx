import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Room({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedRoomId,
}) {
    const [room, setRoom] = useState([]);
    const [deleteRoomId, setDeleteRoomId] = useState(null);

    const handleUpdateButtonClick = (roomId) => {
        setSelectedRoomId(roomId);
        setShowUpdateForm(!showUpdateForm);
    };

    useEffect(() => {
        axios.get('http://localhost:9004/api/room')
            .then((res) => setRoom(res.data))
            .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        setDeleteRoomId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/room/delete/${deleteRoomId}`);
            setRoom(room.filter((item) => item.Room_ID  !== deleteRoomId));


            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
            
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            
        } catch (err) {
            console.log(err);
        }
        setDeleteRoomId(null);
    };

    return (
        <div className="container-fluid mt-4">
            {deleteRoomId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this medicine record?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}> Delete</button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteRoomId(null)}> Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ borderRadius: '0.5rem' }}
                onClick={() => setShowCreateForm(!showCreateForm)}
            >
                {showCreateForm ? 'Close Add Form' : 'Add Room'}
            </button>

            <div className="table-responsive">
                <div className="py-8">
                    <h2 className="text-2xl font-semibold leading-tight">Rooms</h2>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room Type</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cost (€)</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {room.map((data, i) => (
                                        <tr key={i}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Room_ID }</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Room_type}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Patient_ID }</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Room_cost}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleUpdateButtonClick(data.Room_ID)}
                                                >
                                                    {showUpdateForm ? 'Close Update Form' : 'Update'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(data.Room_ID)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Room;
