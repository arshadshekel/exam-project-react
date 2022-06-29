import AddHotelForm from "../forms/AddHotelForm";
import AuthContext from "../../context/AuthContext";
import { useContext, useEffect } from "react";


function AdminAddHotels() {
  const [auth] = useContext(AuthContext);

   useEffect(() => {
     document.title = "Holidaze - Add hotels";
   }, []);
  
  return (
    <div>
      {auth ? (
        <div>
          <AddHotelForm />
        </div>
      ) : (
        <div className="container text-center my-5">
          <h1>Not Logged in</h1>
          <p>Please log in to access admin pages</p>
        </div>
      )}
    </div>
  );
}

export default AdminAddHotels;
