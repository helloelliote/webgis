/* eslint-disable no-undef */
import { map as olMap, selectInteraction } from '../openlayers/Map';
import { default as projection } from '../openlayers/projection/Projection';
import { view as olView } from '../openlayers/view';
import { map, viewSyncOptions } from './Map';
import { roadView, roadViewClient } from './roadview/Client';
import { default as roadViewWalker } from './roadview/Walker';
import { fromLonLat } from 'ol/proj';
import { coordinateToLatLng } from './util';
import { roundCustom } from '../math';

let isActive = false;

kakao.maps.event.addListener(roadView, 'init', function () {
  roadViewWalker.setMap(map);

  kakao.maps.event.addListener(roadView, 'viewpoint_changed', function () {
    const viewpoint = roadView.getViewpoint();
    roadViewWalker.setAngle(viewpoint.pan);
  });

  kakao.maps.event.addListener(roadView, 'position_changed', function () {
    const rvPosition = roadView.getPosition();
    roadViewWalker.setPosition(rvPosition);
    const newCenter = fromLonLat([
      roundCustom(rvPosition['La']),
      roundCustom(rvPosition['Ma']),
    ], projection);
    olView.setCenter(newCenter);
  });
});

const rvContainer = document.getElementById('map-container');
const rvButton = document.getElementById('btn-map-roadview');
rvButton.addEventListener('click', onClickRoadviewButton);

function onClickRoadviewButton(event) {
  event.preventDefault();

  if (olView.getZoom() > viewSyncOptions.zoom.max + viewSyncOptions.zoom.decimal) {
    $.notify({
      message: '현재 지도에서는 로드뷰를 표시할 수 없습니다',
    }, { type: 'danger' });
    return;
  }

  isActive = !isActive;
  rvContainer.classList.toggle('grid-parent', isActive);
  rvButton.classList.toggle('active', isActive);
  window.dispatchEvent(new Event('resize'));

  if (isActive) {
    olMap.getTargetElement().style.cursor = 'pointer';
    olMap.removeInteraction(selectInteraction);
    olMap.on('singleclick', onSingleClick);
    if (roadViewWalker.getMap() === null) {
      roadViewWalker.setMap(map);
    }
    coordinateToLatLng(olView.getCenter()).then(function (latLng) {
      map.setCenter(latLng);
      map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
      roadViewClient.getNearestPanoId(map.getCenter(), 10, function (panoId) {
        if (panoId !== null) {
          roadViewWalker.setPosition(map.getCenter());
          roadView.setPanoId(panoId, map.getCenter());
        } else {
          $.notify({
            message: '로드뷰 정보가 있는 도로 영역을 클릭하세요',
          }, { type: 'primary' });
        }
      });
    });
  } else {

    olMap.getTargetElement().style.cursor = '';
    olMap.addInteraction(selectInteraction);
    olMap.un('singleclick', onSingleClick);
    roadViewWalker.setMap(null);
    coordinateToLatLng(olView.getCenter()).then(function (latLng) {
      map.setCenter(latLng);
      map.removeOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
    });
  }
}

function onSingleClick(event) {
  event.preventDefault();
  coordinateToLatLng(event.coordinate, projection.code).then(function (rvPosition) {
    roadViewClient.getNearestPanoId(rvPosition, 10, function (panoId) {
      if (panoId !== null) {
        // customOverlay.kakaoRoadView.resumeTimer();
        roadView.setPanoId(panoId, rvPosition);
      }
    });
  });
}
