export async function fetchPlace() {
    const response = await fetch('http://localhost:3000/places')
    const resData = await response.json()
    
    if(!response.ok) {
        throw new Error('Failed to fetch data')
    }

    return resData.places;
}

export async function fetchAddedPlace() {
    const response = await fetch('http://localhost:3000/user-places');
    const resData = await response.json();

    if(!response.ok) {
        throw new Error('Failed to load data')
    }

    return resData.places;
}

export async function updatePlaces(places) {
    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({places})
    })
    const resData = await response.json();

    if(!response.ok) {
        throw new Error('Failed to update user data')
    }
    return resData.message;
}