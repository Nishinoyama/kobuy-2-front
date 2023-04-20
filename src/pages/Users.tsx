import {Table} from "react-bootstrap";
import React from "react";
import axios from "axios";

type User = {
  balance: number,
  name: string,
  id: number,
}

export class Users extends React.Component<{}, { users: User[] }> {

  constructor(props: {}) {
    super(props);
    this.state = {users: []}
  }

  componentDidMount() {
    axios.get('/v1/api/users/')
      .then(res => {
        let users = res.data.users.map((u: any) => {
          return u;
        })
        this.setState({users: users})
      })
      .catch(e => alert(e))
  }

  render() {
    return (
      <>
        <h1>メンバー</h1>
        <Table striped variant="light">
          <thead>
          <tr>
            <th>#</th>
            <th>名前</th>
            <th>収支</th>
          </tr>
          </thead>
          <tbody>
          {this.state.users.map(u =>
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.balance}</td>
            </tr>
          )}
          </tbody>
        </Table>
      </>
    );
  }
}