export const budgets = [
  {
    id: 1,
    title: "Backpacker",
    desc: "Low-cost options suitable for backpackers",
    icon: "🎒",
    range: "$0 - $30 per day"
  },
  {
    id: 2,
    title: "Cheap",
    desc: "Affordable options for budget-conscious travelers",
    icon: "🛏️",
    range: "$0 - $50 per day"
  },
  {
    id: 3,
    title: "Mid-Range",
    desc: "Comfortable options with a balance of cost and amenities",
    icon: "🏨",
    range: "$50 - $150 per day"
  },
  {
    id: 4,
    title: "Luxury",
    desc: "High-end options with premium services and facilities",
    icon: "🏛️",
    range: "$150+ per day"
  },
];

export const accommodations = [
  {
    id: 1,
    title: "Hotel",
    desc: "Standard hotel rooms with various amenities",
    icon: "🏨"
  },
  {
    id: 2,
    title: "Hostel",
    desc: "Affordable shared or private rooms, often with communal spaces",
    icon: "🏢"
  },
  {
    id: 3,
    title: "Apartment",
    desc: "Fully furnished apartments for short-term stays",
    icon: "🏘️"
  },
];

export const transportations = [
  {
    id: 1,
    title: "Plane",
    desc: "Air travel for long-distance journeys",
    icon: "✈️"
  },
  {
    id: 2,
    title: "Train",
    desc: "Rail travel for scenic and comfortable trips",
    icon: "🚆"
  },
  {
    id: 3,
    title: "Car",
    desc: "Driving by car for flexible and personal travel",
    icon: "🚗"
  },
  {
    id: 4,
    title: "Bus",
    desc: "Affordable and convenient bus travel",
    icon: "🚌"
  },
  {
    id: 5,
    title: "Boat",
    desc: "Travel by boat for water journeys",
    icon: "🛥️"
  },
];

export const activities = [
  {
    id: 1,
    title: "Sightseeing",
    desc: "Exploring famous landmarks and attractions",
    icon: "🗺️"
  },
  {
    id: 2,
    title: "Adventure",
    desc: "Thrilling activities like hiking, rafting, and more",
    icon: "🏞️"
  },
  {
    id: 3,
    title: "Relaxation",
    desc: "Leisurely activities like spa visits and beach lounging",
    icon: "🛀"
  },
  {
    id: 4,
    title: "Cultural",
    desc: "Experiencing local culture through museums, festivals, and more",
    icon: "🏛️"
  },
  {
    id: 5,
    title: "Shopping",
    desc: "Exploring markets, malls, and boutiques",
    icon: "🛍️"
  },
  {
    id: 6,
    title: "Nightlife",
    desc: "Enjoying nightlife through clubs, bars, and evening events",
    icon: "🌃"
  },
  {
    id: 7,
    title: "Food & Drink",
    desc: "Tasting local cuisine and beverages",
    icon: "🍽️"
  },
  {
    id: 8,
    title: "Nature & Wildlife",
    desc: "Exploring natural parks and observing wildlife",
    icon: "🌳"
  },
  {
    id: 9,
    title: "Sports",
    desc: "Participating in or watching sports activities",
    icon: "🏅"
  },
  {
    id: 10,
    title: "Wellness",
    desc: "Activities focused on health and wellness",
    icon: "💆"
  }
];

export const meals = [
  {
    id: 1,
    title: "Breakfast",
    desc: "The first meal of the day, typically served in the morning",
    icon: "🍳"
  },
  {
    id: 2,
    title: "Brunch",
    desc: "A late morning meal that combines breakfast and lunch",
    icon: "🥞"
  },
  {
    id: 3,
    title: "Lunch",
    desc: "A midday meal, typically lighter than dinner",
    icon: "🥪"
  },
  {
    id: 4,
    title: "Dinner",
    desc: "The main meal of the day, typically served in the evening",
    icon: "🍝"
  },
  {
    id: 5,
    title: "Snack",
    desc: "A small amount of food eaten between meals",
    icon: "🍿"
  },
  {
    id: 6,
    title: "Dessert",
    desc: "A sweet course usually served at the end of a meal",
    icon: "🍰"
  }
];

export const travelCompanions = [
  {
    id: 1,
    title: "Friends",
    desc: "Traveling with friends for a fun and social experience",
    icon: "👫"
  },
  {
    id: 2,
    title: "Family",
    desc: "Traveling with family members, including children and relatives",
    icon: "👨‍👩‍👧‍👦"
  },
  {
    id: 3,
    title: "Partner",
    desc: "Traveling with a romantic partner for a couple's getaway",
    icon: "💑"
  }
];

export const AI_PROMPT = `I am planning a trip with the following preferences and need detailed information to help with the planning. Below are the preferences:

Destinations:
Destination 1: {destination1}, from {startDate1} to {endDate1}.
Destination 2: {destination2}, from {startDate2} to {endDate2}.
Destination 3: {destination3}, from {startDate3} to {endDate3}.

My Location: {location}.
Number of People: {peopleCount}
Budget: {budget} . This budget should cover comfortable options with a balance of cost and amenities.
Travel Companions: {travelCompanions}.
Accommodations: Preference for {accommodationType} accommodations.
Activities: Interest in {activityTypes} activities.
Meals: Preference for various meals, including {mealTypes}.

Please provide a comprehensive plan for the trip, including a plan for each day with the hours and durations mentioned. Include the following:
Accommodations: For each destination, list available preferred accommodation options, including the name, address, rating, and price per night. For each given accommodations type at least provide one, at least total of 4 for all types provided. Include details on the duration of your stay.
Daily Plan: Suggest activities and Meals for each day for each destination based on the preferences provided. Include the name of the activity, description, location, and price of the activities. For the Meals, for each meals preferences at least recommend one for each day, at least 3 meals for each day, include the name of the restaurant or cafe, the type of cuisine, address, rating and the price range. Also, suggest the order in which these activities and meals should be scheduled to make the most of the trip.

for the N/A destination don't include details about them in the response.
The response should be formatted as this JSON object:
{
    "trip_plan": {
        "destinations": [
            {
                "destination": "",
                "dates": "",
                "days": [
                    {
                        "day": "",
                        "activities": [
                            {
                                "name": "",
                                "description": "",
                                "location": "",
                                "price": "",
                                "duration": ""
                            }
                        ],
                        "meals": [
                            {
                                "restaurant": "",
                                "cuisine": "",
                                "address": "",
                                "rating": 0,
                                "price_range": "",
                                "meal_types": [
                                    ""
                                ]
                            }
                        ]
                    }
                ],
                "accommodations": [
                    {
                        "name": "",
                        "address": "",
                        "rating": 0,
                        "price_per_night": "",
                        "duration": ""
                    }
                ],
            }
        ],
        "budget": "",
    }
}
Make sure the response is valid JSON Formatted response with matching opening and closing braquets.`;