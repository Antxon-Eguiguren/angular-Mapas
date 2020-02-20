import { Component, OnInit } from '@angular/core';

declare var google;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  map: any;
  directionsService: any;
  directionsDisplay: any;

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.loadMap(position);
      });
    } else {
      console.log('Tu navegador no soporta la geolocalización');
    }
  }

  loadMap(position) {
    const mapOptions = {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.HYBRID
    };

    this.map = new google.maps.Map(document.getElementById('mapaId'), mapOptions);
    this.directionsDisplay.setMap(this.map);

    const marker = new google.maps.Marker({
      position: mapOptions.center,
      // position: new google.maps.LatLng(LATITUD, LONGITUD),
      title: 'ESTAMOS AQUÍ',
      animation: google.maps.Animation.BOUNCE
    });
    marker.setMap(this.map);

    google.maps.event.addListener(this.map, 'click', (event) => {
      const marker = new google.maps.Marker({
        position: event.latLng,
        animation: google.maps.Animation.BOUNCE
      });
      marker.setMap(this.map);
    });

    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('inputPlaces'), {
      types: ['geocode', 'establishment'],
      origin: mapOptions.center
    });

    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();
      this.map.setCenter(place.geometry.location);
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        animation: google.maps.Animation.BOUNCE
      });
      marker.setMap(this.map);
    }.bind(this));
    // Usamos el bind (this) para poder usar una variable declarada en la clase dentro de una función anónima
  }

  manejarClickRuta() {
    const options = {
      origin: 'juan de dios 1, madrid',
      destination: 'fuencarral 3',
      travelMode: google.maps.TravelMode.BICYCLING
    };
    this.directionsService.route(options, (resultado) => {
      console.log(resultado);
      this.directionsDisplay.setDirections(resultado);
    });

  }
}
