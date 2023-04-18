import React from "react";
import {Badge} from "react-bootstrap";
import "./Market.css"

export interface GroceryProps {
  id: number
  name: string
  price: number
  unit: number
  expirationDate: Date
  selected: boolean

  selectGrocery(): void
}

export function GroceryTableRow(props: GroceryProps) {
  let expiration_date_string = props.expirationDate.toISOString().split('T')[0]
  const expiration_duration =
    props.expirationDate.getTime() - Date.now();
  const expiration_indicator =
    expiration_duration < 0 ? "exceeded" :
      expiration_duration < 1000 * 3600 * 24 * 7 ? "soon" : // 7 days
        expiration_duration < 1000 * 3600 * 24 * 365 * 100 ? "far" : "eternal" // CENTURY
  let expiration_badge = <></>
  switch (expiration_indicator) {
    case "exceeded":
      expiration_badge = <Badge bg="danger">超過</Badge>
      break;
    case "soon":
      expiration_badge = <Badge bg="warning" text="dark">間近</Badge>
      break;
    case "far":
      break;
    case "eternal":
      expiration_date_string = ""
      expiration_badge = <Badge bg="info" text="dark">永遠</Badge>
      break;
  }
  return (
    <tr
      className={props.selected ? "Market-GroceryTableRow-selected" : ""}
      onClick={props.selectGrocery}
    >
      <td> {props.id} </td>
      <td> {props.name} </td>
      <td> {props.price} </td>
      <td> {props.unit} </td>
      <td>
        {expiration_date_string}
        {expiration_badge}
      </td>
    </tr>
  )
}
