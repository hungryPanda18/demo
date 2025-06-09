import { useState, useEffect } from 'react';
import ErrorPage from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import Places from './Places.jsx';
import { fetchPlace } from "../fetchingData.js"; 


export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();
  useEffect(() =>{
      // fetch('http://localhost:3000/places')
      // .then((response) =>{
      //   return response.json()
      // })
      // .then((responseData) =>{
      //   setAvailablePlaces(responseData.places)
      // })

      async function fetchPlaces() {
        setIsFetching(true)
        try {
          // const response = await fetch('http://localhost:3000/places')
          // const resData = await response.json()
          
          // if(!response.ok) {
          //   throw new Error('Failed to fetch data')
          // }
          const places = await fetchPlace()
          navigator.geolocation.getCurrentPosition((position) => {
            const sortedPlaces = sortPlacesByDistance(
              places, 
              position.coords.latitude, 
              position.coords.longitude
            )

            setAvailablePlaces(sortedPlaces)
            setIsFetching(false)
          })

          
        } catch (error) {
          setError({
            message:
              error.message || 'couldn\'t fetch data, try again later'
            })
            setIsFetching(false)
        }
      }

      fetchPlaces();
   }, []) 

   if(error) {
    return <ErrorPage title="Error Occurred" message={error.message} />
   }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
