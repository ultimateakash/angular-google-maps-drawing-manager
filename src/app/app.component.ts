import { Component, QueryList, ViewChildren } from '@angular/core';
import { AgmMap, AgmPolygon, ControlPosition, LatLng, LatLngLiteral } from '@agm/core';
import { DrawingControlOptions } from '@agm/drawing/google-drawing-types';
import { OverlayType } from '@agm/drawing';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChildren(AgmPolygon) public polygonRefs!: QueryList<AgmPolygon>;

  mapRef!: AgmMap;
  zoom: number = 15;
  lat: number = 28.626137;
  lng: number = 79.821603;

  activePolygonIndex!: number;
  drawingMode: any = null;

  drawingControlOptions: DrawingControlOptions = {
    position: ControlPosition.TOP_CENTER,
    drawingModes: [
      OverlayType.POLYGONE
    ]
  }

  polygonOptions = {
    fillOpacity: 0.3,
    fillColor: '#ff0000',
    strokeColor: '#ff0000',
    strokeWeight: 2,
    draggable: true,
    editable: true
  }

  deleteIconStyle = {
    cursor: 'pointer',
    backgroundImage: 'url(../assets/images/remove.png)',
    height: '24px',
    width: '24px',
    marginTop: '5px',
    backgroundColor: '#fff',
    position: 'absolute',
    top: "2px",
    left: "52%",
    zIndex: 99999
  }


  polygons: LatLngLiteral[][] = [
    [
      { lat: 28.630818281028954, lng: 79.80954378826904 },
      { lat: 28.62362346815063, lng: 79.80272024853515 },
      { lat: 28.623585797675588, lng: 79.81490820629882 },
      { lat: 28.630818281028954, lng: 79.80954378826904 }
    ],
    [
      { lat: 28.63130796240949, lng: 79.8170110581665 },
      { lat: 28.623623468150655, lng: 79.81705397351074 },
      { lat: 28.623623468150655, lng: 79.82619494183349 },
      { lat: 28.6313832978037, lng: 79.82619494183349 },
      { lat: 28.63130796240949, lng: 79.8170110581665 }
    ]
  ]

  onLoadMap($event: AgmMap) {
    this.mapRef = $event;
  }

  onOverlayComplete($overlayEvent: any) {
    this.drawingMode = this.drawingMode === null ? '' : null;
    if ($overlayEvent.type === OverlayType.POLYGONE) {
      const newPolygon = $overlayEvent.overlay.getPath()
        .getArray()
        .map((latLng: LatLng) => ({ lat: latLng.lat(), lng: latLng.lng() }))

      // start and end point should be same for valid geojson
      const startPoint = newPolygon[0];
      newPolygon.push(startPoint);
      $overlayEvent.overlay.setMap(null);
      this.polygons = [...this.polygons, newPolygon];
    }
  }

  onClickPolygon(index: number) {
    this.activePolygonIndex = index;
  }

  onEditPolygon(index: number) {
    const allPolygons = this.polygonRefs.toArray();
    allPolygons[index].getPath()
      .then((path: Array<LatLng>) => {
        this.polygons[index] = path.map((latLng: LatLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng()
        }))
      })
  }

  onDeleteDrawing() {
    this.polygons = this.polygons.filter((polygon, index) => index !== this.activePolygonIndex)
  }
}
