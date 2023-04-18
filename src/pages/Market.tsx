import React from "react";
import {GroceryTableRow} from "../GroceryTableRow";
import axios from "axios";
import {Button, Dropdown, Table} from "react-bootstrap";
import "../Market.css"

type Grocery = {
  id: number
  name: string
  price: number
  unit: number
  expiration_date: Date
}

type Buyer = {
  id: number
  name: string
}

interface MarketState {
  groceriesJson: Grocery[]
  groceriesData: Grocery[]
  buyersJson: Buyer[]
  sortedBy: string
  sortOrdIsInc: boolean,
  selectedBuyer: Buyer | null,
  selectedGrocery: Grocery | null,
}

interface MarketProps {
}

class OrderedGrocery {
  public readonly grocery: Grocery;
  private readonly sortedBy: string;
  private readonly reversed: boolean;

  constructor(grocery: Grocery, sortedBy: string | null, reversed: boolean) {
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
      groceriesJson: [],
      groceriesData: [],
      buyersJson: [],
      sortedBy: "",
      sortOrdIsInc: true,
      selectedBuyer: null,
      selectedGrocery: null,
    }
  }


  componentDidMount() {
    this.fetchGroceries()
    this.fetchUsers()
  }

  fetchGroceries() {
    axios.get('http://localhost:8080/v1/api/groceries/')
      .then(res => {
        let groceries: Grocery[] = res.data.groceries.map((g: any) => {
          g.expiration_date = new Date(Date.parse(g.expiration_date));
          return g;
        })
        this.setState({
          groceriesJson: structuredClone(groceries),
          groceriesData: structuredClone(groceries),
        })
      })
      .catch(e => alert(e))
  }

  fetchUsers() {
    axios.get('http://localhost:8080/v1/api/users/')
      .then(res => {
        let users = res.data.users.map((u: any) => {
          return u;
        })
        this.setState({
          buyersJson: users
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
          groceriesData: structuredClone(it.state.groceriesJson),
          sortedBy: "",
          sortOrdIsInc: true,
        })
        return
      }
    } else {
      increaseOrd = true
    }
    let groceriesData = it.state.groceriesJson
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

  selectGrocery(selectedGrocery: Grocery) {
    this.setState({selectedGrocery})
  }

  selectBuyer(selectedBuyer: Buyer) {
    this.setState({selectedBuyer})
  }

  purchase(it: this) {
    let mes = "";
    if (it.state.selectedBuyer === null) {
      mes += "購入者が未選択です\n"
    }
    if (it.state.selectedGrocery === null) {
      mes += "購入する商品が未選択です\n"
    }
    if (mes !== "") {
      alert(mes.slice(0, -1))
      return false
    }
    let buyer = it.state.selectedBuyer!;
    let grocery = it.state.selectedGrocery!;
    if (grocery.unit <= 0) {
      mes += `商品[${grocery.name}]の在庫がありません\n`
    }
    if (mes !== "") {
      alert(mes.slice(0, -1))
      return false
    }
    axios.post('http://localhost:8080/v1/api/purchase',
      {
        buyer_id: buyer.id,
        grocery_id: grocery.id,
        unit: 1,
      },
    )
      .then(res => {
        if (res.status / 100 >= 4) {
          throw Error
        }
        alert(`[${buyer.name}]が[${grocery.name}]を購入完了`)
      })
      .catch(e => alert(e))
      .finally(() => this.fetchGroceries())
    return true;
  }

  render() {
    return (
      <div className="Market-main">
        <Table hover striped variant="light">
          <thead className="Market-thead">
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
          {this.state.groceriesData
            .filter(g => g.unit > 0)
            .map(g =>
            (
              <GroceryTableRow
                id={g.id}
                name={g.name}
                price={g.price}
                unit={g.unit}
                expirationDate={g.expiration_date}
                key={g.id}
                selected={g.id === this.state.selectedGrocery?.id}
                selectGrocery={() => this.selectGrocery(g)}
              />
            )
          )}
          </tbody>
        </Table>
        <div className="Market-purchase">
          <Dropdown>
            <Dropdown.Toggle>
              {
                (() => {
                  let buyer = this.state.selectedBuyer;
                  return buyer !== null ? buyer.name : "購入者"
                })()
              }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {this.state.buyersJson.map(b =>
                <Dropdown.Item
                  key={b.id}
                  active={this.state.selectedBuyer?.id === b.id}
                  onClick={() => this.selectBuyer(b)}
                >
                  {b.name}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          が
          <Button variant="secondary" disabled onClick={() => this.purchase(this)}>
            {
              (() => {
                let grocery = this.state.selectedGrocery;
                return grocery !== null ? grocery.name : "商品"
              })()
            }
          </Button>
          を
          <Button variant="success" onClick={() => this.purchase(this)}>
            購入する！
          </Button>
        </div>
      </div>
    )
      ;
  }
}