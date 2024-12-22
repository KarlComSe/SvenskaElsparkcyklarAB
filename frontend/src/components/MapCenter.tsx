import { useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';

export default function MapCenter({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
}
