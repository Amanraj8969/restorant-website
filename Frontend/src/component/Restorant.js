
import { useState } from "react";
import './RestaurantForm.css'


const RestaurantForm = ({ addRestaurant }) => {
    const [formData, setFormData] = useState({
      name: '',
      address: '',
      contactNumber: '',
      imageUrl: '',
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      addRestaurant(formData);
     
      setFormData({ name: '', address: '', contactNumber: '', imageUrl: '' });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Contact Number:
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Image URL:
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Add Restaurant</button>
      </form>
    );
  };
  
  export default RestaurantForm;
  