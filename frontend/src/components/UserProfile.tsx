import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    unit_number?: string;
    role: string;
}

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '', unit_number: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
            setFormData({
                first_name: response.data.user.first_name,
                last_name: response.data.user.last_name,
                phone_number: response.data.user.phone_number || '',
                unit_number: response.data.user.unit_number || '',
            });
        };
        fetchUserProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:3000/api/auth/profile', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUser({ ...user!, ...formData });
        setIsEditing(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:3000/api/auth/password', { currentPassword, newPassword }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setCurrentPassword('');
        setNewPassword('');
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            {user && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="mt-4">
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 mb-2 w-full"
                                placeholder="First Name"
                                required
                            />
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 mb-2 w-full"
                                placeholder="Last Name"
                                required
                            />
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 mb-2 w-full"
                                placeholder="Phone Number"
                            />
                            <input
                                type="text"
                                name="unit_number"
                                value={formData.unit_number}
                                onChange={handleInputChange}
                                className="border rounded-md p-2 mb-2 w-full"
                                placeholder="Unit Number"
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Update Profile</button>
                        </form>
                    ) : (
                        <div className="mt-4">
                            <p><strong>First Name:</strong> {user.first_name}</p>
                            <p><strong>Last Name:</strong> {user.last_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.phone_number || 'N/A'}</p>
                            <p><strong>Unit Number:</strong> {user.unit_number || 'N/A'}</p>
                            <button onClick={() => setIsEditing(true)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Edit Profile</button>
                        </div>
                    )}
                </div>
            )}
            <div className="mt-6">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <form onSubmit={handleChangePassword} className="mt-4">
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border rounded-md p-2 mb-2 w-full"
                        placeholder="Current Password"
                        required
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border rounded-md p-2 mb-2 w-full"
                        placeholder="New Password"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
