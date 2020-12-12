export default {
  confirmServiceDelete: Swal.mixin({
    title: '선택한 민원(들)을 삭제합니까?',
    icon: 'question',
    confirmButtonText: '예, 삭제합니다',
    showCancelButton: true,
    cancelButtonText: '취소',
    customClass: {
      confirmButton: 'btn btn-success font-weight-bolder',
      cancelButton: 'btn btn-danger font-weight-bolder',
    },
    padding: '0rem',
    width: '25rem',
    allowOutsideClick: false,
  }),
};

// export default function CustomOverlay() {
//   const showAnimation = {
//     popup: 'swal2-show',
//     backdrop: 'swal2-backdrop-show',
//     icon: 'swal2-icon-show'
//   };
//
//   const hideAnimation = {
//     popup: 'swal2-hide',
//     backdrop: 'swal2-backdrop-hide',
//     icon: 'swal2-icon-hide'
//   };
//
//   // 카카오지도 미표시시 항공지도 기능 불가 안내, 지형도 선택시 일정 줌레벨 필요 안내
//   const kakaoHybrid = swal.mixin({
//     toast: true,
//     position: 'bottom',
//     timer: 5000,
//     padding: '1.2rem',
//     showConfirmButton: true,
//     confirmButtonColor: '#0abb87',
//     showCancelButton: true,
//     cancelButtonText: '취소',
//     showClass: showAnimation,
//     hideClass: hideAnimation,
//     onOpen: function (toast) {
//       toast.addEventListener('mouseenter', swal.stopTimer);
//       toast.addEventListener('mouseleave', swal.resumeTimer);
//     }
//   });
//
//   // 로드뷰 실행시 로드뷰 레이어 선택 필요 안내
//   const kakaoRoadView = swal.mixin({
//     toast: true,
//     icon: 'info',
//     timer: 2000,
//     position: 'bottom',
//     padding: '1.2rem',
//     // showConfirmButton: false
//     confirmButtonColor: '#0abb87',
//     showClass: showAnimation,
//     hideClass: hideAnimation,
//     onOpen: function () {
//       document.getElementById('map-container').style.cursor = 'pointer';
//     },
//     onDestroy: function () {
//       document.getElementById('map-container').style.cursor = '';
//     }
//   });
//
//   const kakaoMeasure = swal.mixin({
//     toast: true,
//     icon: 'question',
//     position: 'bottom',
//     padding: '1rem',
//     showConfirmButton: false,
//     showClass: showAnimation,
//     hideClass: hideAnimation
//   });
//
//   // 우클릭 주소 선택시 클립보드 복사 안내
//   const olAddress = swal.mixin({
//     toast: true,
//     timer: 5000,
//     position: 'bottom',
//     padding: '1.2rem',
//     showConfirmButton: false,
//     showClass: showAnimation,
//     hideClass: hideAnimation
//   });
//
//   const olInfoNull = swal.mixin({
//     toast: true,
//     icon: 'error',
//     timer: 5000,
//     position: 'bottom',
//     padding: '1.2rem',
//     showConfirmButton: false,
//     showClass: showAnimation,
//     hideClass: hideAnimation
//   });
//
//   const olFindValveLoading = swal.mixin({
//     toast: true,
//     padding: '1.2rem',
//     icon: 'question',
//     titleText: '연결된 밸브를 찾는 중입니다...',
//     position: 'top',
//     showConfirmButton: false,
//     showCancelButton: true,
//     cancelButtonText: '취소',
//     animation: false, // Deprecated and will be removed in the next major release
//   });
//
//   const olFindValveResult = swal.mixin({
//     toast: true,
//     padding: '1.2rem',
//     icon: 'success',
//     position: 'top',
//     showConfirmButton: true,
//     confirmButtonText: '위치보기',
//     confirmButtonColor: '#0abb87',
//     showCancelButton: true,
//     cancelButtonText: '닫기',
//     reverseButtons: true,
//     animation: false, // Deprecated and will be removed in the next major release
//   });
//
//   const olFindValveResultCycle = swal.mixin({
//     toast: true,
//     padding: '1.2rem',
//     icon: 'info',
//     position: 'top',
//     showConfirmButton: true,
//     confirmButtonText: '다음',
//     confirmButtonColor: '#00b0ff',
//     showCancelButton: true,
//     cancelButtonText: '닫기',
//     reverseButtons: true,
//     animation: false, // Deprecated and will be removed in the next major release
//   });
//
//   this.kakaoHybrid = kakaoHybrid;
//   this.kakaoRoadView = kakaoRoadView;
//   this.kakaoMeasure = kakaoMeasure;
//   this.olAddress = olAddress;
//   this.olInfoNull = olInfoNull;
//   this.olFindValve = olFindValveLoading;
//   this.olFindValveResult = olFindValveResult;
//   this.olFindValveResultCycle = olFindValveResultCycle;
// }
