import axios from "axios"

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_APP_GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': [
            'places.id',
            'places.displayName',
            'places.photos'
        ]
    }
}

export const IMG_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key={API_KEY}'
export const getPlace = (data) => axios.post(BASE_URL, data, config)