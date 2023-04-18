import {Component} from "react";
import axios from "axios";
import {Table} from "react-bootstrap";

type LedgerPage = {
  id: number,
  price: number,
  type: "purchase" | "cash" | "etc",
  payer: User,
  receiver: User,
}

type User = {
  id: number,
  name: string,
}

interface LedgerState {
  ledger: LedgerPage[]
}

export class Ledger extends Component<{}, LedgerState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      ledger: [],
    }
  }

  componentDidMount() {
    this.fetchLedger()
  }

  fetchLedger() {
    axios.get('http://localhost:8080/v1/api/ledger')
      .then(res => {
        console.log(res.data)
        let ledger: LedgerPage[] = res.data.ledgers.map((l: any): LedgerPage => {
            return {
              payer: l.edges.payer,
              receiver: l.edges.receiver,
              type: l.type,
              id: l.id,
              price: l.price
            }
          }
        )
        this.setState({ledger})
      })
      .catch(e => alert(e))
  }

  render() {
    return (
      <>
        <h1>台帳</h1>
        <Table striped variant="light">
          <thead>
          <tr>
            <th>#</th>
            <th>類</th>
            <th>支払者</th>
            <th>→</th>
            <th>受取者</th>
          </tr>
          </thead>
          <tbody>
          {this.state.ledger.map(l =>
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>
                {l.type === "purchase" ? `購入` : l.type === "cash" ? `支払い` : "その他（これが見えたらおかしい）"}
              </td>
              <td>{l.payer.name}</td>
              <td>{l.price}</td>
              <td>{l.receiver.name}</td>
            </tr>
          )}
          </tbody>
        </Table>
      </>
    )
  }

}