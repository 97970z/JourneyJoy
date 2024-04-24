// frontend/src/components/LocationMap/useKakaoLoader.jsx
import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

export default function useKakaoLoader() {
	useKakaoLoaderOrigin({
		appkey: import.meta.env.VITE_KAKAO_MAPS_API_KEY,
		libraries: ["clusterer", "drawing", "services"],
	});
}
