/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidGhhbnR5YXJ6YXJoZWluIiwiYSI6ImNqem1sMnZzYjE2eGgzb29hcTB3a2huMnMifQ.A6-yL94BTtsnMG0WuPq6Ig';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/thantyarzarhein/cjzmlhh2k0wrn1cp6m2aq9zrv',
    scrollZoom: false
    //   center: [95.956, 21.9162],
    //   zoom: 10,
    //   interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      // the bottom of the pin image
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add Popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}<p>`)
      .addTo(map);

    // Extend the map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    // You can specify the layout
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
