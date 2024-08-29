import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    // 카카오맵 API 스크립트를 동적으로 추가
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c9654a57355ed5a994f6a30be622596f&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    const map = new kakao.maps.Map(mapContaion, mapOption);

    var marker = new kakao.maps.Marker({
      position: markerPosition;
    })

    script.onload = () => {
      // 카카오맵 API 로드 후 지도 생성
      window.kakao.maps.load(() => {
        const container = document.getElementById('map'); // 지도를 표시할 컨테이너
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 지도의 중심좌표 (서울시청)
          level: 3, // 지도의 확대 레벨
        };
        const map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

        // 지도에 마커 추가
        const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780); 
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>카카오맵 예제</h1>
      <div id="map" style={{ width: '400px', height: '400px' }}></div>
    </div>
  );
};

export default KakaoMap;
