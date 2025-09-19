"use client"

import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"

type Props = {
  accessToken?: string
  center?: [number, number]
  zoom?: number
  onClick?: (lngLat: { lng: number; lat: number }) => void
  marker?: [number, number] | null
  className?: string
}

export default function MapboxMap({
  accessToken,
  center = [-83.0458, 42.3314],
  zoom = 11,
  onClick,
  marker,
  className,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    mapboxgl.accessToken = accessToken || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
    if (!mapContainer.current || mapRef.current) return
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom,
    })
    mapRef.current = map

    if (onClick) {
      map.on("click", (e) => {
        onClick({ lng: e.lngLat.lng, lat: e.lngLat.lat })
      })
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [accessToken, center, zoom, onClick])

  useEffect(() => {
    if (!mapRef.current) return
    if (marker) {
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker()
      }
      markerRef.current.setLngLat(marker as [number, number]).addTo(mapRef.current)
    } else if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }
  }, [marker])

  return <div ref={mapContainer} className={className || "h-72 w-full rounded-md overflow-hidden"} />
}


