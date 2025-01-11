import { Table } from "flowbite-react";
import { Zone } from '../helpers/map/leaflet-types'

export default function ZoneTable({zone}:{zone:Zone}) {
  return (
     <Table data-testid="zonetable">
        <Table.Head>
        <Table.HeadCell>Bike ID</Table.HeadCell>
        <Table.HeadCell>Bike Battery Level</Table.HeadCell>
        <Table.HeadCell>Latitude</Table.HeadCell>
        <Table.HeadCell>Longitude</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Created At</Table.HeadCell>
        <Table.HeadCell>Updated At</Table.HeadCell>
        <Table.HeadCell>
            <span className="sr-only">Edit</span>
        </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
        { zone.bikes?.map((bike) => (
        <Table.Row key={bike.id} className="bg-white">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
            {bike.id}
            </Table.Cell>
            <Table.Cell>{bike.batteryLevel}</Table.Cell>
            <Table.Cell>{bike.latitude}</Table.Cell>
            <Table.Cell>{bike.longitude}</Table.Cell>
            <Table.Cell>{bike.status}</Table.Cell>
            <Table.Cell>{bike.createdAt}</Table.Cell>
            <Table.Cell>{bike.updatedAt}</Table.Cell>
            <Table.Cell></Table.Cell>
        </Table.Row>
        ))}

        </Table.Body>
    </Table>
  )
}
