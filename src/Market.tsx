import React from "react";
import {Grocery, GroceryProps} from "./Grocery";
import axios from "axios";

type GroceryJSON = {
  id: number
  name: string
  price: number
  unit: number
  expiration_date: string
  intoGrocery(): GroceryProps
}

interface MarketState {
  groceries: GroceryJSON[]
}

interface MarketProps {
}

export class Market extends React.Component<MarketProps, MarketState> {
  constructor(props: MarketProps) {
    super(props);
    this.state = {
      groceries: []
    }
  }


  componentDidMount() {
    this.fetchGroceries()
  }

  fetchGroceries() {
    axios.get('http://localhost:8080/v1/api/groceries/')
      .then(res => {
        this.setState(res.data)
        console.log(res.data);
      })
      .catch(e => alert(e))
  }

  render() {
    return (
      <div>
        {this.state.groceries.map(g =>
          (
            <Grocery
              id={g.id}
              name={g.name}
              price={g.price}
              unit={g.unit}
              expirationDate={new Date(Date.parse(g.expiration_date))}
              key={g.id}
            />
          )
        )}
      </div>
    )
      ;
  }
}