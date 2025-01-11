import { Zone } from "../helpers/map/leaflet-types"
import ZoneTable from "./ZoneTable"
import { Badge } from "flowbite-react"

type Props = {
    zoneData? : Zone[];
}

export default function ZoneTables( {zoneData} : Props ) {
  return (
        <div data-testid="zonetables">
            {zoneData?.map((zone: Zone) => (
                <div key={zone.id}>
                    
                <div className="flex flex-wrap items-center gap-4 p-4 mb-4 bg-gray-50 rounded-lg shadow">
                    <Badge color="info"><span className="font-bold text-xl">Name: {zone.name}</span></Badge>
                    <Badge color="success"><span className="font-bold text-xl">id: {zone.id}</span></Badge>
                    <Badge color="info"><span className="font-bold text-xl">Type: {zone.type}</span></Badge>
                    <Badge color="warning"><span className="font-bold text-xl">Number of bikes: {zone.bikes?.length}</span></Badge>

                </div>
                <ZoneTable zone={zone}/>
            </div>))
            }
        </div>
  )
}
