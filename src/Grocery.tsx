import React from "react";

export interface GroceryProps {
  id: number
  name: string
  price: number
  unit: number
  expirationDate: Date
}

export function Grocery(props: GroceryProps) {
  return (
    <tr>
      <td> {props.id} </td>
      <td> {props.name} </td>
      <td> {props.price} </td>
      <td> {props.unit} </td>
      <td> {props.expirationDate.toISOString().split('T')[0]} </td>
    </tr>
  )
}
