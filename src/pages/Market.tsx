import React from "react";
import {Grocery, GroceryProps} from "../Grocery";
import axios from "axios";
import {Table} from "react-bootstrap";
import "../Market.css"

type GroceryType = {
  id: number
  name: string
  price: number
  unit: number
  expiration_date: Date
  intoGrocery(): GroceryProps
}

interface MarketState {
  groceriesJsons: GroceryType[]
  groceriesData: GroceryType[]
  sortedBy: string
  sortOrdIsInc: boolean,
}

interface MarketProps {
}

class OrderedGrocery {
  public readonly grocery: GroceryType;
  private readonly sortedBy: string;
  private readonly reversed: boolean;

  constructor(grocery: GroceryType, sortedBy: string | null, reversed: boolean) {
    this.grocery = grocery
    this.sortedBy = sortedBy || "id"
    this.reversed = reversed
  }

  cmp(rhs: this) {
    let res = 0;
    if (this.sortedBy === "name") {
      res = this.grocery.name.localeCompare(rhs.grocery.name);
    } else if (this.sortedBy === "price") {
      res = this.grocery.price - rhs.grocery.price;
    } else if (this.sortedBy === "unit") {
      res = this.grocery.unit - rhs.grocery.unit;
    } else if (this.sortedBy === "expiration_date") {
      res = this.grocery.expiration_date.getTime() - rhs.grocery.expiration_date.getTime();
    } else if (this.sortedBy === "id") {
      res = this.grocery.id - rhs.grocery.id;
    }
    if (res !== 0) {
      if (this.reversed) res = -res;
      return res
    }
    return this.grocery.id - rhs.grocery.id;
  }
}

export default class Market extends React.Component<MarketProps, MarketState> {
  constructor(props: MarketProps) {
    super(props);
    this.state = {
      groceriesJsons: [],
      groceriesData: [],
      sortedBy: "",
      sortOrdIsInc: true,
    }
  }


  componentDidMount() {
    this.fetchGroceries()
  }

  fetchGroceries() {
    axios.get('http://localhost:8080/v1/api/groceries/')
      .then(res => {
        let groceries = res.data.groceries.map((g: any) => {
          g.expiration_date = new Date(Date.parse(g.expiration_date));
          return g;
        })
        this.setState({
          groceriesJsons: structuredClone(groceries),
          groceriesData: structuredClone(groceries),
        })
      })
      .catch(e => alert(e))
  }

  sortGroceriesBy(it: this, ord: string) {
    let increaseOrd = true;
    if (it.state.sortedBy === ord) {
      if (it.state.sortOrdIsInc) {
        increaseOrd = false;
      } else {
        it.setState({
          groceriesData: structuredClone(it.state.groceriesJsons),
          sortedBy: "",
          sortOrdIsInc: true,
        })
        return
      }
    } else {
      increaseOrd = true
    }
    let groceriesData = it.state.groceriesJsons
      .map(g => new OrderedGrocery(g, ord, !increaseOrd))
      .sort((a, b) => a.cmp(b))
      .map(g => g.grocery);
    it.setState({
      groceriesData,
      sortedBy: ord,
      sortOrdIsInc: increaseOrd,
    })
  }

  groceriesIsSortedIndicator(ord: string): string {
    return this.state.sortedBy !== ord ? "" : this.state.sortOrdIsInc ? "↑" : "↓";
  }

  render() {
    return (
      <div className="Market-main">
        <Table bordered hover striped>
          <thead>
          <tr>
            <th onClick={() => this.sortGroceriesBy(this, "id")}>
              # {this.groceriesIsSortedIndicator("id")}
            </th>
            <th onClick={() => this.sortGroceriesBy(this, "name")}>
              名前 {this.groceriesIsSortedIndicator("name")}
            </th>
            <th onClick={() => this.sortGroceriesBy(this, "price")}>
              価格 {this.groceriesIsSortedIndicator("price")}
            </th>
            <th onClick={() => this.sortGroceriesBy(this, "unit")}>
              残数 {this.groceriesIsSortedIndicator("unit")}
            </th>
            <th onClick={() => this.sortGroceriesBy(this, "expiration_date")}>
              賞味期限 {this.groceriesIsSortedIndicator("expiration_date")}
            </th>
          </tr>
          </thead>
          <tbody>
          {this.state.groceriesData.map(g =>
            (
              <Grocery
                id={g.id}
                name={g.name}
                price={g.price}
                unit={g.unit}
                expirationDate={g.expiration_date}
                key={g.id}
              />
            )
          )}
          </tbody>
        </Table>
      </div>
    )
      ;
  }
}