import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import ErrorPage from './components/Error.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updatePlaces, fetchAddedPlace } from "./fetchingData.js";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const [errUpdating, setErrUpdating] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    async function fetchPlace() {
      setIsFetching(true)
      try {
        const resData = await fetchAddedPlace();
        console.log(resData)
        // const resData = await response.json();
        setUserPlaces(resData)
      } catch (error) {
        setError({
          message: error.message || 'Fetching user places'
        })
      }
      setIsFetching(false);

    }

    fetchPlace();
  },[])
  try {
    fetchAddedPlace()
  } catch (error) {
    
  }

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updatePlaces([selectedPlace, ...userPlaces])
    } catch (error) {
      // throw new Error('Failed to fetch data')
      setUserPlaces(userPlaces)
      setErrUpdating({message: error.message || "Failed to fetch data"})
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    try {
      await updatePlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id));
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrUpdating({
        message: error.message || 'Unable to remove place'
      })
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError() {
    setErrUpdating(null);
  }

  return (
    <>
      <Modal open={errUpdating} onClose={handleError}>
      {errUpdating && <ErrorPage 
        title='Error occured' 
        message={errUpdating.message} 
        onConfirm={handleError}
      />}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <ErrorPage title="Error Occured" message={error.message} />}
        {!error && <Places
          title="I'd like to visit ..."
          // fallbackText="Select the places you would like to visit below."
          isLoading={isFetching}
          loadingText="Fetching user places"
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
