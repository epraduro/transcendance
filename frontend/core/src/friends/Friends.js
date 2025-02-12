import React, { useEffect, useState } from 'react';
import axiosInstance from '../instance/AxiosInstance';
import { getCookies } from '../App';
import { jwtDecode } from 'jwt-decode';
import { showToast } from '../instance/ToastsInstance';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import useJwt from '../instance/JwtInstance';

function SeeFriendsRequest({ toWhom, type, onResponse }) {
    const handleResponse = async () => {
        try {
            if (type) {
                await axiosInstance.post(`/friends/accept/${toWhom}`);
            } else {
                await axiosInstance.post(`/friends/decline/${toWhom}`);
            }
            onResponse(toWhom);
        } catch (error) {
			showToast("error", error.response.data.error);
            console.error('Error handling friend request:', error);
        }
    };

    return (
        <>
            <button 
                onClick={handleResponse} 
                style={{
                    marginRight: '10px', 
                    backgroundColor: type ? 'green' : 'red', 
                    color: 'white'
                }}
            >
                {type ? 'Accept' : 'Decline'}
            </button>
        </>
    );
}

function FriendRequests() {
    const [friendRequests, setFriendRequests] = useState([]);
	const [friendList, setFriendList] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const getJwt = useJwt();

    const handleSearch = async () => {
        if (searchQuery.length > 0) {
            try {
                const response = await axiosInstance.get(`/friends/search/${searchQuery}`);
                console.log('Search results:', response.data);
				setSearchResults(response.data);
            } catch (error) {
                console.error('Error searching for friends:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

	const handleAddFriend = async (id) => {
        try {
            await axiosInstance.post(`/friends/send/${id}`);
            showToast('success', 'Friend Request sent !')
        } catch (error) {
			showToast("error", error.response.data.error);
            console.error('Error sending friend request:', error);
        }
    };

	const fetchFriendList = async () => {
		const token = getCookies('token');
		const decodeToken = getJwt(token);

		try {
			const reponse = await axiosInstance.get(`/friends/list/${decodeToken.id}`);
			setFriendList(reponse.data);
			console.log(reponse.data)
		}
		catch(error) {
			console.log(error);
		}
	}

	const deleteFriends = async (id) => {

		try {
			const response = await axiosInstance.post(`/friends/delete/${id}`);
			setFriendList((prevList) => ({
				...prevList,
				friends: prevList.friends.filter((friend) => friend.id !== id),
			}));
			showToast('success', response.data.message);
		}
		catch(error) {
			showToast('error', error.response.data.error);
		}
	}

    const fetchFriendRequests = async () => {
        try {
            const response = await axiosInstance.get('/friends/request');
            setFriendRequests(response.data);
			console.log("hello:", response);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const handleRequestResponse = (id) => {
        setFriendRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
		fetchFriendList();
    };

    useEffect(() => {

		fetchFriendList();
        fetchFriendRequests();
		const interval = setInterval(() => {
			fetchFriendList();
        	fetchFriendRequests();
		}, 5000);
		
		return () => clearInterval(interval);
    }, []);

    return (
		<>
			<div>
				<h1>My Friends</h1>
				{friendList.friends && friendList.friends.length > 0 ? (
   				<ul>
        			{friendList.friends.map((friend) => (
            		<li key={friend.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                	<img 
						src={friend.profile_image ? `http://localhost:8000${friend.profile_image}` : '/default.png'}
                    	alt={`${friend.name}'s profile`} 
                    	style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                	/>
					 <Link to={`/profile/${friend.id}`} className="text-decoration-none text-white">{friend.name}</Link>
					 <button
                    	onClick={() => deleteFriends(friend.id)}
                    	style={{
							backgroundColor: 'red',
							color: 'white',
							border: 'none',
							borderRadius: '50%',
							width: '20px',
							height: '20px',
							cursor: 'pointer',
							textAlign: 'center',
						}}
                ></button>
					<span> - Status : {friend.status}</span>
            		</li>
        			))}
    				</ul>
				) : (
					<p>No friends found.</p>
				)}
			</div>
			<div>
				<h1>Friend Requests</h1>
				<ul>
					{friendRequests.map((request) => (
						<li key={request.id}>
							{request.from_user_name} ({request.from_user_email})
							<span> - Requested on {new Date(request.created_at).toLocaleDateString()}</span>
							<div>
								<SeeFriendsRequest 
									toWhom={request.id} 
									type={true} 
									onResponse={handleRequestResponse} 
								/>
								<SeeFriendsRequest 
									toWhom={request.id} 
									type={false} 
									onResponse={handleRequestResponse} 
								/>
							</div>
						</li>
					))}
				</ul>
			</div>
			<div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search for friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '5px', width: '80%' }}
                    />
                    <button onClick={handleSearch} style={{ marginLeft: '5px', padding: '5px 10px' }}>
                        Search
                    </button>
			</div>
			<div>
                <h1>Search Results</h1>
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((user) => (
                            <li key={user.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                <img 
                                    src={user.profile_image ? `http://localhost:8000${user.profile_image}` : '/default.png'}
                                    alt={`${user.name}'s profile`} 
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                                />
                                <span style={{ fontWeight: 'bold' }}>{user.name}</span> <span style={{ color: 'gray' }}>({user.email})</span>
                                <button 
                                    onClick={() => handleAddFriend(user.id)} 
                                    style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: 'blue', color: 'white' }}
                                >
                                    Add Friend
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No search results found.</p>
                )}
            </div>
			<ToastContainer />
		</>
    );
}

export default FriendRequests;
