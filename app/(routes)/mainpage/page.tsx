"use client";
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Trash2 } from "lucide-react"
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'



// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })

// Mock data for bin locations and statuses
const binData = [
  { id: 1, fillLevel: 20, location: "Central Park", lat: 40.785091, lng: -73.968285, lastUpdate: "2023-05-20 10:30" },
  { id: 2, fillLevel: 80, location: "Malviya Nagar", lat: 40.758896, lng: -73.985130, lastUpdate: "2023-05-20 11:15" },
  { id: 3, fillLevel: 50, location: "Vaishali Nagar", lat: 40.706086, lng: -73.996864, lastUpdate: "2023-05-20 09:45" },
  { id: 4, fillLevel: 10, location: "Mansarovar", lat: 40.689247, lng: -74.044502, lastUpdate: "2023-05-20 12:00" },
]

export default function BinStatusPage() {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    setMapLoaded(true)
  }, [])

  const getBinColor = (fillLevel: number) => {
    if (fillLevel < 50) return 'green'
    if (fillLevel < 80) return 'orange'
    return 'red'
  }

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-6">Smart Waste Management Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-700 flex items-center">
                <MapPin className="mr-2" /> Bin Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative" style={{ height: '400px' }}>
                {mapLoaded && (
                  <MapContainer center={[40.730610, -73.935242]} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {binData.map((bin) => (
                      <Marker 
                        key={bin.id} 
                        position={[bin.lat, bin.lng]} 
                        icon={new L.Icon({
                          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${getBinColor(bin.fillLevel)}.png`,
                          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                          shadowSize: [41, 41]
                        })}
                      >
                        <Popup>
                          Bin {bin.id}: {bin.fillLevel}% full<br />
                          Location: {bin.location}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-700 flex items-center">
                <Trash2 className="mr-2" /> Bin Status Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bin ID</TableHead>
                    <TableHead>Fill Level</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {binData.map((bin) => (
                    <TableRow key={bin.id}>
                      <TableCell>{bin.id}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-white ${
                          bin.fillLevel < 50 ? 'bg-green-500' : 
                          bin.fillLevel < 80 ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {bin.fillLevel}%
                        </span>
                      </TableCell>
                      <TableCell>{bin.location}</TableCell>
                      <TableCell>{bin.lastUpdate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <img src="/placeholder.svg?height=100&width=100" alt="Healthy Tree 1" className="w-24 h-24" />
          <img src="/placeholder.svg?height=100&width=100" alt="Healthy Tree 2" className="w-24 h-24" />
          <img src="/placeholder.svg?height=100&width=100" alt="Healthy Tree 3" className="w-24 h-24" />
        </div>
      </div>
    </div>
  )
}