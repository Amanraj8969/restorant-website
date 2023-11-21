import React, { useState, useEffect } from 'react';
import RestaurantForm from './component/Restorant';
import './App.css';
import axios from 'axios';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [editForm, setEditForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showForm, setShowForm] = useState(false); 
  const [displayedItems, setDisplayedItems] = useState(4);
  const [editFormData, setEditFormData] = useState({
    editName: '',
    editMobile: '',
    editAddress: '',
    editImageUrl: '',
  });
 
  const handleShowMoreClick = () => {
    setDisplayedItems((prevCount) => prevCount + 4);
  };

  useEffect(() => {
   
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:3000/restaurants');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  console.log("all the rest",restaurants)

  const addRestaurant = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3000/restaurants', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchRestaurants();
      } else {
        console.error('Error adding restaurant:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  const handleEditClick = (restaurant) => {
    setEditForm(true);
    setSelectedRestaurant(restaurant);
    setEditFormData({
      editName: restaurant.name,
      editMobile: restaurant.mobile,
      editAddress: restaurant.address,
      editImageUrl: restaurant.imageUrl,
    });
  };

  const handleEditFormSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/restaurants/${selectedRestaurant.id}`,
        {
          name: editFormData.editName,
          contactNumber: editFormData.editMobile,
          address: editFormData.editAddress,
          imageUrl: editFormData.editImageUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setEditForm(false); 
        fetchRestaurants();
      } else {
        console.error('Error updating restaurant:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };
  const handleDeleteClick = async (restaurantId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/restaurants/${restaurantId}`);

      if (response.status === 200) {
        fetchRestaurants(); 
      } else {
        console.error('Error deleting restaurant:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="App">
      <h1>Restaurant Listings</h1>
      <button onClick={() => setShowForm(!showForm)}>Add Restaurant</button>
      {showForm && <RestaurantForm addRestaurant={addRestaurant} />}
 
      <div className="RestaurantList">
        {restaurants.slice(0, displayedItems).map((restaurant) => (
          <div key={restaurant.id} className="RestaurantBox">
            <img src={restaurant.imageUrl} alt={restaurant.name} className="RestaurantImage" />
            <h2>{restaurant.name}</h2>
            <p>Mobile: {restaurant.contactNumber}</p>
            <p>Address: {restaurant.address}</p>
            <button onClick={() => handleEditClick(restaurant)}>Edit</button>
            <button onClick={() => handleDeleteClick(restaurant.id)}>Delete</button>
            {editForm && selectedRestaurant === restaurant && (
              <div className="EditForm">
                {/* Basic edit form structure */}
                <form onSubmit={(e) => e.preventDefault()}>
                  <label>
                    Edit Name:
                    <input
                      type="text"
                      name="editName"
                      value={editFormData.editName}
                      onChange={(e) => setEditFormData({ ...editFormData, editName: e.target.value })}
                      required
                    />
                  </label>
                  <br />
                  <label>
                    Edit Mobile:
                    <input
                      type="text"
                      name="editMobile"
                      value={editFormData.editMobile}
                      onChange={(e) => setEditFormData({ ...editFormData, editMobile: e.target.value })}
                      required
                    />
                  </label>
                  <br />
                  <label>
                    Edit Address:
                    <input
                      type="text"
                      name="editAddress"
                      value={editFormData.editAddress}
                      onChange={(e) => setEditFormData({ ...editFormData, editAddress: e.target.value })}
                      required

                    />
                  </label>
                  <br />
                  <label>
                    Edit Image URL:
                    <input
                      type="text"
                      name="editImageUrl"
                      value={editFormData.editImageUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, editImageUrl: e.target.value })}
                      required
                    />
                  </label>
                  <br />
                  <button onClick={handleEditFormSubmit}>Submit</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
      {restaurants.length > displayedItems && (
        <div className="ShowMoreButtonContainer">
          <button className="ShowMoreButton" onClick={handleShowMoreClick}>
            Show More
          </button>
        </div>
      )}
      
    </div>
  );
}

export default App;
