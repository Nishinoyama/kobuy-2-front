import React, {Component} from "react";
import {Button, Col, Dropdown, Form, Row} from "react-bootstrap";
import axios from "axios";

type Receiver = {
  name: string,
  id: number,
}

interface PaymentState {
  receivers: Receiver[]
  receiverSelected: Receiver | null,
  user_id: number | null
  validated: boolean,
}

export class Payment extends Component<{}, PaymentState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      receivers: [],
      receiverSelected: null,
      user_id: null,
      validated: false
    }
  }

  handleSubmit(e: any) {
    const form = e.currentTarget;
    if (form.checkValidity() === false || this.state.receiverSelected === null) {
      this.setState({validated: true})
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    const donor_id: number = this.state.user_id!
    const receiver_id: number = this.state.receiverSelected.id!
    const price: number = Number.parseInt(form.price.value);
    axios.post('/v1/api/cash',
      {
        donor_id,
        receiver_id,
        price,
      },
      {
        withCredentials: true
      }
    ).then(_ => {
      alert(`[${this.state.receiverSelected?.name}]に[${price}円]支払いした！`);
    }).catch(err => {
      e.preventDefault();
      e.stopPropagation();
      alert(err);
    })
    return false;
  }

  componentDidMount() {
    this.fetchUsers()
    axios.get('/authed/', {withCredentials: true})
      .then(res => {
        console.log(res);
        this.setState({
          user_id: res.data.user_id
        })
      })

  }

  fetchUsers() {
    axios.get('/v1/api/users/')
      .then(res => {
        let users = res.data.users.map((u: any) => {
          return u;
        })
        this.setState({
          receivers: users
        })
      })
      .catch(e => alert(e))
  }

  selectReceiver(receiverSelected: Receiver) {
    this.setState({receiverSelected})
  }

  render() {
    if (this.state.user_id === null) {
      return (
        <>
          <h1>支払いにはログインが必要</h1>
        </>
      )
    }
    return (
      <>
        <h1>支払い</h1>
        <Form
          onSubmit={(e) => this.handleSubmit(e)}
          noValidate
          validated={this.state.validated}
        >
          <Row>
            <Form.Group as={Col} md={3} controlId="receiver">
              <Dropdown>
                <Dropdown.Toggle>
                  {this.state.receiverSelected?.name ?? "受取者"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {this.state.receivers
                    .filter(r => r.id !== this.state.user_id)
                    .map(r =>
                      <Dropdown.Item
                        key={r.id}
                        active={this.state.receiverSelected?.id === r.id}
                        onClick={() => this.selectReceiver(r)}
                      >
                        {r.name}
                      </Dropdown.Item>
                    )}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Col md={1}> に </Col>
            <Form.Group as={Col} md={3} controlId={"price"}>
              <Form.Control type="number" min={0} step={10} defaultValue={100}/>
            </Form.Group>
            <Col md={1}> 円 </Col>
            <Col md={4}>
              <Button type="submit">支払った！</Button>
            </Col>
          </Row>
        </Form>
      </>
    )
      ;
  }
}
