export const getUserCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000 }
    );
  });
};

export const DEFAULT_COORDINATES = {
  // Center near Chandigarh / North India, can switch to Bangalore/Delhi
  lat: 30.7333,
  lng: 76.7794,
  zoom: 12,
};
