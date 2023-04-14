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
    <div>
      {props.name} , {props.price}円： {props.unit} 個：賞味期限 {props.expirationDate.toISOString().split('T')[0]}
    </div>
  )
}
