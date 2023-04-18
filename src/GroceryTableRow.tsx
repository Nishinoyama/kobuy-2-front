import React from "react";
import {Button} from "react-bootstrap";

export interface GroceryProps {
  id: number
  name: string
  price: number
  unit: number
  expirationDate: Date
  selectGrocery(): void
}

export function GroceryTableRow(props: GroceryProps) {
  return (
    <tr>
      <td> {props.id} </td>
      <td> {props.name} </td>
      <td> {props.price} </td>
      <td> {props.unit} </td>
      <td> {props.expirationDate.toISOString().split('T')[0]} </td>
      <td><Button variant="secondary" size="sm" onClick={props.selectGrocery}>選ぶ</Button></td>
    </tr>
  )
}
