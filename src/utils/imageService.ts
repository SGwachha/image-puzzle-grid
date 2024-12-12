const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key'; // Get this from Unsplash developer account

export const getRandomImage = async (width = 600, height = 600): Promise<string> => {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&w=${width}&h=${height}`
        );
        const data = await response.json();
        return data.urls.regular;
    } catch (error) {
        console.error('Error fetching image:', error);
        return '/default-puzzle.jpg'; // Fallback image
    }
};

// Array of local fallback images
export const fallbackImages = [
    '/images/puzzle1.jpg',
    '/images/puzzle2.jpg',
    '/images/puzzle3.jpg',
    // Add more local images
]; 